'use client';

import { Asset } from '@interfaces/asset';
import { Label } from '@sk-web-gui/react';
import { buildValidityText, statusColorOf, statusLabelOf } from './partyassets-utils';

export const PartyAssetsRow: React.FC<{
  heading: string;
  asset: Asset;
  selected: boolean;
  onSelect: () => void;
}> = ({ heading, asset, selected, onSelect }) => {
  const validity = buildValidityText(asset);

  return (
    <button
      type="button"
      data-cy="asset-row"
      onClick={onSelect}
      aria-current={selected}
      className={`w-full text-left p-12 rounded-12 border-1 transition-colors ${
        selected ?
          'bg-vattjom-background-200 border-vattjom-surface-primary'
        : 'bg-background-content hover:bg-background-200'
      }`}
    >
      <span className="block font-semibold truncate">{heading}</span>
      {asset.status && (
        <Label rounded color={statusColorOf(asset.status)} className="mt-4">
          {statusLabelOf(asset.status)}
        </Label>
      )}
      {validity && <p className="text-small text-dark-secondary mt-4">Giltig {validity}</p>}
    </button>
  );
};
