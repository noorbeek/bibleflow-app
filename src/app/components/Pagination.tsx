import React, { useEffect, useState } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/solid';
import Link from './Link';
import { SearchIcon } from '@heroicons/react/outline';
export default function Pagination(props) {
  const [pagination, setPagination] = useState({
    first: 1,
    start: 1,
    current: 1,
    end: 1,
    last: 1,
    range: [1],
  });

  const setPage = page => {
    props.callback(page);
  };

  useEffect(() => {
    // Calculate pagination data
    let maxPages = 10;
    let pageData = props?.children;
    let last = pageData?.pages ? pageData?.pages : 1;
    let range = Array.from({ length: last }, (_, i) => i + 1);
    let current = pageData?.page ? pageData?.page : 1;
    let first = 1;

    if (last > maxPages && current <= maxPages / 2) {
      first = 1;
    } else if (
      last > maxPages &&
      current > maxPages / 2 &&
      current <= last - maxPages / 2
    ) {
      first = current - maxPages / 2;
    } else if (
      last > maxPages &&
      current > maxPages / 2 &&
      current >= last - maxPages / 2
    ) {
      first = last + 1 - maxPages;
    } else if (last > maxPages) {
      first = last - maxPages;
    }

    // Splice array to MAX items
    if (last > maxPages) {
      range = range.splice(range.indexOf(first), first + (maxPages - first));
    }

    // Update state
    setPagination({
      first: 1,
      start: range[0],
      current: current,
      end: range[range.length - 1],
      last: last,
      range: range,
    });
  }, [props?.children]);

  return (
    <nav className="border-t border-black/5 dark:border-white/10 mt-8 pt-4 sm:px-0">
      {pagination.last > 1 ? (
        <div className="flex flex-row items-start justify-between border-b border-black/5 dark:border-white/10 mb-4 pb-6">
          <div
            className={
              'grow flex ' +
              (pagination.current === 1 ? 'opacity-25 cursor-default' : '')
            }
          >
            <Link
              onClick={() => (pagination.current !== 1 ? setPage(1) : null)}
              className="pt-2 inline-flex text-sm font-medium"
            >
              <ChevronDoubleLeftIcon className={'mr-0 sm:mr-2 h-5 w-5 '} />
              <span className="hidden sm:inline">Eerste</span>
            </Link>
            <Link
              onClick={() =>
                pagination.current !== 1
                  ? setPage(pagination.current - 1)
                  : null
              }
              className="pt-2 ml-0 sm:ml-3 inline-flex text-sm font-medium"
            >
              <ChevronLeftIcon className={'mr-0 sm:mr-2 h-5 w-5 '} />
              <span className="hidden sm:inline">Vorige</span>
            </Link>
          </div>
          <div className="grow text-center">
            {pagination.start > 1 ? <span className="mute">...</span> : ''}
            {pagination.range.map(page => (
              <Link
                key={page}
                onClick={event => setPage(page)}
                className={
                  (pagination.current === page
                    ? 'font-bold underline text-primary hover:text-primary dark:text-white hover:dark:text-white'
                    : 'font-medium') +
                  ' border-transparent pt-2 px-2 inline-flex items-center text-sm'
                }
              >
                {page}
              </Link>
            ))}
            {pagination.end < pagination.last ? (
              <span className="mute">...</span>
            ) : (
              ''
            )}
          </div>
          <div
            className={
              'grow flex justify-end ' +
              (pagination.end === pagination.current
                ? 'opacity-25 cursor-default'
                : '')
            }
          >
            <Link
              onClick={() =>
                pagination?.last !== pagination.current
                  ? setPage(pagination.current + 1)
                  : null
              }
              className="pt-2 pr-0 sm:pr-3 inline-flex text-sm font-medium"
            >
              <span className="hidden sm:inline">Volgende</span>
              <ChevronRightIcon className={'ml-0 sm:ml-3 h-5 w-5 '} />
            </Link>
            <Link
              onClick={() =>
                pagination?.last !== pagination.current
                  ? setPage(pagination.last)
                  : null
              }
              className="pt-2 inline-flex text-sm font-medium"
            >
              <span className="hidden sm:inline">Laatste</span>
              <ChevronDoubleRightIcon className={'ml-0 sm:ml-3 h-5 w-5 '} />
            </Link>
          </div>
        </div>
      ) : null}
      <div className="flex flex-col sm:flex-row items-center justify-between align-middle text-xs text-center mute">
        {props?.title ? (
          <div>
            <SearchIcon className="w-4 h-4 inline" /> {props?.title}
          </div>
        ) : null}
        <div>
          {props?.children?.count} items gevonden ({props?.children?.limit} per
          pagina)
        </div>
      </div>
    </nav>
  );
}
