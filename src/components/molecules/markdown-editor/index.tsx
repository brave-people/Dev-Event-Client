import React, {
  useState,
  useRef,
  type DragEvent,
  type ChangeEvent,
} from 'react';
import { fetchUploadImage } from '../../../api/image';
import {
  parseMarkdown,
  createBlobUrl,
  extractBlobUrls,
  replaceBlobUrl,
} from '../../../util/markdown';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = '마크다운 형식으로 작성하세요...',
  minHeight = '300px',
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 업로드 대기 중인 이미지들 (blob URL과 파일 매핑)
  const pendingImagesRef = useRef<Map<string, File>>(new Map());

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 각 이미지에 대해 Blob URL 생성 및 마크다운에 삽입
    imageFiles.forEach((file) => {
      const blobUrl = createBlobUrl(file);
      pendingImagesRef.current.set(blobUrl, file);

      const imageMarkdown = `![${file.name}](${blobUrl})\n`;
      const cursorPosition =
        textareaRef.current?.selectionStart || value.length;
      const newValue =
        value.slice(0, cursorPosition) +
        imageMarkdown +
        value.slice(cursorPosition);

      onChange(newValue);

      // 커서 위치 업데이트
      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = cursorPosition + imageMarkdown.length;
          textareaRef.current.selectionStart = newPosition;
          textareaRef.current.selectionEnd = newPosition;
          textareaRef.current.focus();
        }
      }, 0);
    });
  };

  const handleConfirm = async () => {
    if (pendingImagesRef.current.size === 0) {
      alert('업로드할 이미지가 없습니다.');
      return;
    }

    setIsUploading(true);

    try {
      let updatedMarkdown = value;

      // 모든 대기 중인 이미지 업로드
      for (const [blobUrl, file] of pendingImagesRef.current.entries()) {
        const formData = new FormData();
        formData.append('images', file);

        try {
          const response = await fetchUploadImage({
            fileType: 'VOD',
            body: formData,
          });

          if (response.file_url) {
            // Blob URL을 실제 업로드된 URL로 치환
            updatedMarkdown = replaceBlobUrl(
              updatedMarkdown,
              blobUrl,
              response.file_url
            );

            // Blob URL 해제 (메모리 정리)
            URL.revokeObjectURL(blobUrl);
          } else if (response.message) {
            alert(`이미지 업로드 실패: ${response.message}`);
          }
        } catch (error) {
          console.error('이미지 업로드 오류:', error);
          alert(`이미지 업로드 중 오류가 발생했습니다: ${file.name}`);
        }
      }

      // 업로드 완료 후 상태 업데이트
      onChange(updatedMarkdown);
      pendingImagesRef.current.clear();
      alert('모든 이미지가 업로드되었습니다!');
    } catch (error) {
      console.error('업로드 처리 오류:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const hasPendingImages =
    pendingImagesRef.current.size > 0 || extractBlobUrls(value).length > 0;

  return (
    <div className="markdown-editor">
      <div className="markdown-editor__header">
        <label className="markdown-editor__label">
          행사 상세 내용
          {hasPendingImages && (
            <span className="markdown-editor__pending-badge">
              업로드 대기 중 ({extractBlobUrls(value).length}개)
            </span>
          )}
        </label>
        <div className="markdown-editor__actions">
          <button
            type="button"
            onClick={togglePreview}
            className="markdown-editor__preview-button"
          >
            {showPreview ? '편집' : '미리보기'}
          </button>
          {hasPendingImages && (
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isUploading}
              className="markdown-editor__confirm-button"
            >
              {isUploading ? '업로드 중...' : '이미지 업로드 확인'}
            </button>
          )}
        </div>
      </div>

      {!showPreview ? (
        <div
          className={`markdown-editor__editor-wrapper ${
            isDragging ? 'markdown-editor__editor-wrapper--dragging' : ''
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className="markdown-editor__textarea"
            style={{ minHeight }}
          />
          {isDragging && (
            <div className="markdown-editor__drop-overlay">
              <div className="markdown-editor__drop-message">
                이미지를 여기에 드롭하세요
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className="markdown-editor__preview"
          style={{ minHeight }}
          dangerouslySetInnerHTML={{ __html: parseMarkdown(value) }}
        />
      )}

      <div className="markdown-editor__footer">
        <span className="markdown-editor__hint">
          💡 이미지를 드래그 앤 드롭하여 첨부할 수 있습니다. 이미지는 "확인"
          버튼을 눌러야 실제 업로드됩니다.
        </span>
      </div>
    </div>
  );
};

export default MarkdownEditor;
