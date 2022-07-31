import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Api from 'services/Api';
import BibleTimelineLayer from 'app/components/bible/BibleTimelineLayer';
import Header from 'app/components/Header';

export default function BibleTimeline(props) {
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
