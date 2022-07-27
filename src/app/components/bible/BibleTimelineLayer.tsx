import React from 'react';
import { SelectorIcon } from '@heroicons/react/outline';

export default function BibleTimelineLayer(props) {
  return (
    <div className={'flow-root'}>
      <ul role="list" className="-mb-8">
        {props?.children?.map((item, idx) => (
          <li key={item.id}>
            <div className="relative pb-8 pt-4">
              {idx !== item.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-white/10"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-4">
                <div className="h-8 w-8">
                  <span className="m-1 h-6 w-6 rounded-full flex items-center justify-center ring-2 ring-white">
                    {/* <event.icon className="h-5 w-5 text-white" aria-hidden="true" /> */}
                    <SelectorIcon className="h-3 w-3" />
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1 pb-2">
                  <div
                    className={
                      item.parent ? 'font-medium text-sm' : 'font-bold text-lg'
                    }
                  >
                    {item.name}
                  </div>
                  {item.children ? (
                    <BibleTimelineLayer>{item.children}</BibleTimelineLayer>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
