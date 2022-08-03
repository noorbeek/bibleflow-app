/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import Api from 'services/Api';
import { useQuery } from '@tanstack/react-query';
import BibleVerse from './BibleVerse';
import { useBibleBooks, useBibleTranslation } from 'services/Bibles';
import Pagination from '../Pagination';

export default function BibleQuery(props) {
  const bibleBooks = useBibleBooks();
  const bibleTranslation = useBibleTranslation();
  const [pagination, setPagination]: any = useState(null);

  let currentBook = 0;
  let currentChapter = 0;
  let currentVerse = 0;

  // Bible query service
  const bibleQuery = useQuery(
    [`bibleQuery${props.children}`, pagination?.page],
    async () =>
      await Api.get(
        `/search/${
          bibleTranslation?.abbreviation
            ? bibleTranslation?.abbreviation
            : 'hsv'
        }?q=${props.children}`,
        {
          order: 'book,chapter,verse',
          join: 'createdBy',
          limit: props.limit ? props.limit : 10,
          page: pagination?.page ? pagination?.page : 1,
        },
      ),
    {
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
      {bibleQuery?.data?.response?.map((verse, index) => {
        // Remember book and chapter and write if they change
        let setBook = verse.book !== currentBook;
        let setChapter = verse.chapter !== currentChapter;
        let setVerse = verse.verse !== currentVerse + 1;

        currentBook = verse.book;
        currentChapter = verse.chapter;
        currentVerse = verse.verse;

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
              <div className={'mute text-sm ' + (setBook ? 'pb-4' : 'py-4')}>
                Hoofdstuk {verse.chapter}
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
        title={`"${props.children}" (${bibleTranslation?.abbreviation})`}
        callback={setPage}
      >
        {pagination}
      </Pagination>
    </>
  );
}
