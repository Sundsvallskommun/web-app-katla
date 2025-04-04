import dayjs from 'dayjs';

export const newNumberPhonePattern = /^$|^\+46$|^(\+?[0-9]{7,11})$/gi;
export const phonePattern = /^$|^(\+?[0-9]{7,11})$/gi;
export const phonePatternNoCountryCode = /^$|^07[02369]\d{7}$/;
export const phonePatternWithCountryCode = /^$|^(\+[0-9]{10,12})$/gi;
export const supportManagementPhonePattern = /^\+[1-9]\d{3,14}$/gi;
export const supportManagementPhonePatternOrCountryCode = /^\+46$|^\+[1-9]\d{3,14}$/gi;

export const invalidPhoneMessage = 'Ej giltigt telefonnummer';
// export const invalidPhoneMessage = 'Ej giltigt telefonnummer (ange i formatet 07NNNNNNNN)';

export const ssnPattern = /^$|^((19|20)[0-9]{6}-?[0-9]{4})$/gi;
export const usernamePattern = /.*/;

export const invalidSsnMessage = 'Ej giltigt personnummer (ange tolv siffror: ååååmmddxxxx)';
export const invalidUsernameMessage = 'Ej giltigt användarnamn, mellanslag ej tillåtet.';

export const orgNumberPattern = /^$|^([0-9]{6}-[0-9]{4})$/gi;
export const invalidOrgNumberMessage = 'Ej giltigt organisationsnummer (ange tio siffror med streck: kkllmm-nnnn)';

export const luhnCheck = (str = ''): boolean => {
  str = str?.replace('-', '');
  if (!str) {
    return false;
  }
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

export const formatOrgNr = (orgNr: string, format: OrgNumberFormat = OrgNumberFormat.NODASH): string => {
  if (!orgNr) {
    return '';
  }
  const orgNumber = orgNr?.replace(/\D/g, '');
  if (!orgNumber || orgNumber.length !== 10 || !luhnCheck(orgNumber)) {
    return ''; // NOTE: incorrect org number
  }
  return format === OrgNumberFormat.DASH ? orgNumber.substring(0, 6) + '-' + orgNumber.substring(6, 10) : orgNumber;
};

export const base64Encode = (str: string) => {
  return Buffer.from(str, 'utf-8').toString('base64');
};

export const base64Decode = (base64: string) => {
  return Buffer.from(base64, 'base64').toString();
};

export function b64toBlob(data: string, mimeType: string) {
  const byteString = base64Decode(data);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeType });
}

// eslint-disable-next-line
export const latestBy = (list: any[], timeField: string) =>
  list && list.length > 0 ?
    list
      .sort((a, b) =>
        dayjs(a[timeField]).isAfter(dayjs(b[timeField])) ? 1
        : dayjs(b[timeField]).isAfter(dayjs(a[timeField])) ? -1
        : 0
      )
      .reverse()[0]
  : undefined;

export const sortBy = (list: [], field: string) =>
  list && list.length > 0 ? list.sort((a, b) => (a[field] > b[field] ? 1 : -1)) : [];

export function toTitleCase(str: string) {
  return str ? str.charAt(0).toUpperCase() + str.substr(1).toLowerCase() : '';
}

//eslint-disable-next-line
export function deepFlattenToObject(obj: any, prefix = '') {
  //eslint-disable-next-line
  return Object.keys(obj).reduce((acc: { [key: string]: any }, k) => {
    const pre = prefix.length ? prefix + '_' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      Object.assign(acc, deepFlattenToObject(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});
}

// //eslint-disable-next-line
// export function debounce(this: any, func: any, wait:any, immediate: any) {
//   let timeout: NodeJS.Timeout | null = null;
//   return (...args: any[]) => {
//     const context = this;
//     const later = () => {
//       timeout = null;
//       if (!immediate) func.apply(context, args);
//     };
//     const callNow = immediate && !timeout;
//     if (timeout !== null) {
//       clearTimeout(timeout);
//     }
//     timeout = setTimeout(later, wait);
//     if (callNow) func.apply(context, args);
//   };
// }

export function prettyTime(time: string) {
  if (!time) {
    return '';
  }
  const d = dayjs(time);
  // check if today
  if (d.isSame(dayjs(), 'day')) {
    return `Idag ${d.format('HH:mm')}`;
  } else if (d.isSame(dayjs().subtract(1, 'day'), 'day')) {
    return `Igår ${d.format('HH:mm')}`;
  } else {
    return d.format('YYYY-MM-DD HH:mm');
  }
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(value);
}

export function twoDecimals(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
