import React from 'react';
import Api from 'services/Api';
import { useQuery } from '@tanstack/react-query';
import BibleVerse from './BibleVerse';
import { useBibleBooks } from 'services/Bibles';

export default function BibleQuery(props) {
  const bibleBooks = useBibleBooks();
  const bibleQuery = useQuery(
    [`bibleQuery${props.children}`],
    async () =>
      await Api.get(`/search/hsv?q=${props.children}`, {
        order: 'book,chapter,verse',
        join: 'createdBy',
      }),
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
    </>
  );
}
