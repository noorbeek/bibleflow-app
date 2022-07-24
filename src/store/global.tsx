import axios from 'axios';
import create, { StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

interface AppStore {
  authenticated?: boolean;
  authenticationToken?: any;
  user?: any;
  bibleBooks?: any;
  bibleTranslations?: any;
  logout: any;
  login: any;
}

type AppStorePersist = (
  config: StateCreator<AppStore>,
  options: PersistOptions<AppStore>,
) => StateCreator<AppStore>;

/**
 * Store
 */

export const useAppStore = create<AppStore>(
  (persist as unknown as AppStorePersist)(
    set => ({
      /**
       * Authentication/authorization
       */

      authenticated: false,
      user: null,
      authenticationToken: null,

      // Mutators

      login: async authorizationToken => {
        // Set auth
        set({
          authenticated: true,
          authenticationToken: authorizationToken,
        });

        axios.defaults.headers.common['Authorization'] = authorizationToken;

        // Set user
        const user = await axios.get('/users/me');

        set({
          user: user.data?.response,
        });

        // Set bibles
        const bibleTranslations = await axios.get('/bibleTranslations');
        const bibleBooks = await axios.get('/bibleBooks');

        set({
          bibleTranslations: bibleTranslations.data?.response,
          bibleBooks: bibleBooks.data?.response,
        });
      },

      logout: async () => {
        /** Reset state */

        axios.defaults.headers.common['Authorization'] = '';

        set({
          authenticated: false,
          user: null,
          authenticationToken: null,
        });

        /** Logout */
      },
    }),
    {
      name: 'appStore',
    },
  ),
);
