import React from 'react';

export default function Link(props) {
  // Override props to merge component attributes
  let attributes = { ...props };
  attributes.className =
    'cursor-pointer text-black/75 hover:text-black dark:text-white/75 hover:dark:text-white ' +
    (props.className ? ' ' + props.className : '');
  attributes.children = null;

  // Return link
  return <span {...attributes}>{props.children ? props.children : ''}</span>;
}
