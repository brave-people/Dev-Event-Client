import moment from 'moment';
import { useState, useRef, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import jwt from 'jsonwebtoken';
import Button from '@mui/material/Button';
import type { KeyboardEvent } from 'react';
import type { NextPageContext } from 'next/types';
import type { TokenModel } from '../../../model/User';
import stores from '../../../store';
import getToken from '../../../server/api/auth/getToken';
import EventComponent from '../../../components/Event';
import TimeComponent from '../../../components/event/Form/Time';
import ImageUploadComponent from '../../../components/event/ImageUpload';
import { createEventsApi } from '../../api/events/create';

const EventCreate = ({ data }: { data: TokenModel }) => {
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

  const createEvent = async (e) => {
    e.preventDefault();
    e.stopPropagation();

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

    // router.push(baseRouter() + '/admin/event')
  };

  useEffect(() => {
    if (data) setUser(jwt.decode(data['access_token']));
  }, []);

  return (
    <EventComponent>
      <>
        <form className="form--large">
          <h2>이벤트 생성</h2>
          <div className="form__content">
            <div className="form__content__input">
              <label htmlFor="title">제목</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={changeTitle}
                required
              />
            </div>
            <div className="form__content__input">
              <label htmlFor="description">행사 설명</label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={changeDescription}
              />
            </div>
            <div className="form__content__input">
              <label htmlFor="organizer">주최</label>
              <input
                id="organizer"
                type="text"
                value={organizer}
                onChange={changeOrganizer}
                required
              />
            </div>
            <div className="form__content__input">
              <label htmlFor="event_link">행사 링크</label>
              <input
                id="event_link"
                type="text"
                value={eventLink}
                onChange={changeEventLink}
                required
              />
            </div>
            <div className="form__content__input">
              <label htmlFor="tag">태그</label>
              <input
                ref={tagRef}
                id="tag"
                type="text"
                value={tag}
                onChange={changeTag}
                onKeyPress={updateTags}
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
              <span>시작 날짜</span>
              <DatePicker
                dateFormat="yyyy/MM/dd"
                selected={startDate}
                onChange={(date) => date && setStartDate(date)}
              />
              <span>종료 날짜</span>
              <DatePicker
                dateFormat="yyyy/MM/dd"
                selected={endDate}
                minDate={startDate}
                onChange={(date) => date && setEndDate(date)}
              />
            </div>
            <div className="form__content--date">
              <span>시작 시간</span>
              <TimeComponent time={startTime} setTime={setStartTime} />
              <span>종료 시간</span>
              <TimeComponent time={endTime} setTime={setEndTime} />
            </div>
            <ImageUploadComponent setCoverImageUrl={setCoverImageUrl} />
          </div>
          <Button variant="contained" type="submit" onClick={createEvent}>
            확인
          </Button>
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
