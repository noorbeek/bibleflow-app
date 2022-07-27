import React from 'react';
import Api from 'services/Api';
import { useQuery } from '@tanstack/react-query';
import BibleVerse from './BibleVerse';
import BibleVerses from './BibleVerses';
import { useAppStore } from 'store/global';
import { getBibleBook } from 'services/Bibles';

export default function BibleQuery(props) {
  const bibleTranslations = useAppStore.getState().bibleTranslations;
  const bibleBooks = useAppStore.getState().bibleBooks;
  const bibleQuery = useQuery(
    ['bibleQuery'],
    async () =>
      await Api.get(`/search/hsv?q=${props.children}`, {
        order: 'createdAt desc',
        join: 'createdBy',
      }),
  );

  let currentBook = null;
  let currentChapter = null;

  return (
    <>
      {bibleQuery?.data?.map(verse => {
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
          <span key={verse.id}>
            {setBook ? (
              <div className="font-bold text-lg pt-4">
                {getBibleBook(verse.book).name}
              </div>
            ) : null}
            {setChapter ? (
              <div className={'mute text-sm ' + (setBook ? 'pb-4' : 'py-4')}>
                {getBibleBook(verse.book).name} {verse.chapter}
              </div>
            ) : null}
            <BibleVerse>{verse}</BibleVerse>
          </span>
        );
      })}
    </>
  );
}
