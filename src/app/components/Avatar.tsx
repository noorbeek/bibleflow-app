import React from 'react';

export default function Avatar(props) {
  return (
    <div className="h-8 w-8 leading-8 rounded-full bg-slate-300 uppercase font-bold text-sm">
      {props.text ? props.text : ''}
    </div>
  );
}
