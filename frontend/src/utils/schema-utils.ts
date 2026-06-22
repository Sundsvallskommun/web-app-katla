type JsonSchema = Record<string, unknown>;
type OneOf = Array<{ const?: string; title?: string }>;

export interface ResolvedField {
  key: string;
  label: string;
  /** Display string (enum/array values joined). Always set. */
  value: string;
  /** Present for array/enum-list fields so they can be rendered as chips. */
  items?: string[];
}

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : undefined;

const propertyOf = (schema: JsonSchema | null, field: string): Record<string, unknown> | undefined =>
  asRecord(asRecord(schema?.properties)?.[field]);

/** The `oneOf` enum options of a (possibly array-item) field, if any. */
const oneOfOf = (fieldSchema: Record<string, unknown> | undefined, fromItems: boolean): OneOf | undefined => {
  const source = fromItems ? asRecord(fieldSchema?.items) : fieldSchema;
  return source?.oneOf as OneOf | undefined;
};

/** Resolve a single enum value to its schema title, falling back to the raw value. */
export function enumTitleOf(schema: JsonSchema | null, field: string, value: string): string {
  if (!schema || !value) return value ?? '';
  const oneOf = oneOfOf(propertyOf(schema, field), false);
  return oneOf?.find((o) => o.const === value)?.title ?? value;
}

/** Resolve an array of enum values to their schema titles. */
export function enumTitlesOfArray(schema: JsonSchema | null, field: string, values: string[] = []): string[] {
  const oneOf = oneOfOf(propertyOf(schema, field), true);
  if (!oneOf) return values ?? [];
  return (values ?? []).map((v) => oneOf.find((o) => o.const === v)?.title ?? v);
}

const isEmpty = (value: unknown): boolean =>
  value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0);

const labelOf = (schema: JsonSchema | null, uiSchema: JsonSchema | null, key: string): string => {
  const uiTitle = asRecord(uiSchema?.[key])?.['ui:title'];
  if (typeof uiTitle === 'string' && uiTitle) return uiTitle;
  const schemaTitle = propertyOf(schema, key)?.title;
  return typeof schemaTitle === 'string' && schemaTitle ? schemaTitle : key;
};

const resolveValue = (schema: JsonSchema | null, key: string, value: unknown): { value: string; items?: string[] } => {
  if (Array.isArray(value)) {
    const items = enumTitlesOfArray(
      schema,
      key,
      value.map((v) => String(v))
    );
    return { value: items.join(', '), items };
  }
  if (typeof value === 'boolean') return { value: value ? 'Ja' : 'Nej' };
  if (value && typeof value === 'object') return { value: JSON.stringify(value) };
  return { value: enumTitleOf(schema, key, String(value)) };
};

/**
 * Resolve a `jsonParameter.value` blob into an ordered list of human-readable
 * fields using its schema (labels + enum titles) and ui-schema (`ui:order`,
 * `ui:title`). Empty values are skipped. Falls back to raw keys/values when the
 * schema is missing, so data is always shown even without a resolvable schema.
 */
export function resolveSchemaFields(
  schema: JsonSchema | null,
  uiSchema: JsonSchema | null,
  data: Record<string, unknown> | null | undefined
): ResolvedField[] {
  if (!data) return [];

  const order = uiSchema?.['ui:order'];
  const orderedKeys = Array.isArray(order) ? (order as string[]).filter((k) => k in data) : [];
  const remainingKeys = Object.keys(data).filter((k) => !orderedKeys.includes(k));

  return [...orderedKeys, ...remainingKeys]
    .filter((key) => !isEmpty(data[key]))
    .map((key) => ({
      key,
      label: labelOf(schema, uiSchema, key),
      ...resolveValue(schema, key, data[key]),
    }));
}
