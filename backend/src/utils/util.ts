import { API_BASE_URL } from '@config';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { logger } from './logger';
dayjs.extend(utc);
/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */

export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export const apiURL = (...parts: string[]): string => {
  const urlParts = [API_BASE_URL, ...parts];
  return urlParts.map(pathPart => pathPart.replace(/(^\/|\/$)/g, '')).join('/');
};

export const luhnCheck = (str = ''): boolean => {
  str = str.length === 12 ? str.slice(2) : str;
  let sum = 0;
  for (let i = 0, l = str.length; i < l; i++) {
    let v = parseInt(str[i]);
    v *= 2 - (i % 2);
    if (v > 9) {
      v -= 9;
    }
    sum += v;
  }
  return sum % 10 === 0;
};

export enum OrgNumberFormat {
  DASH,
  NODASH,
}

export const formatOrgNr = (orgNr: string, format: OrgNumberFormat = OrgNumberFormat.NODASH): string | undefined => {
  if (!orgNr) {
    return null;
  }
  let orgNumber = orgNr?.replace(/\D/g, '');
  if (!orgNumber || orgNumber.length !== 10 || !luhnCheck(orgNumber)) {
    return null;
  }
  return format === OrgNumberFormat.DASH ? orgNumber.substring(0, 6) + '-' + orgNumber.substring(6, 10) : orgNumber;
};

export const toBase64: (data: File | Blob) => Promise<string> = data =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

export const withRetries: <T>(retries: number, func: () => Promise<T>) => Promise<T | boolean> = (retries, func) => {
  return func().catch(e => {
    if (retries > 0) {
      return withRetries(retries - 1, func);
    } else {
      logger.error('Out of retries in withRetries, returning false');
      return false;
    }
  });
};

export const latestBy = (list: any[], timeField: string) =>
  list
    ? list
        .sort((a, b) => (dayjs(a[timeField]).isAfter(dayjs(b[timeField])) ? 1 : dayjs(b[timeField]).isAfter(dayjs(a[timeField])) ? -1 : 0))
        .reverse()[0]
    : undefined;

export const base64Encode = (str: string) => {
  return Buffer.from(str, 'utf-8').toString('base64');
};

export const base64Decode = (base64: string) => {
  return Buffer.from(base64, 'base64').toString();
};

export const toOffsetDateTime = (date: Dayjs) => encodeURIComponent(date.format('YYYY-MM-DDTHH:mm:ss.SSSZ'));

export const isValidUrl = (string: string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
};
