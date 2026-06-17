'use client';

import { Asset } from '@interfaces/asset';
import sanitized from '@services/sanitizer-service';
import { Label, Spinner } from '@sk-web-gui/react';
import { ResolvedField } from '@utils/schema-utils';
import { buildValidityText, statusColorOf, statusLabelOf } from './partyassets-utils';

const containsHtml = (value: string): boolean => /<[^>]+>/.test(value);

const Chips: React.FC<{ items: string[] }> = ({ items }) => (
  <div className="flex flex-wrap gap-6">
    {items.map((item, i) => (
      <span
        key={`${item}-${i}`}
        className="inline-flex items-center text-small bg-vattjom-background-200 rounded-full px-10 py-4"
      >
        {item}
      </span>
    ))}
  </div>
);

const FieldRow: React.FC<{ field: ResolvedField }> = ({ field }) => (
  <div>
    <div className="text-small font-bold text-dark-secondary mb-4">{field.label}</div>
    {field.items?.length ?
      <Chips items={field.items} />
    : containsHtml(field.value) ?
      <div className="text-base break-words [&_p]:m-0" dangerouslySetInnerHTML={{ __html: sanitized(field.value) }} />
    : <div className="text-base break-words whitespace-pre-wrap">{field.value}</div>}
  </div>
);

/**
 * Full read-only view of a single asset ("insats"): resource type heading,
 * status, validity and every resolved schema field plus any flat metadata.
 */
export const PartyAssetsDetail: React.FC<{
  asset: Asset;
  heading: string;
  fields: ResolvedField[];
  loading?: boolean;
}> = ({ asset, heading, fields, loading }) => {
  const validity = buildValidityText(asset);
  const additionalParameters = Object.entries(asset.additionalParameters ?? {}).filter(([, value]) => !!value);

  return (
    <div className="flex flex-col gap-20">
      <div>
        <h3 className="text-md font-bold mb-8">{heading}</h3>
        <div className="flex items-center gap-12 flex-wrap">
          {asset.status && (
            <Label rounded color={statusColorOf(asset.status)}>
              {statusLabelOf(asset.status)}
            </Label>
          )}
          {validity && <span className="text-small text-dark-secondary">Giltig {validity}</span>}
        </div>
      </div>

      {loading && !fields.length && (
        <div className="flex items-center gap-8 text-small text-dark-secondary">
          <Spinner size={2} aria-label="Hämtar detaljer" />
          Hämtar detaljer …
        </div>
      )}

      {fields.map((field) => (
        <FieldRow key={field.key} field={field} />
      ))}

      {asset.description && <FieldRow field={{ key: 'description', label: 'Beskrivning', value: asset.description }} />}
      {asset.statusReason && <FieldRow field={{ key: 'statusReason', label: 'Orsak', value: asset.statusReason }} />}
      {additionalParameters.map(([key, value]) => (
        <FieldRow key={key} field={{ key, label: key, value }} />
      ))}
    </div>
  );
};
