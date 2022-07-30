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
};

/**
 * API resource models
 */

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
