import React from 'react';
import { useBibleTranslation } from 'services/Bibles';
import { useParams, useSearchParams } from 'react-router-dom';
import Header from 'app/components/Header';
import BibleQuery from 'app/components/bible/BibleQuery';

export default function Search() {
  const bibleTranslation = useBibleTranslation();
  const [searchParams] = useSearchParams();
  const { q } = useParams();

  return (
    <main className="col-span-10 max-w-2xl px-4 sm:px-0">
      <Header
        title={`${bibleTranslation?.name} (${bibleTranslation?.abbreviation})`}
        subtitle={`Zoekresultaten voor "${searchParams?.get('q')}"`}
      />
      <div className="pb-4 mb-4">
        <BibleQuery limit="100">{searchParams?.get('q')}</BibleQuery>
      </div>
    </main>
  );
}
