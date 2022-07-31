import React, { Fragment, useState } from 'react';
import { useAppStore } from 'store/global';
import { useQuery } from '@tanstack/react-query';
import {
  useBibleBook,
  useBibleBooks,
  useBibleTranslation,
  useBibleTranslations,
} from 'services/Bibles';
import { useLocation } from 'react-router-dom';
import BibleVerse from 'app/components/bible/BibleVerse';
import Api from 'services/Api';
import Header from 'app/components/Header';
import BibleQuery from 'app/components/bible/BibleQuery';

export default function Search(props) {
  const bibleTranslations = useBibleTranslations();
  const bibleTranslation = useBibleTranslation();
  const bibleBook = useBibleBook();
  const currentTranslation = useAppStore(state => state.currentTranslation);
  const location = useLocation();

  let q = decodeURIComponent(
    location.search.replace(/^.*(\?+|&+)q=([^$&]+).*$/, '$2'),
  );

  const bibleVerses = useQuery(
    ['bibleVerses', currentTranslation, q],
    async () => {
      return await Api.get(
        `/search/${
          bibleTranslation?.abbreviation
            ? bibleTranslation?.abbreviation
            : 'hsv'
        }?q=${q}`,
        {
          limit: 999,
          order: 'book,chapter,verse',
        },
      );
    },
  );

  // function setTranslation(translation) {
  //   setSearchState(
  //     Object.assign({}, searchState, {
  //       translation: translation.id,
  //       book: 1,
  //       chapter: 1,
  //       chapters: 50,
  //     }),
  //   );
  // }

  let currentBook: number = 0;
  let currentChapter: number = 0;
  let currentVerse: number = 0;

  return (
    <>
      <main className="col-span-10">
        <Header
          title={
            bibleTranslation?.name + '(' + bibleTranslation?.abbreviation + ')'
          }
          subtitle={'Zoekresultaten voor "' + q + '"'}
        />
        <BibleQuery>{q}</BibleQuery>
      </main>
    </>
  );
}
