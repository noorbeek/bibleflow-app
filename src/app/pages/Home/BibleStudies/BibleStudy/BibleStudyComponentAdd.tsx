import { PlusIcon } from '@heroicons/react/outline';
import Selectbox from 'app/components/Selectbox';
import React from 'react';

export default function BibleStudyComponentAdd(props) {
  return (
    <div className="mt-8 relative cursor-pointer hover:bg-primary/10 p-2 flex flex-row justify-around items-center">
      <div className="absolute left-0 right-0 border-t border-black/10 dark:border-white/10"></div>
      <Selectbox
        selected={0}
        onChange={option => props.onChange(option.id, props?.index)}
        options={[
          {
            id: 0,
            text: (
              <span className="text-xs">
                <PlusIcon className="inline h-2 w-2 mr-2" />
                Component toevoegen
              </span>
            ),
            description: '',
          },
          {
            id: 'text',
            text: 'Tekst',
            description: '',
          },
          {
            id: 'bibleQuery',
            text: 'Bijbelquery',
            description: '',
          },
          {
            id: 'header',
            text: 'Koptekst',
            description: '',
          },
        ]}
      />
    </div>
  );
}
