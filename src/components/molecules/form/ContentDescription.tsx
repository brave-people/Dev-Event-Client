'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useDropzone } from 'react-dropzone';
import type { EventForm } from '../../../model/Event';
import Input from '../../atoms/input/Input';
import ErrorContext from '../../layouts/ErrorContext';

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

// todo 위치 맨 아래로 내리기
// todo api 이미지 업로드 연동
// todo 행사 등록시 파일 업로드하도록(lazy upload) 변경

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
  const [markdown, setMarkdown] = useState(description);
  const [preview, setPreview] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        setMarkdown((prev) => `${prev}\n![${file.name}](${text})`);
      };
      reader.readAsDataURL(file);
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
    // changeDescription(e.target.value); // todo active me
  };

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
      <div className="form__content">
        {!preview && (
          <button
            {...getRootProps({
              className:
                'dropzone bg-blue-500 text-white rounded mr-2 py-2 px-5 text-sm font-medium mt-2',
              onClick: (e) => e.preventDefault(),
            })}
          >
            <input {...getInputProps()} />
            사진 첨부
          </button>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            setPreview(!preview);
          }}
          className="bg-blue-500 text-white rounded py-2 px-5 text-sm font-medium mt-2"
        >
          {preview ? '작성' : '미리보기'}
        </button>
        {!preview && (
          <textarea
            className="w-full mt-4 mb-4 h-96 p-2 border border-gray-300 rounded-md resize-none"
            value={markdown}
            onChange={handleMarkdownChange}
            placeholder="행사 설명을 입력해주세요. 마크다운 형식을 지원합니다. 드래그 드랍으로 사진을 추가할 수 있습니다."
          />
        )}
        {preview && (
          <div className="markdown-preview mt-4 mb-4 p-2 border border-gray-300 rounded-md">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        )}
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
