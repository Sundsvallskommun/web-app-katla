export enum PTCaseType {
  PARKING_PERMIT = 'PARKING_PERMIT',
  PARKING_PERMIT_RENEWAL = 'PARKING_PERMIT_RENEWAL',
  LOST_PARKING_PERMIT = 'LOST_PARKING_PERMIT',
  APPEAL = 'APPEAL',
}

export const CaseType = { ...PTCaseType };

export const CaseTypes = {
  PT: PTCaseType,

  ALL: { ...PTCaseType },
};
