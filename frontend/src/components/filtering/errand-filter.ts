export interface CaseTypeFilter {
  caseType: string[];
}

export const CaseTypeValues = {
  caseType: [],
};

export interface CaseQueryFilter {
  query: string;
}

export const CaseQueryValues = {
  query: '',
};

export type CaseDataFilter = CaseTypeFilter;
export const CaseDataValues = {
  ...CaseTypeValues,
};
