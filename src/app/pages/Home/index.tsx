import React from 'react';
import { useAppStore } from 'store/global';
import { Fragment } from 'react';
import { Menu, Popover, Transition } from '@headlessui/react';
import { SunIcon as SunIconSolid, SearchIcon } from '@heroicons/react/solid';
import {
  BellIcon,
  SunIcon,
  FireIcon,
  HomeIcon,
  MenuIcon,
  TrendingUpIcon,
  UserGroupIcon,
  XIcon,
} from '@heroicons/react/outline';
import Avatar from 'app/components/Avatar';
import Dashboard from './Dashboard';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import BibleReader from './BibleReader';

const navigation = [
  { name: 'Home', href: '#', icon: HomeIcon, current: true },
  { name: 'Popular', href: '#', icon: FireIcon, current: false },
  { name: 'Communities', href: '#', icon: UserGroupIcon, current: false },
  { name: 'Trending', href: '#', icon: TrendingUpIcon, current: false },
];
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', onClick: () => useAppStore.getState().logout() },
];
const communities = [
  { name: 'Movies', href: '#' },
  { name: 'Food', href: '#' },
  { name: 'Sports', href: '#' },
  { name: 'Animals', href: '#' },
  { name: 'Science', href: '#' },
  { name: 'Dinosaurs', href: '#' },
  { name: 'Talents', href: '#' },
  { name: 'Gaming', href: '#' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function Home() {
  const user = useAppStore().user;
  const bibleBooks = useAppStore().bibleBooks;
  const bibleTranslations = useAppStore().bibleTranslations;
  const bibleTimelines = useAppStore().bibleTimelines;
  const darkMode = useAppStore().darkMode;
  const toggleDarkMode = useAppStore().toggleDarkMode;
  return (
    <BrowserRouter>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
      <div className="min-h-full">
        {/* When the mobile menu is open, add `overflow-hidden` to the `body` element to prevent double scrollbars */}
        <Popover
          as="header"
          className={({ open }) =>
            classNames(
              open ? 'fixed inset-0 z-40 overflow-y-auto' : '',
              'bg-white dark:bg-black/25 shadow-sm lg:static lg:overflow-y-visible',
            )
          }
        >
          {({ open }) => (
            <>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex justify-between xl:grid xl:grid-cols-12 lg:gap-8">
                  <div className="flex md:absolute md:left-0 md:inset-y-0 lg:static xl:col-span-2">
                    <div className="flex-shrink-0 flex items-center">
                      <a href="#">
                        <img
                          className="block h-8 w-auto"
                          src="/assets/logo.svg"
                          alt="Workflow"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6">
                    <div className="flex items-center px-6 py-4 md:max-w-3xl md:mx-auto lg:max-w-none lg:mx-0 xl:px-0">
                      <div className="w-full">
                        <label htmlFor="search" className="sr-only">
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
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center md:absolute md:right-0 md:inset-y-0 lg:hidden">
                    {/* Mobile menu button */}
                    <Popover.Button className="-mx-2 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:mute focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                      {open ? (
                        <XIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <MenuIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Popover.Button>
                  </div>
                  <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
                    <a
                      onClick={toggleDarkMode}
                      className="ml-5 flex-shrink-0 rounded-full p-1 mute"
                    >
                      {darkMode ? (
                        <SunIcon className="h-6 w-6" aria-hidden="true" />
                      ) : (
                        <SunIconSolid className="h-6 w-6" aria-hidden="true" />
                      )}
                    </a>

                    {/* Profile dropdown */}
                    <Menu as="div" className="flex-shrink-0 relative ml-5">
                      <div>
                        <Menu.Button className="bg-transparent hover:bg-transparent rounded-full flex">
                          <Avatar
                            text={
                              user && user.name?.length > 2
                                ? user.name[0] + user.name[1]
                                : ''
                            }
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
                                  href={item.href}
                                  onClick={
                                    item.onClick ? item.onClick : () => true
                                  }
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block py-2 px-4 text-sm text-gray-700',
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

                    <a
                      href="#"
                      className="ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      New Post
                    </a>
                  </div>
                </div>
              </div>

              <Popover.Panel as="nav" className="lg:hidden" aria-label="Global">
                <div className="max-w-3xl mx-auto px-2 pt-2 pb-3 space-y-1 sm:px-4">
                  {navigation.map(item => (
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={item.current ? 'page' : undefined}
                      className={classNames(
                        item.current
                          ? 'bg-gray-100 text-gray-900'
                          : 'hover:bg-gray-50',
                        'block rounded-md py-2 px-3 text-base font-medium',
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="max-w-3xl mx-auto px-4 flex items-center sm:px-6">
                    <div className="flex-shrink-0">
                      {user ? user.name[0] + user.name[1] : '?'}
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {user ? user.name : ''}
                      </div>
                      <div className="text-sm font-medium mute">
                        {user ? user.email : ''}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="ml-auto flex-shrink-0 bg-white rounded-full p-1 text-gray-400 hover:mute focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-3 max-w-3xl mx-auto px-2 space-y-1 sm:px-4">
                    {userNavigation.map(item => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="block rounded-md py-2 px-3 text-base font-medium mute"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="mt-6 max-w-3xl mx-auto px-4 sm:px-6">
                  <a
                    href="#"
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                  >
                    New Post
                  </a>

                  <div className="mt-6 flex justify-center">
                    <a
                      href="#"
                      className="text-base font-medium text-gray-900 hover:underline"
                    >
                      Go Premium
                    </a>
                  </div>
                </div>
              </Popover.Panel>
            </>
          )}
        </Popover>

        <div className="py-10">
          <div className="max-w-3xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
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
                        item.current
                          ? 'bg-black/5 dark:bg-white/10'
                          : 'hover:bg-black/10 dark:hover:bg-white/20',
                        'mute group flex items-center px-3 py-2 text-sm font-medium rounded-md',
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      <item.icon
                        className={classNames(
                          item.current ? 'mute' : '',
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
                    {bibleTranslations.map(bibleTranslation => (
                      <a
                        key={bibleTranslation.name}
                        href="#"
                        className="group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                      >
                        <span className="truncate">
                          {bibleTranslation.name} (
                          {bibleTranslation.abbreviation})
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
                <div className="pb-4 pt-8 space-y-1">
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
                      <a
                        key={bibleTimeline.name}
                        href="#"
                        className="group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                      >
                        <span className="truncate">{bibleTimeline.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </nav>
            </div>
            <Switch>
              <Route exact path="/dashboard" component={Dashboard} />
              <Route exact path="*" component={BibleReader} />
            </Switch>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
