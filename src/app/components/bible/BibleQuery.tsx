/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import Api from 'services/Api';
import { useQuery } from '@tanstack/react-query';
import BibleVerse from './BibleVerse';
import { useBibleBooks, useBibleTranslation } from 'services/Bibles';
import Pagination from '../Pagination';
import { RefreshIcon } from '@heroicons/react/outline';
import { useParams } from 'react-router';

export default function BibleQuery(props) {
  const bibleBooks = useBibleBooks();
  const bibleTranslation = useBibleTranslation();
  const [pagination, setPagination]: any = useState(null);

  let { q } = useParams();
  let query = props.children ? props.children : q;

  let currentBook = 0;
  let currentChapter = 0;
  let currentVerse = 0;

  // Bible query service
  const bibleQuery = useQuery(
    [`bibleQuery${query}`, pagination],
    async () =>
      await Api.get(
        `/search/${
          bibleTranslation?.abbreviation
            ? bibleTranslation?.abbreviation
            : 'hsv'
        }?q=${query}`,
        {
          order: 'book,chapter,verse',
          join: 'createdBy',
          limit: props.limit ? props.limit : 10,
          page:
            pagination?.page && pagination?.page <= pagination?.pages
              ? pagination?.page
              : 1,
        },
      ),
    {
      staleTime: 5 * 60 * 1000,
      onSuccess: data => {
        setPagination(data?.metadata?.pagination);
      },
    },
  );

  // Set page callback from <Pagination>
  const setPage = (page: number) => {
    setPagination({ ...pagination, page: page });
  };

  return (
    <>
      {bibleQuery.isLoading ? (
        <div className="w-full flex justify-center bg-black/10 dark:bg-white/10">
          <RefreshIcon className="animate-spin w-5 h-5 m-5 text-default" />
        </div>
      ) : null}
      {bibleQuery?.data?.response?.map((verse, index) => {
        // Remember book and chapter and write if they change
        let setBook = verse.book !== currentBook;
        let setChapter = verse.chapter !== currentChapter;
        let setVerse = parseInt(verse.verse) !== currentVerse + 1;

        currentBook = verse.book;
        currentChapter = verse.chapter;
        currentVerse = verse.verse;

        return (
          <span
            key={verse.id}
            className={props?.className ? props?.className : ''}
          >
            {setBook || setChapter ? (
              <div className={'font-bold text-xs ' + (index ? 'py-2' : 'pb-2')}>
                <a
                  href={`/bible/${
                    bibleTranslation?.abbreviation
                      ? bibleTranslation?.abbreviation.toLowerCase()
                      : 'hsv'
                  }/${bibleBooks
                    ?.find(book => book.id === verse.book)
                    ?.abbreviations[0]?.toLowerCase()}/${verse.chapter}`}
                >
                  {bibleBooks?.find(book => book.id === verse.book)?.name +
                    ' ' +
                    verse.chapter}
                </a>
              </div>
            ) : null}
            {setVerse && !setChapter && !setBook ? <br /> : null}
            <BibleVerse
              className={setVerse && !setChapter && !setBook ? 'indent-2' : ''}
              highlight={props?.children}
            >
              {verse}
            </BibleVerse>
          </span>
        );
      })}
      <Pagination
        title={`"${query}" (${bibleTranslation?.abbreviation})`}
        callback={setPage}
      >
        {pagination}
      </Pagination>
    </>
  );
}
