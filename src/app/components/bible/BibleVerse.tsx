import React from 'react';
import { useShareStore } from 'store/share';

export default function BibleVerse(props) {
  const { find, toggle, share } = useShareStore();
  const verse: any = props?.children;

  // Special character regular expressions
  let chars =
    'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏàáâãäåæçèéêëìíîïÐÑÒÓÔÕÖØÙÚÛÜÝÞßðñòóôõöøùúûüýþÿa-z';

  // Replace all italic words
  let text: string = props?.children?.text.replace(
    /\*+([^\*]+)\*+/gi,
    '<i>$1</i>',
  );

  // Create highlighted words from user query
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
        'bible-verse inline-block indent-4 leading-7 sm:indent-0 cursor-pointer ' +
        (find(verse)
          ? 'underline decoration-dotted dark:text-primary-100 text-primary-700 '
          : '') +
        (props?.className ? props.className : '')
      }
      onClick={() => toggle(verse)}
    >
      <sup onClick={share} className="text-primary dark:text-primary-200">
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
