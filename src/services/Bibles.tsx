import { useAppStore } from 'store/global';
import { useState, useEffect } from 'react';

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

export const useBibleTranslation: any = (id: number = 1) => {
  const bibleTranslations = useAppStore(state => state.bibleTranslations);
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(bibleTranslations.filter(book => book.id === id)[0]);
  }, [bibleTranslations, id]);

  return data;
};

export const useBibleBook: any = (id: number = 1) => {
  const bibleBooks = useAppStore(state => state.bibleBooks);
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(bibleBooks.filter(book => book.id === id)[0]);
  }, [bibleBooks, id]);

  return data;
};
