import remarkBreaks from 'remark-breaks';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import ReactMarkdown from 'react-markdown';

interface MarkdownEditorProps {
  markdown: string;
  onMarkdownChange: (value: string) => void;
}

// todo api 이미지 업로드 연동
// todo 행사 등록시 파일 업로드하도록(lazy upload) 변경

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  markdown,
  onMarkdownChange,
}) => {
  const [preview, setPreview] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      // 여기에 파일 업로드 로직을 구현하세요
    },
  });

  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onMarkdownChange(e.target.value);
  };

  return (
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
        <div className="markdown-preview h-96 mt-4 mb-4 p-2 border border-gray-300 rounded-md overflow-auto">
          <div
            style={{
              lineHeight: '1.6',
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkBreaks]}
              components={{
                h1: ({ children }) => (
                  <h1
                    style={{
                      fontSize: '2em',
                      fontWeight: 'bold',
                      marginBottom: '0.5em',
                      marginTop: '0.5em',
                    }}
                  >
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2
                    style={{
                      fontSize: '1.5em',
                      fontWeight: 'bold',
                      marginBottom: '0.5em',
                      marginTop: '0.5em',
                    }}
                  >
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3
                    style={{
                      fontSize: '1.25em',
                      fontWeight: 'bold',
                      marginBottom: '0.5em',
                      marginTop: '0.5em',
                    }}
                  >
                    {children}
                  </h3>
                ),
                hr: () => (
                  <hr
                    style={{
                      margin: '1em 0',
                      border: 'none',
                      borderTop: '1px solid #ccc',
                    }}
                  />
                ),
                ul: ({ children }) => (
                  <ul style={{ paddingLeft: '1.5em', marginBottom: '1em' }}>
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol style={{ paddingLeft: '1.5em', marginBottom: '1em' }}>
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li style={{ marginBottom: '0.25em' }}>{children}</li>
                ),
                p: ({ children }) => (
                  <p style={{ marginBottom: '1em' }}>{children}</p>
                ),
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;
