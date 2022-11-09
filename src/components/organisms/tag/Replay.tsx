import { Fragment, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import {
  createTagApi,
  modifyTagApi,
  deleteTagApi,
  getTagsApi,
} from '../../../pages/api/replay/tag';
import TagLayer from '../../molecules/layer/Tag';
import { STATUS_200, STATUS_201 } from '../../../config/constants';
import type { ChangeEvent } from 'react';
import type { Tag, TagLayerType } from '../../../model/Tag';

const TagList = ({ tags }: { tags: Tag[] }) => {
  const layerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement[]>([]);
  const [list, setList] = useState(tags);
  const [keyword, setKeyword] = useState('');
  const [showLayer, setShowLayer] = useState(false);
  const [layerType, setLayerType] = useState<TagLayerType | null>(null);
  const [selectTags, setSelectTags] = useState<Tag[]>([]);
  const [name, setName] = useState('');
  const [color, setColor] = useState('');

  const { data, refetch } = useQuery(
    ['fetchEventTags'],
    async () => await getTagsApi(),
    { refetchOnWindowFocus: false }
  );

  const setLayer = async (type: TagLayerType) => {
    // 생성
    if (type === 'create') {
      resetCheckbox();
      setShowLayer(!showLayer);
    }

    // 수정
    if (type === 'modify') {
      if (selectTags.length !== 1) return alert('하나의 태그만 선택해주세요');

      setName(selectTags[0].tag_name);
      setColor(selectTags[0].tag_color);
      setShowLayer(!showLayer);
    }

    // 삭제
    if (type === 'delete') {
      if (!selectTags.at(-1)) return alert('태그를 하나 이상 선택해주세요');

      const deleteTags = async () => {
        for (const tag of selectTags) {
          await deleteTagApi(tag.id);
        }
      };

      await deleteTags();
      resetCheckbox();
      await refetch();
    }

    setLayerType(type);
  };

  const closeLayer = () => setShowLayer(!showLayer);
  const resetCheckbox = () => {
    inputRef.current.map((el) => (el.checked = false));
    setSelectTags([]);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = JSON.parse(e.target.value);
    let updatedList = selectTags;

    if (e.target.checked) {
      updatedList = [...selectTags, value];
    } else {
      updatedList.splice(list.indexOf(value), 1);
    }

    setSelectTags(updatedList);
  };

  const save = async () => {
    // 태그 생성
    if (layerType === 'create') {
      if (!name) return alert('이름을 넣어주세요');
      if (!color) return alert('색상을 골라주세요');

      const findTag = tags.find(({ tag_name }) => tag_name === name);
      if (findTag) return alert(`이미 있는 태그에요! 태그 id: ${findTag.id}`);

      const data = await createTagApi({ tag_name: name, tag_color: color });
      if (data.status_code === STATUS_201) {
        closeLayer();
        await refetch();
      }
    }

    // 태그 수정
    if (layerType === 'modify') {
      const data = await modifyTagApi(
        { tag_name: name, tag_color: color },
        selectTags[0].id
      );

      if (data.status_code === STATUS_200) {
        resetCheckbox();
        closeLayer();
        await refetch();
      }
    }
  };

  useEffect(() => {
    if (!data) return setList([]);
    if (!keyword) return setList(data);

    const findKeywordList = data.filter((tagList) =>
      tagList.tag_name.includes(keyword)
    );
    return setList(findKeywordList);
  }, [keyword, data]);

  return (
    <div className="list">
      <div className="list__header">
        <div className="relative">
          <button
            onClick={() => setLayer('create')}
            className="mr-2 py-2 px-6 text-white rounded bg-blue-500 text-sm"
          >
            + 생성
          </button>
          <button
            onClick={() => setLayer('modify')}
            className="mr-2 py-2 px-6 text-gray-500 rounded border border-solid border-gray-200 text-sm"
          >
            수정
          </button>
          <button
            onClick={() => setLayer('delete')}
            className="py-2 px-6 text-gray-500 rounded border border-solid border-gray-200 text-sm"
          >
            삭제
          </button>
        </div>
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
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>
      <div className="list__table relative mt-8 border rounded">
        {!list?.length ? (
          <p className="py-24 text-center font-bold text-base">
            태그가 없어요! 태그를 만들어주세요
          </p>
        ) : (
          <table className="w-full p-4">
            <thead className="list__table--thead">
              <tr>
                <td className="list__table--title w-20" />
                <td className="list__table--title">ID</td>
                <td className="list__table--title">태그 이름</td>
                <td className="list__table--title">색상</td>
              </tr>
            </thead>
            <tbody>
              {list?.map((value, index) => (
                <Fragment key={value.id}>
                  <tr>
                    <td>
                      <input
                        ref={(el) => el && (inputRef.current[index] = el)}
                        type="checkbox"
                        onChange={onChange}
                        value={JSON.stringify(value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="list__table--sub-title">{value.id}</td>
                    <td>{value.tag_name}</td>
                    <td>
                      <span
                        className="w-3 h-3 mr-1 inline-block rounded-full"
                        style={{ backgroundColor: value.tag_color || '#000' }}
                      />
                      {value.tag_color || '색상 없음'}
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div ref={layerRef}>
        <TagLayer
          type={layerType}
          showLayer={showLayer}
          closeLayer={closeLayer}
          layerRef={layerRef}
          name={name}
          setName={setName}
          color={color}
          setColor={setColor}
          save={save}
        />
      </div>
    </div>
  );
};

export default TagList;
