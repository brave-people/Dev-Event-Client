'use client';

import type { EventForm } from '../../../model/Event';
import Input from '../../atoms/input/Input';
import ErrorContext from '../../layouts/ErrorContext';
import MarkdownEditor from '../markdown-editor';

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
      <div className="my-8">
        <MarkdownEditor
          value={description}
          onChange={(value) => changeDescription({ target: { value } })}
          placeholder="행사에 대한 상세 설명을 마크다운 형식으로 작성하세요..."
          minHeight="400px"
        />
      </div>
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
