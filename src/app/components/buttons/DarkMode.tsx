import { useAppStore } from 'store/global';
import { SunIcon as SunIconSolid } from '@heroicons/react/solid';
import { SunIcon } from '@heroicons/react/outline';
import React from 'react';
import Hyperlink from '../Hyperlink';

export default function ButtonDarkMode() {
  const darkMode = useAppStore().darkMode;
  const toggleDarkMode = useAppStore().toggleDarkMode;

  return (
    <Hyperlink
      onClick={toggleDarkMode}
      className="ml-5 flex-shrink-0 rounded-full p-1 mute"
    >
      {darkMode ? (
        <SunIcon className="h-6 w-6" aria-hidden="true" />
      ) : (
        <SunIconSolid className="h-6 w-6" aria-hidden="true" />
      )}
    </Hyperlink>
  );
}
