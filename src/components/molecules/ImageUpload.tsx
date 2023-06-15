import Cropper from 'cropperjs';
import { useEffect, useRef, useState } from 'react';
import type { BaseSyntheticEvent, Dispatch, SetStateAction } from 'react';
import Image from 'next/image';

const ImageUpload = ({
  coverImageUrl,
  setBlob,
}: {
  coverImageUrl?: string;
  setBlob: Dispatch<SetStateAction<FormData | null>>;
}) => {
  const htmlFor = 'image-upload';
  const imageRef = useRef(null);
  const prevImageRef = useRef(coverImageUrl);
  const dragRef = useRef<HTMLLabelElement | null>(null);
  const [size, setSize] = useState(0);

  const [imageUrl, setImageUrl] = useState<{
    url?: string;
    name: string;
  }>({ url: '', name: '' });
  const [cropImageUrl, setCropImageUrl] = useState<{
    url?: string;
    name: string;
  }>({ url: '', name: '' });
  const [cropper, setCropper] = useState<Cropper | null>(null);

  const changeImageUpload = async ({ file }: { file: File }) => {
    deleteImage();

    const reader = new FileReader();
    reader.onload = async () => {
      setImageUrl({ url: reader.result?.toString(), name: file.name });
    };
    reader.readAsDataURL(file);
  };
  const clickCropImageUpload = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setCropImageUrl({
      url: cropper?.getCroppedCanvas({ maxWidth: 1024 })?.toDataURL() || '',
      name: imageUrl.name,
    });
    cropper?.getCroppedCanvas({ maxWidth: 1024 })?.toBlob(
      async (blob) => {
        const formData = new FormData();
        if (blob) {
          setSize(blob.size);
          formData.append('images', blob, imageUrl.name);
          for (const [key, value] of Array.from(formData)) {
            formData.set(key, value);
          }
          setBlob(formData);
        }
      },
      'image/jpg',
      1
    );
  };
  const deleteImage = () => {
    setImageUrl({ url: '', name: '' });
    setCropImageUrl({ url: '', name: '' });
    setSize(0);
  };
  const dragAndDropHandler = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e?.dataTransfer?.files[0];
    file && changeImageUpload({ file });
  };
  const dragAndOverHandler = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const bytesToSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    const i = parseInt(
      String(Math.floor(Math.log(bytes) / Math.log(1024))),
      10
    );
    if (i === 0) return `${bytes} ${sizes[i]})`;
    return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
  };

  useEffect(() => {
    if (!imageRef.current) return;
    setCropper(new Cropper(imageRef.current, { aspectRatio: 16 / 9 }));
  }, [imageUrl]);

  useEffect(() => {
    if (dragRef.current) {
      dragRef.current.addEventListener('drop', dragAndDropHandler);
      dragRef.current.addEventListener('dragover', dragAndOverHandler);

      return () => {
        dragRef.current?.removeEventListener('drop', dragAndDropHandler);
        dragRef.current?.removeEventListener('dragover', dragAndOverHandler);
      };
    }
  }, [dragRef]);

  return (
    <>
      {prevImageRef.current && (
        <section className="mb-4">
          <p>기존 이미지</p>
          <Image
            src={prevImageRef.current}
            alt="기존이미지"
            width={400}
            height={400}
          />
        </section>
      )}
      {!imageUrl.url && (
        <>
          <input
            id={htmlFor}
            name="image-upload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={({ target: { files } }) =>
              files &&
              changeImageUpload({
                file: files[0],
              })
            }
          />
          <label htmlFor={htmlFor} ref={dragRef} className="drag__box">
            <p className="drag__box__text--large">
              드래그 혹은 클릭으로 파일을 업로드 할 수 있습니다.
            </p>
            <p className="drag__box__text--small">(3MB까지 가능해요!)</p>
          </label>
        </>
      )}
      <section className="drag__section">
        {imageUrl.url && (
          <div className="drag__section--image">
            <img ref={imageRef} src={imageUrl.url} alt={imageUrl.name} />
          </div>
        )}
        {cropImageUrl.url && (
          <div className="drag__section--image">
            <img src={cropImageUrl.url} alt={cropImageUrl.name} />
          </div>
        )}
      </section>
      {size > 0 && (
        <p className="mt-4 text-sm text-right">{bytesToSize(size)}</p>
      )}
      {imageUrl.url && (
        <div className="mt-4">
          <button
            onClick={deleteImage}
            className="mr-4 p-2 text-red-500 font-bold bg-gray-50 rounded"
          >
            이미지 삭제
          </button>
          <button
            onClick={clickCropImageUpload}
            className="p-2 text-blue-500 font-bold bg-gray-50 rounded"
          >
            자르기
          </button>
        </div>
      )}
    </>
  );
};

export default ImageUpload;