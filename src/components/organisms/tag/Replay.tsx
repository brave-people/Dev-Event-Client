import { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import {
  createTagApi,
  modifyTagApi,
  deleteTagApi,
  getTagsApi,
} from '../../../pages/api/replay/tag';
import TagLayer from '../../molecules/layer/Tag';
import type { Tag, TagLayerType, TagState } from '../../../model/Tag';
import TagSearch from '../../molecules/TagSearch';
import ActionTagButtons from '../../molecules/ActionTagButtons';

const TagList = ({ tags }: { tags: Tag[] }) => {
  const layerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement[]>([]);
  const [state, setState] = useState<TagState>({
    tagList: tags,
    selectTags: [],
    activeType: null,
    keyword: '',
    showLayer: false,
  });

  const { data, refetch } = useQuery(
    ['fetchReplayTags'],
    async () => await getTagsApi(),
    { refetchOnWindowFocus: false }
  );

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
      await deleteTagApi(tag.id);
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
      <div className="list__table relative mt-8 border rounded">
        {!state.tagList?.length ? (
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
              {state.tagList?.map(({ id, tag_name, tag_color }, index) => (
                <Fragment key={id}>
                  <tr>
                    <td>
                      <input
                        ref={(el) => el && (inputRef.current[index] = el)}
                        type="checkbox"
                        onChange={handleCheckbox}
                        value={JSON.stringify({ id, tag_name, tag_color })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="list__table--sub-title">{id}</td>
                    <td>{tag_name}</td>
                    <td>
                      <span
                        className="w-3 h-3 mr-1 inline-block rounded-full"
                        style={{ backgroundColor: tag_color || '#000' }}
                      />
                      {tag_color || '색상 없음'}
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
          state={state}
          layerRef={layerRef}
          closeLayer={closeLayer}
          resetCheckbox={resetCheckbox}
          refetch={refetch}
          createTag={createTagApi}
          modifyTag={modifyTagApi}
        />
      </div>
    </div>
  );
};

export default TagList;
