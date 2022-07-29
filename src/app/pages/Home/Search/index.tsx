import React, { Fragment, useState } from 'react';
import { useAppStore } from 'store/global';
import { useQuery } from '@tanstack/react-query';
import { getBibleBook, getBibleTranslation } from 'services/Bibles';
import { useLocation } from 'react-router-dom';
import BibleVerse from 'app/components/bible/BibleVerse';
import Api from 'services/Api';

export default function Search(props) {
  const bibleTranslations = useAppStore.getState().bibleTranslations;
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
      return await Api.get(
        `/search/${
          getBibleTranslation(searchState.translation).abbreviation
        }?q=${q}`,
        {
          limit: 999,
          order: 'book,chapter,verse',
        },
      );
    },
  );

  function updateLocalStorage(translation) {
    if (translation) {
      localStorage['currentTranslation'] = translation;
    }
  }

  function setTranslation(translation) {
    updateLocalStorage(translation.id);
    setSearchState(
      Object.assign({}, searchState, {
        translation: translation.id,
        book: 1,
        chapter: 1,
        chapters: 50,
      }),
    );
  }

  let currentBook: number = 0;
  let currentChapter: number = 0;
  let currentVerse: number = 0;

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
                {bibleVerses?.data?.length} verzen gevonden
              </p>
            </div>
          </div>
        </div>

        <div className="my-4 text-justify px-4 sm:px-0">
          {bibleVerses?.data?.map(verse => {
            let setBook = false;
            let setChapter = false;
            let setVerse = false;
            if (verse.verse * 1 < currentVerse * 1) {
              currentVerse = 0;
            }
            if (verse.book !== currentBook) {
              currentBook = verse.book;
              setBook = true;
            }
            if (verse.chapter !== currentChapter) {
              currentChapter = verse.chapter;
              setChapter = true;
            }
            if (currentVerse && verse.verse * 1 !== currentVerse * 1 + 1) {
              setVerse = true;
              console.warn(verse.verse * 1 + ' !== ' + (currentVerse * 1 + 1));
            }
            currentVerse = verse.verse * 1;
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
                {setVerse ? <br /> : null}
                <BibleVerse highlight={q}>{verse}</BibleVerse>
              </span>
            );
          })}
        </div>
      </main>
    </>
  );
}
