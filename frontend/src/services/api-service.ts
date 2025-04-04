'use client';

import axios, { AxiosError } from 'axios';

export interface Data {
  error?: string;
}

export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
}

export const handleError = (error: AxiosError<ApiResponse>) => {
  //TODO: Refactor to be more compliant with NextJS routing standards
  if (error?.response?.status === 401 && !window?.location.pathname.includes('login')) {
    window.location.href = `/login?path=${window.location.pathname}&failMessage=${error.response.data.message}`;
  }

  throw error;
};

const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const get = <T>(url: string) =>
  axios.get<T>(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, defaultOptions).catch(handleError);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const post = <T, U>(url: string, data: U, customOptions: { [key: string]: any } = {}) => {
  return axios
    .post<T>(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, data, { ...defaultOptions, ...customOptions })
    .catch(handleError);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const patch = <T, U>(url: string, data: U, customOptions: { [key: string]: any } = {}) => {
  return axios
    .patch<T>(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, data, { ...defaultOptions, ...customOptions })
    .catch(handleError);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const put = <T, U>(url: string, data: U, customOptions: { [key: string]: any } = {}) => {
  return axios
    .put<T>(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, data, { ...defaultOptions, ...customOptions })
    .catch(handleError);
};

const deleteRequest = <T>(url: string) => {
  return axios.delete<T>(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, defaultOptions).catch(handleError);
};

export const apiService = { get, post, patch, put, deleteRequest };
