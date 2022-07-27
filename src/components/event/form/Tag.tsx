import { useRef, useState } from 'react';
import type {
  MouseEvent,
  Dispatch,
  KeyboardEvent,
  SetStateAction,
} from 'react';
import type { Tag } from '../../../model/Tag';
import getFirstConsonant from '../../../util/get-first-consonant';

const Tags = ({
  tags,
  setTags,
  allTags,
}: {
  tags: string[];
  setTags: Dispatch<SetStateAction<string[]>>;
  allTags: Tag[];
}) => {
  const tagRef = useRef<HTMLInputElement>(null);
  const tagLabelRef = useRef<HTMLLabelElement>(null);
  const [tag, setTag] = useState('');
  const [showPrevTags, setShowPrevTags] = useState<boolean>(false);
  const [filterAllTags, setFilterAllTags] = useState(allTags);

  const showAllTags = showPrevTags && filterAllTags?.length > 0;

  const changeTag = (e: { target: { value: string } }) => {
    const value = e.target.value;
    setTag(value);
    setFilterAllTags(getFirstConsonant({ words: value, allWord: allTags }));
  };
  const changeSelectTag = (e: MouseEvent<HTMLButtonElement>) => {
    const { value } = e.target as HTMLButtonElement;
    const currentTag = allTags.find((tag) => tag.tag_name === value);
    if (currentTag) {
      if (tags.length > 4) return alert('태그는 5개까지만 등록 가능해요!');

      setTags((prevTags: string[]) =>
        Array.from(new Set([...prevTags, currentTag.tag_name]))
      );
    }
    setShowPrevTags(false);
  };
  const updateTags = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      tagRef.current?.blur();
      const target = e.target as HTMLInputElement;
      const replaceValue = target.value.replaceAll(/\s/g, '');
      if (tags.length > 4) return alert('태그는 5개까지만 등록 가능해요!');

      setTags((prevTags: string[]) =>
        Array.from(new Set([...prevTags, replaceValue]))
      );
      setTag('');
      setShowPrevTags(false);
    }
  };
  const deleteTag = (e: MouseEvent<HTMLButtonElement>, currentTag: string) => {
    e.preventDefault();
    setTags((prevTags) => prevTags.filter((tag) => tag !== currentTag));
  };

  return (
    <>
      <label
        ref={tagLabelRef}
        htmlFor="tag"
        className="form__content__title inline-block text-base font-medium text-gray-600"
      >
        태그
        <span className="text-red-500">*</span>
      </label>
      <input
        ref={tagRef}
        id="tag"
        type="text"
        value={tag}
        onChange={changeTag}
        onClick={() => setShowPrevTags(true)}
        onBlur={() => setShowPrevTags(false)}
        onKeyPress={updateTags}
        className="appearance-none w-full h-10 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
        autoComplete="off"
      />
      {showAllTags && (
        <div className="form__content--all-tags--popup z-10">
          {filterAllTags.map((tag) => (
            <button key={tag.id} value={tag.tag_name} onClick={changeSelectTag}>
              {tag.tag_name}
            </button>
          ))}
        </div>
      )}
      {tags?.length > 0 && (
        <div className="form__content--all-tags">
          {tags.map((tag, index) => {
            return (
              <button
                key={index}
                onClick={(e) => deleteTag(e, tag)}
                className="rounded py-1 px-3 mr-3 text-blue-600 bg-white-400 border border-blue-600 font-bold text-sm flex items-center"
              >
                {tag}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 inline-block ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Tags;
