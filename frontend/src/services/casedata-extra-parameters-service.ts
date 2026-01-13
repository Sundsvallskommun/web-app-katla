import { notification_UppgiftFieldTemplate } from '@components/errandinformation/extraparameter-templates/paratransit-notification';
import { notificationBusCard_UppgiftFieldTemplate } from '@components/errandinformation/extraparameter-templates/paratransit-notification-bus-card';
import { notificationNational_UppgiftFieldTemplate } from '@components/errandinformation/extraparameter-templates/paratransit-notification-national';
import { notificationRenewal_UppgiftFieldTemplate } from '@components/errandinformation/extraparameter-templates/paratransit-notification-renewal';
import { notificationRiak_UppgiftFieldTemplate } from '@components/errandinformation/extraparameter-templates/paratransit-notification-riak';
import { FTCaseType } from '@interfaces/case-type';
import { IErrand } from '@interfaces/errand';
import { ExtraParameter } from '@interfaces/extra-parameters';
import escapeStringRegexp from 'escape-string-regexp';
import { apiService } from './api-service';

export const EXTRAPARAMETER_SEPARATOR = '@';

export type OptionBase = {
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
    | { type: 'checkbox'; options: OptionBase[] }
    | { type: 'repeatableGroup' };
  section: string;
  dependsOnLogic?: 'AND' | 'OR';
  dependsOn?: {
    field: string;
    value: string | string[];
    validationMessage?: string;
  }[];
  description?: string;
  required?: boolean;
  pairWith?: string;
}

export interface RepeatableGroupConfig {
  groupName: string;
  basePath: string;
  section: string;
  repeatableConfig: {
    minItems: number;
    addButtonText: string;
    removeButtonText: string;
  };
  fields: UppgiftField[];
}

export interface UppgiftFieldWithRepeatableGroup extends UppgiftField {
  formField: { type: 'repeatableGroup' };
  repeatableGroup: RepeatableGroupConfig;
  initialData?: Record<number, Record<string, string | string[]>>;
}

export type UppgiftFieldExtended = UppgiftField | UppgiftFieldWithRepeatableGroup;

// Type guard to check if a field has a repeatable group
export const hasRepeatableGroup = (field: UppgiftFieldExtended): field is UppgiftFieldWithRepeatableGroup => {
  return 'repeatableGroup' in field;
};

export interface ExtraParametersObject {
  [key: string]: UppgiftFieldExtended[] | undefined;
}

const template: ExtraParametersObject = {
  PARATRANSIT_NOTIFICATION: notification_UppgiftFieldTemplate,
  PARATRANSIT_NOTIFICATION_RENEWAL: notificationRenewal_UppgiftFieldTemplate,
  PARATRANSIT_NOTIFICATION_NATIONAL: notificationNational_UppgiftFieldTemplate,
  PARATRANSIT_NOTIFICATION_RIAK: notificationRiak_UppgiftFieldTemplate,
  PARATRANSIT_NOTIFICATION_BUS_CARD: notificationBusCard_UppgiftFieldTemplate,
};

export const getTemplateFields = (caseType?: string): UppgiftField[] => {
  if (!caseType || !template[caseType]) {
    return [];
  }
  return template[caseType] ?? [];
};

