import React from 'react';

export default function BibleVerse(props) {
  let verse: string = props?.children?.text.replace(
    /\*+([^\*]+)\*+/gi,
    '<i>$1</i>',
  );

  if (props.highlight) {
    props.highlight.split(/[\s,]/g).forEach(element => {
      if (element) {
        verse = verse.replace(
          new RegExp(
            '([ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏàáâãäåæçèéêëìíîïÐÑÒÓÔÕÖØÙÚÛÜÝÞßðñòóôõöøùúûüýþÿa-z]*' +
              element +
              '[ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏàáâãäåæçèéêëìíîïÐÑÒÓÔÕÖØÙÚÛÜÝÞßðñòóôõöøùúûüýþÿa-z]*)',
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
          __html: verse,
        }}
      ></span>
    </span>
  );
}
