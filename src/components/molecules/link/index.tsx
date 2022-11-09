import { useAtom } from 'jotai';
import { linksAtom } from '../../../store/replay';
import LinkInput from './Input';
import type { MouseEvent } from 'react';

const Link = () => {
  const [replayLinks, setReplayLinks] = useAtom(linksAtom);

  const addLink = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setReplayLinks((prev) => [
      ...prev,
      {
        link: '',
        link_type: 'HOMEPAGE',
      },
    ]);
  };

  return (
    <>
      {replayLinks?.map((replayLink, index) => (
        <LinkInput key={index} id={index} replayLink={replayLink} />
      ))}
      <button
        className="link__button--plus w-100 flex justify-center rounded-full"
        onClick={addLink}
      >
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
            strokeWidth="1"
            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    </>
  );
};

export default Link;
