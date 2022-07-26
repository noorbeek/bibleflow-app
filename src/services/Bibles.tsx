import { useAppStore } from 'store/global';

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
