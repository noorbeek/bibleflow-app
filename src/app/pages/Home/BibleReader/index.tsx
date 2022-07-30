import React, { useState } from 'react';
import { useAppStore } from 'store/global';
import { useQuery } from '@tanstack/react-query';
import Selectbox from 'app/components/Selectbox';
import { useBibleBook, useBibleTranslation } from 'services/Bibles';
import {
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
} from '@heroicons/react/solid';
import BibleVerses from 'app/components/bible/BibleVerses';
import Api from 'services/Api';
import Header from 'app/components/Header';

export default function BibleReader(props) {
  const bibleTranslations = useAppStore.getState().bibleTranslations;
  const bibleBooks = useAppStore.getState().bibleBooks;

  const [readerState, setReaderState] = useState<any>({
    translation: localStorage['currentTranslation']
      ? localStorage['currentTranslation']
      : bibleTranslations[0]?.id,
    book: localStorage['currentBook'] ? localStorage['currentBook'] : 1,
    chapter: localStorage['currentChapter']
      ? localStorage['currentChapter']
      : 1,
    verse: localStorage['currentVerse'] ? localStorage['currentVerse'] : 0,
  });

  const bibleTranslation = useBibleTranslation(readerState.translation);
  const bibleBook = useBibleBook(readerState.book);

  const bibleVerses = useQuery(
    [
      'bibleVerses',
      readerState.translation,
      readerState.book,
      readerState.chapter,
    ],
    async () =>
      await Api.get(`/bibleVerses`, {
        limit: 999,
        where: `translation:${readerState.translation} and book:${readerState.book} and chapter:${readerState.chapter}`,
        order: 'book,chapter,verse',
      }),
  );

  const bibleChapters = useQuery(
    [
      'bibleChapters',
      readerState.translation,
      readerState.book,
      readerState.chapter,
    ],
    async () =>
      await Api.get(`/bibleVerses`, {
        limit: 999,
        select: 'id,chapter',
        where: `translation:${readerState.translation} and book:${readerState.book} and verse:1`,
        order: 'chapter',
      }),
  );

  function updateLocalStorage(translation, book, chapter, verse) {
    if (translation) {
      localStorage['currentTranslation'] = translation;
    }
    if (book) {
      localStorage['currentBook'] = book;
    }
    if (chapter) {
      localStorage['currentChapter'] = chapter;
    }
    if (verse) {
      localStorage['currentVerse'] = verse;
    }
  }

  function setTranslation(translation) {
    updateLocalStorage(translation.id, 1, 1, null);
    setReaderState(
      Object.assign({}, readerState, {
        translation: translation.id,
        book: 1,
        chapter: 1,
        chapters: 50,
      }),
    );
  }

  function setBook(book) {
    updateLocalStorage(null, book.id, 1, null);
    setReaderState(
      Object.assign({}, readerState, {
        book: book.id,
        chapter: 1,
      }),
    );
  }

  function setChapter(chapter) {
    updateLocalStorage(null, null, chapter.id, null);
    setReaderState(Object.assign({}, readerState, { chapter: chapter.id }));
  }

  return (
    <>
      <main className="col-span-9">
        <Header
          title={
            bibleTranslation?.name + ' (' + bibleTranslation?.abbreviation + ')'
          }
          subtitle={
            bibleBook?.name +
            ' ' +
            readerState.chapter +
            ':1-' +
            bibleVerses?.data?.length
          }
        />

        <div className="flex flex-col sm:flex-row my-4 pb-5 border-b border-gray-200 dark:border-white/10 px-4 sm:px-0">
          <div className="flex-none">
            <Selectbox
              label="Vertaling"
              selected={readerState.translation}
              onChange={setTranslation}
              options={bibleTranslations.map(translation => {
                return {
                  id: translation.id,
                  text: translation.name,
                  description: translation.abbreviation,
                  active: translation.id === readerState.translation,
                  selected: translation.id === readerState.translation,
                };
              })}
            />
          </div>
          <div className="grow px-0 sm:px-4">
            <Selectbox
              label="Boek"
              selected={readerState.book}
              onChange={setBook}
              options={bibleBooks.map(book => {
                return {
                  id: book.id,
                  text: book.name,
                  description: book.abbreviations.join(', '),
                  active: book.id === readerState.book,
                  selected: book.id === readerState.book,
                };
              })}
            />
          </div>
          <div className="flex-none">
            <Selectbox
              label="Hoofdstuk"
              selected={readerState.chapter}
              onChange={setChapter}
              options={bibleChapters?.data?.map(chapter => {
                return {
                  id: chapter.chapter,
                  text: chapter.chapter,
                  description: '',
                  active: chapter.chapter === readerState.chapter,
                  selected: chapter.chapter === readerState.chapter,
                };
              })}
            />
          </div>
        </div>
        <div className="my-4">
          <BibleVerses>{bibleVerses?.data}</BibleVerses>
        </div>
        <nav className="border-t border-black/5 dark:border-white/10 mt-8 pt-4 flex flex-row items-start justify-between sm:px-0">
          <div className="grow">
            <a
              onClick={event =>
                setChapter({
                  id: readerState.chapter - 1 < 1 ? 1 : readerState.chapter - 1,
                })
              }
              className="pt-2 pr-1 pl-4 sm:pl-0 inline-flex text-sm font-medium"
            >
              <ArrowNarrowLeftIcon
                className="mr-3 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Vorige</span>
            </a>
          </div>
          <div className="grow text-center">
            {bibleChapters?.data?.map(chapter => (
              <a
                key={chapter.id}
                onClick={event => setChapter({ id: chapter.chapter })}
                className={
                  (readerState.chapter === chapter.chapter
                    ? 'font-bold'
                    : 'font-medium mute') +
                  ' border-transparent pt-2 px-2 inline-flex items-center text-sm'
                }
              >
                {chapter.chapter}
              </a>
            ))}
          </div>
          <div className="grow flex justify-end">
            <a
              onClick={event =>
                setChapter({
                  id:
                    readerState.chapter + 1 > bibleChapters?.data?.length
                      ? bibleChapters?.data?.length
                      : readerState.chapter + 1,
                })
              }
              className="pt-2 pl-1 pr-4 sm:pr-0 inline-flex text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <span className="hidden sm:inline">Volgende</span>
              <ArrowNarrowRightIcon
                className="ml-3 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </a>
          </div>
        </nav>
        <div className="mt-8 pt-4 text-center border-t border-black/5 dark:border-white/10">
          <p className="mt-1 text-sm mute">
            {bibleTranslation?.name} ({bibleTranslation?.abbreviation}) -
            {bibleBook?.name} {readerState.chapter}:1-
            {bibleVerses?.data?.length}
            <br />
            <small>{bibleTranslation?.copyright}</small>
          </p>
        </div>
      </main>
    </>
  );
}
