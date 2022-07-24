/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import { useAppStore } from '../store/global';
import { queryClientOptions } from '../interceptors/react-query';
import { QueryClientProvider } from 'react-query';
import { Authenticate } from './pages/Authenticate';
import { Home } from './pages/Home';

export function App() {
  const authenticated = useAppStore().authenticated;

  return (
    <QueryClientProvider client={queryClientOptions}>
      <BrowserRouter>
        <Helmet titleTemplate="BibleFlow" defaultTitle="BibleFlow">
          <meta name="description" content="A React Boilerplate application" />
        </Helmet>
        <Switch>
          {authenticated ? (
            <Route exact path="*" component={Home} />
          ) : (
            <Route exact path="*" component={Authenticate} />
          )}
        </Switch>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
