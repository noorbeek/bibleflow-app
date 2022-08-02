/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Selectbox(props) {
  const [selected, setSelected] = useState(
    props?.options?.find(option => option.id === props?.selected),
  );

  function changeSelected(option) {
    setSelected(option);
    props.onChange(option);
  }

  useEffect(() => {
    setSelected(props?.options?.find(option => option.id === props?.selected));
  }, [props.options, props.selected]);

  return (
    <Listbox value={selected} onChange={changeSelected}>
      {({ open }) => (
        <>
          {props.label ? (
            <Listbox.Label className="hidden sm:block text-sm font-medium">
              {props.label}
            </Listbox.Label>
          ) : null}
          <div className="mt-1 relative">
            <Listbox.Button className="relative w-full text-default hover:text-white bg-white dark:bg-white/10 border border-gray-900/25 rounded-md shadow-sm hover:shadow-xl transition-all pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm">
              <span className="w-full inline-flex truncate">
                <span className="truncate">{selected?.text}</span>
                {selected?.description ? (
                  <span className="ml-2 truncate mute">
                    {selected?.description}
                  </span>
                ) : (
                  <></>
                )}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon className="h-5 w-5 mute" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute bg-default z-10 mt-1 w-full text-default drop-shadow-2xl max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {props.options?.map(option => (
                  <Listbox.Option
                    key={option.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-primary' : '',
                        'hover:bg-primary cursor-default select-none relative py-2 pl-3 pr-9',
                      )
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex">
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'truncate',
                            )}
                          >
                            {option.text}
                          </span>
                          <span
                            className={classNames(
                              selected ? 'text-indigo-200' : 'text-gray-500',
                              'ml-2 truncate',
                            )}
                          >
                            {option.description}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-primary',
                              'absolute inset-y-0 right-0 flex items-center pr-4',
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
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
  );
}
