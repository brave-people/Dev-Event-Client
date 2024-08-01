import '@uiw/react-markdown-preview/markdown.css';
import { MDEditorProps } from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { FileDrop } from 'react-file-drop';
import dynamic from 'next/dynamic';
import { fetchUploadImage } from '../../../api/image';

const MDEditor = dynamic<MDEditorProps>(() => import('@uiw/react-md-editor'), {
  ssr: false,
});

export type EditorProps = MDEditorProps & {
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
};

const uploadImage = async (blob: FormData) => {
  if (blob === null) return '';

  const data = await fetchUploadImage({
    fileType: 'DEV_EVENT_DETAIL',
    body: blob,
  });

  if (data.message) alert(data.message);
  if (data.file_url) return data.file_url;
  return '';
};

export const MarkdownEditor = ({
  description,
  setDescription,
  ...rest
}: EditorProps) => {
  const dropRef = useRef(null);

  const handleDropFileUpload = async (files, event) => {
    const file = files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('images', file);

    try {
      const imageURL = await uploadImage(formData);
      if (imageURL) {
        const newDescription =
          description + '\n\n ![attach file](' + imageURL + ')';
        setDescription(newDescription);
      }
    } catch (error) {
      console.error('Image upload failed', error);
    }
  };

  return (
    // <FileDrop
    //   // onDragOver={(event) => {
    //   //   setBoardColor(true);
    //   // }}
    //   // onDragLeave={(event) => {
    //   //   setBoardColor(false);
    //   // }}
    //   onDrop={(files, event) => {
    //     const formData = new FormData();
    //     const file = files?.[0];
    //     alert('here');
    //     if (file) {
    //       formData.append('images', file);
    //       const imageURL = uploadImage(formData);
    //       console.log(imageURL);
    //       const newDescription = description + '\n\n ![123](' + imageURL + ')';
    //       setDescription(newDescription);
    //     }
    //   }}
    // >
    <div ref={dropRef}>
      <FileDrop frame={dropRef.current} onDrop={handleDropFileUpload}>
        <MDEditor value={description} onChange={setDescription} {...rest} />
      </FileDrop>
    </div>
  );
};
