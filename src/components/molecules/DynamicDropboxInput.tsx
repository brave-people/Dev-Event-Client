import type { MouseEvent } from 'react';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { ReplayLink, Selected } from '../../model/Replay';
import { linksAtom } from '../../store/replay';
import Minus from '../atoms/icon/Minus';
import Plus from '../atoms/icon/Plus';
import Dropbox from '../atoms/input/Dropbox';

type DropboxInputProps = {
  id: number;
  item: ReplayLink;
};

const replayTypes: Selected[] = [
  {
    id: 1,
    label: '홈페이지',
    value: 'HOMEPAGE',
  },
  {
    id: 2,
    label: 'Youtube',
    value: 'YOUTUBE',
  },
];

const DropboxInput = ({ id, item }: DropboxInputProps) => {
  const findReplayType =
    replayTypes.find((type) => type.value === item?.link_type) ||
    replayTypes[0];

  const [links, setLinks] = useAtom(linksAtom);
  const [value, setValue] = useState(links[id].link);
  const [selectedType, setSelectedType] = useState(findReplayType);

  const deleteInput = (id: number) => {
    setLinks((prev) => {
      return prev.filter((_, index) => index !== id);
    });
  };

  const updateInput = (e: { target: { value: string } }) => {
    const { value } = e.target;
    setValue(value);
    setLinks((prev) => {
      prev[id].link = value;
      prev[id].link_type = selectedType.value;
      return prev;
    });
  };

  return (
    <div className="form__content__list h-10 mb-4 px-2 border-solid border border-gray-300 rounded">
      <Dropbox
        selected={selectedType}
        onChange={setSelectedType}
        list={replayTypes}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => updateInput(e)}
        className="w-full border-none focus:outline-none focus:ring-transparent text-sm py-0"
      />
      <button className="rounded-full" onClick={() => deleteInput(id)}>
        <Minus />
      </button>
    </div>
  );
};

const DynamicDropboxInput = () => {
  const [links, setLinks] = useAtom(linksAtom);

  const addLink = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setLinks((prev) => [
      ...prev,
      {
        link: '',
        link_type: 'HOMEPAGE',
      },
    ]);
  };

  return (
    <>
      {links?.map((item, index) => (
        <DropboxInput key={index} id={index} item={item} />
      ))}
      <button
        className="link__button--plus w-100 flex justify-center rounded-full"
        onClick={addLink}
      >
        <Plus />
      </button>
    </>
  );
};

export default DynamicDropboxInput;
