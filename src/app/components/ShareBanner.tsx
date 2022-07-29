/* This example requires Tailwind CSS v2.0+ */
import { ShareIcon, XIcon } from '@heroicons/react/outline';
import React from 'react';
import { useShareStore } from 'store/share';

export default function ShareBanner() {
  const { share, reset, bibleVerses } = useShareStore();
  return (
    <div
      className={
        'bottom-0 inset-x-0 pb-2 sm:pb-5 ' +
        (bibleVerses.length ? 'fixed' : 'hidden')
      }
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="p-2 rounded-lg bg-primary shadow-lg sm:p-3">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <span className="flex p-2 rounded-lg">
                <ShareIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </span>
              <p className="ml-3 font-medium text-white truncate">
                <span className="md:hidden">Selectie</span>
                <span className="hidden md:inline">
                  {bibleVerses.length} Bijbelverzen geselecteerd
                </span>
              </p>
            </div>
            <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
              <a
                onClick={share}
                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-white"
              >
                Deel
              </a>
            </div>
            <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-2">
              <button
                type="button"
                onClick={reset}
                className="-mr-1 flex p-2 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <span className="sr-only">Reset</span>
                <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
