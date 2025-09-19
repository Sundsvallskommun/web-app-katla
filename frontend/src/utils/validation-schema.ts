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
  .transform((val) => val.replace(/\s/g, ''))
  .required('Postnummer är obligatoriskt')
  .matches(zipPattern, invalidZipMessage);

/**
 * Stakeholder-schema
 */
export const stakeholderSchema = yup.object().shape({
  ssn: ssnSchema,
  firstName: yup.string().required('Förnamn är obligatoriskt'),
  lastName: yup.string().required('Efternamn är obligatoriskt'),
  newEmail: emailSchema,
  newPhoneNumber: phoneSchema,
  street: yup.string().required('Adress är obligatorisk'),
  careof: yup.string(),
  zip: zipSchema,
  city: yup.string().required('Ort är obligatorisk'),
  roles: yup.array().of(yup.string().required()).min(1, 'Välj en roll').required('Välj en roll'),
});
