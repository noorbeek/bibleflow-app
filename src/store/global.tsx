import axios from 'axios';
import create, { StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

type AppStorePersist = (
  config: StateCreator<any>,
  options: PersistOptions<any>,
) => StateCreator<any>;

/**
 * Store
 */

export const useAppStore = create<any>(
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

      // Current

      currentTranslation: 1,
      currentBook: 1,
      currentChapter: 1,
      currentVerse: 1,

      // Mutators

      mutate: () => set((state, newState) => ({ ...state, ...newState })),

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
        // const bibleTranslations = await axios.get(
        //   '/bibleTranslations?limit=9999',
        // );
        // const bibleBooks = await axios.get('/bibleBooks?limit=9999');
        // const bibleTimelines = await axios.get('/bibleTimelines?limit=9999');

        // set({
        //   bibleTranslations: bibleTranslations.data?.response,
        //   bibleBooks: bibleBooks.data?.response,
        //   bibleTimelines: bibleTimelines.data?.response,
        // });
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
