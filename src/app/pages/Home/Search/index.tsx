import axios from 'axios';
import React, { Fragment, useState } from 'react';
import { useAppStore } from 'store/global';
import { useQuery } from '@tanstack/react-query';
import Selectbox from 'app/components/Selectbox';
import { getBibleBook, getBibleTranslation } from 'services/Bibles';
import {
  ChevronRightIcon,
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
} from '@heroicons/react/solid';
import BibleVerses from 'app/components/bible/BibleVerses';
import { useLocation } from 'react-router-dom';
import BibleVerse from 'app/components/bible/BibleVerse';

export default function Search(props) {
  const bibleTranslations = useAppStore.getState().bibleTranslations;
  const bibleBooks = useAppStore.getState().bibleBooks;
  const location = useLocation();

  let q = decodeURIComponent(
    location.search.replace(/^.*(\?+|&+)q=([^$&]+).*$/, '$2'),
  );

  const [searchState, setSearchState] = useState<any>({
    translation: localStorage['currentTranslation']
      ? localStorage['currentTranslation']
      : bibleTranslations[0].id,
  });

  const bibleVerses = useQuery(
    ['bibleVerses', searchState.translation, q],
    async () => {
      let query: any = [];
      q.split(/\s*,+\s*/g).forEach(orQ => {
        if (orQ) {
          query.push(`(text~${orQ.split(/\s+/g).join('+and+text~')})`);
        }
      });
      return await axios.get(
        `/bibleVerses?limit=999&order=book,chapter,verse&where=translation:${
          searchState.translation
        }+and+(${query.join('+or+')})`,
      );
    },
  );

  function updateLocalStorage(translation, book, chapter, verse) {
    if (translation) {
      localStorage['currentTranslation'] = translation;
    }
  }

  function setTranslation(translation) {
    updateLocalStorage(translation.id, 1, 1, null);
    setSearchState(
      Object.assign({}, searchState, {
        translation: translation.id,
        book: 1,
        chapter: 1,
        chapters: 50,
      }),
    );
  }

  let currentBook = null;
  let currentChapter = null;

  return (
    <>
      <main className="col-span-9">
        <div className="pb-5 border-b border-gray-200 dark:border-white/10 px-4 sm:px-0">
          <div className="sm:flex sm:justify-between sm:items-baseline">
            <div className="sm:w-0 sm:flex-1">
              <h1 id="message-heading">
                {getBibleTranslation(searchState.translation)?.name} (
                {getBibleTranslation(searchState.translation)?.abbreviation})
              </h1>
              <p className="mt-1 text-sm text-gray-500 truncate">
                {bibleVerses?.data?.data?.response?.length} verzen gevonden
              </p>
            </div>
          </div>
        </div>

        <div className="my-4 text-justify">
          {bibleVerses?.data?.data?.response.map(verse => {
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
                  <div
                    className={'mute text-sm ' + (setBook ? 'pb-4' : 'py-4')}
                  >
                    {getBibleBook(verse.book).name} {verse.chapter}
                  </div>
                ) : null}
                <BibleVerse highlight={q}>{verse}</BibleVerse>
              </span>
            );
          })}
        </div>
      </main>
    </>
  );
}
