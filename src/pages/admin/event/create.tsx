import React, { useState, useRef } from 'react';
import type { KeyboardEvent, BaseSyntheticEvent } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import Cropper from 'cropperjs';
import EventComponent from '../../../components/Event';
import { baseRouter } from '../../../config/constants';

const EventCreate = () => {
  const router = useRouter();
  const tagRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

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
  const changeStartDate = (e: { target: { value: string } }) => {
    setStartDate(e.target.value);
  };
  const changeEndDate = (e: { target: { value: string } }) => {
    setEndDate(e.target.value);
  };

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
