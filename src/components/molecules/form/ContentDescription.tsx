'use client';

import { useState } from 'react';
import type { EventForm } from '../../../model/Event';
import Input from '../../atoms/input/Input';
import ErrorContext from '../../layouts/ErrorContext';
import MarkdownEditor from './MarkdownEditor';

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
  description,
  changeDescription,
  organizer,
  changeOrganizer,
  eventLink,
  changeEventLink,
}: ContentDescriptionProps) => {
  // const [markdown, setMarkdown] = useState(description);
  // const [preview, setPreview] = useState(false);
  const [markdownContent, setMarkdownContent] = useState('');

  // const onDrop = (acceptedFiles: File[]) => {
  //   acceptedFiles.forEach((file) => {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       const text = reader.result as string;
  //       setMarkdown((prev) => `${prev}\n![${file.name}](${text})`);
  //     };
  //     reader.readAsDataURL(file);
  //   });
  // };

  return (
    <>
      <Input
        text="제목"
        value={title}
        onChange={changeTitle}
        isRequired={true}
        customClass={{ 'border-red-400': !!error.title }}
      >
        {error.title && <ErrorContext />}
      </Input>
      <MarkdownEditor
        markdown={markdownContent}
        onMarkdownChange={(value) => setMarkdownContent(value)}
      />
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
