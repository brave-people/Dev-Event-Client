import { useState, type MouseEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { modifyHostApi } from '../../../api/host/modify';
import { fetchUploadImage } from '../../../api/image';
import { STATUS_200 } from '../../../config/constants';
import { Host, HostResponse } from '../../../model/Host';
import Input from '../../atoms/input/Input';
import ErrorContext, { useErrorContext } from '../../layouts/ErrorContext';
import ImageUpload from '../../molecules/image-upload';

export const Modify = ({ host }: { host: HostResponse }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';

  const [hostName, setHostName] = useState(host.host_name);
  const [description, setDescription] = useState(host?.description || '');

  // image
  const [hostImageUrl] = useState(host.image_link);
  const [blob, setBlob] = useState<FormData | null>(null);

  const { formErrors, validateForm } = useErrorContext({
    hostName,
  });

  const changeHostName = (e: { target: { value: string } }) => {
    setHostName(e.target.value);
  };
  const changeDescription = (e: { target: { value: string } }) => {
    setDescription(e.target.value);
  };

  const uploadImage = async () => {
    if (blob === null) return '';

    const data = await fetchUploadImage({
      fileType: 'HOST',
      body: blob,
    });

    if (data.message) alert(data.message);
    if (data.file_url) return data.file_url;
    return '';
  };

  const modifyHost = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!hostName) return validateForm();

    const newCoverImageUrl = await uploadImage();

    const body: Host = {
      host_name: hostName,
      description,
      image_link: newCoverImageUrl || hostImageUrl,
    };

    const data = await modifyHostApi({ data: body, id: id.toString() });
    if (data.status_code === STATUS_200) router.push('/admin/host');
    return alert(data.message);
  };

  return (
    <div className="list">
      <form className="form--large">
        <div className="form__content">
          <Input
            text="주최명"
            value={hostName}
            onChange={changeHostName}
            isRequired={true}
            customClass={{
              'border-red-400': !!(formErrors.hostName && !hostName),
            }}
          >
            {formErrors.hostName && !hostName && <ErrorContext />}
          </Input>
          <Input
            text="주최 설명"
            value={description}
            onChange={changeDescription}
          />
          <div className="relative">
            <span className="form__content__title inline-block text-base text-gray-600">
              주최 이미지
              <span className="text-red-500">*</span>
            </span>
            <ImageUpload
              width={360}
              height={200}
              coverImageUrl={hostImageUrl}
              setBlob={setBlob}
            />
          </div>
        </div>
        <div className="relative pt-8 pb-6">
          <button
            type="submit"
            onClick={modifyHost}
            className="form__button form__button--center w-20 inline-flex items-center justify-center my-4 p-2 rounded-md text-white bg-blue-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            확인
          </button>
          <a
            href={'/admin/host'}
            className="form__button form__button--right w-20 inline-flex items-center justify-center my-4 p-2 rounded-md text-gray-400 text-white bg-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            취소
          </a>
        </div>
      </form>
    </div>
  );
};

export default Modify;
