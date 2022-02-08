import React, { useState, useRef } from 'react';
import type { KeyboardEvent, BaseSyntheticEvent } from 'react';
import { useRouter } from 'next/router';
import Cropper from 'cropperjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import EventComponent from '../../../components/Event';
import { baseRouter } from '../../../config/constants';

const EventCreate = () => {
  const router = useRouter();
  const tagRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

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
  const [imageUrl, setImageUrl] = useState<{
    url: string | undefined;
    name: string;
  }>({ url: '', name: '' });
  const [cropImageUrl, setCropImageUrl] = useState<{
    url: string | undefined;
    name: string;
  }>({ url: '', name: '' });
  const [cropper, setCropper] = useState<Cropper | null>(null);

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

  console.log(startTime, endTime);

  const changeImageUpload = ({ file }: { file: File }) => {
    setImageUrl({ url: undefined, name: '' });
    setCropImageUrl({ url: undefined, name: '' });

    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl({ url: reader.result?.toString(), name: file.name });
      if (imageRef.current) {
        setCropper(new Cropper(imageRef.current, { aspectRatio: 1 }));
      }
    };
    reader.readAsDataURL(file);
  };
  const clickCropImageUpload = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const imgSrc = cropper?.getCroppedCanvas().toDataURL();
    setCropImageUrl({ url: imgSrc, name: imageUrl.name });
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
            <input type="radio" id="am" name="hour" value="am" checked />
            <label htmlFor="am">PM</label>
            <input type="radio" id="pm" name="hour" value="pm" />
          </div>
        </div>
        <form method="post" encType="multipart/form-data">
          <label htmlFor="image-upload">이미지 올리기</label>
          <input
            name="image-upload"
            type="file"
            accept="image/*"
            onChange={({ target: { files } }) => {
              if (files) {
                changeImageUpload({
                  file: files[0],
                });
              }
            }}
          />
          <div className="admin--create__image">
            {imageUrl.url && (
              <div style={{ maxWidth: '50%' }}>
                <img ref={imageRef} src={imageUrl.url} alt={imageUrl.name} />
              </div>
            )}
            {cropImageUrl.url && (
              <img src={cropImageUrl.url} alt={cropImageUrl.name} />
            )}
          </div>
          {imageUrl.url && (
            <button onClick={clickCropImageUpload}>자르기</button>
          )}
        </form>
        <button onClick={() => router.push(baseRouter() + '/admin/event')}>
          확인
        </button>
      </section>
    </EventComponent>
  );
};

export default EventCreate;
