import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MenuIcon } from '@heroicons/react/outline';

export function SortableItem(props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  let disabled = props?.disabled ? props.disabled : false;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={'flex flex-row items-top justify-between ' + props?.className}
    >
      <div className="truncate">{props?.children}</div>
      {!disabled ? (
        <div className="shrink">
          <MenuIcon
            className="cursor-move w-3 h-3 m-1 mr-2"
            {...attributes}
            {...listeners}
          />
        </div>
      ) : null}
    </div>
  );
}
