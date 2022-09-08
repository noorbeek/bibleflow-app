import { useState } from 'react';
import Api from './Api';
import { BibleBookModel, BibleTranslationModel } from 'models/Api';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from 'store/global';

const STALE_TIME = 5 * 60 * 1000;

export const useBibleBooks = (): Array<BibleBookModel> | null => {
  useQuery(
    [`bibleBooks`],
    async () => await Api.get(`/bibleBooks`, { limit: 999 }),
    {
      staleTime: STALE_TIME,
      onSuccess: data => {
        useAppStore.setState({ bibleBooks: data?.response });
      },
    },
  );
  return useAppStore.getState().bibleBooks;
};

export const useBibleBook = (id: number = 1): BibleBookModel | null => {
  const [data, setData] = useState(null);
  useQuery(
    [`bibleBooks${id}`, id],
    async () => await Api.get(`/bibleBooks/${id}`, { limit: 999 }),
    {
      staleTime: STALE_TIME,
      onSuccess: data => {
        setData(data?.response);
      },
    },
  );
  return data;
};

export const useBibleTranslations = (): Array<BibleTranslationModel> | null => {
  useQuery(
    [`bibleTranslations`],
    async () => await Api.get(`/bibleTranslations`, { limit: 999 }),
    {
      staleTime: STALE_TIME,
      onSuccess: data => {
        useAppStore.setState({ bibleTranslations: data?.response });
      },
    },
  );
  return useAppStore.getState().bibleTranslations;
};

export const useBibleTranslation = (
  id: number = 1,
): BibleTranslationModel | null => {
  const [data, setData] = useState(null);
  useQuery(
    [`bibleTranslations${id}`, id],
    async () => await Api.get(`/bibleTranslations/${id}`, { limit: 999 }),
    {
      staleTime: STALE_TIME,
      onSuccess: data => {
        setData(data?.response);
      },
    },
  );
  return data;
};
