import React from 'react';
import BibleVerse from './BibleVerse';

export default function BibleVerses(props) {
  const options = Object.assign(
    {
      className: '',
      hoverable: false,
    },
    props,
  );

  let className =
    'bg-white dark:bg-transparent shadow transition-all overflow-hidden sm:rounded-md ' +
    (options.hoverable ? 'hover:shadow-2xl ' : '') +
    options.className;

  return (
    <div className={className}>
      <ul role="list" className="divide-y divide-black/10 dark:divide-white/10">
        {props?.children?.map(verse => (
          <li key={verse.id}>
            <div
              className={
                'block ' +
                (options.hoverable ? 'bg-gray-50 hover:dark:bg-white/10' : '')
              }
            >
              <div className="px-4 py-4 flex items-center sm:px-6">
                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <BibleVerse>{verse}</BibleVerse>
                </div>
                {/* <div className="ml-5 flex-shrink-0">
              <ChevronRightIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div> */}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
