/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import Api from 'services/Api';
import { useQuery } from '@tanstack/react-query';
import BibleVerse from './BibleVerse';
import { useBibleBooks } from 'services/Bibles';
import {
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
} from '@heroicons/react/solid';

export default function BibleQuery(props) {
  const bibleBooks = useBibleBooks();
  const [pagination, setPagination] = useState({
    first: 1,
    start: 1,
    current: 1,
    end: 1,
    last: 1,
    pages: [1],
  });

  const bibleQuery = useQuery(
    [`bibleQuery${props.children}`, pagination.current],
    async () =>
      await Api.get(`/search/hsv?q=${props.children}`, {
        order: 'book,chapter,verse',
        join: 'createdBy',
        limit: 10,
        page: pagination.current,
      }),
    {
      onSuccess: data => {
        // Calculate pagination data
        let maxPages = 10;
        let pageData = data?.metadata?.pagination;
        let last = pageData?.pages ? pageData?.pages : 1;
        let pages = Array.from({ length: last }, (_, i) => i + 1);
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
          pages = pages.splice(
            pages.indexOf(first),
            first + (maxPages - first),
          );
        }

        // Update state
        setPagination({
          first: 1,
          start: pages[0],
          current: current,
          end: pages[pages.length - 1],
          last: last,
          pages: pages,
        });
      },
    },
  );

  let currentBook = null;
  let currentChapter = null;

  return (
    <>
      {bibleQuery?.data?.response?.map((verse, index) => {
        let setBook = false;
        let setChapter = false;
        if (verse.book !== currentBook) {
          currentBook = verse.book;
          setBook = true;
        }
        if (verse.chapter !== currentChapter) {
          currentChapter = verse.chapter;
          setChapter = true;
        }
        return (
          <span
            key={verse.id}
            className={
              'text-justify ' + (props?.className ? props?.className : '')
            }
          >
            {setBook ? (
              <div className={'font-bold ' + (index ? 'pt-4' : '')}>
                {bibleBooks.find(book => book.id === verse.book)?.name}
              </div>
            ) : null}
            {setChapter ? (
              <div className={'mute ' + (setBook ? 'pb-4' : 'py-4')}>
                Hoofdstuk {verse.chapter}
              </div>
            ) : null}
            <BibleVerse highlight={props?.children}>{verse}</BibleVerse>
          </span>
        );
      })}
      <nav className="border-t border-black/5 dark:border-white/10 mt-8 pt-4 flex flex-row items-start justify-between sm:px-0">
        <div
          className={
            'grow flex ' +
            (pagination.current === 1 ? 'opacity-25 cursor-default' : '')
          }
        >
          <a
            onClick={() =>
              pagination.current !== 1
                ? setPagination({ ...pagination, current: 1 })
                : null
            }
            className="pt-2 pr-1 pl-4 sm:pl-0 inline-flex text-sm font-medium text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
          >
            <ArrowNarrowLeftIcon className={'mr-3 h-5 w-5 '} />
            <span className="hidden sm:inline">Eerste</span>
          </a>
        </div>
        <div className="grow text-center">
          {pagination.start > 1 ? <span className="mute">...</span> : ''}
          {pagination.pages.map(page => (
            <a
              key={page}
              onClick={event => setPagination({ ...pagination, current: page })}
              className={
                (pagination.current === page
                  ? 'font-bold'
                  : 'font-medium mute') +
                ' border-transparent pt-2 px-2 inline-flex items-center text-sm'
              }
            >
              {page}
            </a>
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
          <a
            onClick={() =>
              pagination?.last !== pagination.current
                ? setPagination({ ...pagination, current: pagination.last })
                : null
            }
            className="pt-2 pl-1 pr-4 sm:pr-0 inline-flex text-sm font-medium text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
          >
            <span className="hidden sm:inline">Laatste</span>
            <ArrowNarrowRightIcon className={'ml-3 h-5 w-5 '} />
          </a>
        </div>
      </nav>
    </>
  );
}
