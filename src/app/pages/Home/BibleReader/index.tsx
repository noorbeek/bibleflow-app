import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { useAppStore } from 'store/global';
import { useQuery } from '@tanstack/react-query';

export default function BibleReader(props) {
  const bibleTranslations = useAppStore.getState().bibleTranslations;
  const [readerState, setReaderState] = useState<any>({
    translation: bibleTranslations[0].id,
    book: 1,
    chapter: 1,
    verse: 0,
    bibleVerses: [],
  });

  let where = `translation:${readerState.translation}+and+book:${readerState.book}+and+chapter:${readerState.chapter}`;

  const bibleVerses = useQuery(
    ['bibleVerses'],
    async () => await axios.get(`/bibleVerses?where=` + where),
  );

  //   useEffect(() => {
  //     axios.get(`/bibleVerses?where=` + where).then(response => {
  //       setReaderState({ bibleVerses: response.data.response });
  //     });
  //   });

  return (
    <>
      <main className="col-span-9">
        <div className="mt-4">
          <h1 className="font-large font-bold mb-4">
            {bibleTranslations[0].name} ({bibleTranslations[0].abbreviation})
          </h1>
          <div>
            {bibleVerses?.data?.data?.response?.map(verse => (
              <div>
                <sup>{verse.verse}</sup> {verse.text}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
