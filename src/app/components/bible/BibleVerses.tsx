import React from 'react';
import BibleVerse from './BibleVerse';

export default function BibleVerses(props) {
  return (
    <div>
      {props?.children?.map(verse => (
        <span key={verse.id}>
          <BibleVerse className="inline-block">{verse}</BibleVerse>
        </span>
      ))}
    </div>
  );
}
