/**
 * Base API response/request models
 */

export type ApiRequestParamsModel = {
  select?: string;
  join?: string;
  where?: string;
  order?: string;
  limit?: number;
  offset?: number;
  page?: number;
};

export type ApiResponseModel = {
  metadata: {
    [key: string]: any;
    datetime?: string;
    duration?: string;
    pagination?: {
      count: number;
      limit: number;
      offset: number;
      pages: number;
      page: number;
    };
    resource?: string;
  };
  response?: any;
  errors?: any;
};

/**
 * API resource models
 */

export type BibleTranslationModel = {
  id: number;
  abbreviation: string;
  name: string;
  author: string;
  copyright: string;
};

export type BibleBookModel = {
  id: number;
  name: string;
  abbreviations: Array<string>;
  section: string;
};

export type BibleVerseModel = {
  id: number;
  translation: number | BibleTranslationModel;
  book: number | BibleBookModel;
  chapter: number;
  verse: number;
  text: string;
};

export type StudyModel = {
  id: number;
  type: string;
  study: number | StudyModel;
  name: string;
  properties: object;
};

export type StudyComponentModel = {
  id: number;
  sort: number;
  type: string;
  study: number | StudyModel;
  name: string;
  properties: { [key: string]: any };
};
