import moment from 'moment';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import type { MouseEvent } from 'react';
import type { NextPageContext } from 'next/types';
import type { TokenModel } from '../../../model/User';
import type { TagModel } from '../../../model/Tag';
import { baseRouter, STATUS_201 } from '../../../config/constants';
import getToken from '../../../server/api/auth/getToken';
import getTags from '../../../server/api/events/getTags';
import EventComponent from '../../../components/Event';
import TimeComponent from '../../../components/event/Date/Time';
import ImageUploadComponent from '../../../components/event/ImageUpload';
import { createEventsApi } from '../../api/events/create';
import { createTagApi } from '../../api/events/tag';
import ErrorContext from '../../../components/event/Form/ErrorContext';
import Tag from '../../../components/event/Form/Tag';
import UpdateTokenInCookie from '../../../util/update-token-in-cookie';
import { EventModel } from '../../../model/Event';

const EventCreate = (data: { token: TokenModel; allTags: TagModel[] }) => {
  const router = useRouter();
  const { token, allTags } = data || {};

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [eventLink, setEventLink] = useState('');
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

  const validateForm = () => {
    setError((prevState) => ({ ...prevState, title: !title }));
    setError((prevState) => ({ ...prevState, organizer: !organizer }));
    setError((prevState) => ({ ...prevState, eventLink: !eventLink }));
    setError((prevState) => ({ ...prevState, tags: !tags.length }));
  };

  const createEvent = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!title || !organizer || !eventLink || !tags.length)
      return validateForm();

    for (const tag of tags) {
      if (!allTags.length) {
        await createTagApi({ tag_name: tag });
      } else if (allTags.every((prevTag) => prevTag.tag_name !== tag)) {
        await createTagApi({ tag_name: tag });
      }
    }

    const body: EventModel = {
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
    if (data.status_code === STATUS_201) return router.reload();
    return alert(data.message);
  };

  useEffect(() => {
    if (token?.access_token) UpdateTokenInCookie(document, token);
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
                className={classNames(
                  'appearance-none w-full h-10 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm',
                  { 'border-red-400': error.title }
                )}
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
                className={classNames(
                  'appearance-none w-full h-10 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm',
                  { 'border-red-400': error.title }
                )}
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
                className={classNames(
                  'appearance-none w-full h-10 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm',
                  { 'border-red-400': error.title }
                )}
              />
              {error.eventLink && <ErrorContext />}
            </div>
            <div className="form__content__input relative">
              <Tag tags={tags} setTags={setTags} allTags={allTags} />
            </div>
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
              className="form__button form__button--center w-20 inline-flex items-center justify-center my-4 p-2 rounded-md text-white bg-blue-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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

export const getServerSideProps = async (context: NextPageContext) => {
  const cookies = context.req?.headers.cookie;
  const token = await getToken(cookies);

  // token이 없거나 에러나면 로그인 페이지로 이동
  if (!token?.data || token?.error) {
    return {
      redirect: {
        destination: '/auth/signIn',
      },
    };
  }

  const tags = await getTags(token.data['access_token']);
  return { props: { token: token.data, allTags: tags } };
};

export default EventCreate;
