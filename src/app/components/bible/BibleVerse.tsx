import React from 'react';
import { useShareStore } from 'store/share';

export default function BibleVerse(props) {
  const { find, toggle, share } = useShareStore();
  const verse: any = props?.children;

  let chars =
    'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏàáâãäåæçèéêëìíîïÐÑÒÓÔÕÖØÙÚÛÜÝÞßðñòóôõöøùúûüýþÿa-z';
  let text: string = props?.children?.text.replace(
    /\*+([^\*]+)\*+/gi,
    '<i>$1</i>',
  );

  if (props.highlight) {
    props.highlight.split(/[,]+/g).forEach(element => {
      if (
        element &&
        element.trim().match(new RegExp('^[' + chars + '- ]+$', 'gi'))
      ) {
        text = text.replace(
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
    <span
      className={
        'bible-verse text-justify cursor-pointer dark:hover:text-primary-50 hover:text-primary-600 ' +
        (find(verse)
          ? 'underline decoration-dotted dark:text-primary-100 text-primary-700'
          : '')
      }
      onClick={() => toggle(verse)}
    >
      <sup onClick={share} className="text-primary/75 font-bold">
        {verse.verse}
      </sup>{' '}
      <span
        dangerouslySetInnerHTML={{
          __html: text + ' ',
        }}
      ></span>
    </span>
  );
}
