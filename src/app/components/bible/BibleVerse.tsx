import React from 'react';

export default function BibleVerse(props) {
  let chars =
    'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏàáâãäåæçèéêëìíîïÐÑÒÓÔÕÖØÙÚÛÜÝÞßðñòóôõöøùúûüýþÿa-z';
  let verse: string = props?.children?.text.replace(
    /\*+([^\*]+)\*+/gi,
    '<i>$1</i>',
  );

  if (props.highlight) {
    props.highlight.split(/[,]+/g).forEach(element => {
      if (element && element.match(/^[a-z-\s]+$/gi)) {
        verse = verse.replace(
          new RegExp(
            '([' +
              chars +
              ']*(' +
              element.trim().replace(/\s+/g, '|') +
              ')[' +
              chars +
              ']*)',
            'gi',
          ),
          '<span class="highlight">$1</span>',
        );
      }
    });
  }
  return (
    <span className="bible-verse text-justify">
      <sup className="text-primary/75 font-bold">{props?.children?.verse}</sup>{' '}
      <span
        dangerouslySetInnerHTML={{
          __html: verse + ' ',
        }}
      ></span>
    </span>
  );
}
