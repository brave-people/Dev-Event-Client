'use client';

import type { EventForm } from '../../../model/Event';
import Input from '../../atoms/input/Input';
import ErrorContext from '../../layouts/ErrorContext';
import React from 'react';
import 'react-quill/dist/quill.snow.css';

type ContentDescriptionProps = Pick<
  EventForm,
  | 'title'
  | 'changeTitle'
  | 'error'
  | 'description'
  | 'changeDescription'
  | 'organizer'
  | 'changeOrganizer'
  | 'eventLink'
  | 'changeEventLink'
>;

const ContentDescription = ({
  title,
  changeTitle,
  error,
  organizer,
  changeOrganizer,
  eventLink,
  changeEventLink,
}: ContentDescriptionProps) => {
  return (
    <>
      <Input
        text="제목"
        value={title}
        onChange={changeTitle}
        isRequired={true}
        customClass={{ 'border-red-400': error.title }}
      >
        {error.title && <ErrorContext />}
      </Input>
      <div className="form__content">
        <Input
          text="주최"
          value={organizer}
          onChange={changeOrganizer}
          isRequired={true}
          customClass={{ 'border-red-400': !!error.organizer }}
        >
          {error.organizer && <ErrorContext />}
        </Input>
      </div>
      <div className="form__content">
        <Input
          text="행사 링크"
          value={eventLink}
          onChange={changeEventLink}
          isRequired={true}
          autoComplete="off"
          customClass={{ 'border-red-400': !!error.eventLink }}
        >
          {error.eventLink && <ErrorContext />}
        </Input>
      </div>
    </>
  );
};

export default ContentDescription;
