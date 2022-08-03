import React, { useState } from 'react';
import { useAppStore } from 'store/global';
import { useQuery } from '@tanstack/react-query';
import Selectbox from 'app/components/Selectbox';
import {
  useBibleBook,
  useBibleBooks,
  useBibleTranslation,
  useBibleTranslations,
} from 'services/Bibles';
import {
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
} from '@heroicons/react/solid';
import BibleVerses from 'app/components/bible/BibleVerses';
import Api from 'services/Api';
import Header from 'app/components/Header';

export default function BibleReader(props) {
  const currentTranslation = useAppStore(state => state.currentTranslation);
  const currentBook = useAppStore(state => state.currentBook);
  const currentChapter = useAppStore(state => state.currentChapter);
  const currentVerse = useAppStore(state => state.currentVerse);

  const bibleTranslations = useBibleTranslations();
  const bibleTranslation = useBibleTranslation(currentTranslation);
  const bibleBooks = useBibleBooks();
  const bibleBook = useBibleBook(currentBook);

  const bibleVerses = useQuery(
    ['bibleVerses', currentTranslation, currentBook, currentChapter],
    async () =>
      await Api.get(`/bibleVerses`, {
        limit: 999,
        where: `translation:${currentTranslation} and book:${currentBook} and chapter:${currentChapter}`,
        order: 'book,chapter,verse',
      }),
  );

  const bibleChapters = useQuery(
    ['bibleChapters', currentTranslation, currentBook, currentChapter],
    async () =>
      await Api.get(`/bibleVerses`, {
        limit: 999,
        select: 'id,chapter',
        where: `translation:${currentTranslation} and book:${currentBook} and verse:1`,
        order: 'chapter',
      }),
  );

  function setTranslation(translation) {
    useAppStore.setState({
      currentTranslation: translation.id,
      currentBook: 1,
      currentChapter: 1,
    });
  }

  function setBook(book) {
    useAppStore.setState({
      currentBook: book.id,
      currentChapter: 1,
    });
  }

  function setChapter(chapter) {
    useAppStore.setState({
      currentChapter: chapter.id,
    });
  }

  return (
    <>
      <main className="col-span-10 max-w-2xl">
        <Header
          title={
            bibleTranslation?.name + ' (' + bibleTranslation?.abbreviation + ')'
          }
          subtitle={
            bibleBook?.name +
            ' ' +
            currentChapter +
            ':1-' +
            bibleVerses?.data?.response?.length
          }
        />

        <div className="flex flex-col sm:flex-row my-4 pb-5 border-b border-gray-200 dark:border-white/10 px-4 sm:px-0">
          <div className="flex-none">
            <Selectbox
              label="Vertaling"
              selected={currentTranslation}
              onChange={setTranslation}
              options={bibleTranslations?.map(translation => {
                return {
                  id: translation.id,
                  text: translation.name,
                  description: translation.abbreviation,
                  active: translation.id === currentTranslation,
                  selected: translation.id === currentTranslation,
                };
              })}
            />
          </div>
          <div className="grow px-0 sm:px-4">
            <Selectbox
              label="Boek"
              selected={currentBook}
              onChange={setBook}
              options={bibleBooks.map(book => {
                return {
                  id: book.id,
                  text: book.name,
                  description: book.abbreviations.join(', '),
                  active: book.id === currentBook,
                  selected: book.id === currentBook,
                };
              })}
            />
          </div>
          <div className="flex-none">
            <Selectbox
              label="Hoofdstuk"
              selected={currentChapter}
              onChange={setChapter}
              options={bibleChapters?.data?.response?.map(chapter => {
                return {
                  id: chapter.chapter,
                  text: chapter.chapter,
                  description: '',
                  active: chapter.chapter === currentChapter,
                  selected: chapter.chapter === currentChapter,
                };
              })}
            />
          </div>
        </div>
        <div className="my-4">
          <BibleVerses>{bibleVerses?.data?.response}</BibleVerses>
        </div>
        <nav className="border-t border-black/5 dark:border-white/10 mt-8 pt-4 flex flex-row items-start justify-between sm:px-0">
          <div className="grow">
            <a
              onClick={event =>
                setChapter({
                  id: currentChapter - 1 < 1 ? 1 : currentChapter - 1,
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
            {bibleChapters?.data?.response?.map(chapter => (
              <a
                key={chapter.id}
                onClick={event => setChapter({ id: chapter.chapter })}
                className={
                  (currentChapter === chapter.chapter
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
                    currentChapter + 1 > bibleChapters?.data?.response?.length
                      ? bibleChapters?.data?.response?.length
                      : currentChapter + 1,
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
            {bibleBook?.name} {currentChapter}:1-
            {bibleVerses?.data?.response?.length}
            <br />
            <small>{bibleTranslation?.copyright}</small>
          </p>
        </div>
      </main>
    </>
  );
}
