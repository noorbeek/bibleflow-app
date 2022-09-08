import React from 'react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAppStore } from 'store/global';
import { useMutation } from '@tanstack/react-query';
import Api from 'services/Api';
import { ApiResponseModel } from 'models/Api';
import Hyperlink from 'app/components/Hyperlink';
import { XCircleIcon } from '@heroicons/react/outline';

export function Authenticate() {
  const [errors, setErrors]: Array<any> = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const authenticate = useMutation(
    ['authenticate'],
    async () =>
      await Api.post(`/auth`, {
        username: formData.username,
        password: formData.password,
      }),
    {
      onSuccess: (data: ApiResponseModel) => {
        if (data?.response?.authorization) {
          useAppStore.getState().login(data?.response?.authorization);
        }
        if (data?.response?.errors?.length) {
          setErrors(data?.errors);
        }
      },
      onError: (data: ApiResponseModel) => {
        if (data?.response?.data?.errors?.length) {
          setErrors(data?.response?.data?.errors);
        }
      },
    },
  );

  return (
    <>
      <Helmet>
        <title>Authenticate</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-80 space-y-8">
          <div>
            <img
              className="mx-auto h-40 w-auto"
              src="/assets/logo.svg"
              alt="Workflow"
            />
          </div>
          <div className="text-center">
            <h1 className="text-4xl">BibleFlow</h1>
            <p className="mute">Timeline studytool</p>
          </div>
          <form
            className="mt-8 space-y-6"
            onSubmit={e => {
              e.preventDefault();
              authenticate.mutate();
            }}
          >
            <input type="hidden" name="remember" defaultValue="true" />
            {errors.length ? (
              <div className="rounded-md bg-red-50 dark:bg-red-900 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <XCircleIcon
                      className="h-5 w-5 text-red-400 dark:text-red-200"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                      U kunt niet worden ingelogd
                    </h3>
                    <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                      <ul role="list" className="list-disc space-y-1 pl-5">
                        {errors.map(error => (
                          <li>{error.description}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">
                  Email address
                </label>
                <input
                  id="username"
                  name="username"
                  type="email"
                  autoComplete="email"
                  value={formData.username}
                  onChange={e =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-white/25 rounded-t-md focus:outline-none focus:ring-primary-400 focus:border-primary-400 focus:z-10 sm:text-sm"
                  placeholder="Email"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Wachtwoord
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={e =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-white/25 rounded-b-md focus:outline-none focus:ring-primary-400 focus:border-primary-400 focus:z-10 sm:text-sm"
                  placeholder="Wachtwoord"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-500 focus:ring-primary-400 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Onthoudt mij
                </label>
              </div>

              <div className="text-sm">
                <Hyperlink
                  href="#"
                  className="font-medium text-primary-500 hover:text-primary-400"
                >
                  Wachtwoord vergeten?
                </Hyperlink>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {/* <LockClosedIcon className="h-5 w-5 text-primary-400 group-hover:text-primary-400" aria-hidden="true" /> */}
                </span>
                Inloggen
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
