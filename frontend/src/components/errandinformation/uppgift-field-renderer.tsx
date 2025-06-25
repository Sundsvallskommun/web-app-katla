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
import { FieldErrors, get, useFormContext } from 'react-hook-form';
import { EXTRAPARAMETER_SEPARATOR, UppgiftField } from '@services/casedata-extra-parameters-service';
import { useEffect } from 'react';

export const UppgiftFieldRenderer: React.FC<{ field: UppgiftField }> = ({ field }) => {
  const {
    register,
    watch,
    setValue,
    getValues,
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
  //TODO: Implement error handling.
  const ErrorMessage = ({ error }: { error?: string }) =>
    error ? <span className="text-error text-md">{error}</span> : null;

  function getConditionalValidationRules(
    field: UppgiftField,
    watch: (field: string) => any
  ): { validate?: (value: any) => true | string } {
    if (!field.dependsOn) return {};

    const shouldValidate = field.dependsOn.some((dep) => {
      const depName = dep.field.replace(/\./g, EXTRAPARAMETER_SEPARATOR);
      const depValue = watch(depName);
      return depValue === dep.value;
    });

    if (!shouldValidate) return {};

    const message =
      field.dependsOn.find((dep) => dep.validationMessage)?.validationMessage || 'Detta fält är obligatoriskt';

    return {
      validate: (value: any) => (value !== undefined && value !== null && String(value).trim() !== '') || message,
    };
  }

  function validateAndSetError(
    field: UppgiftField,
    watch: (field: string) => any,
    setError: (name: string, error: { type: string; message?: string }) => void,
    name: string,
    value: any
  ) {
    const rules = getConditionalValidationRules(field, watch);
    if (rules.validate) {
      const result = rules.validate(value);
      if (result !== true) {
        setError(name, { type: 'manual', message: result });
      } else {
        clearErrors(name);
      }
    }
  }

  const validationRules = getConditionalValidationRules(field, watch);

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
          <RadioButton.Group inline={!isMaxMediumDevice} defaultValue={field.formField.options[0]?.value}>
            {field.formField.options.map((o, i) => (
              <RadioButton key={`${o.value}-${i}`} value={o.value} {...register(name, validationRules)}>
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
          <div className={`flex ${isMaxMediumDevice ? 'flex-col' : 'flex-row'} w-full gap-10`}>
            {field.formField.options.map((option, i) => {
              const raw = watch(name);
              const selectedValues = Array.isArray(raw) ? raw : [];
              const isChecked = selectedValues.includes(option.value);

              const handleChange = () => {
                const current = getValues(name);
                const currentValues = Array.isArray(current) ? current : [];
                const newValue =
                  isChecked ?
                    currentValues.filter((v: string) => v !== option.value)
                  : [...currentValues, option.value];

                setValue(name, newValue, { shouldDirty: true });
                validateAndSetError(field, watch, setError, name, newValue);
              };

              return (
                <Checkbox
                  key={`${option.value}-${i}`}
                  checked={isChecked}
                  onChange={handleChange}
                  value={option.value}
                  name={name}
                  className="flex items-center whitespace-nowrap"
                >
                  {option.label}
                </Checkbox>
              );
            })}
          </div>
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
              validateAndSetError(field, watch, setError, name, selectedDate);
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
