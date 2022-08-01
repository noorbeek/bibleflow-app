import React from 'react';

export default function Avatar(props) {
  return (
    <div
      className={
        'inline-block h-8 w-8 leading-8 font-bold rounded-full bg-slate-300 uppercase text-sm ' +
        (props?.className ? props.className : '') +
        (props?.user?.avatar ? 'bg-[url(' + props.user.avatar + ')]' : '')
      }
    >
      {props?.user?.name ? props.user.name[0] + props.user.name[1] : null}
      {props?.children ? props.children : ''}
    </div>
  );
}
