import React from 'react';

export default function Hyperlink(props) {
  // Override props to merge component attributes
  let attributes = { ...props };
  attributes.className =
    'hyperlink ' + (props.className ? ' ' + props.className : '');
  attributes.children = null;

  // Return link
  return <span {...attributes}>{props.children ? props.children : ''}</span>;
}
