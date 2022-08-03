/**
 * Base API response/request models
 */

export interface ApiRequestParamsModel {
  select?: string;
  join?: string;
  where?: string;
  order?: string;
  limit?: number;
  offset?: number;
  page?: number;
}

export interface ApiResponseModel {
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
}

/**
 * API resource models
 */

export interface BibleTranslationModel {
  id: number;
  abbreviation: string;
  name: string;
  author: string;
  copyright: string;
}

export interface BibleBookModel {
  id: number;
  name: string;
  abbreviations: Array<string>;
  section: string;
}

export interface BibleVerseModel {
  id: number;
  translation: number | BibleTranslationModel;
  book: number | BibleBookModel;
  chapter: number;
  verse: number;
  text: string;
}

export interface StudyModel {
  id: number;
  name: string;
  description: string;
  createdBy: string | any;
  createdAt?: string;
  [key: string]: any;
}

export interface StudyComponentModel {
  id: number;
  sort: number;
  type: string;
  study: number | StudyModel;
  properties: { [key: string]: any };
  [key: string]: any;
}
