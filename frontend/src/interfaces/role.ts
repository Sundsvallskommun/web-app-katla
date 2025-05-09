export enum Role {
  APPLICANT = 'APPLICANT',
  ADMINISTRATOR = 'ADMINISTRATOR',
  CONTACT_PERSON = 'CONTACT_PERSON',
  FELLOW_APPLICANT = 'FELLOW_APPLICANT',
  DRIVER = 'DRIVER',
  PASSENGER = 'PASSENGER',
  DOCTOR = 'DOCTOR',
  REPORTER = 'REPORTER',
}

export const RoleDisplayNames: Record<Role, string> = {
  [Role.APPLICANT]: 'Ärendeägare',
  [Role.ADMINISTRATOR]: 'Handläggare',
  [Role.CONTACT_PERSON]: 'Ärendeintressent',
  [Role.FELLOW_APPLICANT]: 'Medsökande',
  [Role.DRIVER]: 'Förare',
  [Role.PASSENGER]: 'Passagerare',
  [Role.DOCTOR]: 'Läkare',
  [Role.REPORTER]: 'Anmälare',
};

export function getRoleDisplayName(role: Role): string {
  return RoleDisplayNames[role] || role;
}
