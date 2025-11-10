import { FieldErrors } from 'react-hook-form';

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
