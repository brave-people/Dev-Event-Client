import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { linksState } from '../../../../store/replay';
import { useSetRecoilState } from 'recoil';

const replayType = [
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

const LinkInput = ({ replayLink, id }) => {
  const { link, link_type } = replayLink;
  const setLinks = useSetRecoilState(linksState);
  const [selected, setSelected] = useState(replayType[0]);

  const removeLink = (id: number) => {
    setLinks((prev) => {
      return prev.filter((_, index) => index !== id);
    });
  };

  return (
    <div className="form__content__list h-10 mb-4 px-2 border-solid border border-gray-300 rounded">
      <Listbox value={selected} onChange={setSelected}>
        {({ open }) => (
          <>
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-default bg-white py-2 pr-10 text-left focus:outline-none sm:text-sm">
                <span className="flex items-center">
                  <span className="block truncate">{selected.label}</span>
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {replayType.map((type) => (
                    <Listbox.Option
                      key={type.id}
                      className="relative cursor-default select-none p-2"
                      value={type}
                    >
                      {({ selected }) => (
                        <>
                          <div className="flex items-center">
                            <span
                              className={classNames(
                                selected ? 'font-semibold' : 'font-normal',
                                'ml-3 block truncate'
                              )}
                            >
                              {type.label}
                            </span>
                          </div>
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
      <input
        type="text"
        className="w-full border-none focus:outline-none focus:ring-transparent text-sm py-0"
      />
      <button className="rounded-full" onClick={() => removeLink(id)}>
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
            d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    </div>
  );
};

export default LinkInput;
