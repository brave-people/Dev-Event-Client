import type { Tag } from '../model/Tag';
import type { EventTimeType } from '../model/Event';

export interface ParsedEventMarkdown {
  title: string;
  link: string;
  organizer: string;
  eventTimeType: EventTimeType;
  startDate: Date | null;
  startTime: Date | null;
  endDate: Date | null;
  endTime: Date | null;
  tags: Tag[];
  unmatchedTagNames: string[];
}

export const extractTagNames = (text: string): string[] => {
  const lines = text.split('\n');
  const categoryLine = lines.find((line) => line.includes('분류:'));
  if (!categoryLine) return [];

  const backtickRegex = /`([^`]+)`/g;
  const names = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = backtickRegex.exec(categoryLine)) !== null) {
    const normalized = match[1].replace(/\s*\([^)]*\)\s*/g, '').trim();
    if (normalized.length > 0) names.add(normalized);
  }

  return Array.from(names);
};

export const parseEventMarkdown = (
  text: string,
  allTags: Tag[]
): ParsedEventMarkdown => {
  const lines = text.split('\n');
  const firstLine = lines[0] ?? '';

  // 행사 제목 파싱
  const titleRegex = /- __\[(.*?)\]\(/;
  const titleMatch = firstLine.match(titleRegex);
  const title = titleMatch ? titleMatch[1] : '';

  // 행사 링크 파싱
  const linkRegex = /\]\((.*?)\)__/;
  const linkMatch = firstLine.match(linkRegex);
  const link = linkMatch ? linkMatch[1] : '';

  // 주최 파싱
  const organizerLine = lines.find((line) => line.includes('주최:'));
  const organizer = organizerLine ? organizerLine.split('주최:')[1].trim() : '';

  // 시작 & 종료일자 파싱
  const dateLine = lines.find(
    (line) => line.includes('접수:') || line.includes('일시:')
  );

  let startDateStr = '';
  let startTimeStr = '';
  let endDateStr = '';
  let endTimeStr = '';
  let startDate: Date | null = null;
  let startTime: Date | null = null;
  let endDate: Date | null = null;
  let endTime: Date | null = null;
  let eventTimeType: EventTimeType = 'DATE';

  if (dateLine) {
    eventTimeType = dateLine.includes('접수:') ? 'RECRUIT' : 'DATE';
    const currentYear = new Date().getFullYear();

    const startRegex =
      /(\d{2}\.\s*\d{2})\([\w가-힣]+\)(?:\s*(\d{2}:\d{2}))?\s*~/;
    const startMatch = dateLine.match(startRegex);
    if (startMatch) {
      startDateStr = startMatch[1].replace(/\s+/g, '');
      startTimeStr = startMatch[2] || '00:00';
      startDate = new Date(`${currentYear}.${startDateStr} ${startTimeStr}`);
      if (startTimeStr) {
        startTime = new Date(`${currentYear}.${startDateStr} ${startTimeStr}`);
      }
    }

    const endRegex = /~\s*(\d{2}\.\s*\d{2})\([\w가-힣]+\)(?:\s*(\d{2}:\d{2}))?/;
    const endMatch = dateLine.match(endRegex);
    if (endMatch) {
      endDateStr = endMatch[1].replace(/\s+/g, '');
      endTimeStr = endMatch[2] || '23:59';
      endDate = new Date(`${currentYear}.${endDateStr} ${endTimeStr}`);
      if (endTimeStr) {
        endTime = new Date(`${currentYear}.${endDateStr} ${endTimeStr}`);
      }
    } else {
      const endTimeOnlyRegex = /~\s*(\d{2}:\d{2})/;
      const endTimeOnlyMatch = dateLine.match(endTimeOnlyRegex);
      if (endTimeOnlyMatch) {
        endTimeStr = endTimeOnlyMatch[1];
        endDate = new Date(`${currentYear}.${startDateStr} ${endTimeStr}`);
        endTime = new Date(`${currentYear}.${startDateStr} ${endTimeStr}`);
      }
    }
  }

  // 태그 매칭
  const extracted = extractTagNames(text);
  const tags: Tag[] = [];
  const unmatchedTagNames: string[] = [];

  for (const name of extracted) {
    const found = allTags.find((t) => t.tag_name === name);
    if (found) tags.push(found);
    else unmatchedTagNames.push(name);
  }

  return {
    title,
    link,
    organizer,
    eventTimeType,
    startDate,
    startTime,
    endDate,
    endTime,
    tags,
    unmatchedTagNames,
  };
};
