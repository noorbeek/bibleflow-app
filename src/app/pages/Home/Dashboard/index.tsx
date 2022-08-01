import React, { Fragment } from 'react';
import {
  ChatAltIcon,
  CodeIcon,
  DotsVerticalIcon,
  EyeIcon,
  FlagIcon,
  PlusSmIcon,
  ShareIcon,
  StarIcon,
  ThumbUpIcon,
} from '@heroicons/react/solid';
import { Menu, Transition } from '@headlessui/react';
import Hyperlink from 'app/components/Hyperlink';

const tabs = [
  { name: 'Recent', href: '#', current: true },
  { name: 'Most Liked', href: '#', current: false },
  { name: 'Most Answers', href: '#', current: false },
];
const questions = [
  {
    id: '81614',
    likes: '29',
    replies: '11',
    views: '2.7k',
    author: {
      name: 'Dries Vincent',
      imageUrl:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      href: '#',
    },
    date: 'December 9 at 11:43 AM',
    datetime: '2020-12-09T11:43:00',
    href: '#',
    title: 'What would you have done differently if you ran Jurassic Park?',
    body: `
      <p>Jurassic Park was an incredible idea and a magnificent feat of engineering, but poor protocols and a disregard for human safety killed what could have otherwise been one of the best businesses of our generation.</p>
      <p>Ultimately, I think that if you wanted to run the park successfully and keep visitors safe, the most important thing to prioritize would be&hellip;</p>
    `,
  },
  // More questions...
];
const whoToFollow = [
  {
    name: 'Leonard Krasner',
    handle: 'leonardkrasner',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  // More people...
];
const trendingPosts = [
  {
    id: 1,
    user: {
      name: 'Floyd Miles',
      imageUrl:
        'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    body: 'What books do you have on your bookshelf just to look smarter than you actually are?',
    comments: 291,
  },
  // More posts...
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Dashboard(props) {
  return (
    <>
      <main className="lg:col-span-9 xl:col-span-6">
        <div className="px-4 sm:px-0">
          <div className="sm:hidden">
            <label htmlFor="question-tabs" className="sr-only">
              Select a tab
            </label>
            <select
              id="question-tabs"
              className="block w-full rounded-md border-gray-300 text-base font-medium shadow-sm focus:border-primary-500 focus:ring-primary-500"
              defaultValue={tabs.find(tab => tab?.current)?.name}
            >
              {tabs.map(tab => (
                <option key={tab.name}>{tab.name}</option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <nav
              className="relative z-0 rounded-lg shadow flex divide-x divide-gray-200"
              aria-label="Tabs"
            >
              {tabs.map((tab, tabIdx) => (
                <a
                  key={tab.name}
                  href={tab.href}
                  aria-current={tab.current ? 'page' : undefined}
                  className={classNames(
                    tab.current
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-700',
                    tabIdx === 0 ? 'rounded-l-lg' : '',
                    tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
                    'group relative min-w-0 flex-1 overflow-hidden bg-default py-4 px-6 text-sm font-medium text-center focus:z-10',
                  )}
                >
                  <span>{tab.name}</span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      tab.current ? 'bg-primary-500' : 'bg-transparent',
                      'absolute inset-x-0 bottom-0 h-0.5',
                    )}
                  />
                </a>
              ))}
            </nav>
          </div>
        </div>
        <div className="mt-4">
          <h1 className="sr-only">Recent questions</h1>
          <ul className="space-y-4">
            {questions.map(question => (
              <li
                key={question.id}
                className="bg-default px-4 py-6 shadow sm:p-6 sm:rounded-lg"
              >
                <article aria-labelledby={'question-title-' + question.id}>
                  <div>
                    <div className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={question.author.imageUrl}
                          alt=""
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">
                          <a
                            href={question.author.href}
                            className="hover:underline"
                          >
                            {question.author.name}
                          </a>
                        </p>
                        <p className="text-sm text-gray-500">
                          <a href={question.href} className="hover:underline">
                            <time dateTime={question.datetime}>
                              {question.date}
                            </time>
                          </a>
                        </p>
                      </div>
                      <div className="flex-shrink-0 self-center flex">
                        <Menu
                          as="div"
                          className="relative inline-block text-left"
                        >
                          <div>
                            <Menu.Button className="-m-2 p-2 rounded-full flex items-center">
                              <span className="sr-only">Open options</span>
                              <DotsVerticalIcon
                                className="h-5 w-5"
                                aria-hidden="true"
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
                            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-default ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <div className="py-1">
                                <Menu.Item>
                                  {({ active }) => (
                                    <Hyperlink
                                      href="#"
                                      className={classNames(
                                        active
                                          ? 'bg-gray-100 text-gray-900'
                                          : 'text-gray-700',
                                        'flex px-4 py-2 text-sm',
                                      )}
                                    >
                                      <StarIcon
                                        className="mr-3 h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                      />
                                      <span>Add to favorites</span>
                                    </Hyperlink>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <Hyperlink
                                      href="#"
                                      className={classNames(
                                        active
                                          ? 'bg-gray-100 text-gray-900'
                                          : 'text-gray-700',
                                        'flex px-4 py-2 text-sm',
                                      )}
                                    >
                                      <CodeIcon
                                        className="mr-3 h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                      />
                                      <span>Embed</span>
                                    </Hyperlink>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <Hyperlink
                                      href="#"
                                      className={classNames(
                                        active
                                          ? 'bg-gray-100 text-gray-900'
                                          : 'text-gray-700',
                                        'flex px-4 py-2 text-sm',
                                      )}
                                    >
                                      <FlagIcon
                                        className="mr-3 h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                      />
                                      <span>Report content</span>
                                    </Hyperlink>
                                  )}
                                </Menu.Item>
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    </div>
                    <h2
                      id={'question-title-' + question.id}
                      className="mt-4 text-base font-medium text-gray-900"
                    >
                      {question.title}
                    </h2>
                  </div>
                  <div
                    className="mt-2 text-sm text-gray-700 space-y-4"
                    dangerouslySetInnerHTML={{ __html: question.body }}
                  />
                  <div className="mt-6 flex justify-between space-x-8">
                    <div className="flex space-x-6">
                      <span className="inline-flex items-center text-sm">
                        <button
                          type="button"
                          className="inline-flex space-x-2 text-gray-400 hover:text-gray-500"
                        >
                          <ThumbUpIcon className="h-5 w-5" aria-hidden="true" />
                          <span className="font-medium text-gray-900">
                            {question.likes}
                          </span>
                          <span className="sr-only">likes</span>
                        </button>
                      </span>
                      <span className="inline-flex items-center text-sm">
                        <button
                          type="button"
                          className="inline-flex space-x-2 text-gray-400 hover:text-gray-500"
                        >
                          <ChatAltIcon className="h-5 w-5" aria-hidden="true" />
                          <span className="font-medium text-gray-900">
                            {question.replies}
                          </span>
                          <span className="sr-only">replies</span>
                        </button>
                      </span>
                      <span className="inline-flex items-center text-sm">
                        <button
                          type="button"
                          className="inline-flex space-x-2 text-gray-400 hover:text-gray-500"
                        >
                          <EyeIcon className="h-5 w-5" aria-hidden="true" />
                          <span className="font-medium text-gray-900">
                            {question.views}
                          </span>
                          <span className="sr-only">views</span>
                        </button>
                      </span>
                    </div>
                    <div className="flex text-sm">
                      <span className="inline-flex items-center text-sm">
                        <button
                          type="button"
                          className="inline-flex space-x-2 text-gray-400 hover:text-gray-500"
                        >
                          <ShareIcon className="h-5 w-5" aria-hidden="true" />
                          <span className="font-medium text-gray-900">
                            Share
                          </span>
                        </button>
                      </span>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <aside className="hidden xl:block xl:col-span-4">
        <div className="sticky top-4 space-y-4">
          <section aria-labelledby="who-to-follow-heading">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2
                  id="who-to-follow-heading"
                  className="text-base font-medium text-gray-900"
                >
                  Who to follow
                </h2>
                <div className="mt-6 flow-root">
                  <ul className="-my-4 divide-y divide-gray-200">
                    {whoToFollow.map(user => (
                      <li
                        key={user.handle}
                        className="flex items-center py-4 space-x-3"
                      >
                        <div className="flex-shrink-0">
                          <img
                            className="h-8 w-8 rounded-full"
                            src={user.imageUrl}
                            alt=""
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            <a href={user.href}>{user.name}</a>
                          </p>
                          <p className="text-sm text-gray-500">
                            <a href={user.href}>{'@' + user.handle}</a>
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-0.5 rounded-full bg-primary-50 text-sm font-medium text-primary-700 hover:bg-primary-100"
                          >
                            <PlusSmIcon
                              className="-ml-1 mr-0.5 h-5 w-5 text-primary-400"
                              aria-hidden="true"
                            />
                            <span>Follow</span>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6">
                  <Hyperlink
                    href="#"
                    className="w-full block text-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View all
                  </Hyperlink>
                </div>
              </div>
            </div>
          </section>
          <section aria-labelledby="trending-heading">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2
                  id="trending-heading"
                  className="text-base font-medium text-gray-900"
                >
                  Trending
                </h2>
                <div className="mt-6 flow-root">
                  <ul className="-my-4 divide-y divide-gray-200">
                    {trendingPosts.map(post => (
                      <li key={post.id} className="flex py-4 space-x-3">
                        <div className="flex-shrink-0">
                          <img
                            className="h-8 w-8 rounded-full"
                            src={post.user.imageUrl}
                            alt={post.user.name}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-800">{post.body}</p>
                          <div className="mt-2 flex">
                            <span className="inline-flex items-center text-sm">
                              <button
                                type="button"
                                className="inline-flex space-x-2 text-gray-400 hover:text-gray-500"
                              >
                                <ChatAltIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                                <span className="font-medium text-gray-900">
                                  {post.comments}
                                </span>
                              </button>
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6">
                  <Hyperlink
                    href="#"
                    className="w-full block text-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View all
                  </Hyperlink>
                </div>
              </div>
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}
