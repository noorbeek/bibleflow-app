import axios from 'axios';
import React, { Fragment, useState } from 'react';
import { useAppStore } from 'store/global';
import { useQuery } from '@tanstack/react-query';
import Selectbox from 'app/components/Selectbox';
import { getBibleTranslation } from 'app/services/Bibles';
import { CalendarIcon, ChevronRightIcon } from '@heroicons/react/solid';

export default function BibleReader(props) {
  const bibleTranslations = useAppStore.getState().bibleTranslations;
  const bibleBooks = useAppStore.getState().bibleBooks;
  const [readerState, setReaderState] = useState<any>({
    translation: localStorage['currentTranslation']
      ? localStorage['currentTranslation']
      : bibleTranslations[0].id,
    book: localStorage['currentBook'] ? localStorage['currentBook'] : 1,
    chapters: localStorage['currentChapters']
      ? localStorage['currentChapters']
      : 50,
    chapter: localStorage['currentChapter']
      ? localStorage['currentChapter']
      : 1,
    verse: localStorage['currentVerse'] ? localStorage['currentVerse'] : 0,
  });

  const bibleVerses = useQuery(
    [
      'bibleVerses',
      readerState.translation,
      readerState.book,
      readerState.chapter,
    ],
    async () =>
      await axios.get(
        `/bibleVerses?where=translation:${readerState.translation}+and+book:${readerState.book}+and+chapter:${readerState.chapter}`,
      ),
  );

  function updateLocalStorage(translation, book, chapters, chapter, verse) {
    if (translation) {
      localStorage['currentTranslation'] = translation;
    }
    if (book) {
      localStorage['currentBook'] = book;
    }
    if (chapters) {
      localStorage['currentChapters'] = chapters;
    }
    if (chapter) {
      localStorage['currentChapter'] = chapter;
    }
    if (verse) {
      localStorage['currentVerse'] = verse;
    }
  }

  function setTranslation(translation) {
    updateLocalStorage(translation.id, 1, 50, 1, null);
    setReaderState(
      Object.assign({}, readerState, {
        translation: translation.id,
        book: 1,
        chapter: 1,
        chapters: 50,
      }),
    );
  }

  async function setBook(book) {
    const chapters = await axios.get(
      `/bibleVerses?select=id&where=translation:${readerState.translation}+and+book:${readerState.book}+and+verse:1`,
    );
    updateLocalStorage(null, book.id, chapters.data.response.length, 1, null);
    setReaderState(
      Object.assign({}, readerState, {
        book: book.id,
        chapters: chapters.data.response.length,
        chapter: 1,
      }),
    );
  }

  function setChapter(chapter) {
    updateLocalStorage(null, null, null, chapter.id, null);
    setReaderState(Object.assign({}, readerState, { chapter: chapter.id }));
  }

  return (
    <>
      <main className="col-span-9">
        <div className="pb-5 border-b border-gray-200">
          <div className="sm:flex sm:justify-between sm:items-baseline">
            <div className="sm:w-0 sm:flex-1">
              <h1
                id="message-heading"
                className="text-lg font-medium text-gray-900"
              >
                {getBibleTranslation(readerState.translation)?.name} (
                {getBibleTranslation(readerState.translation)?.abbreviation})
              </h1>
              <p className="mt-1 text-sm text-gray-500 truncate">
                Hoofdstuk {readerState.chapter}:1-
                {bibleVerses?.data?.data?.response?.length}
              </p>
            </div>
          </div>
        </div>

        <div className="my-4 pb-5 border-b border-gray-200 columns-3">
          <Selectbox
            label="Vertaling"
            selected={readerState.translation}
            onChange={setTranslation}
            options={bibleTranslations.map(translation => {
              return {
                id: translation.id,
                text: translation.name,
                description: translation.abbreviation,
              };
            })}
          />
          <Selectbox
            label="Boek"
            selected={readerState.book}
            onChange={setBook}
            options={bibleBooks.map(book => {
              return {
                id: book.id,
                text: book.name,
                description: book.abbreviations.join(', '),
              };
            })}
          />
          <Selectbox
            label="Hoofdstuk"
            selected={readerState.chapter}
            onChange={setChapter}
            options={Array.from(Array(readerState.chapters).keys()).map(
              chapterId => {
                return {
                  id: chapterId + 1,
                  text: chapterId + 1,
                  description: '',
                };
              },
            )}
          />
        </div>
        <div className="my-4">
          <div className="bg-white shadow hover:shadow-2xl transition-all overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {bibleVerses?.data?.data?.response?.map(verse => (
                <li key={verse.id}>
                  <a href="#" className="block hover:bg-gray-50">
                    <div className="px-4 py-4 flex items-center sm:px-6">
                      <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                        <div className="text-sm">
                          <sup>{verse.verse}</sup> {verse.text}
                        </div>
                      </div>
                      <div className="ml-5 flex-shrink-0">
                        <ChevronRightIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
