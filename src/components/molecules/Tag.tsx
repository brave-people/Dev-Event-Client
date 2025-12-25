import {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import type {
  Tag,
  TagRefetch,
  TagLayerType,
  TagApi,
  TagState,
} from '../../model/Tag';
import TagLayer from './layer/Tag';

const ActionTagButtons = ({
  updateActiveLayer,
}: {
  updateActiveLayer: (type: TagLayerType) => void;
}) => {
  return (
    <div className="relative">
      <button
        onClick={() => updateActiveLayer('create')}
        className="mr-2 py-2 px-6 text-white rounded bg-blue-500 text-sm"
      >
        + 생성
      </button>
      <button
        onClick={() => updateActiveLayer('modify')}
        className="mr-2 py-2 px-6 text-gray-500 rounded border border-solid border-gray-200 text-sm"
      >
        수정
      </button>
      <button
        onClick={() => updateActiveLayer('delete')}
        className="py-2 px-6 text-gray-500 rounded border border-solid border-gray-200 text-sm"
      >
        삭제
      </button>
    </div>
  );
};

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

const TagComponent = ({
  tags,
  data,
  refetch,
  createTag,
  modifyTag,
  deleteTag,
}: {
  tags: Tag[];
  data?: Tag[];
} & TagApi &
  TagRefetch) => {
  const inputRef = useRef<HTMLInputElement[]>([]);
  const layerRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<TagState>({
    tagList: tags,
    selectTags: [],
    activeType: null,
    keyword: '',
    showLayer: false,
  });

  const resetCheckbox = () => {
    inputRef.current.map((el) => (el.checked = false));
    setState((prev) => ({ ...prev, selectTags: [] }));
  };

  const updateActiveLayer = async (type: TagLayerType) => {
    switch (type) {
      case 'create':
        break;
      case 'modify':
        if (state.selectTags.length !== 1)
          return alert('하나의 태그만 선택해주세요');
        break;
      case 'delete':
        if (!state.selectTags.at(-1))
          return alert('태그를 하나 이상 선택해주세요');
        await deleteTags();
        return;
    }

    setState((prevState) => ({
      ...prevState,
      activeType: type,
      showLayer: !state.showLayer,
    }));
  };

  const closeLayer = () => setState({ ...state, showLayer: !state.showLayer });

  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    const value = JSON.parse(e.target.value);
    const index = state.selectTags.findIndex((tag) => tag.id === value.id);
    if (e.target.checked) {
      setState((prev) => ({
        ...prev,
        selectTags: [...state.selectTags, value],
      }));
    } else if (index !== -1) {
      state.selectTags.splice(index, 1);
      setState((prev) => ({
        ...prev,
        selectTags: [...state.selectTags],
      }));
    }
  };

  const deleteTags = async () => {
    for (const tag of state.selectTags) {
      await deleteTag(tag.id);
    }
    resetCheckbox();
    await refetch();
  };

  useEffect(() => {
    if (!data) return setState((prev) => ({ ...prev, tagList: [] }));
    if (!state.keyword) return setState((prev) => ({ ...prev, tagList: data }));

    const findKeywordList = data.filter((tagList) =>
      tagList.tag_name.includes(state.keyword)
    );
    return setState((prev) => ({ ...prev, tagList: findKeywordList }));
  }, [state.keyword, data]);

  return (
    <div className="list">
      <div className="list__header">
        <ActionTagButtons updateActiveLayer={updateActiveLayer} />
        <TagSearch keyword={state.keyword} setState={setState} />
      </div>
      <div className="list__container">
        {!state.tagList?.length ? (
          <div className="list__empty">
            <svg
              className="list__empty-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <p className="list__empty-text">
              태그가 없어요! 태그를 만들어주세요
            </p>
          </div>
        ) : (
          <div className="list__table-wrapper">
            <table className="list__table">
              <thead>
                <tr>
                  <th className="list__table-header" style={{ width: '80px' }}>
                    선택
                  </th>
                  <th className="list__table-header" style={{ width: '100px' }}>
                    ID
                  </th>
                  <th className="list__table-header">태그 이름</th>
                  <th className="list__table-header">색상</th>
                </tr>
              </thead>
              <tbody>
                {state.tagList?.map(({ id, tag_name, tag_color }, index) => (
                  <tr key={id} className="list__table-row">
                    <td className="list__table-cell">
                      <input
                        ref={(el) => {
                          if (el) inputRef.current[index] = el;
                        }}
                        type="checkbox"
                        onChange={handleCheckbox}
                        value={JSON.stringify({ id, tag_name, tag_color })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                      />
                    </td>
                    <td className="list__table-cell list__table-cell--number">
                      {id}
                    </td>
                    <td className="list__table-cell list__table-cell--title">
                      <span className="list__table-title-text">{tag_name}</span>
                    </td>
                    <td className="list__table-cell">
                      <div className="flex items-center">
                        <span
                          className="w-4 h-4 mr-2 inline-block rounded-full border border-gray-200"
                          style={{ backgroundColor: tag_color || '#000' }}
                        />
                        <span className="text-sm text-gray-600">
                          {tag_color || '색상 없음'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div ref={layerRef}>
        <TagLayer
          state={state}
          layerRef={layerRef}
          closeLayer={closeLayer}
          resetCheckbox={resetCheckbox}
          refetch={refetch}
          createTag={createTag}
          modifyTag={modifyTag}
        />
      </div>
    </div>
  );
};

export default TagComponent;
