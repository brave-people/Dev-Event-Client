import { useEffect, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { STATUS_200, STATUS_201 } from '../../../config/constants';
import type { TagState, TagName } from '../../../model/Tag';
import CloseIcon from '../../atoms/icon/CloseIcon';
import Input from '../../atoms/input/Input';

type TagLayerProps = {
  state: TagState;
  layerRef: MutableRefObject<HTMLDivElement | null>;
  closeLayer: () => void;
  resetCheckbox: () => void;
  refetch: () => void;
  createTag: (
    data: TagName
  ) => Promise<{ status_code: number; status: string }>;
  modifyTag: (
    data: TagName,
    id: number
  ) => Promise<{ status_code: number; status: string }>;
};

const colors = [
  '#6DC670',
  '#9867D7',
  '#F0977B',
  '#667CF1',
  '#5D93E4',
  '#F1C36A',
  '#E17272',
  '#FFE76B',
  '#DE85D5',
  '#589457',
];

const TagLayer = ({
  state,
  layerRef,
  closeLayer,
  resetCheckbox,
  refetch,
  createTag,
  modifyTag,
}: TagLayerProps) => {
  const { showLayer, activeType, tagList, selectTags } = state;

  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const divRef = useRef<HTMLDivElement | null>(null);

  const onChangeName = (e: { target: { value: string } }) =>
    setName(e.target.value);

  const onChangeColor = (value: string) => setColor(value);

  const save = async () => {
    if (activeType === 'create') {
      if (!name) return alert('이름을 넣어주세요');
      if (!color) return alert('색상을 골라주세요');

      const findTag = tagList.find(({ tag_name }) => tag_name === name);
      if (findTag) return alert(`이미 있는 태그에요! 태그 id: ${findTag.id}`);

      const data = await createTag({ tag_name: name, tag_color: color });
      if (data.status_code === STATUS_201) {
        closeLayer();
        await refetch();
      }
    }

    if (activeType === 'modify') {
      const data = await modifyTag(
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
    divRef.current = document.createElement('div');
  }, []);

  useEffect(() => {
    if (!divRef.current) return;

    if (showLayer) {
      layerRef.current?.appendChild(divRef.current);

      if (activeType === 'modify') {
        setName(selectTags[0].tag_name);
        setColor(selectTags[0].tag_color);
      }
    } else if (layerRef.current?.childElementCount) {
      layerRef.current?.removeChild(divRef.current);
    }

    return () => {
      setName('');
      setColor('');
    };
  }, [showLayer]);

  if (!divRef.current || !showLayer) return null;

  return createPortal(
    <div className="popup p-4">
      <div className="flex justify-between p-4">
        <h3 className="uppercase text-xl font-medium">{activeType} tags</h3>
        <button onClick={closeLayer}>
          <CloseIcon />
        </button>
      </div>
      <div className="m-4">
        <Input
          text="태그 이름"
          value={name}
          onChange={onChangeName}
          autoComplete="off"
        />
        <p className="form__content__title inline-block text-base font-medium text-gray-600 mb-4">
          태그 색상
        </p>
        <div className="tag__colors">
          {colors.map((value) => (
            <button
              key={value}
              onClick={() => onChangeColor(value)}
              className={classNames({ 'tag__colors--active': value === color })}
            >
              <div
                key={value}
                className="w-16 h-16 rounded-full"
                style={{ backgroundColor: value }}
              />
              <p className="mt-2 text-sm">{value}</p>
            </button>
          ))}
        </div>
        <div className="popup__button mt-16">
          <button
            onClick={save}
            className="bg-blue-500 text-white rounded py-2 px-5 text-sm font-medium"
          >
            확인
          </button>
          <button
            onClick={closeLayer}
            className="border border-solid border-gray-200 rounded py-2 px-5 text-sm font-medium ml-2"
          >
            취소
          </button>
        </div>
      </div>
    </div>,
    divRef.current
  );
};

export default TagLayer;
