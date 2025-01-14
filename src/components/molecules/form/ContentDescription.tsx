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

// todo 미리보기 버튼 클릭하면 텍스트 입력이 사라지게 변경
// todo 행사 설명 라벨 추가
// todo 위치 맨 아래로 내리기
// todo 여백 추가
// todo 사진 업로드 버튼 만들기
// todo 실제 파일 업로드로 시도
// todo 행사 등록시 파일 업로드하도록 변경

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
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p>드래그 드랍 혹은 여기를 클릭하시면 사진을 추가할 수 있습니다.</p>
        </div>
        <textarea
          className="w-full h-96 p-2 border border-gray-300 rounded-md resize-none"
          value={markdown}
          onChange={handleMarkdownChange}
          placeholder="Enter your markdown here..."
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            setPreview(!preview);
          }}
          className="bg-blue-500 text-white rounded py-2 px-5 text-sm font-medium mt-2"
        >
          {preview ? 'Edit' : 'Preview'}
        </button>
        {preview && (
          <div className="markdown-preview mt-4 p-2 border border-gray-300 rounded-md">
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
