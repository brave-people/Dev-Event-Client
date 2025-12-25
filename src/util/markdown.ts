import { marked } from 'marked';
import DOMPurify from 'dompurify';

/**
 * 마크다운 문자열을 안전한 HTML로 변환합니다.
 * XSS 공격을 방지하기 위해 DOMPurify로 sanitize 합니다.
 * blob: URL은 로컬 이미지 미리보기를 위해 허용합니다.
 */
export const parseMarkdown = (markdown: string): string => {
  // marked 설정: 단일 줄바꿈도 <br>로 변환 (GFM 스타일)
  marked.setOptions({
    breaks: true, // 한 번의 엔터로 줄바꿈 처리
    gfm: true, // GitHub Flavored Markdown 활성화
  });

  const rawHtml = marked.parse(markdown);
  return DOMPurify.sanitize(rawHtml as string, {
    ADD_TAGS: ['img', 'br'],
    ADD_ATTR: ['src', 'alt'],
    ALLOWED_URI_REGEXP:
      /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|blob):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
  });
};

/**
 * 이미지 파일을 Blob URL로 변환합니다.
 */
export const createBlobUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * 마크다운 텍스트에서 Blob URL을 추출합니다.
 * 예: ![image](blob:http://localhost:3000/abc-123) → blob:http://localhost:3000/abc-123
 */
export const extractBlobUrls = (markdown: string): string[] => {
  const regex = /!\[.*?\]\((blob:[^)]+)\)/g;
  const matches: string[] = [];
  let match;

  while ((match = regex.exec(markdown)) !== null) {
    matches.push(match[1]);
  }

  return matches;
};

/**
 * 마크다운에서 특정 Blob URL을 실제 업로드된 URL로 치환합니다.
 */
export const replaceBlobUrl = (
  markdown: string,
  blobUrl: string,
  uploadedUrl: string
): string => {
  return markdown.replace(
    new RegExp(blobUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
    uploadedUrl
  );
};
