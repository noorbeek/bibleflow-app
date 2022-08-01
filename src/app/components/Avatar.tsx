import React from 'react';

export default function Avatar(props) {
  return (
    <div
      className={
        'inline-block relative overflow-hidden h-8 w-8 leading-8 font-bold rounded-full bg-slate-300 uppercase text-sm ' +
        (props?.className ? props.className : '') +
        (props?.user?.avatar ? 'bg-[url(' + props.user.avatar + ')]' : '')
      }
    >
      {!props?.user?.avatar && props?.user?.name
        ? props.user.name[0] + props.user.name[1]
        : null}
      {!props?.user?.avatar && props?.children ? props.children : ''}
      {props?.user?.avatar ? (
        <img
          className="absolute inset-0 rounded-full"
          alt="User avatar"
          src={props.user.avatar}
        />
      ) : null}
    </div>
  );
}
