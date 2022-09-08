import { useEffect, useState } from 'react';
import Api from './Api';
import { BibleBookModel, BibleTranslationModel } from 'models/Api';
import { useQuery } from '@tanstack/react-query';

export const useBibleBooks = (): Array<BibleBookModel> => {
  const [data, setData] = useState([]);
  useEffect(() => {
    (async () => {
      const data = await Api.get(`/bibleBooks`, {
        limit: 999,
      });
      setData(data?.response);
    })();
  }, []);

  //   useQuery(
  //     [`bibleBooks`],
  //     async () => await Api.get(`/bibleBooks`, { limit: 999 }),
  //     {
  //       cacheTime: 300000,
  //       onSuccess: data => {
  //         setData(data?.response);
  //       },
  //     },
  //   )
  return data;
};

export const useBibleBook = (id: number = 1): BibleBookModel | null => {
  const [data, setData] = useState(null);
  useQuery(
    [`bibleBooks${id}`, id],
    async () => await Api.get(`/bibleBooks/${id}`, { limit: 999 }),
    {
      cacheTime: 300000,
      onSuccess: data => {
        setData(data?.response);
      },
    },
  );
  //   useEffect(() => {
  //     (async () => {
  //       const data = await Api.get(`/bibleBooks/${id}`, {
  //         limit: 999,
  //       });
  //       setData(data?.response);
  //     })();
  //   }, [id]);

  return data;
};

export const useBibleTranslations = (): Array<BibleTranslationModel> => {
  const [data, setData] = useState([]);
  useEffect(() => {
    (async () => {
      const data = await Api.get(`/bibleTranslations`, {
        limit: 999,
      });
      setData(data?.response);
    })();
  }, []);
  return data;
};

export const useBibleTranslation = (
  id: number = 1,
): BibleTranslationModel | null => {
  const [data, setData] = useState(null);
  useEffect(() => {
    (async () => {
      const data = await Api.get(`/bibleTranslations/${id}`, {
        limit: 999,
      });
      setData(data?.response);
    })();
  }, [id]);
  return data;
};
