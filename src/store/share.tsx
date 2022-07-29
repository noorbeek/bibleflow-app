import create, { StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { getBibleBook, getBibleTranslation } from 'services/Bibles';

type ShareStorePersist = (
  config: StateCreator<any>,
  options: PersistOptions<any>,
) => StateCreator<any>;

/**
 * Store
 */

export const useShareStore = create<any>(
  (persist as unknown as ShareStorePersist)(
    (set, get) => ({
      bibleVerses: [],

      share: event => {
        let currentBook: number = 0;
        let currentChapter: number = 0;
        let currentVerse: number = 0;

        if (get().bibleVerses.length) {
          let text = '';

          // Build verses
          get().bibleVerses.forEach(verse => {
            if (verse.verse * 1 < currentVerse * 1) {
              currentVerse = 0;
            }
            if (verse.book !== currentBook) {
              currentBook = verse.book;
              //text += getBibleBook(verse.book).name + '\n';
            }
            if (verse.chapter !== currentChapter) {
              currentChapter = verse.chapter;
              text +=
                (text ? '\n' : '') +
                getBibleBook(verse.book).name +
                ' ' +
                verse.chapter +
                ' (' +
                getBibleTranslation(verse.translation).abbreviation +
                ')' +
                '\n';
            }

            text += verse.verse + ' ' + verse.text + ' ';

            if (currentVerse && verse.verse * 1 !== currentVerse * 1 + 1) {
              text += '\n';
            }
            currentVerse = verse.verse * 1;
          });

          if (navigator.share) {
            navigator
              .share({
                url: window.location.href,
                title: document.title,
                text: text,
              })
              .then(() => {
                get().reset();
              });
          } else if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
              get().reset();
            });
          } else {
            return document.execCommand('copy', true, text);
          }
        }
        event?.stopPropagation();
      },

      reset: () => set(state => ({ bibleVerses: [] })),

      add: verse => {
        set(state => ({
          bibleVerses: [...state.bibleVerses, verse],
        }));
      },
      remove: verse => {
        set(state => ({
          bibleVerses: state.bibleVerses.filter(
            bibleVerse => bibleVerse.id !== verse.id,
          ),
        }));
      },
      toggle: verse => {
        get().find(verse) ? get().remove(verse) : get().add(verse);
      },
      find: verse => {
        return get().bibleVerses.filter(
          bibleVerse => bibleVerse.id === verse.id,
        ).length;
      },
    }),
    {
      name: 'shareStore',
    },
  ),
);
