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
  status: ['ArendeInkommi'],
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

export interface CaseDatesFilter {
  startdate: string;
  enddate: string;
}

export const CaseDatesValues = {
  startdate: '',
  enddate: '',
};

export interface CaseAdminsFilter {
  admins: string[];
}

export const CaseAdminsValues = {
  admins: [],
};

export interface CaseChannelFilter {
  channel: string[];
}

export const CaseChannelValues = {
  channel: [],
};

export type CaseDataFilter = CaseTypeFilter &
  CaseStatusFilter &
  CasePriorityFilter &
  CaseQueryFilter &
  CaseDatesFilter &
  CaseAdminsFilter &
  CaseChannelFilter;
export const CaseDataValues = {
  ...CaseTypeValues,
  ...CaseStatusValues,
  ...CasePriorityValues,
  ...CaseQueryValues,
  ...CaseDatesValues,
  ...CaseAdminsValues,
  ...CaseChannelValues,
};
