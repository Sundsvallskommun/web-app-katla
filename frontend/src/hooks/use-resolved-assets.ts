'use client';

import { Asset } from '@interfaces/asset';
import { getFormSchema } from '@services/jsonschema-service';
import { resolveSchemaFields, ResolvedField } from '@utils/schema-utils';
import { useEffect, useState } from 'react';

const resolveAssetFields = async (asset: Asset): Promise<ResolvedField[]> => {
  const perParameter = await Promise.all(
    (asset.jsonParameters ?? []).map(async (param) => {
      try {
        const { schema, uiSchema } = await getFormSchema(param.schemaId);
        return resolveSchemaFields(schema, uiSchema, param.value);
      } catch {
        return resolveSchemaFields(null, null, param.value);
      }
    })
  );
  return perParameter.flat();
};

/**
 * Loads schemas for every asset's json parameters and resolves their stored
 * values into human-readable fields, keyed by asset id. Schema fetches are
 * deduplicated/cached, so assets sharing a schema only fetch it once. When a
 * schema can't be loaded the raw values are still resolved, so data is never
 * silently dropped.
 */
export const useResolvedAssets = (
  assets: Asset[]
): { fieldsById: Record<string, ResolvedField[]>; loading: boolean } => {
  const [fieldsById, setFieldsById] = useState<Record<string, ResolvedField[]>>({});
  const [loading, setLoading] = useState(false);

  const key = assets.map((asset) => asset.id).join(',');

  useEffect(() => {
    const withParameters = assets.filter((asset) => asset.jsonParameters?.length);
    if (!withParameters.length) {
      setFieldsById({});
      return;
    }

    let cancelled = false;
    setLoading(true);

    Promise.all(withParameters.map(async (asset) => [asset.id, await resolveAssetFields(asset)] as const)).then(
      (entries) => {
        if (cancelled) return;
        setFieldsById(Object.fromEntries(entries));
        setLoading(false);
      }
    );

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { fieldsById, loading };
};
