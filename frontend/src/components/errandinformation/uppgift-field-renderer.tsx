import {
  Checkbox,
  DatePicker,
  FormControl,
  FormLabel,
  Input,
  RadioButton,
  Select,
  Textarea,
  useThemeQueries,
} from '@sk-web-gui/react';
import { Controller, get, useFormContext } from 'react-hook-form';
import { EXTRAPARAMETER_SEPARATOR, UppgiftField } from '@services/casedata-extra-parameters-service';
import { useEffect } from 'react';

export const UppgiftFieldRenderer: React.FC<{ field: UppgiftField }> = ({ field }) => {
  const {
    register,
    watch,
    setValue,
    getValues,
    control,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const name = field.field.replace(/\./g, EXTRAPARAMETER_SEPARATOR);
  const error = get(errors, name)?.message;
  const fieldValue = watch(name);
  const { isMaxMediumDevice } = useThemeQueries();

  const dependentSatisfied = field.dependsOn?.every((dep) => {
    const depName = dep.field.replace(/\./g, EXTRAPARAMETER_SEPARATOR);
    const depValue = watch(depName);
    return Array.isArray(depValue) ? depValue.includes(dep.value) : depValue === dep.value;
  });

  useEffect(() => {
    if (fieldValue === undefined && field.value !== undefined) {
      const valueToSet =
        Array.isArray(field.value) ? field.value
        : typeof field.value === 'string' && field.value.trim() !== '' ? field.value
        : undefined;

      if (valueToSet !== undefined) {
        setValue(name, valueToSet, { shouldDirty: false });
      }
    }
  }, [field.value, fieldValue, name, setValue]);

  if (field.dependsOn && !dependentSatisfied) {
    return null;
  }

  const formFieldClassName = 'flex flex-col w-full pt-10';
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
        const shouldValidate = field.dependsOn?.some((dep) => {
          const depName = dep.field.replace(/\./g, EXTRAPARAMETER_SEPARATOR);
          const depValue = allValues[depName];
          return Array.isArray(depValue) ? depValue.includes(dep.value) : depValue === dep.value;
        });

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

  return (
    <FormControl className="flex flex-col gap-2 items-start justify-start max-w-[80rem] w-full">
      <FormLabel className="self-stretch justify-center text-dark-primary text-md leading-24 ">{field.label}</FormLabel>

      {field.formField.type === 'text' && (
        <div className={formFieldClassName}>
          <Input
            className="w-full"
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
          <Select className="w-full" {...register(name, validationRules)}>
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

      {field.formField.type === 'radio' && (
        <div className={formFieldClassName}>
          <RadioButton.Group inline={!isMaxMediumDevice}>
            {field.formField.options.map((o, i) => (
              <RadioButton
                key={`${o.value}-${i}`}
                value={o.value}
                {...register(name, {
                  ...validationRules,
                  required: 'Vänligen välj ett alternativ.',
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

      {field.formField.type === 'checkbox' && 'options' in field.formField && (
        <div className={formFieldClassName}>
          <Controller
            name={name}
            control={control}
            rules={{
              ...validationRules,
              validate: (value: unknown) => {
                const hasSelection = Array.isArray(value) && value.length > 0;
                const conditionalValidation = getConditionalValidationRules(field, getValues).validate;

                if (conditionalValidation) {
                  const conditionalResult = conditionalValidation(value);
                  if (conditionalResult !== true) return conditionalResult;
                }

                return hasSelection ? true : 'Vänligen välj minst ett alternativ.';
              },
            }}
            render={({ field: controllerField }) => (
              <Checkbox.Group
                value={controllerField.value || []}
                onChange={(val) => {
                  controllerField.onChange(val);
                  validateAndSetError(field, getValues, setError, clearErrors, name, val);
                }}
                direction={isMaxMediumDevice ? 'column' : 'row'}
              >
                {(field.formField as { options: { label: string; value: string }[] }).options.map((option, i) => (
                  <Checkbox key={`${option.value}-${i}`} value={option.value}>
                    {option.label}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            )}
          />
          {field.description && <p className={fieldDescriptionClassName}>{field.description}</p>}
          <ErrorMessage error={error} />
        </div>
      )}

      {field.formField.type === 'date' && (
        <div className={formFieldClassName}>
          <DatePicker
            type="date"
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
