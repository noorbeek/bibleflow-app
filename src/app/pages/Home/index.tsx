import React, { useState } from 'react';
import { useAppStore } from 'store/global';
import { Fragment } from 'react';
import { Menu, Popover, Transition } from '@headlessui/react';
import { SearchIcon } from '@heroicons/react/solid';
import {
  CollectionIcon,
  MenuIcon,
  LightBulbIcon,
  XIcon,
  BookOpenIcon,
} from '@heroicons/react/outline';
import Avatar from 'app/components/Avatar';
import Dashboard from './Dashboard';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import BibleReader from './BibleReader';
import ButtonDarkMode from 'app/components/buttons/DarkMode';
import Search from './Search';
import BibleTimeline from './BibleTimeline';
import BibleStudies from './BibleStudies';
import ShareBanner from 'app/components/ShareBanner';
import BibleStudy from './BibleStudies/BibleStudy';
import { useBibleTranslations } from 'services/Bibles';
import Hyperlink from 'app/components/Hyperlink';
import { useQuery } from '@tanstack/react-query';
import Api from 'services/Api';
import Dialog from 'app/components/Dialog';

const navigation = [
  //{ name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Bijbel', href: '/', icon: BookOpenIcon },
  { name: 'Bijbelstudies', href: '/studies', icon: LightBulbIcon },
  //{ name: 'Tijdlijn', href: '/timeline', icon: CollectionIcon },
];
const userNavigation = [
  //{ name: 'Mijn profiel', href: '#' },
  //{ name: 'Instellingen', href: '#' },
  { name: 'Uitloggen', onClick: () => useAppStore.getState().logout() },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function Home() {
  const user = useAppStore().user;

  const userQuery = useQuery(['me'], async () => await Api.get(`/users/me`), {
    onSuccess: data => {
      useAppStore.setState({ user: data.response });
    },
  });

  const bibleTranslations = useBibleTranslations();
  const bibleTimelines = useAppStore().bibleTimelines;
  const location = useLocation();

  let [q, setQuery] = useState(localStorage['q'] ? localStorage['q'] : '');

  function searchSubmit(event) {
    event.preventDefault();
    localStorage['q'] = q;
    if (q) {
      window.location.href = '/search?q=' + encodeURIComponent(q);
    }
  }

  return (
    <div className="min-h-full">
      {/* When the mobile menu is open, add `overflow-hidden` to the `body` element to prevent double scrollbars */}
      <Popover
        as="header"
        className={({ open }) =>
          classNames(
            open ? 'fixed inset-0 z-40 overflow-y-auto' : '',
            'bg-default shadow-sm lg:static lg:overflow-y-visible',
          )
        }
      >
        {({ open }) => (
          <>
            <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative flex justify-between xl:grid xl:grid-cols-12 lg:gap-8">
                <div className="flex md:absolute md:left-0 md:inset-y-0 lg:static xl:col-span-2">
                  <a
                    href="/"
                    className="group flex items-center px-3 py-2 rounded-md"
                  >
                    <img
                      className="block h-8 w-auto lex-shrink-0 -ml-1 sm:-ml-0 mr-0 sm:mr-3"
                      src="/assets/logo.svg"
                      alt="Workflow"
                    />
                    <div className="leading-3 hidden lg:block">
                      <span className="text-default text-sm font-extrabold truncate">
                        BibleFlow
                      </span>
                      <br />
                      <span className="mute text-xs truncate">
                        Timeline studytool
                      </span>
                    </div>
                  </a>
                </div>
                <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-7">
                  <div className="flex items-center px-6 py-4 md:max-w-3xl md:mx-auto lg:max-w-none lg:mx-0 xl:px-0">
                    <form className="w-full" onSubmit={searchSubmit}>
                      <div className="w-full">
                        <label htmlFor="search" className="sr-only">
                          Zoeken
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <div className="relative flex items-stretch flex-grow focus-within:z-10">
                            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                              <SearchIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </div>
                            <input
                              id="search"
                              name="search"
                              className="block w-full bg-white dark:bg-white/10 border border-gray-300 dark:border-white/25 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 dark:focus:text-white focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              placeholder="Gen 1:1-1:5, Exo 3..."
                              type="search"
                              value={q ? q : ''}
                              onChange={event => setQuery(event.target.value)}
                            />
                          </div>
                        </div>

                        {/* <label htmlFor="search" className="sr-only">
                            Zoeken
                          </label>
                          <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                              <SearchIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </div>
                            <input
                              id="search"
                              name="search"
                              className="block w-full bg-white dark:bg-white/10 border border-gray-300 dark:border-white/25 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              placeholder="Gen 1:1-1:5, Exo 3..."
                              type="search"
                              // onKeyUp={event => {
                              //   window.location.href =
                              //     '/search?q=' + event.target.value;
                              // }}
                            />
                            <button
                              type="button"
                              className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <span>Sort</span>
                            </button>
                          </div> */}
                      </div>
                    </form>
                  </div>
                </div>
                <div className="flex items-center md:absolute md:right-0 md:inset-y-0 lg:hidden">
                  {/* Mobile menu button */}
                  <Popover.Button className="-mx-2 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:mute focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Popover.Button>
                </div>
                <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-3">
                  <ButtonDarkMode />

                  {/* Profile dropdown */}
                  <Menu as="div" className="flex-shrink-0 relative ml-5">
                    <div>
                      <Menu.Button className="bg-transparent hover:bg-transparent hover:shadow-none text-default rounded-full flex">
                        <Avatar
                          user={user}
                          className="bg-gray-300 dark:bg-primary cursor-pointer"
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg bg-default ring-1 ring-black ring-opacity-5 py-1 focus:outline-none">
                        {userNavigation.map(item => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <a
                                onClick={
                                  item.onClick ? item.onClick : () => true
                                }
                                className={classNames(
                                  active ? 'bg-gray-100 dark:bg-white/10' : '',
                                  'block py-2 px-4 text-sm text-default mute dark:hover:text-white/10',
                                )}
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>

            <Popover.Panel
              as="nav"
              className="lg:hidden w-full h-full bg-default"
              aria-label="Global"
            >
              <div className="max-w-3xl mx-auto px-2 pt-2 pb-3 space-y-1 sm:px-4">
                {navigation.map(item => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={
                      (
                        item.href === '/'
                          ? location.pathname === '/'
                          : location.pathname.match(
                              new RegExp('^' + item.href, 'g'),
                            )
                      )
                        ? 'page'
                        : undefined
                    }
                    className={classNames(
                      (
                        item.href === '/'
                          ? location.pathname === '/'
                          : location.pathname.match(
                              new RegExp('^' + item.href, 'g'),
                            )
                      )
                        ? 'bg-gray-100 dark:bg-white/10 text-default'
                        : 'hover:bg-gray-50 dark:hover:bg-white',
                      'block rounded-md py-2 px-3 text-base font-medium',
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="border-t border-gray-200 dark:border-white/10 pt-4">
                <div className="max-w-3xl mx-auto px-4 flex items-center sm:px-6 ">
                  <div className="flex-shrink-0 text-default">
                    {user ? user.name[0] + user.name[1] : '?'}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-default">
                      {user ? user.name : ''}
                    </div>
                    <div className="text-sm font-medium mute">
                      {user ? user.email : ''}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="ml-auto flex-shrink-0 bg-transparent rounded-full p-1 hover:mute focus:outline-none"
                  >
                    <ButtonDarkMode />
                  </button>
                </div>
                <div className="mt-3 max-w-3xl mx-auto px-2 space-y-1 sm:px-4 border-t border-gray-200 dark:border-white/10">
                  {userNavigation.map(item => (
                    <Hyperlink
                      key={item.name}
                      onClick={item.onClick}
                      className="block rounded-md py-2 px-3 text-base font-medium mute"
                    >
                      {item.name}
                    </Hyperlink>
                  ))}
                </div>
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>

      <div className="py-10">
        <div className="w-full max-w-screen-2xl mx-auto sm:px-6 lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="hidden lg:block lg:col-span-2">
            <nav
              aria-label="Sidebar"
              className="sticky top-4 divide-y divide-gray-300 dark:divide-gray-700"
            >
              <div className="pb-8 space-y-1">
                {navigation.map(item => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      (
                        item.href === '/'
                          ? location.pathname === '/'
                          : location.pathname.match(
                              new RegExp('^' + item.href, 'g'),
                            )
                      )
                        ? 'font-bold bg-black/5 dark:bg-white/10 dark:text-white'
                        : 'font-medium hover:bg-black/10 dark:hover:bg-white/20',
                      'mute group flex items-center px-3 py-2 text-sm rounded-md dark:hover:text-white',
                    )}
                  >
                    <item.icon
                      className={classNames(
                        (
                          item.href === '/'
                            ? location.pathname === '/'
                            : location.pathname.match(
                                new RegExp('^' + item.href, 'g'),
                              )
                        )
                          ? 'mute'
                          : '',
                        'mute lex-shrink-0 -ml-1 mr-3 h-6 w-6',
                      )}
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.name}</span>
                  </a>
                ))}
              </div>
              <div className="pb-4 pt-8 space-y-1">
                <p
                  className="px-3 text-xs font-semibold mute uppercase tracking-wider"
                  id="bibletranslations-headline"
                >
                  Bijbelvertalingen
                </p>
                <div
                  className="mt-3 space-y-2"
                  aria-labelledby="bibletranslations-headline"
                >
                  {bibleTranslations?.map(bibleTranslation => (
                    <Hyperlink
                      key={bibleTranslation?.name}
                      href="#"
                      className="group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                    >
                      <span className="truncate">
                        {bibleTranslation?.name} (
                        {bibleTranslation?.abbreviation})
                      </span>
                    </Hyperlink>
                  ))}
                </div>
              </div>
              {/* <div className="pb-4 pt-8 space-y-1">
                <p
                  className="px-3 text-xs font-semibold mute uppercase tracking-wider"
                  id="biblebooks-headline"
                >
                  Bijbeltijdlijnen
                </p>
                <div
                  className="mt-3 space-y-2"
                  aria-labelledby="biblebooks-headline"
                >
                  {bibleTimelines.map(bibleTimeline => (
                    <Hyperlink
                      key={bibleTimeline.name}
                      href="#"
                      className="group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                    >
                      <span className="truncate">{bibleTimeline.name}</span>
                    </Hyperlink>
                  ))}
                </div>
              </div> */}
            </nav>
          </div>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/search" element={<Search />} />
            <Route path="/timeline" element={<BibleTimeline />} />
            <Route path="/studies" element={<BibleStudies />} />
            <Route path="/studies/:id" element={<BibleStudy />} />
            <Route
              path="/bible/:translation/:book/:chapter"
              element={<BibleReader />}
            />
            <Route path="/" element={<BibleReader />} />
            <Route path="*" element={<BibleReader />} />
          </Routes>
        </div>
        <ShareBanner />
      </div>
      <Dialog />
    </div>
  );
}
