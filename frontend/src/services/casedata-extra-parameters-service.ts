import { apiService } from './api-service';
import { ExtraParameter } from '@interfaces/extra-parameters';
import { IErrand } from '@interfaces/errand';
import { FTCaseType } from '@interfaces/case-type';
import { notificationChange_UppgiftFieldTemplate } from '@components/errandinformation/extraparameter-templates/paratransit-notification-change';
import { notificationRenewal_UppgiftFieldTemplate } from '@components/errandinformation/extraparameter-templates/paratransit-notification-renewal';
import { notification_UppgiftFieldTemplate } from '@components/errandinformation/extraparameter-templates/paratransit-notification';
import { notificationNational_UppgiftFieldTemplate } from '@components/errandinformation/extraparameter-templates/paratransit-notification-national';
import { notificationNationalRenewal_UppgiftFieldTemplate } from '@components/errandinformation/extraparameter-templates/paratransit-notification-national-renewal';
import { notificationRiak_UppgiftFieldTemplate } from '@components/errandinformation/extraparameter-templates/paratransit-notification-riak';
import { notificationBusCard_UppgiftFieldTemplate } from '@components/errandinformation/extraparameter-templates/paratransit-notification-bus-card';

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
    | { type: 'radio'; options: OptionBase[]; inline?: boolean }
    | { type: 'radioPlus'; options: OptionBase[]; ownOption: string }
    | { type: 'checkbox'; options: OptionBase[] };
  section: string;
  dependsOn?: {
    field: string;
    value: string;
    validationMessage?: string;
  }[];
  description?: string;
}

export interface ExtraParametersObject {
  [key: string]: UppgiftField[] | undefined;
}

const template: ExtraParametersObject = {
  PARATRANSIT_NOTIFICATION: notification_UppgiftFieldTemplate,
  PARATRANSIT_NOTIFICATION_CHANGE: notificationChange_UppgiftFieldTemplate,
  PARATRANSIT_NOTIFICATION_RENEWAL: notificationRenewal_UppgiftFieldTemplate,
  PARATRANSIT_NOTIFICATION_NATIONAL: notificationNational_UppgiftFieldTemplate,
  PARATRANSIT_NOTIFICATION_NATIONAL_RENEWAL: notificationNationalRenewal_UppgiftFieldTemplate,
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
      const isMultiSelect = templateField?.formField.type === 'checkbox';
      value = isMultiSelect ? filtered : filtered[0] || '';
    }

    if (templateField) {
      const { label, formField, section, dependsOn } = templateField;

      obj[caseType] = obj[caseType] || [];
      const fields = obj[caseType]!;

      const updatedField: UppgiftField = {
        field,
        value,
        label,
        formField,
        section,
        dependsOn,
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
  const nullFilteredData: ExtraParameter[] = data.filter(
    (d) => d.values && d.values[0] !== null && typeof d.values[0] !== 'undefined'
  );
  let newExtraParameters = [...errand.extraParameters];
  nullFilteredData.forEach((p) => {
    newExtraParameters = replaceExtraParameter(newExtraParameters, p);
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return apiService.patch<any, { id: string; extraParameters: ExtraParameter[] }>(
    `casedata/${municipalityId}/errands/${errand.id}`,
    {
      id: errand.id.toString(),
      extraParameters: newExtraParameters,
    }
  );
};

// If parameter exists, replace the existing one, otherwise append to list
export const replaceExtraParameter = (extraParameters: ExtraParameter[], newParameter: ExtraParameter) => {
  return extraParameters.some((p) => p.key === newParameter.key) ?
      extraParameters.map((p) => (p.key === newParameter.key ? newParameter : p))
    : [...extraParameters, newParameter];
};

export const extractExtraParameters = <T extends Record<string, any>>(
  fields: UppgiftField[],
  getValues: () => T
): ExtraParameter[] => {
  const rawValues = getValues();

  return fields
    .map((field) => {
      const formKey = field.field.replace(/\./g, EXTRAPARAMETER_SEPARATOR);
      const value = rawValues[formKey];

      let values: string[] = [];

      if (Array.isArray(value)) {
        values = value.filter((v) => typeof v === 'string' && v.trim() !== '');
      } else if (typeof value === 'string' && value.trim() !== '') {
        values = [value];
      }

      return {
        key: field.field,
        values,
      };
    })
    .filter((param) => param.values.length > 0);
};
