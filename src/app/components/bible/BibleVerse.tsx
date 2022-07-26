import React from 'react';

export default function BibleVerse(props) {
  let verse: string = props?.children?.text.replace(
    /\*+([^\*]+)\*+/gi,
    '<i>$1</i>',
  );

  if (props.highlight) {
    console.warn(
      verse,
      props.highlight,
      verse.match(new RegExp('(' + props.highlight + ')', 'gi')),
    );
    verse = verse.replace(
      new RegExp(
        '([\u0000-\u0019\u0021-\uFFFF]*' +
          props.highlight +
          '[\u0000-\u0019\u0021-\uFFFF]*)',
        'gui',
      ),
      '<span class="highlight">$1</span>',
    );
  }
  return (
    <span className="bible-verse text-justify">
      <sup className="text-primary/75 font-bold">{props?.children?.verse}</sup>{' '}
      <span
        dangerouslySetInnerHTML={{
          __html: verse,
        }}
      ></span>
    </span>
  );
}
