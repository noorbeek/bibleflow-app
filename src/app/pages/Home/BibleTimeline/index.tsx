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
import Api from 'services/Api';
import BibleTimelineLayer from 'app/components/bible/BibleTimelineLayer';
import Header from 'app/components/Header';

export default function BibleTimeline(props) {
  const bibleTranslations = useAppStore.getState().bibleTranslations;
  const bibleBooks = useAppStore.getState().bibleBooks;

  const bibletimelinemarkers = useQuery(
    ['bibletimelinemarkers'],
    async () =>
      await Api.get(`/bibletimelinemarkers`, {
        limit: 9999,
        where: `parent:0`,
        join: 'children,parents',
        order: 'sort,id',
      }),
  );

  return (
    <>
      <main className="col-span-9">
        <Header
          title="Tijdlijn"
          subtitle={
            bibletimelinemarkers?.data?.response?.length +
            ' tijdlijn segmenten gevonden'
          }
        />

        <div className="my-4">
          <BibleTimelineLayer>
            {bibletimelinemarkers?.data?.response}
          </BibleTimelineLayer>
        </div>
      </main>
    </>
  );
}
