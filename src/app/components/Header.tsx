import React from 'react';

export default function Header(props) {
  return (
    <div className="pb-4 mb-4 px-4 sm:px-0 border-b border-gray-200 dark:border-white/10">
      <div className="sm:flex sm:justify-between sm:items-baseline">
        <div className="sm:w-0 sm:flex-1">
          {(() => {
            switch (parseInt(props?.level ? props?.level : 1)) {
              case 2:
                return <h2 className="p-0 m-0 leading-4">{props?.title}</h2>;
              case 3:
                return <h3 className="p-0 m-0 leading-4">{props?.title}</h3>;
              case 4:
                return <h4 className="p-0 m-0 leading-4">{props?.title}</h4>;
              case 5:
                return <h5 className="p-0 m-0 leading-4">{props?.title}</h5>;
              case 6:
                return <h6 className="p-0 m-0 leading-4">{props?.title}</h6>;
              default:
                return <h1 className="p-0 m-0 leading-4">{props?.title}</h1>;
            }
          })()}
          {props?.subtitle ? (
            <p className="mt-1 text-sm mute truncate">{props?.subtitle}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
