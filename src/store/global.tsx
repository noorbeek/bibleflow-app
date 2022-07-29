import axios from 'axios';
import create, { StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

interface AppStore {
  authenticated?: boolean;
  authenticationToken?: any;
  user?: any;
  darkMode?: boolean;
  bibleBooks?: any;
  bibleTranslations?: any;
  bibleTimelines?: any;
  bibleVerses?: any;
  logout: any;
  login: any;
  toggleDarkMode: any;
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

      // User prefrences
      darkMode: false,

      // General data

      bibleBooks: [],
      bibleTranslations: [],
      bibleTimelines: [],
      bibleVerses: [],

      // Mutators

      toggleDarkMode: () => set(state => ({ darkMode: !state.darkMode })),

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
        const bibleTranslations = await axios.get(
          '/bibleTranslations?limit=9999',
        );
        const bibleBooks = await axios.get('/bibleBooks?limit=9999');
        const bibleTimelines = await axios.get('/bibleTimelines?limit=9999');

        set({
          bibleTranslations: bibleTranslations.data?.response,
          bibleBooks: bibleBooks.data?.response,
          bibleTimelines: bibleTimelines.data?.response,
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
