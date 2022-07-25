/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Selectbox(props) {
  let options: any[] = [];

  if (props.options && props.options.length && props.options[0].id) {
    options = props.options;
  }

  const [selected, setSelected] = useState(
    options.find(option => option.id && option.id === parseInt(props.selected))
      ? options.find(
          option => option.id && option.id === parseInt(props.selected),
        )
      : options.length
      ? options[0]
      : null,
  );

  function changeSelected(option) {
    setSelected(option);
    props.onChange(option);
  }

  return (
    <Listbox value={selected} onChange={changeSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium text-gray-700">
            {props.label ? props.label : 'Selecteer'} - {props.selected}
          </Listbox.Label>
          <div className="mt-1 relative">
            <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm hover:shadow-xl transition-all pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <span className="w-full inline-flex truncate">
                <span className="truncate">
                  {selected && selected.text ? selected.text : ''}
                </span>
                {selected && selected.description ? (
                  <span className="ml-2 truncate text-gray-500">
                    {selected.description}
                  </span>
                ) : (
                  <></>
                )}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon
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
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {props.options?.map(option => (
                  <Listbox.Option
                    key={option.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                        'cursor-default select-none relative py-2 pl-3 pr-9',
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
                              active ? 'text-white' : 'text-indigo-600',
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
