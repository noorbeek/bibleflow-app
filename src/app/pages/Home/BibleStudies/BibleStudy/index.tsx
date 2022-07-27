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
import { useNavigate, useParams } from 'react-router-dom';
import BibleVerse from 'app/components/bible/BibleVerse';
import BibleQuery from 'app/components/bible/BibleQuery';

export default function BibleStudy(props) {
  const { id } = useParams();

  const study = useQuery(
    ['study'],
    async () =>
      await Api.get(`/studies/${id}`, {
        order: 'createdAt desc',
        join: 'createdBy',
      }),
  );

  const studyComponents = useQuery(
    ['studyComponents'],
    async () =>
      await Api.get(`/studyComponents`, {
        where: `study:${id}`,
        order: 'sort',
        limit: 999,
      }),
  );

  const refs = studyComponents?.data?.reduce((acc, value) => {
    acc[value.id] = React.createRef();
    return acc;
  }, {});

  const scrollTo = id =>
    refs[id].current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

  return (
    <>
      <main className="lg:col-span-6 text-justify px-4 sm:px-0">
        <div className="pb-5 border-b border-gray-200 dark:border-white/10">
          <div className="sm:flex sm:justify-between sm:items-baseline">
            <div className="sm:w-0 sm:flex-1">
              <h1>{study?.data?.name}</h1>
              <p className="mt-1 text-sm mute truncate">
                Gemaakt door {study?.data?.createdBy?.name} op{' '}
                {study?.data?.createdAt}
              </p>
            </div>
          </div>
        </div>
        <div className="py-4 font-bold">{study?.data?.description}</div>
        <div className="bg-white dark:bg-transparent shadow overflow-hidden sm:rounded-md">
          <ul role="list">
            {studyComponents?.data?.map(component => (
              <li key={component.id} ref={refs[component.id]}>
                {component.type === 'header' ? (
                  <div
                    className="py-4"
                    dangerouslySetInnerHTML={{
                      __html:
                        '<h' +
                        (component.properties?.level > 0 &&
                        component.properties?.level < 7
                          ? component.properties?.level
                          : 1) +
                        '>' +
                        component.properties?.text +
                        '</h' +
                        (component.properties?.level > 0 &&
                        component.properties?.level < 7
                          ? component.properties?.level
                          : 1) +
                        '>',
                    }}
                  ></div>
                ) : null}
                {component.type === 'text' ? (
                  <div
                    className="py-4"
                    dangerouslySetInnerHTML={{
                      __html: component.properties?.text,
                    }}
                  ></div>
                ) : null}
                {component.type === 'bibleQuery' ? (
                  <BibleQuery>{component.properties?.query}</BibleQuery>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </main>
      <aside className="sticky lg:col-span-3 px-4 sm:px-0">
        <div className="sticky">
          <section className="pb-5 mb-5 border-b border-gray-200 dark:border-white/10">
            <div>
              <p
                className="text-xs font-semibold mute uppercase tracking-wider"
                id="bibletranslations-headline"
              >
                Over deze studie
              </p>
              <div className="my-6 text-sm">
                <label className="mute text-xs">Auteur</label>
                <br />
                {study?.data?.createdBy?.name}
              </div>
            </div>
          </section>
          <section className="pb-5 mb-5 border-b border-gray-200 dark:border-white/10">
            <div>
              <p
                className="text-xs font-semibold mute uppercase tracking-wider"
                id="bibletranslations-headline"
              >
                Index
              </p>
              <div className="my-6 text-sm">
                <ul role="list" className="-my-4">
                  {studyComponents?.data?.map(component => (
                    <li key={component.id} className="truncate">
                      {component.type === 'header' ? (
                        <a
                          onClick={() => scrollTo(component.id)}
                          className={
                            (component?.properties?.level === 1
                              ? 'font-bold py-2 '
                              : '') +
                            'inline-block pl-' +
                            (component.properties.level
                              ? (component.properties.level - 1) * 3
                              : 0)
                          }
                        >
                          {component.properties?.level > 1 ? (
                            <ChevronRightIcon className="w-4 h-4 inline-block" />
                          ) : null}
                          {component.properties?.text}
                        </a>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}
