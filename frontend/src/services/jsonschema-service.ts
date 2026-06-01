'use client';

import { ApiResponse, apiService } from '@services/api-service';

/** A JSON Schema document and its optional ui-schema, as returned by the backend. */
export interface FormSchema {
  schema: Record<string, unknown>;
  uiSchema: Record<string, unknown>;
  schemaId: string;
}

/**
 * Schemas are immutable per id, so we cache the in-flight/resolved promise per
 * `schemaId` to avoid refetching the same schema for every asset that uses it.
 */
const schemaCache = new Map<string, Promise<FormSchema>>();

/**
 * Fetch (and cache) a JSON schema by id. Used to resolve the labels and enum
 * titles of an asset's `jsonParameters`.
 */
export const getFormSchema = (schemaId: string): Promise<FormSchema> => {
  const cached = schemaCache.get(schemaId);
  if (cached) {
    return cached;
  }

  const promise = apiService
    .get<ApiResponse<FormSchema>>(`schemas/${schemaId}`)
    .then((res) => res.data.data)
    .catch((e) => {
      schemaCache.delete(schemaId);
      throw e;
    });

  schemaCache.set(schemaId, promise);
  return promise;
};
