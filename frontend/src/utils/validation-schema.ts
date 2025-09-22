import { Role } from '@interfaces/role';
import {
  invalidOrgNumberMessage,
  invalidPhoneMessage,
  invalidSsnMessage,
  invalidZipMessage,
  luhnCheck,
  newNumberPhonePattern,
  orgNumberPattern,
  phonePattern,
  ssnPattern,
  zipPattern,
} from '@services/helper-service';
import * as yup from 'yup';

/**
 * Schema för validering av telefonnummer
 */
export const phoneSchema = yup
  .string()
  .trim()
  .nullable()
  .notRequired()
  .transform((val) => (val === '' ? undefined : val.replace('-', '')))
  .matches(phonePattern, invalidPhoneMessage);

/**
 * Schema för nytt telefonnummer-fält (+46...)
 */
export const newPhoneSchema = yup
  .string()
  .trim()
  .nullable()
  .notRequired()
  .transform((val) => (val === '' ? undefined : val.replace('-', '')))
  .matches(newNumberPhonePattern, invalidPhoneMessage);

/**
 * Schema för e-postadresser
 */
export const emailSchema = yup
  .string()
  .trim()
  .nullable()
  .notRequired()
  .transform((value) => (value === '' ? undefined : value))
  .email('E-postadress har fel format')
  .test('has-dot-in-domain', 'E-postadress har fel format', (value) => {
    if (!value) return true;
    const domain = value.split('@')[1];
    return domain?.includes('.');
  });
/**
 * Schema för personnummer med Luhn-kontroll
 */
export const ssnSchema = yup
  .string()
  .trim()
  .matches(ssnPattern, invalidSsnMessage)
  .test('luhncheck', invalidSsnMessage, (ssn) => luhnCheck(ssn) || !ssn);

/**
 * Schema för organisationsnummer
 */
export const orgNumberSchema = yup
  .string()
  .trim()
  .matches(orgNumberPattern, invalidOrgNumberMessage)
  .test('isValidOrgNr', invalidOrgNumberMessage, (orgNr) => (orgNr ? /^[0-9]{10}$/.test(orgNr) : true));

/**
 * Postnummer-schema
 */
export const zipSchema = yup
  .string()
  .nullable()
  .notRequired()
  .transform((val) => (val ? val.replace(/\s/g, '') : val))
  .test('zip-format', invalidZipMessage, (value) => {
    if (!value) return true;
    return zipPattern.test(value);
  });

/**
 * Stakeholder-schema
 */
export const stakeholderSchema = yup.object().shape({
  ssn: ssnSchema,
  firstName: yup.string().required('Förnamn är obligatoriskt'),
  lastName: yup.string().required('Efternamn är obligatoriskt'),
  newEmail: emailSchema,
  newPhoneNumber: phoneSchema,
  careof: yup.string(),

  roles: yup.array().of(yup.string().required()).min(1, 'Välj en roll').required('Välj en roll'),

  street: yup.string().when('roles', {
    is: (roles?: string[]) => roles?.[0] === Role.APPLICANT,
    then: (s) => s.required('Adress är obligatorisk'),
    otherwise: (s) => s.nullable().notRequired(),
  }),

  zip: yup.string().when('roles', {
    is: (roles?: string[]) => roles?.[0] === Role.APPLICANT,
    then: () => zipSchema.required('Postnummer är obligatoriskt'),
    otherwise: () => zipSchema,
  }),

  city: yup.string().when('roles', {
    is: (roles?: string[]) => roles?.[0] === Role.APPLICANT,
    then: (s) => s.required('Ort är obligatorisk'),
    otherwise: (s) => s.nullable().notRequired(),
  }),
});
