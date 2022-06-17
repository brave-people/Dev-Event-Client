import { useRef, useState } from 'react';
import type {
  MouseEvent,
  Dispatch,
  KeyboardEvent,
  SetStateAction,
} from 'react';
import type { TagModel } from '../../../model/Tag';

const Tags = ({
  tags,
  setTags,
  allTags,
}: {
  tags: string[];
  setTags: Dispatch<SetStateAction<string[]>>;
  allTags: TagModel[];
}) => {
  const tagRef = useRef<HTMLInputElement>(null);
  const [tag, setTag] = useState('');
  const [showPrevTags, setShowPrevTags] = useState<boolean>(false);

  const changeTag = (e: { target: { value: string } }) => {
    setTag(e.target.value);
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
      const target = e.target as HTMLInputElement;
      const replaceValue = target.value.replaceAll(/\s/g, '');
      if (tags.length > 4) return alert('태그는 5개까지만 등록 가능해요!');

      setTags((prevTags: string[]) =>
        Array.from(new Set([...prevTags, replaceValue]))
      );
      tagRef.current?.focus();
      setTag('');
      setShowPrevTags(false);
    }
  };
  const deleteTag = (currentTag: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== currentTag));
    tagRef.current?.focus();
  };

  return (
    <>
      <label
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
        onKeyPress={updateTags}
        className="appearance-none w-full h-10 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
        autoComplete="off"
      />
      {showPrevTags && allTags?.length > 0 && (
        <div className="form__content--all-tags--popup z-10">
          {allTags.map((tag) => (
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
                onClick={() => deleteTag(tag)}
                className="rounded py-1 px-3 mr-3 text-white bg-blue-400 text-sm flex items-center"
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
