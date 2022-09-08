/* This example requires Tailwind CSS v2.0+ */
import { ShareIcon, XIcon } from '@heroicons/react/outline';
import React from 'react';
import { useBibleBooks, useBibleTranslations } from 'services/Bibles';
import { useShareStore } from 'store/share';

export default function ShareBanner() {
  const { share, reset, bibleVerses } = useShareStore();
  const bibleTranslations = useBibleTranslations();
  const bibleBooks = useBibleBooks();

  /**
   * Convert verse list to sharable text
   * @param event
   */
  const shareVerses = event => {
    let curBook: number = 0;
    let curChapter: number = 0;
    let curVerse: number = 0;
    let text = '';

    bibleVerses
      .sort((a, b) => a.translation - b.translation)
      .sort((a, b) => a.book - b.book)
      .sort((a, b) => a.chapter - b.chapter)
      .sort((a, b) => a.verse - b.verse)
      .forEach(verse => {
        // Write book and translation names
        if (verse.chapter !== curChapter) {
          text +=
            (text ? '\n' : '') +
            bibleBooks?.find(book => book.id === verse.book)?.name +
            ' ' +
            verse.chapter +
            ' (' +
            bibleTranslations?.find(
              translations => translations.id === verse.translation,
            )?.abbreviation +
            ')' +
            '\n';
        }

        // Write verse text and prepend linebreak if necessary
        text +=
          (curVerse && verse.verse !== curVerse + 1 ? '\n' : '') +
          verse.verse +
          ' ' +
          verse.text +
          ' ';

        // Override current
        curBook = verse.book !== curBook ? verse.book : curBook;
        curChapter = verse.chapter !== curChapter ? verse.chapter : curChapter;
        curVerse = verse.verse;
      });

    // Share text
    if (text) {
      share(event, {
        text: text.replace(/\n{1,}/g, '\n'),
      });
    }
  };

  return (
    <div
      className={
        'bottom-0 inset-x-0 pb-2 sm:pb-5 ' +
        (bibleVerses.length ? 'fixed' : 'hidden')
      }
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="p-2 rounded-lg bg-primary shadow-lg sm:p-3">
          <div className="flex items-center justify-between flex-wrap">
            <div className="shrink w-0 flex-1 flex items-center">
              <span className="flex p-2 rounded-lg">
                <ShareIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </span>
              <p className="ml-3 font-medium text-white truncate">
                <span className="hidden md:inline">
                  {bibleVerses.length} Bijbelverzen geselecteerd
                </span>
              </p>
            </div>
            <div className="order-3 mt-0 flex-shrink-0 sm:order-2 w-auto items-center">
              <button
                onClick={shareVerses}
                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm text-white font-medium hover:bg-white hover:text-primary"
              >
                Deel selectie
              </button>
            </div>
            <div className="shrink order-4 sm:order-3 sm:ml-2">
              <button
                type="button"
                onClick={reset}
                className="-mr-1 flex p-2 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <span className="sr-only">Reset</span>
                <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
