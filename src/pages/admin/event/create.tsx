import React, { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { useSetRecoilState } from 'recoil';
import { useRouter } from 'next/router';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import jwt from 'jsonwebtoken';
import type { NextPageContext } from 'next/types';
import type { TokenModel } from '../../../model/User';
import EventComponent from '../../../components/Event';
import ImageUploadComponent from '../../../components/event/ImageUpload';
import { baseRouter } from '../../../config/constants';
import getToken from '../../../server/api/auth/getToken';
import stores from '../../../store';
import Button from '@mui/material/Button';

const EventCreate = ({ data }: { data: TokenModel }) => {
  const router = useRouter();
  const setUser = useSetRecoilState(stores.user);

  useEffect(() => {
    if (data) setUser(jwt.decode(data['access_token']));
  }, []);

  const tagRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [eventLink, setEventLink] = useState('');
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [hour, setHour] = useState('am');

  console.log(startTime, endTime, hour);

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
      const target = e.target as HTMLInputElement;
      setTags((prevTags) => Array.from(new Set([...prevTags, target.value])));
      tagRef.current?.focus();
      setTag('');
    }
  };
  const deleteTag = (currentTag: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== currentTag));
    tagRef.current?.focus();
  };

  return (
    <EventComponent>
      <>
        <section className="form--large">
          <h2>이벤트 생성</h2>
          <div>
            <label htmlFor="title">제목</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={changeTitle}
              required
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="description">행사 설명</label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={changeDescription}
            />
          </div>
          <div>
            <label htmlFor="organizer">주최</label>
            <input
              id="organizer"
              type="text"
              value={organizer}
              onChange={changeOrganizer}
              required
            />
          </div>
          <div>
            <label htmlFor="event_link">행사 링크</label>
            <input
              id="event_link"
              type="text"
              value={eventLink}
              onChange={changeEventLink}
              required
            />
          </div>
          <div>
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
          {tags && (
            <div>
              <label />
              {tags.map((tag, index) => {
                return (
                  <button key={index} onClick={() => deleteTag(tag)}>
                    {tag}
                  </button>
                );
              })}
            </div>
          )}
          <div>
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
          <div>
            <input
              ref={startTimeRef}
              type="number"
              max={12}
              placeholder="00"
              onChange={(event) => setStartTime(event.target.value)}
            />
            <span>:</span>
            <input
              ref={endTimeRef}
              type="number"
              max={59}
              placeholder="00"
              onChange={(event) => setEndTime(event.target.value)}
            />
            <div>
              <label htmlFor="am">AM</label>
              <input
                type="radio"
                id="am"
                name="hour"
                value="am"
                checked={true}
                onChange={(event) => setHour(event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="pm">PM</label>
              <input
                type="radio"
                id="pm"
                name="hour"
                value="pm"
                onChange={(event) => setHour(event.target.value)}
              />
            </div>
          </div>
        </section>
        <section>
          <ImageUploadComponent />
        </section>
        <section>
          <Button
            variant="contained"
            onClick={() => router.push(baseRouter() + '/admin/event')}
          >
            확인
          </Button>
        </section>
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
