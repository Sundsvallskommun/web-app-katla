import React from 'react';
import { hasRepeatableGroup, UppgiftFieldExtended } from '@services/casedata-extra-parameters-service';

export type RenderComponents = {
  RepeatableFieldGroup: React.ComponentType<any>;
  UppgiftFieldRenderer: React.ComponentType<{ field: UppgiftFieldExtended }>;
};

export function buildRenderableFields(
  fields: UppgiftFieldExtended[],
  { RepeatableFieldGroup, UppgiftFieldRenderer }: RenderComponents
): React.ReactNode[] {
  if (!fields || fields.length === 0) return [];

  // map fieldName -> first index (stabiliserar lookup)
  const indexMap = new Map<string, number>();
  for (let i = 0; i < fields.length; i++) {
    if (!indexMap.has(fields[i].field)) indexMap.set(fields[i].field, i);
  }

  const done = new Set<string>();
  const items: React.ReactNode[] = [];

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    if (done.has(field.field)) continue;

    if (hasRepeatableGroup(field)) {
      done.add(field.field);
      const g = field.repeatableGroup!;
      items.push(
        <RepeatableFieldGroup
          key={`repeatable-${field.field}`}
          groupName={g.groupName}
          basePath={g.basePath}
          fields={g.fields}
          minItems={g.repeatableConfig.minItems}
          addButtonText={g.repeatableConfig.addButtonText}
          removeButtonText={g.repeatableConfig.removeButtonText}
          initialData={field.initialData}
        />
      );
      continue;
    }

    if (field.pairWith) {
      const pairedIndex = indexMap.get(field.pairWith);
      if (pairedIndex !== undefined && !done.has(field.pairWith)) {
        done.add(field.field);
        done.add(field.pairWith);
        const pairedField = fields[pairedIndex];
        items.push(
          <div key={`pair-${field.field}`} className="grid grid-cols-2 gap-16 w-full">
            <div className="min-w-0">
              <UppgiftFieldRenderer field={field} />
            </div>
            <div className="min-w-0">
              <UppgiftFieldRenderer field={pairedField} />
            </div>
          </div>
        );
        continue;
      }
    }

    done.add(field.field);
    items.push(<UppgiftFieldRenderer key={field.field} field={field} />);
  }

  return items;
}
