import React, { useMemo, useRef } from 'react';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { fetchUploadImage } from '../../../api/image';

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    return function comp({ forwardedRef, style, ...props }) {
      return <RQ ref={forwardedRef} style={style} {...props} />;
    };
  },
  { ssr: false }
);

const Editor = ({
  description,
  changeDescription,
}: {
  description: string;
  changeDescription: (value: string) => string;
}) => {
  const quillRef = useRef<HTMLDivElement>(null);

  const uploadImage = async (blob) => {
    if (blob === null) return '';

    const data = await fetchUploadImage({
      fileType: 'HOST',
      body: blob,
    });

    if (data.message) alert(data.message);
    if (data.file_url) return data.file_url;
    return '';
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.addEventListener('change', async () => {
      try {
        const file = input.files?.[0];
        const formData = new FormData();
        formData.append('images', file, file.name);
        const imageURL = await uploadImage(formData);
        const range = quillRef.current.getEditorSelection();
        quillRef.current
          .getEditor()
          .insertEmbed(range.index, 'image', imageURL);
        quillRef.current.getEditor().setSelection(range.index + 1);
        document.body.querySelector(':scope > input').remove();
      } catch (error) {
        console.log(error);
      }
    });
  };

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }, 'link', 'image'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    };
  }, []);

  return (
    <div className="form__content">
      <ReactQuill
        style={{ width: '100%', height: '500px', paddingTop: '10px' }}
        placeholder="내용을 입력해주세요. *드래그하면 이미지가 추가됩니다..."
        theme="snow"
        forwardedRef={quillRef}
        value={description}
        onChange={changeDescription}
        modules={modules}
      />
    </div>
  );
};

export default Editor;
