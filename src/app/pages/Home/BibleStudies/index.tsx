import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronRightIcon } from '@heroicons/react/solid';
import Api from 'services/Api';

export default function BibleStudies(props) {
  const studies = useQuery(
    ['studies'],
    async () =>
      await Api.get(`/studies`, {
        order: 'createdAt desc',
      }),
  );

  return (
    <>
      <main className="col-span-9">
        <div className="pb-5 border-b border-gray-200 dark:border-white/10 px-4 sm:px-0">
          <div className="sm:flex sm:justify-between sm:items-baseline">
            <div className="sm:w-0 sm:flex-1">
              <h1 id="message-heading">Bijbelstudies</h1>
              <p className="mt-1 text-sm text-gray-500 truncate">
                {studies?.data?.length} studies gevonden
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-transparent shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {studies?.data?.map(study => (
              <li key={study.id}>
                <a
                  href={`/studies/${study.id}`}
                  className="block hover:bg-gray-50 dark:hover:bg-white/10"
                >
                  <div className="flex items-center px-4 py-4 sm:px-6">
                    <div className="min-w-0 flex-1 flex items-center">
                      <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                        <div>
                          <p className="text-sm font-bold truncate">
                            {study.name}
                          </p>
                          <p className="mt-2 flex items-center text-sm mute truncate">
                            {study.description}
                          </p>
                        </div>
                        <div className="hidden md:block">
                          <div>
                            <p className="text-sm mute">
                              Aangemaakt op{' '}
                              <time dateTime={study.createdAt}>
                                {study.createdAt}
                              </time>
                            </p>
                            <p className="mt-2 flex items-center text-sm mute">
                              {study.createdBy}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <ChevronRightIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
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
