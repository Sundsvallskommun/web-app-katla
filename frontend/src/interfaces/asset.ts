export type AssetStatus = 'ACTIVE' | 'DRAFT' | 'EXPIRED' | 'BLOCKED' | 'TEMPORARY' | 'REPLACED';
export enum assetStatusLabels {
  ACTIVE = 'Aktivt',
  DRAFT = 'Utkast',
  EXPIRED = 'Utgånget',
  BLOCKED = 'Blockerat',
  TEMPORARY = 'Tillfälligt',
  REPLACED = 'Ersatt',
}

export enum assetTypeLabels {
  PARKINGPERMIT = 'P-tillstånd',
}

/** Maps an asset status to a `@sk-web-gui` Label color token. */
export const assetStatusColors: Record<AssetStatus, string> = {
  ACTIVE: 'gronsta',
  DRAFT: 'tertiary',
  EXPIRED: 'tertiary',
  BLOCKED: 'warning',
  TEMPORARY: 'vattjom',
  REPLACED: 'tertiary',
};
/**
 * A schema-bound blob of structured data stored on an asset. `value` holds the
 * form data (validated against the schema identified by `schemaId`) and is what
 * we resolve into human-readable fields when displaying an asset.
 */
export interface AssetJsonParameter {
  key: string;
  value: Record<string, unknown>;
  schemaId: string;
}

export interface Asset {
  id: string;
  assetId: string;
  origin: string;
  partyId: string;
  caseReferenceIds: string[];
  type: string;
  issued: string;
  validTo: string;
  status: AssetStatus;
  statusReason: string;
  description: string;
  additionalParameters: { [key: string]: string };
  jsonParameters?: AssetJsonParameter[];
}

export interface UpdateAsset {
  caseReferenceIds: string[];
  validTo: string;
  status: AssetStatus;
  statusReason: string;
  additionalParameters: { [key: string]: string };
}
