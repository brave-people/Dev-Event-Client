import type { Dispatch, SetStateAction } from 'react';
import type { TagState } from '../../model/Tag';

const TagSearch = ({
  keyword,
  setState,
}: {
  keyword: string;
  setState: Dispatch<SetStateAction<TagState>>;
}) => {
  const onChange = (value: string) =>
    setState((prevState) => ({ ...prevState, keyword: value }));

  return (
    <div className="list__search">
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="#6E6E6E"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        placeholder="태그명으로 검색"
        value={keyword}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default TagSearch;
