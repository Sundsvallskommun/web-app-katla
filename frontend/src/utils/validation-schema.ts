import {
  invalidOrgNumberMessage,
  invalidPhoneMessage,
  invalidSsnMessage,
  luhnCheck,
  newNumberPhonePattern,
  orgNumberPattern,
  phonePattern,
  ssnPattern,
} from '@services/helper-service';
import * as yup from 'yup';

/**
 * Schema för validering av telefonnummer
 */
export const phoneSchema = yup
  .string()
  .trim()
  .transform((val) => val.replace('-', ''))
  .matches(phonePattern, invalidPhoneMessage);

/**
 * Schema för nytt telefonnummer-fält (+46...)
 */
export const newPhoneSchema = yup
  .string()
  .trim()
  .transform((val) => val.replace('-', ''))
  .matches(newNumberPhonePattern, invalidPhoneMessage);

/**
 * Schema för e-postadresser
 */
export const emailSchema = yup.string().trim().email('E-postadress har fel format');

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
