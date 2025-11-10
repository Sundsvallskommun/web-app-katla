import { notification_UppgiftFieldTemplate } from '@components/errandinformation/extraparameter-templates/paratransit-notification';
import { notificationBusCard_UppgiftFieldTemplate } from '@components/errandinformation/extraparameter-templates/paratransit-notification-bus-card';
import { notificationNational_UppgiftFieldTemplate } from '@components/errandinformation/extraparameter-templates/paratransit-notification-national';
import { notificationRenewal_UppgiftFieldTemplate } from '@components/errandinformation/extraparameter-templates/paratransit-notification-renewal';
import { notificationRiak_UppgiftFieldTemplate } from '@components/errandinformation/extraparameter-templates/paratransit-notification-riak';
import { FTCaseType } from '@interfaces/case-type';
import { IErrand } from '@interfaces/errand';
import { ExtraParameter } from '@interfaces/extra-parameters';
import { apiService } from './api-service';

export const EXTRAPARAMETER_SEPARATOR = '@';

type OptionBase = {
  label: string;
  value: string;
  name?: string;
};
export interface UppgiftField {
  field: string;
  value: string | string[];
  label: string;
  formField:
    | { type: 'text'; options?: { placeholder?: string } }
    | { type: 'date'; options?: { min?: string; max?: string } }
    | { type: 'datetime-local' }
    | { type: 'textarea'; options?: { placeholder?: string } }
    | { type: 'select'; options: OptionBase[] }
    | { type: 'combobox'; options: OptionBase[]; placeholder?: string; multiple?: boolean }
    | { type: 'radio'; options: OptionBase[]; inline?: boolean }
    | { type: 'radioPlus'; options: OptionBase[]; ownOption: string }
    | { type: 'checkbox'; options: OptionBase[] };
  section: string;
  dependsOn?: {
    field: string;
    value: string | string[];
    validationMessage?: string;
  }[];
  description?: string;
  required?: boolean;
}

export interface ExtraParametersObject {
  [key: string]: UppgiftField[] | undefined;
}

const template: ExtraParametersObject = {
  PARATRANSIT_NOTIFICATION: notification_UppgiftFieldTemplate,
  PARATRANSIT_NOTIFICATION_RENEWAL: notificationRenewal_UppgiftFieldTemplate,
  PARATRANSIT_NOTIFICATION_NATIONAL: notificationNational_UppgiftFieldTemplate,
  PARATRANSIT_NOTIFICATION_RIAK: notificationRiak_UppgiftFieldTemplate,
  PARATRANSIT_NOTIFICATION_BUS_CARD: notificationBusCard_UppgiftFieldTemplate,
};

export const extraParametersToUppgiftMapper = (
  errand?: Partial<Pick<IErrand, 'caseType' | 'extraParameters'>>
): Partial<ExtraParametersObject> => {
  const obj: Partial<ExtraParametersObject> = { ...template };

  const caseType = errand?.caseType;
  const extraParameters = errand?.extraParameters ?? [];

  if (!caseType || !(caseType in FTCaseType)) {
    return obj;
  }

  extraParameters.forEach((param) => {
    const field = param.key;
    let value: string | string[] = '';

    const templateFields = template[caseType] as UppgiftField[] | undefined;
    const templateField = templateFields?.find((f) => f.field === field);

    if (Array.isArray(param.values)) {
      const filtered = param.values.filter((v) => typeof v === 'string' && v.trim() !== '');
      const formField = templateField?.formField;
      const isMultiSelect =
        formField?.type === 'checkbox' || (formField?.type === 'combobox' && Array.isArray(templateField?.value));
      value = isMultiSelect ? filtered : filtered[0] || '';
    }

    if (templateField) {
      const { label, formField, section, dependsOn, required } = templateField;

      obj[caseType] = obj[caseType] || [];
      const fields = obj[caseType]!;

      const updatedField: UppgiftField = {
        field,
        value,
        label,
        formField,
        section,
        dependsOn,
        required,
      };

      const index = fields.findIndex((f) => f.field === field);

      if (index > -1) {
        fields[index] = updatedField;
      } else {
        fields.push(updatedField);
      }
    }
  });

  return obj;
};

export const saveExtraParameters = (municipalityId: string, data: ExtraParameter[], errand: IErrand) => {
  const sanitizedData: ExtraParameter[] = data.map((param) => ({
    ...param,
    values: (param.values ?? [])
      .map((value) => (value === null || typeof value === 'undefined' ? '' : String(value).trim()))
      .filter((value) => value !== ''),
  }));

  const mergedExtraParameters = errand.extraParameters
    .filter((existing) => !sanitizedData.some((param) => param.key === existing.key))
    .concat(sanitizedData);

  return apiService.patch<unknown, { id: string; extraParameters: ExtraParameter[] }>(
    `casedata/${municipalityId}/errands/${errand.id}`,
    {
      id: errand.id.toString(),
      extraParameters: mergedExtraParameters,
    }
  );
};

// If parameter exists, replace the existing one, otherwise append to list
export const replaceExtraParameter = (extraParameters: ExtraParameter[], newParameter: ExtraParameter) => {
  return extraParameters.some((p) => p.key === newParameter.key) ?
      extraParameters.map((p) => (p.key === newParameter.key ? newParameter : p))
    : [...extraParameters, newParameter];
};

export const extractExtraParameters = <T extends Record<string, unknown>>(
  fields: UppgiftField[],
  getValues: () => T
): ExtraParameter[] => {
  const rawValues = getValues();
  const extracted: ExtraParameter[] = [];

  fields.forEach((field) => {
    const formKey = field.field.replace(/\./g, EXTRAPARAMETER_SEPARATOR);
    const value = rawValues[formKey];

    let values: string[] = [];

    if (Array.isArray(value)) {
      values = value.filter((v) => typeof v === 'string' && v.trim() !== '');
    } else if (typeof value === 'string' && value.trim() !== '') {
      values = [value];
    }

    const hadExistingValue =
      Array.isArray(field.value) ?
        field.value.length > 0
      : typeof field.value === 'string' && field.value.trim() !== '';

    if (values.length === 0 && !hadExistingValue) {
      return;
    }

    extracted.push({
      key: field.field,
      values,
    });
  });

  return extracted;
};
