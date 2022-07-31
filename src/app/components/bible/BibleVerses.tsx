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
    'py-8 dark:py-0 px-4 sm:px-8 dark:px-4 dark:sm:px-0 leading-8 text-justify bg-white dark:bg-transparent shadow transition-all overflow-hidden sm:rounded-md ' +
    (options.hoverable ? 'hover:shadow-2xl ' : '') +
    options.className;

  return (
    <div className={className}>
      {props?.children?.map(verse => (
        <span key={verse.id}>
          <BibleVerse>{verse}</BibleVerse>
        </span>
      ))}
    </div>
  );
}
