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
        <div className="pb-5 border-b border-gray-200 dark:border-white/10 px-4 sm:px-0">
          <div className="sm:flex sm:justify-between sm:items-baseline">
            <div className="sm:w-0 sm:flex-1">
              <h1 id="message-heading">Tijdlijn</h1>
              <p className="mt-1 text-sm text-gray-500 truncate">
                {bibletimelinemarkers?.data?.length} tijdlijn segmenten gevonden
              </p>
            </div>
          </div>
        </div>

        <div className="my-4">
          <BibleTimelineLayer>{bibletimelinemarkers?.data}</BibleTimelineLayer>
        </div>
      </main>
    </>
  );
}
