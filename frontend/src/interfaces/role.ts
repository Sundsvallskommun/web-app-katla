export enum Role {
  APPLICANT = 'APPLICANT',
  ADMINISTRATOR = 'ADMINISTRATOR',
  CONTACT_PERSON = 'CONTACT_PERSON',
  FELLOW_APPLICANT = 'FELLOW_APPLICANT',
  DRIVER = 'DRIVER',
  PASSENGER = 'PASSENGER',
  DOCTOR = 'DOCTOR',
  REPORTER = 'REPORTER',
  NEXT_OF_KIN = 'NEXT_OF_KIN',
  LEGAL_GUARDIAN = 'LEGAL_GUARDIAN',
  LEGAL_REPRESENTATIVE = 'LEGAL_REPRESENTATIVE',
  HEALTHCARE_PERSONNEL = 'HEALTHCARE_PERSONNEL',
  OTHER = 'OTHER',
}

export const RoleDisplayNames: Record<Role, string> = {
  [Role.APPLICANT]: 'Ärendeägare',
  [Role.ADMINISTRATOR]: 'Handläggare',
  [Role.CONTACT_PERSON]: 'Kontaktperson',
  [Role.FELLOW_APPLICANT]: 'Medsökande',
  [Role.DRIVER]: 'Förare',
  [Role.PASSENGER]: 'Passagerare',
  [Role.DOCTOR]: 'Läkare',
  [Role.REPORTER]: 'Anmälare',
  [Role.NEXT_OF_KIN]: 'Anhörig',
  [Role.LEGAL_GUARDIAN]: 'Vårdnadshavare',
  [Role.LEGAL_REPRESENTATIVE]: 'Juridiskt ombud',
  [Role.HEALTHCARE_PERSONNEL]: 'Sjukvårdspersonal',
  [Role.OTHER]: 'Annan',
};

export const OTHER_PARTY_ROLES: Role[] = [
  Role.CONTACT_PERSON,
  Role.FELLOW_APPLICANT,
  Role.DOCTOR,
  Role.NEXT_OF_KIN,
  Role.LEGAL_GUARDIAN,
  Role.LEGAL_REPRESENTATIVE,
  Role.HEALTHCARE_PERSONNEL,
  Role.OTHER,
];

export function getRoleDisplayName(role: Role): string {
  return RoleDisplayNames[role] || role;
}
