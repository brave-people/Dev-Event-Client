import type { HostClassification } from '../../model/Host';

const LABEL: Record<HostClassification, string> = {
  COMPANY: '회사',
  COMMUNITY: '커뮤니티',
  ACADEMIC: '학회/학술',
  GOVERNMENT: '정부/공공',
  EDUCATION: '교육기관',
  MEDIA: '미디어',
};

const COLOR: Record<HostClassification, string> = {
  COMPANY: 'bg-blue-50 text-blue-700',
  COMMUNITY: 'bg-emerald-50 text-emerald-700',
  ACADEMIC: 'bg-fuchsia-50 text-fuchsia-700',
  GOVERNMENT: 'bg-violet-50 text-violet-700',
  EDUCATION: 'bg-orange-50 text-orange-700',
  MEDIA: 'bg-red-50 text-red-700',
};

type Props = { value: HostClassification | null };

const HostClassificationBadge = ({ value }: Props) => {
  if (!value) {
    return (
      <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
        미분류
      </span>
    );
  }
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${COLOR[value]}`}
    >
      {LABEL[value]}
    </span>
  );
};

export default HostClassificationBadge;
export { LABEL as HOST_CLASSIFICATION_LABEL };
