/**
 * ISO 날짜 문자열을 사람이 읽기 좋은 형식으로 변환합니다.
 * @param dateString - ISO 8601 형식의 날짜 문자열 (예: "2025-12-17T00:00:00Z")
 * @param format - 'date' | 'datetime' | 'relative'
 * @returns 포맷된 날짜 문자열 (예: "2025.12.17" 또는 "2025.12.17 00:00")
 */
export const formatDate = (
  dateString: string | null,
  format: 'date' | 'datetime' | 'relative' = 'datetime'
): string => {
  if (!dateString) return '-';

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return '-';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    switch (format) {
      case 'date':
        return `${year}.${month}.${day}`;
      case 'datetime':
        return `${year}.${month}.${day} ${hours}:${minutes}`;
      case 'relative':
        return getRelativeTime(date);
      default:
        return `${year}.${month}.${day} ${hours}:${minutes}`;
    }
  } catch (error) {
    console.error('Date formatting error:', error);
    return '-';
  }
};

/**
 * 상대적인 시간을 반환합니다 (예: "2일 전", "1시간 후")
 */
const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (Math.abs(diffDays) > 7) {
    return formatDate(date.toISOString(), 'date');
  } else if (diffDays > 0) {
    return `${diffDays}일 후`;
  } else if (diffDays < 0) {
    return `${Math.abs(diffDays)}일 전`;
  } else if (diffHours > 0) {
    return `${diffHours}시간 후`;
  } else if (diffHours < 0) {
    return `${Math.abs(diffHours)}시간 전`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes}분 후`;
  } else if (diffMinutes < 0) {
    return `${Math.abs(diffMinutes)}분 전`;
  } else {
    return '방금';
  }
};

/**
 * 날짜 범위를 사람이 읽기 좋은 형식으로 변환합니다.
 * @param startDate - 시작 날짜
 * @param endDate - 종료 날짜
 * @returns 포맷된 날짜 범위 (예: "2025.12.17 ~ 2025.12.20")
 */
export const formatDateRange = (
  startDate: string | null,
  endDate: string | null
): string => {
  const start = formatDate(startDate, 'datetime');
  const end = formatDate(endDate, 'datetime');

  if (start === '-' && end === '-') return '-';
  if (start === '-') return end;
  if (end === '-') return start;

  return `${start} ~ ${end}`;
};

