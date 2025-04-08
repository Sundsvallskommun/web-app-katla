export interface CaseTypeFilter {
  caseType: string[];
}

export const CaseTypeValues = {
  caseType: [],
};

export interface CaseStatusFilter {
  status: string[];
}

export const CaseStatusValues = {
  status: [],
};

export interface CasePriorityFilter {
  priority: string[];
}

export const CasePriorityValues = {
  priority: [],
};

export interface CaseQueryFilter {
  query: string;
}

export const CaseQueryValues = {
  query: '',
};

export type CaseDataFilter = CaseTypeFilter & CaseStatusFilter & CasePriorityFilter & CaseQueryFilter;
export const CaseDataValues = {
  ...CaseTypeValues,
  ...CaseStatusValues,
  ...CasePriorityValues,
  ...CaseQueryValues,
};
