import { useAppStore } from 'store/global';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Api from './Api';
import { BibleBookModel, BibleTranslationModel } from 'models/Api';

const bibleBooks = useAppStore.getState().bibleBooks;
const bibleTranslations = useAppStore.getState().bibleTranslations;

export function getBibleBook(id) {
  return bibleBooks.filter(book => book.id === parseInt(id))[0];
}

export function getBibleTranslation(id) {
  return bibleTranslations.filter(
    translation => translation.id === parseInt(id),
  )[0];
}

export const useBibleBooks = (): Array<BibleBookModel> => {
  const [data, setData] = useState([]);
  useQuery(
    [`bibleBooksQuery`],
    async () =>
      await Api.get(`/bibleBooks`, {
        limit: 999,
      }),
    {
      onSuccess: data => {
        setData(data?.response);
      },
    },
  );

  return data;
};

export const useBibleBook = (id: number = 1): BibleBookModel | null => {
  const [data, setData] = useState(null);
  useQuery(
    [`bibleBookQuery`, id],
    async () =>
      await Api.get(`/bibleBooks/${id}`, {
        limit: 999,
      }),
    {
      onSuccess: data => {
        setData(data?.response);
      },
    },
  );

  return data;
};

export const useBibleTranslations = (): Array<BibleTranslationModel> => {
  const [data, setData] = useState([]);
  useQuery(
    [`bibleTranslationsQuery`],
    async () =>
      await Api.get(`/bibleTranslations`, {
        limit: 999,
      }),
    {
      onSuccess: data => {
        setData(data?.response);
      },
    },
  );

  return data;
};

export const useBibleTranslation = (
  id: number = 1,
): BibleTranslationModel | null => {
  const [data, setData] = useState(null);
  useQuery(
    [`bibleTranslationQuery`, id],
    async () =>
      await Api.get(`/bibleTranslations/${id}`, {
        limit: 999,
      }),
    {
      onSuccess: data => {
        setData(data?.response);
      },
    },
  );

  return data;
};
