import { AppContext } from '@contexts/app-context-interface';
import { EXTRAPARAMETER_SEPARATOR, OptionBase, UppgiftField } from '@services/casedata-extra-parameters-service';
import {
  Checkbox,
  Combobox,
  DatePicker,
  FormControl,
  FormLabel,
  Input,
  RadioButton,
  Select,
  Textarea,
  useThemeQueries,
} from '@sk-web-gui/react';
import { isErrandReadOnly } from '@utils/errand-utils';
import { useContext, useEffect, useState } from 'react';
import { get, useFormContext } from 'react-hook-form';

export const UppgiftFieldRenderer: React.FC<{ field: UppgiftField }> = ({ field }) => {
  const {
    register,
    unregister,
    watch,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const name = field.field.replaceAll('.', EXTRAPARAMETER_SEPARATOR);
  const error = get(errors, name)?.message;
  const fieldValue = watch(name);
  const { isMaxMediumDevice } = useThemeQueries();
  const { errand } = useContext(AppContext);
  const options: OptionBase[] = (field.formField as { options?: OptionBase[] }).options ?? [];

  //TODO: Refactor this component and use a general form for extraparameters instead of hijacking IErrand form.
  //      Refactoring of this component should include better rendering from parent component to elimit rerenderings.
  const allFormValues = watch();
  const [initialComboBoxValue] = useState<string | string[]>(field.value);

  const matchesDependency = (depValue: unknown, requirement: string | string[]) => {
    if (Array.isArray(requirement)) {
      if (Array.isArray(depValue)) {
        return depValue.some((value) => requirement.includes(value));
      }
      return requirement.includes(String(depValue));
    }

    if (Array.isArray(depValue)) {
      return depValue.includes(requirement);
    }

    return depValue === requirement;
  };

  const dependentSatisfied =
    field.dependsOn && field.dependsOn.length > 0 ?
      (() => {
        const logicOperator = field.dependsOnLogic ?? 'AND';

        if (logicOperator === 'OR') {
          // OR logic: at least one dependency must be satisfied
          const result = field.dependsOn.some((dep) => {
            const depName = dep.field.replaceAll('.', EXTRAPARAMETER_SEPARATOR);
            const depValue = allFormValues[depName];
            const matches = matchesDependency(depValue, dep.value);
            return matches;
          });
          return result;
        } else {
          // AND logic (default): all dependencies must be satisfied
          const result = field.dependsOn.every((dep) => {
            const depName = dep.field.replaceAll('.', EXTRAPARAMETER_SEPARATOR);
            const depValue = allFormValues[depName];
            const matches = matchesDependency(depValue, dep.value);
            return matches;
          });
          return result;
        }
      })()
    : undefined;

  const fieldType = field.formField.type;
  const hasConditionalRequirement = field.dependsOn?.some((dep) => Boolean(dep.validationMessage)) ?? false;
  const defaultRequiredTypes = ['select', 'radio', 'checkbox', 'combobox'];

  const isTypeRequiredByDefault = defaultRequiredTypes.includes(fieldType);
  const isRequired = field.required === true;
  const isOptional = field.required === false;

  const baseRequired = isOptional ? false : isRequired || isTypeRequiredByDefault;
  const isRequiredField = baseRequired || hasConditionalRequirement;

  useEffect(() => {
    if (fieldValue === undefined && field.value !== undefined) {
      const valueToSet =
        Array.isArray(field.value) ? field.value
        : typeof field.value === 'string' && field.value.trim() !== '' ? field.value
        : undefined;

      if (valueToSet !== undefined) {
        setValue(name, valueToSet, { shouldDirty: false, shouldValidate: false });
      }
    }
  }, [field.value, fieldValue, name, setValue]);

  // Register combobox field once on mount, unregister on unmount
  useEffect(() => {
    if (field.formField.type === 'combobox') {
      const validationRules = getConditionalValidationRules(field, getValues);
      if (isRequiredField) {
        register(name, {
          ...validationRules,
          required: 'Vänligen välj ett alternativ.',
        });
      } else {
        register(name, validationRules);
      }
    }

    // Cleanup: unregister field when component unmounts (when switching case type)
    return () => {
      unregister(name);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (field.dependsOn && !dependentSatisfied) {
    return null;
  }

  const formFieldClassName = 'flex flex-col w-full pt-8';
  const fieldDescriptionClassName = 'pt-8 w-full flex flex-col text-md leading-[1.8rem] font-normal font-[Arial]';

  const ErrorMessage = ({ error }: { error?: string }) =>
    error ? <span className="text-error text-md">{error}</span> : null;

  function getConditionalValidationRules<T extends Record<string, unknown>>(
    field: UppgiftField,
    getValues: () => T
  ): { validate?: (value: unknown) => true | string } {
    if (!field.dependsOn) return {};

    const message =
      field.dependsOn.find((dep) => dep.validationMessage)?.validationMessage || 'Detta fält är obligatoriskt';

    return {
      validate: (value: unknown) => {
        const allValues = getValues();
        const logicOperator = field.dependsOnLogic ?? 'AND';

        let shouldValidate: boolean;

        if (logicOperator === 'OR') {
          shouldValidate =
            field.dependsOn?.some((dep) => {
              const depName = dep.field.replaceAll('.', EXTRAPARAMETER_SEPARATOR);
              const depValue = allValues[depName];
              return matchesDependency(depValue, dep.value);
            }) ?? false;
        } else {
          shouldValidate =
            field.dependsOn?.every((dep) => {
              const depName = dep.field.replaceAll('.', EXTRAPARAMETER_SEPARATOR);
              const depValue = allValues[depName];
              return matchesDependency(depValue, dep.value);
            }) ?? false;
        }

        if (!shouldValidate) return true;

        return value !== undefined && value !== null && String(value).trim() !== '' ? true : message;
      },
    };
  }

  function validateAndSetError(
    field: UppgiftField,
    getValues: () => Record<string, unknown>,
    setError: (name: string, error: { type: string; message?: string }) => void,
    clearErrors: (name: string) => void,
    name: string,
    value: unknown
  ) {
    const rules = getConditionalValidationRules(field, getValues);
    if (rules.validate) {
      const result = rules.validate(value);
      if (result !== true) {
        setError(name, { type: 'manual', message: result });
      } else {
        clearErrors(name);
      }
    }
  }

  const validationRules = getConditionalValidationRules(field, getValues);

  const handleChange = (e: unknown) => {
    setValue(name, e, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <FormControl disabled={isErrandReadOnly(errand)} className="flex flex-col gap-2 items-start justify-start w-full">
      <FormLabel className="self-stretch justify-center text-dark-primary text-md leading-24 ">
        {field.label}
        {isRequiredField && <span className="text-error ml-4">*</span>}
      </FormLabel>

      {field.formField.type === 'text' && (
        <div className={formFieldClassName}>
          <Input
            className="w-full"
            data-cy={`uppgift-field-${field.field}`}
            {...register(name, validationRules)}
            placeholder={field.formField.options?.placeholder}
          />
          {field.description && <p className={fieldDescriptionClassName}>{field.description}</p>}
          <ErrorMessage error={error} />
        </div>
      )}

      {field.formField.type === 'textarea' && (
        <div className={formFieldClassName}>
          <Textarea
            className="w-full"
            data-cy={`uppgift-field-${field.field}`}
            {...register(name, validationRules)}
            rows={3}
            placeholder={field.formField.options?.placeholder}
          />
          {field.description && <p className={fieldDescriptionClassName}>{field.description}</p>}
          <ErrorMessage error={error} />
        </div>
      )}

      {field.formField.type === 'select' && (
        <div className={formFieldClassName}>
          <Select
            className="w-full"
            data-cy={`uppgift-field-${field.field}`}
            defaultValue={typeof field.value === 'string' ? field.value : ''}
            {...register(name, {
              ...validationRules,
              ...(isRequiredField ? { required: 'Vänligen välj ett alternativ.' } : {}),
            })}
          >
            <Select.Option value="">Välj</Select.Option>
            {field.formField.options.map((o, i) => (
              <Select.Option key={`${o.value}-${i}`} value={o.value}>
                {o.label}
              </Select.Option>
            ))}
          </Select>
          {field.description && <p className={fieldDescriptionClassName}>{field.description}</p>}
          <ErrorMessage error={error} />
        </div>
      )}

      {field.formField.type === 'combobox' && (
        <div className={formFieldClassName}>
          <Combobox
            className="w-full"
            data-cy={`${field.field}-combobox`}
            multiple={Array.isArray(field.value)}
            value={initialComboBoxValue}
            onSelect={(e) => handleChange(e.target.value)}
          >
            <Combobox.Input className="w-full" placeholder="Sök eller välj" />
            <Combobox.List>
              {options.map((option, index) => (
                <Combobox.Option
                  key={`${option.value}-${index}`}
                  value={option.value}
                  data-cy={`uppgift-field-${field.field}`}
                >
                  {option.label}
                </Combobox.Option>
              ))}
            </Combobox.List>
          </Combobox>
          {field.description && <p className={fieldDescriptionClassName}>{field.description}</p>}
          <ErrorMessage error={error} />
        </div>
      )}

      {field.formField.type === 'radio' && (
        <div className={formFieldClassName}>
          <RadioButton.Group
            inline={!isMaxMediumDevice && field.formField.options.length <= 3}
            data-cy={`uppgift-field-${field.field}`}
          >
            {field.formField.options.map((o, i) => (
              <RadioButton
                key={`${o.value}-${i}`}
                value={o.value}
                {...register(name, {
                  ...validationRules,
                  ...(isRequiredField && !validationRules.validate ?
                    { required: 'Vänligen välj ett alternativ.' }
                  : {}),
                })}
              >
                {o.label}
              </RadioButton>
            ))}
          </RadioButton.Group>
          {field.description && <p className={fieldDescriptionClassName}>{field.description}</p>}
          <ErrorMessage error={error} />
        </div>
      )}

      {field.formField.type === 'checkbox' && (
        <div className={formFieldClassName}>
          <Checkbox.Group
            data-cy={`uppgift-field-${field.field}`}
            direction="row"
            defaultValue={field.value as string[]}
          >
            {options.map((option, index) => (
              <Checkbox
                key={`${option.value}-${index}`}
                value={option.value}
                data-cy={`${field.field}-checkbox-${index}`}
                {...register(name)}
              >
                {option.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
          {field.description && <p className={fieldDescriptionClassName}>{field.description}</p>}
          <ErrorMessage error={error} />
        </div>
      )}

      {field.formField.type === 'date' && (
        <div className={formFieldClassName}>
          <DatePicker
            type="date"
            data-cy={`uppgift-field-${field.field}`}
            value={watch(name) ?? ''}
            onChange={(e) => {
              const selectedDate = e.target?.value ?? '';
              setValue(name, selectedDate, { shouldDirty: true });
              validateAndSetError(field, getValues, setError, clearErrors, name, selectedDate);
            }}
            className="w-full"
            aria-label={field.label}
          />
          {field.description && <p className={fieldDescriptionClassName}>{field.description}</p>}
          <ErrorMessage error={error} />
        </div>
      )}
    </FormControl>
  );
};
