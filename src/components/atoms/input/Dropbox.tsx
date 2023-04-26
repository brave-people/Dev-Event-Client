import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Dispatch, Fragment, SetStateAction } from 'react';
import classNames from 'classnames';
import type { Selected } from '../../../model/Replay';

type DropboxProps = {
  selected: Selected;
  onChange: Dispatch<SetStateAction<Selected>>;
  list: Selected[];
};

const Dropbox = ({ selected, onChange, list }: DropboxProps) => {
  const { label: selectedLabel } = selected;

  return (
    <Listbox value={selected} onChange={onChange}>
      {({ open }) => (
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-default bg-white py-2 pr-10 text-left focus:outline-none sm:text-sm">
            <span className="flex items-center">
              <span className="block truncate">{selectedLabel}</span>
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
              {list.map((type) => (
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
      )}
    </Listbox>
  );
};

export default Dropbox;
