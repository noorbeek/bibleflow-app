import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronRightIcon,
  HeartIcon as HeartSolidIcon,
} from '@heroicons/react/solid';
import { HeartIcon } from '@heroicons/react/outline';
import Api from 'services/Api';
import Header from 'app/components/Header';
import Avatar from 'app/components/Avatar';
import Moment from 'moment';

export default function BibleStudies(props) {
  const studies = useQuery(
    ['studies'],
    async () =>
      await Api.get(`/studies`, {
        order: 'createdAt desc',
        join: 'createdBy',
      }),
  );

  return (
    <>
      <main className="col-span-10">
        <Header
          title="Bijbelstudies"
          subtitle={studies?.data?.response?.length + ' studies gevonden'}
        />

        <div className="bg-white dark:bg-transparent shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-black/10 dark:divide-white/10">
            {studies?.data?.response?.map(study => (
              <li key={study.id}>
                <a
                  href={`/studies/${study.id}`}
                  className="block hover:bg-primary/10 dark:hover:bg-white/10"
                >
                  <div className="flex items-center">
                    <div className="min-w-0 flex-1 flex items-center">
                      <div className="min-w-0 flex-1 px-4">
                        <div>
                          <div className="text-sm truncate py-2 leading-6">
                            <div className="font-bold">{study.name}</div>
                            <div className="mute">{study.description}</div>
                            <div className="pt-1 text-xs mute flex items-center space-x-2">
                              <div>
                                <HeartSolidIcon className="inline text-red-700 h-3 w-3" />
                                <HeartSolidIcon className="inline text-red-700 h-3 w-3" />
                                <HeartSolidIcon className="inline text-red-700 h-3 w-3" />
                                <HeartSolidIcon className="inline text-red-700 h-3 w-3" />
                                <HeartIcon className="inline h-3 w-3" />
                              </div>
                              <div>
                                {study.createdAt
                                  ? Moment(study.createdAt).format()
                                  : ''}
                              </div>
                              <Avatar
                                user={study.createdBy}
                                className="w-4 h-4 leading-4 text-xs"
                              />
                              <div>{study.createdBy.name}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <ChevronRightIcon className="h-5 w-5 mr-4 text-default dark:text-white" />
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
