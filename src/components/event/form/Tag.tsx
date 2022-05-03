import { useRef, useState } from 'react';
import type {
  ChangeEvent,
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
  const [selectTag] = useState();

  const changeTag = (e: { target: { value: string } }) => {
    setTag(e.target.value);
  };
  const changeSelectTag = (e: ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.children) as HTMLOptionElement[];
    const currentTag = options.find(
      (selectList) => selectList.value === e.target.value
    );
    if (currentTag?.label) {
      setTags((prevTags: string[]) =>
        Array.from(new Set([...prevTags, currentTag.label]))
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
      setTags((prevTags: string[]) =>
        Array.from(new Set([...prevTags, replaceValue]))
      );
      tagRef.current?.focus();
      setTag('');
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
        <select
          className="form__content--all-tags z-10"
          value={selectTag}
          onChange={changeSelectTag}
        >
          <option value="">--추천 태그--</option>
          {allTags.map((tag) => (
            <option key={tag.id} value={tag.id} label={tag.tag_name}>
              {tag.tag_name}
            </option>
          ))}
        </select>
      )}
      {tags?.length > 0 && (
        <div className="form__content--all-tags">
          {tags.map((tag, index) => {
            return (
              <button
                key={index}
                onClick={() => deleteTag(tag)}
                className="rounded py-1 px-3 text-white bg-blue-400 text-sm flex items-center"
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