// Helper function to group indexed parameters into repeatable groups
const groupRepeatableParameters = (
  extraParameters: ExtraParameter[],
  basePath: string
): Record<number, Record<string, string | string[]>> => {
  const grouped: Record<number, Record<string, string | string[]>> = {};
  const pattern = new RegExp(`^${escapeStringRegexp(basePath)}\\.([0-9]+)\\.(.+)$`);

  extraParameters.forEach((param) => {
    const match = param.key.match(pattern);
    if (match) {
      const index = parseInt(match[1], 10);
      const fieldKey = match[2];

      if (!grouped[index]) {
        grouped[index] = {};
      }

      const filtered = param.values?.filter((v) => typeof v === 'string' && v.trim() !== '') ?? [];
      grouped[index][fieldKey] = filtered.length === 1 ? filtered[0] : filtered;
    }
  });

  return grouped;
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

  const templateFields = template[caseType] as UppgiftFieldExtended[] | undefined;
  const repeatableGroupFields = templateFields?.filter(hasRepeatableGroup) ?? [];

  repeatableGroupFields.forEach((field) => {
    const groupConfig = field.repeatableGroup;
    const basePath = groupConfig.basePath;
    const groupedData = groupRepeatableParameters(extraParameters, basePath);

    if (Object.keys(groupedData).length > 0) {
      obj[caseType] = obj[caseType] || [];
      const fields = obj[caseType]!;
      const index = fields.findIndex((f) => f.field === field.field);

      if (index > -1 && hasRepeatableGroup(fields[index])) {
        fields[index].initialData = groupedData;
      }
    }
  });

  extraParameters.forEach((param) => {
    const field = param.key;
    let value: string | string[] = '';

    const templateField = templateFields?.find((f) => f.field === field);
    const isPartOfRepeatableGroup = repeatableGroupFields.some((rgField) => {
      const groupConfig = rgField.repeatableGroup;
      return field.startsWith(`${groupConfig.basePath}.`) && /\.[0-9]+\./.test(field);
    });

    if (isPartOfRepeatableGroup) {
      return;
    }

    if (Array.isArray(param.values)) {
      const filtered = param.values.filter((v) => typeof v === 'string' && v.trim() !== '');
      const formField = templateField?.formField;
      const isMultiSelect =
        formField?.type === 'checkbox' || (formField?.type === 'combobox' && Array.isArray(templateField?.value));
      value = isMultiSelect ? filtered : filtered[0] || '';
    }

    if (templateField) {
      const { label, formField, section, dependsOn, dependsOnLogic, description, required, pairWith } = templateField;

      obj[caseType] = obj[caseType] || [];
      const fields = obj[caseType]!;

      const updatedField: UppgiftField = {
        field,
        value,
        label,
        formField,
        section,
        dependsOn,
        dependsOnLogic,
        description,
        required,
        pairWith,
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

  const repeatableGroupPaths = new Set<string>();
  sanitizedData.forEach((param) => {
    // IMPORTANT Pattern: basePath.index.fieldName (e.g., personal.journey.0.destination)
    const match = param.key.match(/^(.+)\.\d+\..+$/);
    if (match) {
      repeatableGroupPaths.add(match[1]);
    }
  });

  const mergedExtraParameters = errand.extraParameters
    .filter((existing) => {
      if (sanitizedData.some((param) => param.key === existing.key)) {
        return false;
      }

      for (const basePath of repeatableGroupPaths) {
        if (existing.key.match(new RegExp(`^${escapeStringRegexp(basePath)}\\.\\d+\\..+$`))) {
          return false;
        }
      }

      return true;
    })
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

const extractRepeatableGroupData = <T extends Record<string, unknown>>(
  rawValues: T,
  basePath: string
): ExtraParameter[] => {
  const extracted: ExtraParameter[] = [];
  const formKeyPrefix = basePath.replaceAll('.', EXTRAPARAMETER_SEPARATOR) + EXTRAPARAMETER_SEPARATOR;

  const pattern = new RegExp(
    `^${escapeStringRegexp(formKeyPrefix)}(\\d+)${EXTRAPARAMETER_SEPARATOR}(.+)$`
  );

  Object.keys(rawValues).forEach((key) => {
    const match = key.match(pattern);
    if (match) {
      const index = match[1];
      const fieldName = match[2];
      const value = rawValues[key];
      const fullKey = `${basePath}.${index}.${fieldName}`;

      let values: string[] = [];

      if (Array.isArray(value)) {
        values = value.filter((v) => typeof v === 'string' && v.trim() !== '');
      } else if (typeof value === 'string' && value.trim() !== '') {
        values = [value];
      }

      if (values.length > 0) {
        extracted.push({
          key: fullKey,
          values,
        });
      }
    }
  });

  return extracted;
};

export const extractExtraParameters = <T extends Record<string, unknown>>(
  fields: UppgiftFieldExtended[],
  getValues: () => T
): ExtraParameter[] => {
  const rawValues = getValues();
  const extracted: ExtraParameter[] = [];

  fields.forEach((field) => {
    if (hasRepeatableGroup(field)) {
      const groupConfig = field.repeatableGroup;
      const repeatableData = extractRepeatableGroupData(rawValues, groupConfig.basePath);
      extracted.push(...repeatableData);
      return;
    }

    const formKey = field.field.replaceAll('.', EXTRAPARAMETER_SEPARATOR);
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
