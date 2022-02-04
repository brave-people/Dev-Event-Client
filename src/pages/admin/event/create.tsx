import { useState, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import EventComponent from '../../../components/Event';
import { baseRouter } from '../../../config/constants';

const EventCreate = () => {
  const router = useRouter();
  const tagRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [eventLink, setEventLink] = useState('');
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(
    moment().format('yyyy-MM-DDThh:mm')
  );
  const [endDate, setEndDate] = useState(moment().format('yyyy-MM-DDThh:mm'));

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
  const changeStartDate = (e: { target: { value: string } }) => {
    setStartDate(e.target.value);
  };
  const changeEndDate = (e: { target: { value: string } }) => {
    setEndDate(e.target.value);
  };

  return (
    <EventComponent>
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
          <label htmlFor="start">시작 날짜</label>
          <input
            ref={startDateRef}
            type="datetime-local"
            id="datetime-start"
            name="datetime-start"
            value={startDate}
            min="2018-01-01T00:00"
            max="2099-12-31T00:00"
            onChange={changeStartDate}
          />
        </div>
        <div>
          <label htmlFor="datetime-end">종료 날짜</label>
          <input
            ref={endDateRef}
            type="datetime-local"
            id="datetime-end"
            name="datetime-end"
            value={endDate}
            min="2018-01-01T00:00"
            max="2099-12-31T00:00"
            onChange={changeEndDate}
          />
        </div>
        <button onClick={() => router.push(baseRouter() + '/admin/event')}>
          확인
        </button>
      </section>
    </EventComponent>
  );
};

export default EventCreate;
