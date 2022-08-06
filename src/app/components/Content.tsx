import React from 'react';

export default function Content(props) {
  // Override props to merge component attributes
  let attributes = { ...props };
  attributes.className =
    'p-4 sm:p-8 dark:sm:p-0 bg-white shadow-xl rounded dark:bg-transparent dark:shadow-none dark:rounded-none ' +
    (props.className ? ' ' + props.className : '');
  attributes.children = null;

  // Return link
  return <div {...attributes}>{props.children ? props.children : ''}</div>;
}
