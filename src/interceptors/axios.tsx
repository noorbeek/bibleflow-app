import axios from 'axios';
import React from 'react';
import { toast } from 'react-toastify';
import { useAppStore } from '../store/global';

/**
 * REST default options
 */

axios.defaults.baseURL = process.env.API_BASEURL;

console.warn(process.env);
/** Set authorization token from session store */

if (useAppStore.getState().authenticationToken) {
  axios.defaults.headers.common['Authorization'] =
    useAppStore.getState().authenticationToken;
}

/** Error interceptor */

axios.interceptors.response.use(
  rsp => rsp,
  error => {
    /** Logout if 401 */

    if (error?.response?.status === 401) {
      useAppStore.getState().logout();
    }

    /** Set title and description */

    let title = 'Onbekende fout | ' + error?.response?.status;
    let description = error?.response?.responseText ?? '';
    switch (error?.response?.status) {
      case 400:
        title = 'Foute aanvraag';
        break;
      case 401:
        title = 'Niet geautoriseerd';
        break;
      case 403:
        title = 'Verboden toegang';
        break;
      case 404:
        title = 'Niet gevonden';
        break;
    }

    /** Throw toast */

    let message = (
      <div>
        <span className="uppercase text-sm font-bold">{title}</span>
        {description ? <div>{description}</div> : ''}
      </div>
    );
    switch (error?.response?.status) {
      case 400:
        toast.warning(message);
        break;
      default:
        toast.error(message, {
          icon: (
            <b>
              <small>{error?.response?.status}</small>
            </b>
          ),
        });
        break;
    }

    /** Return error promise */

    return Promise.reject(error);
  },
);
