import create from 'zustand';

/**
 * Store
 */

export const useShareStore = create<any>((set, get) => ({
  bibleVerses: [],

  share: (event, shareObject) => {
    shareObject = Object.assign(
      {
        url: window.location.href,
        title: document.title,
        text: '',
      },
      shareObject,
    );
    if (navigator.share) {
      navigator.share(shareObject).then(() => {
        get().reset();
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareObject.text).then(() => {
        get().reset();
      });
    } else {
      return document.execCommand('copy', true, shareObject.text);
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
    return get().bibleVerses.filter(bibleVerse => bibleVerse.id === verse.id)
      .length;
  },
}));
