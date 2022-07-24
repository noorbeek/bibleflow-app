import axios from 'axios';
import create, { StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

interface AppStore {
  authenticated?: boolean;
  user?: any;
  token?: any;
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
      token: null,

      // Mutators

      login: async authorizationToken => {
        set({
          authenticated: true,
          token: authorizationToken,
        });

        axios.defaults.headers.common['Authorization'] = authorizationToken;

        const user = await axios.get('/users/me');

        set({
          user: user.data?.response,
        });
      },

      logout: async () => {
        /** Reset state */

        axios.defaults.headers.common['Authorization'] = '';

        set({ authenticated: false, user: null, token: null });

        /** Logout */
      },
    }),
    {
      name: 'appStore',
    },
  ),
);
