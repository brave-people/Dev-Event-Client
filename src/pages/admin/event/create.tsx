import moment from 'moment';
import { useState, useRef, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
// import { useRouter } from 'next/router';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import jwt from 'jsonwebtoken';
import type { KeyboardEvent } from 'react';
import type { NextPageContext } from 'next/types';
import type { TokenModel } from '../../../model/User';
import stores from '../../../store';
import { baseRouter } from '../../../config/constants';
import getToken from '../../../server/api/auth/getToken';
import EventComponent from '../../../components/Event';
import TimeComponent from '../../../components/event/Form/Time';
import ImageUploadComponent from '../../../components/event/ImageUpload';
import { createEventsApi } from '../../api/events/create';
import ErrorContext from '../../../components/event/Form/ErrorContext';

const EventCreate = ({ data }: { data: TokenModel }) => {
  // const router = useRouter();
  const setUser = useSetRecoilState(stores.user);
  const tagRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [eventLink, setEventLink] = useState('');
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // date
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  // image
  const [coverImageUrl, setCoverImageUrl] = useState('');

  // error
  const [error, setError] = useState({
    title: false,
    organizer: false,
    eventLink: false,
    tags: false,
  });

  const changeTitle = (e: { target: { value: string } }) => {
    setTitle(e.target.value);
  };
  const changeDescription = (e: { target: { value: string } }) => {
    setDescription(e.target.value);
  };
  const changeOrganizer = (e: { target: { value: string } }) => {
    setOrganizer(e.target.value);
  };
  const changeEventLink = (e: { target: { value: string } }) => {
    setEventLink(e.target.value);
  };
  const changeTag = (e: { target: { value: string } }) => {
    setTag(e.target.value);
  };
  const updateTags = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target as HTMLInputElement;
      setTags((prevTags: string[]) =>
        Array.from(new Set([...prevTags, target.value]))
      );
      tagRef.current?.focus();
      setTag('');
    }
  };
  const deleteTag = (currentTag: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== currentTag));
    tagRef.current?.focus();
  };

  const validateForm = () => {
    setError((prevState) => ({ ...prevState, title: !title }));
    setError((prevState) => ({ ...prevState, organizer: !organizer }));
    setError((prevState) => ({ ...prevState, eventLink: !eventLink }));
    setError((prevState) => ({ ...prevState, tags: !tags.length }));
  };

  const createEvent = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!title || !organizer || !eventLink || !tags.length)
      return validateForm();

    const body = {
      title,
      description,
      organizer,
      display_sequence: 0,
      event_link: eventLink,
      start_date_time: moment(startDate).format('YYYY-MM-DD HH:MM'),
      start_time: moment(startTime).format('HH:MM'),
      end_date_time: moment(endDate).format('YYYY-MM-DD HH:MM'),
      end_time: moment(endTime).format('HH:MM'),
      tags: tags.map((tag) => ({
        tag_name: tag,
      })),
      cover_image_link: coverImageUrl,
    };

    const data = await createEventsApi({ data: body });
    console.log(data);
  };

  useEffect(() => {
    if (data) setUser(jwt.decode(data['access_token']));
  }, []);

  return (
    <EventComponent>
      <>
        <h1 className="text-3xl font-bold">개발자 행사 등록</h1>
        <form className="form--large">
          <div className="form__content">
            <div className="form__content__input">
              <label
                htmlFor="title"
                className="form__content__title inline-block text-base font-medium text-gray-600"
              >
                제목
                <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={changeTitle}
                required
                className="appearance-none w-full h-10 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
              {error.title && <ErrorContext />}
            </div>
            <div className="form__content__input">
              <label
                htmlFor="description"
                className="form__content__title inline-block text-base font-medium text-gray-600"
              >
                행사 설명
              </label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={changeDescription}
                className="appearance-none w-full h-10 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
            <div className="form__content__input">
              <label
                htmlFor="organizer"
                className="form__content__title inline-block text-base font-medium text-gray-600"
              >
                주최
                <span className="text-red-500">*</span>
              </label>
              <input
                id="organizer"
                type="text"
                value={organizer}
                onChange={changeOrganizer}
                required
                className="appearance-none w-full h-10 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
              {error.organizer && <ErrorContext />}
            </div>
            <div className="form__content__input">
              <label
                htmlFor="event_link"
                className="form__content__title inline-block text-base font-medium text-gray-600"
              >
                행사 링크
                <span className="text-red-500">*</span>
              </label>
              <input
                id="event_link"
                type="text"
                value={eventLink}
                onChange={changeEventLink}
                required
                className="appearance-none w-full h-10 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
              {error.eventLink && <ErrorContext />}
            </div>
            <div className="form__content__input">
              <label
                htmlFor="tag"
                className="form__content__title inline-block text-base font-medium text-gray-600"
              >
                태그
                <span className="text-red-500">*</span>
              </label>
              <input
                ref={tagRef}
                id="tag"
                type="text"
                value={tag}
                onChange={changeTag}
                onKeyPress={updateTags}
                className="appearance-none w-full h-10 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
            {tags.length > 0 && (
              <div>
                {tags.map((tag, index) => {
                  return (
                    <button key={index} onClick={() => deleteTag(tag)}>
                      {tag}
                    </button>
                  );
                })}
              </div>
            )}
            <div className="form__content--date">
              <span className="form__content__title inline-block text-base font-medium text-gray-600">
                시작 날짜
              </span>
              <DatePicker
                dateFormat="yyyy/MM/dd"
                selected={startDate}
                onChange={(date) => date && setStartDate(date)}
                className="appearance-none w-80 h-10 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
              <span className="w-40 inline-block text-base font-medium text-gray-600">
                시작 시간
              </span>
              <TimeComponent time={startTime} setTime={setStartTime} />
            </div>
            <div className="form__content--date">
              <span className="form__content__title inline-block text-base font-medium text-gray-600">
                종료 날짜
              </span>
              <DatePicker
                dateFormat="yyyy/MM/dd"
                selected={endDate}
                minDate={startDate}
                onChange={(date) => date && setEndDate(date)}
                className="appearance-none w-80 h-10 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
              <span className="w-40 inline-block text-base font-medium text-gray-600">
                종료 시간
              </span>
              <TimeComponent time={endTime} setTime={setEndTime} />
            </div>
            <div className="my-8" />
            <ImageUploadComponent setCoverImageUrl={setCoverImageUrl} />
          </div>
          <div className="relative">
            <button
              type="submit"
              onClick={createEvent}
              className="form__button form__button--center w-20 inline-flex items-center justify-center my-4 p-2 rounded-md text-gray-400 text-white bg-blue-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              확인
            </button>
            <a
              href={baseRouter() + '/admin/event'}
              className="form__button form__button--right w-20 inline-flex items-center justify-center my-4 p-2 rounded-md text-gray-400 text-white bg-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              취소
            </a>
          </div>
        </form>
      </>
    </EventComponent>
  );
};

export const getInitialProps = async (context: NextPageContext) => {
  const cookies = context.req?.headers.cookie;
  const token = await getToken(cookies);

  // token이 없거나 에러나면 로그인 페이지로 이동
  if (!token || token?.error) {
    return {
      redirect: {
        destination: '/auth/signIn',
      },
    };
  }

  return { props: token };
};

export default EventCreate;
