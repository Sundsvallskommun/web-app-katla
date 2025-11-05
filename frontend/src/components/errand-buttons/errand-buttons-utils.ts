import { FieldError, FieldErrors, UseFormClearErrors, UseFormSetError } from 'react-hook-form';

const VIRTUAL_APPLICANT_FIELD = '_applicant' as const;

const scrollToElementSmooth = (element: Element | null) => {
  if (element && typeof element.scrollIntoView === 'function') {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    (element as HTMLElement).focus();
  }
};

export const scrollToFirstError = (errors: FieldErrors) => {
  const firstErrorField = Object.keys(errors)[0];
  const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
  scrollToElementSmooth(errorElement);
};

export const scrollToElement = (selector: string) => {
  const element = document.querySelector(selector);
  scrollToElementSmooth(element);
};

export const setApplicantError = (setError: UseFormSetError<Record<string, unknown>>, message: string) => {
  setError(VIRTUAL_APPLICANT_FIELD as never, {
    type: 'manual',
    message,
  });
};

export const clearApplicantError = (clearErrors: UseFormClearErrors<Record<string, unknown>>) => {
  clearErrors(VIRTUAL_APPLICANT_FIELD as never);
};

export const getApplicantError = (errors: Record<string, unknown>): string | undefined => {
  const error = errors[VIRTUAL_APPLICANT_FIELD] as FieldError | undefined;
  return error?.message as string | undefined;
};
