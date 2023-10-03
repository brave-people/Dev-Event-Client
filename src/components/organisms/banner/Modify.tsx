import dayjs from 'dayjs';
import { useState, type ChangeEvent, type MouseEvent } from 'react';
import DatePicker from 'react-datepicker';
import { useRouter, useSearchParams } from 'next/navigation';
import { modifyBannersApi } from '../../../api/banner/modify';
import { fetchUploadImage } from '../../../api/image';
import { STATUS_200 } from '../../../config/constants';
import type { Banner, BannerResponse } from '../../../model/Banner';
import Time from '../../atoms/datepicker/Time';
import Input from '../../atoms/input/Input';
import ErrorContext, { useErrorContext } from '../../layouts/ErrorContext';
import ImageUpload from '../../molecules/image-upload';

export const Modify = ({ banner }: { banner: BannerResponse }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';

  const [title, setTitle] = useState(banner.title);
  const [eventLink, setEventLink] = useState(banner?.event_link || '');
  const [priority, setPriority] = useState(banner.priority);
  const [visibleYn, setVisibleYn] = useState(banner.visible_yn === 'Y');
  const [startDate, setStartDate] = useState<Date | null>(
    new Date(banner.start_date_time)
  );
  const [startTime, setStartTime] = useState<Date | null>(
    new Date(banner.start_date_time)
  );
  const [endDate, setEndDate] = useState<Date | null>(
    new Date(banner?.end_date_time)
  );
  const [endTime, setEndTime] = useState<Date | null>(
    new Date(banner?.end_date_time)
  );
  const [noEndDateTime, setNoEndDateTime] = useState(
    banner?.end_date_time?.includes('9999-')
  );

  // image
  const [coverImageUrl] = useState(banner.banner_image);
  const [blob, setBlob] = useState<FormData | null>(null);

  const [color, setColor] = useState(banner?.background_color);

  const { formErrors, validateForm } = useErrorContext({
    title,
    priority,
    eventLink,
    startDate,
    endDate,
    blob,
  });

  const changeTitle = (e: { target: { value: string } }) => {
    setTitle(e.target.value);
  };
  const changeEventLink = (e: { target: { value: string } }) => {
    setEventLink(e.target.value);
  };
  const changePriority = (e: ChangeEvent<HTMLInputElement>) => {
    const value = JSON.parse(e.target.value);
    setPriority(value);
  };
  const changeVisibleYn = (e: ChangeEvent<HTMLInputElement>) => {
    setVisibleYn(e.target.checked);
  };
  const changeStartDate = (startDate: Date | null) => {
    setStartDate(startDate);
    if (!startDate || !endDate) return;
    if (endDate < startDate) setEndDate(startDate);
  };

  const changeAlwaysButton = () => {
    setNoEndDateTime(!noEndDateTime);

    if (!noEndDateTime) return;

    if (!endDate && !endTime) {
      setEndDate(!startDate ? null : startDate);
      setEndTime(!startTime ? null : startTime);
    }
  };

  const uploadImage = async () => {
    if (blob === null) return '';

    const data = await fetchUploadImage({
      fileType: 'DEV_EVENT',
      body: blob,
    });

    if (data.message) alert(data.message);
    if (data.file_url) return data.file_url;
    return '';
  };

  const modifyBanner = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!title || !startDate || (!endDate && !noEndDateTime))
      return validateForm();

    const convertTime = (time: Date | null) =>
      time ? 'T' + dayjs(time).format('HH:mm') : 'T00:00';
    const convertStartTime = convertTime(startTime);
    const convertEndTime = convertTime(endTime);

    const newCoverImageUrl = await uploadImage();

    const body: Banner = {
      title,
      priority,
      event_link: eventLink,
      visible_yn: visibleYn ? 'Y' : 'N',
      start_date_time: `${dayjs(startDate).format(
        'YYYY-MM-DD'
      )}${convertStartTime}`,
      end_date_time: noEndDateTime
        ? '9999-12-31T00:00'
        : `${dayjs(endDate).format('YYYY-MM-DD')}${convertEndTime}`,
      banner_image: newCoverImageUrl || coverImageUrl,
      background_color: color,
    };

    const data = await modifyBannersApi({ data: body, id: id.toString() });
    if (data.status_code === STATUS_200) router.push('/admin/banner');
    return alert(data.message);
  };

  return (
    <div className="list">
      <form className="form--large">
        <div className="form__content">
          <Input
            text="제목"
            value={title}
            onChange={changeTitle}
            isRequired={true}
            customClass={{ 'border-red-400': formErrors.title && !title }}
          >
            {formErrors.title && !title && <ErrorContext />}
          </Input>
          <div className="form__content__input">
            <label
              htmlFor="priority"
              className="form__content__title inline-block text-base text-gray-600"
            >
              우선 순위
            </label>
            <input
              id="priority"
              type="number"
              min="1"
              max="10"
              value={priority}
              onChange={changePriority}
              className="appearance-none w-20 h-10 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
          </div>
          <div className="form__content__input">
            <label
              htmlFor="visibleYn"
              className="form__content__title inline-block text-base text-gray-600"
            >
              노출 여부
            </label>
            <input
              id="visibleYn"
              type="checkbox"
              checked={visibleYn}
              onChange={changeVisibleYn}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <Input
            text="행사 링크"
            value={eventLink}
            onChange={changeEventLink}
            isRequired={true}
            customClass={{
              'border-red-400': !!(formErrors.eventLink && !eventLink),
            }}
          >
            {formErrors.eventLink && !eventLink && <ErrorContext />}
          </Input>
          <div className="mb-6 flex items-center">
            <span className="form__content__title inline-block text-base text-gray-600">
              시작 일자
              <span className="text-red-500">*</span>
            </span>
            <div className="relative">
              <DatePicker
                dateFormat="yyyy/MM/dd"
                selected={startDate}
                onChange={(date) => changeStartDate(date)}
                isClearable={true}
                placeholderText=""
                className="appearance-none w-40 h-10 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
              {formErrors.startDate && !startDate && (
                <ErrorContext style={{ left: 0 }} />
              )}
            </div>
            <div className="w-full inline-flex items-center">
              <span className="w-20 inline-block text-base text-gray-600 ml-8">
                시작 시간
              </span>
              <Time
                selected={startTime}
                onChange={setStartTime}
                className="w-40"
              />
            </div>
          </div>
          <div className="mb-6 flex items-center">
            <span className="form__content__title inline-block text-base text-gray-600">
              종료 일자
              <span className="text-red-500">*</span>
            </span>
            <div className="relative">
              <DatePicker
                dateFormat="yyyy/MM/dd"
                selected={endDate}
                minDate={startDate}
                onChange={(date) => setEndDate(date)}
                isClearable={true}
                placeholderText=""
                disabled={noEndDateTime}
                className="appearance-none w-40 h-10 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
              {formErrors.endDate && !endDate && !noEndDateTime && (
                <ErrorContext style={{ left: 0 }} />
              )}
            </div>
            <div className="w-full inline-flex items-center ml-8">
              <span className="w-20 inline-block text-base text-gray-600">
                종료 시간
              </span>
              <Time
                selected={endTime}
                onChange={setEndTime}
                disabled={noEndDateTime}
                className="w-40"
              />
            </div>
            <div className="inline-flex items-center">
              <label
                htmlFor="noExpiration"
                className="w-10 inline-block text-base text-gray-600"
              >
                상시
              </label>
              <input
                id="noExpiration"
                type="checkbox"
                checked={noEndDateTime}
                onChange={changeAlwaysButton}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
          <div className="relative">
            <span className="form__content__title inline-block text-base text-gray-600">
              배너 이미지
              <span className="text-red-500">*</span>
            </span>
            <ImageUpload
              width={360}
              height={200}
              coverImageUrl={coverImageUrl}
              setBlob={setBlob}
              color={color}
              setColor={setColor}
            />
          </div>
        </div>
        <div className="relative pt-8 pb-6">
          <button
            type="submit"
            onClick={modifyBanner}
            className="form__button form__button--center w-20 inline-flex items-center justify-center my-4 p-2 rounded-md text-white bg-blue-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            확인
          </button>
          <a
            href={'/admin/banner'}
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
