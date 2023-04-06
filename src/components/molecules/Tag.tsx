import { useEffect, useRef, useState } from 'react';
import {
  MouseEvent,
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  ReactNode,
} from 'react';
import { Tag } from '../../model/Tag';
import BaseLabel from '../atoms/label/base';

const TagButton = ({
  deleteTag,
  tag,
}: {
  deleteTag: (e: MouseEvent<HTMLButtonElement>, currentTag: string) => void;
  tag: string;
}) => {
  return (
    <button
      key={tag}
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
};

const Tags = ({
  tags,
  setTags,
  storedTags,
  children,
}: {
  tags: string[];
  setTags: Dispatch<SetStateAction<Tag[]>>;
  storedTags: Tag[];
  children: ReactNode;
}) => {
  const tagRef = useRef<HTMLInputElement | null>(null);
  const [tag, setTag] = useState('');
  const [showPrevTags, setShowPrevTags] = useState<boolean>(false);
  const [filterAllTags, setFilterAllTags] = useState(storedTags || []);

  const changeTag = (e: { target: { value: string } }) => {
    const value = e.target.value;
    setTag(value);
    setFilterAllTags(
      storedTags?.filter((tag) => {
        const lowerTag = tag.tag_name.toLowerCase();
        return lowerTag.includes(value.toLowerCase());
      })
    );
  };

  const updateTag = (
    e: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLInputElement>,
    value: string
  ) => {
    e.preventDefault();
    const currentTag = storedTags.find((tag) => tag.tag_name === value);

    if (currentTag) {
      if (tags.length > 4) return alert('태그는 5개까지만 등록 가능해요!');
      if (tags.find((tag) => tag === value)) return;
      setTags((prevTags) => {
        return Array.from(new Set([...prevTags, currentTag]));
      });
    }

    setTag('');
    setShowPrevTags(false);
    setFilterAllTags(storedTags);
  };

  const clickTagEvent = (e: MouseEvent<HTMLButtonElement>) => {
    const { value } = e.target as HTMLButtonElement;
    updateTag(e, value);
    setFilterAllTags(storedTags);
  };

  const keyboardTagEvent = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code !== 'Enter') return;
    e.preventDefault();

    const { value } = e.target as HTMLInputElement;
    updateTag(e, value);
  };

  const deleteTag = (e: MouseEvent<HTMLButtonElement>, currentTag: string) => {
    e.preventDefault();
    setTags((prevTags) =>
      prevTags.filter((tag) => tag.tag_name !== currentTag)
    );
  };

  const blurEvent = () => {
    // click event를 먼저 받을 수 있게 setTimeout 100ms 추가
    setTimeout(() => {
      setShowPrevTags(false);
    }, 100);
  };

  useEffect(() => {
    setFilterAllTags(storedTags);
  }, [storedTags]);

  return (
    <>
      <div className="form__content__input form__content__input--tag">
        <BaseLabel title="태그" htmlFor="tag" required={true} />
        {tags.length > 0 ? (
          <div className="form__content--all-tags">
            {tags.map((tag, index) => (
              <TagButton key={index} tag={tag} deleteTag={deleteTag} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            하나 이상의 태그를 추가해주세요 😇
          </p>
        )}
      </div>
      <div className="form__content__input--tag-search relative">
        <input
          ref={tagRef}
          id="tag"
          type="text"
          value={tag}
          onChange={changeTag}
          onClick={() => setShowPrevTags(true)}
          onBlur={blurEvent}
          onKeyPress={keyboardTagEvent}
          className="appearance-none w-full h-10 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          autoComplete="off"
        />
        {showPrevTags && (
          <div className="form__content--all-tags--popup z-10">
            {filterAllTags.length ? (
              filterAllTags.map((tag) => (
                <button
                  key={tag.id}
                  value={tag.tag_name}
                  onClick={clickTagEvent}
                >
                  + {tag.tag_name}
                </button>
              ))
            ) : (
              <p>태그 검색 결과가 없어요!</p>
            )}
          </div>
        )}
      </div>
      <div className="form__content__input">{children}</div>
    </>
  );
};

export default Tags;
