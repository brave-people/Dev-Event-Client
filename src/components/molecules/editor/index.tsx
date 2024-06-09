import React, { Dispatch, forwardRef, SetStateAction, useMemo, useRef } from 'react';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { fetchUploadImage } from '../../../api/image';

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    const ImageCompress = await import('quill-image-compress');
    const ImageResize = await import('quill-image-resize-module-ts');

    RQ.Quill.register('modules/imageCompress', ImageCompress.default);
    RQ.Quill.register('modules/imageResize', ImageResize.ImageResize);

    const editorContainer = forwardRef<typeof RQ, any>(function getEditor(props, ref) {
      const newProps = {
        ...props,
        modules: {
          ...props.modules,
          imageResize: {
            parchment: RQ.Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize', 'Toolbar'],
          },
          // imageCompress: {
          //   quality: 0.9, // default
          //   imageType: 'image/*', // default
          //   debug: true, // default
          //   suppressErrorLogging: false, // default
          //   insertIntoEditor: true, // default
          // },
        },
      };
      return <RQ ref={ref} {...newProps} />;
  })
  return editorContainer
},
  { ssr: false, loading: () => <div>*에디터를 불러오는 중입니다...</div> }
);

const Editor = ({
  description,
  setDescription,
}: {
  description: string;
  setDescription: Dispatch<SetStateAction<FormData | null>>;
}) => {
  const quillRef = useRef<typeof ReactQuill | null>(null);

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

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    console.log("input", input)

    input.onchange = async () => {
      try {
        const file = input.files?.[0];

        console.log("file", file)
        const formData = new FormData();
        
        if (file) {
          formData.append('images', file);
          const imageURL = await uploadImage(formData);
          const range = quillRef.current.getEditorSelection();
          quillRef.current
            .getEditor()
            .insertEmbed(range.index, 'image', imageURL);

          quillRef.current.getEditor().setSelection(range.index + 1);
          document.body.querySelector(':scope > input').remove();
        } else {
          console.log("file undefined")
          throw new Error('file undefined')
        }
      } catch (error) {
        console.log(error);
      }
    }
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
        onChange={setDescription}
        modules={modules}
      />
    </div>
  );
};

export default Editor;
