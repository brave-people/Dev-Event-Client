import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import Input from '../input/Input';
import type { Dispatch, SetStateAction, MutableRefObject } from 'react';
import type { TagLayerType } from '../../model/Tag';

interface TagLayerProps {
  type: TagLayerType | null;
  layerRef: MutableRefObject<HTMLDivElement | null>;
  showLayer: boolean;
  closeLayer: () => void;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  color: string;
  setColor: Dispatch<SetStateAction<string>>;
  save: () => void;
}

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
  type,
  layerRef,
  showLayer,
  closeLayer,
  name,
  setName,
  color,
  setColor,
  save,
}: TagLayerProps) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const showName = type !== 'delete';

  const onChangeName = (e: { target: { value: string } }) =>
    setName(e.target.value);

  const onChangeColor = (value: string) => setColor(value);

  useEffect(() => {
    divRef.current = document.createElement('div');
  }, []);

  useEffect(() => {
    if (!divRef.current) return;

    if (showLayer) {
      layerRef.current?.appendChild(divRef.current);
    } else {
      // close 시 초기화
      setName('');
      setColor('');

      layerRef.current?.children?.length &&
        layerRef.current?.removeChild(divRef.current);
    }
  }, [showLayer]);

  if (!divRef.current || !showLayer) return null;

  return createPortal(
    <div className="popup p-4">
      <div className="flex justify-between p-4">
        <h3 className="uppercase text-xl font-medium">{type} tags</h3>
        <button onClick={closeLayer}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="m-4">
        {showName && (
          <Input
            text="태그 이름"
            value={name}
            onChange={onChangeName}
            autoComplete="off"
          />
        )}
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
