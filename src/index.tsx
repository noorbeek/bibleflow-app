/**
 * index.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';

// Use consistent styling
import './styles/global.css';

// Intercepptors
import './interceptors/axios';
import './interceptors/react-query';
import './interceptors/moment';

// Import root app
import { App } from 'app';
import { HelmetProvider } from 'react-helmet-async';
import reportWebVitals from 'reportWebVitals';

const MOUNT_NODE = document.getElementById('root') as HTMLElement;

ReactDOMClient.createRoot(MOUNT_NODE!).render(
  <HelmetProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </HelmetProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
