import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { useAppStore } from 'store/global';
import { useQuery } from '@tanstack/react-query';
import Selectbox from 'app/components/Selectbox';

export default function BibleReader(props) {
  const bibleTranslations = useAppStore.getState().bibleTranslations;
  const [readerState, setReaderState] = useState<any>({
    translation: bibleTranslations[0].id,
    books: 66,
    book: 1,
    chapters: 1,
    chapter: 1,
    verses: 1,
    verse: 0,
  });

  let where = `translation:${readerState.translation}+and+book:${readerState.book}+and+chapter:${readerState.chapter}`;

  const bibleVerses = useQuery(
    ['bibleVerses'],
    async () => await axios.get(`/bibleVerses?where=` + where),
  );

  function setTranslation(translation) {
    console.warn(translation);
    setReaderState({ translation: translation.id });
  }

  //   useEffect(() => {
  //     axios.get(`/bibleVerses?where=` + where).then(response => {
  //       setReaderState({ bibleVerses: response.data.response });
  //     });
  //   });

  return (
    <>
      <main className="col-span-9">
        <div className="mt-4">
          <Selectbox
            label="Vertaling"
            onChange={setTranslation}
            options={bibleTranslations.map(translation => {
              return {
                id: translation.id,
                text: translation.name,
                description: translation.abbreviation,
              };
            })}
          />
          <h1 className="font-large font-bold mb-4">
            {bibleTranslations[0].name} ({bibleTranslations[0].abbreviation})
          </h1>
          <div>
            {bibleVerses?.data?.data?.response?.map(verse => (
              <div key={verse.id}>
                <sup>{verse.verse}</sup> {verse.text}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
