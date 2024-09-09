import '@uiw/react-markdown-preview/markdown.css';
import { MDEditorProps } from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
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
  const dragRef = useRef<HTMLLabelElement | null>(null);

  const dragAndDropHandler = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    alert('hello');
    const file = e?.dataTransfer?.files[0];
    file && handleDropFileUpload({ file });
  };
  const dragAndOverHandler = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    if (dragRef.current) {
      dragRef.current.addEventListener('drop', dragAndDropHandler);
      // dragRef.current.addEventListener('dragover', dragAndOverHandler);

      return () => {
        dragRef.current?.removeEventListener('drop', dragAndDropHandler);
        // dragRef.current?.removeEventListener('dragover', dragAndOverHandler);
      };
    }
  }, [dragRef]);

  const handleDropFileUpload = async ({ file }: { file: File }) => {
    const formData = new FormData();
    formData.append('images', file);

    try {
      const imageURL = await uploadImage(formData);
      const newDescription =
        description + '\n\n ![attach file](' + imageURL + ')';
      alert(newDescription);
      setDescription(newDescription);
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
    <label ref={dragRef}>
      <MDEditor
        preview="live"
        height={500}
        value={description}
        onChange={setDescription}
        {...rest}
      />
    </label>
  );
};
