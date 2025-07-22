import { FieldErrors } from 'react-hook-form';

export const scrollToFirstError = (errors: FieldErrors) => {
  const firstErrorField = Object.keys(errors)[0];
  const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
  if (errorElement && typeof errorElement.scrollIntoView === 'function') {
    errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    (errorElement as HTMLElement).focus();
  }
};
