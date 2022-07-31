import React from 'react';

export default function Header(props) {
  return (
    <div className="pb-5 px-4 sm:px-0 border-b border-gray-200 dark:border-white/10">
      <div className="sm:flex sm:justify-between sm:items-baseline">
        <div className="sm:w-0 sm:flex-1">
          <h1>{props?.title}</h1>
          {props?.subtitle ? (
            <p className="mt-1 text-sm mute truncate">{props?.subtitle}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
