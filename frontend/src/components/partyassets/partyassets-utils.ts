import { Asset, AssetStatus, assetStatusColors, assetStatusLabels, assetTypeLabels } from '@interfaces/asset';
import { ResolvedField } from '@utils/schema-utils';
import dayjs from 'dayjs';

/** Schema field key that holds the asset's resource type ("Restyp"). */
const RESTYP_FIELD = 'type';

export type StatusFilter = 'ALL' | AssetStatus;

export const formatDate = (value?: string): string => {
  if (!value) return '';
  const date = dayjs(value);
  return date.isValid() ? date.format('YYYY-MM-DD') : value;
};

/**
 * Compact validity text: a date range when time-limited, otherwise "fr.o.m." the
 * start date (open-ended). Empty when no dates are set.
 */
export const buildValidityText = (asset: Pick<Asset, 'issued' | 'validTo'>): string => {
  const from = formatDate(asset.issued);
  const to = formatDate(asset.validTo);
  if (from && to) return `${from} – ${to}`;
  if (from) return `fr.o.m. ${from}`;
  return '';
};

export const statusLabelOf = (status: Asset['status']): string =>
  assetStatusLabels[status as keyof typeof assetStatusLabels] ?? status;

export const statusColorOf = (status: Asset['status']): string => assetStatusColors[status] ?? 'tertiary';

/**
 * Card/modal heading: the resolved "Restyp" value when available, otherwise the
 * asset's type label, falling back to a generic word.
 */
export const assetHeading = (asset: Asset, fields: ResolvedField[]): string => {
  const restyp = fields.find((field) => field.key === RESTYP_FIELD)?.value;
  if (restyp) return restyp;
  return assetTypeLabels[asset.type as keyof typeof assetTypeLabels] ?? asset.type ?? 'Insats';
};

/** Active assets first, then newest first (by issued/valid-from date). */
export const sortAssets = (assets: Asset[]): Asset[] =>
  [...assets].sort((a, b) => {
    const activeRank = (status: Asset['status']) => (status === 'ACTIVE' ? 0 : 1);
    const rankDiff = activeRank(a.status) - activeRank(b.status);
    if (rankDiff !== 0) return rankDiff;
    // ISO dates (YYYY-MM-DD) sort correctly as strings; descending for newest first.
    return (b.issued ?? '').localeCompare(a.issued ?? '');
  });

/** Status tabs with counts: "Alla" plus each status that has at least one asset. */
export const buildStatusTabs = (assets: Asset[]): { key: StatusFilter; label: string; count: number }[] => {
  // DRAFT is intentionally omitted: drafts are filtered out before reaching here.
  const statuses: AssetStatus[] = ['ACTIVE', 'TEMPORARY', 'EXPIRED', 'BLOCKED', 'REPLACED'];
  const tabs: { key: StatusFilter; label: string; count: number }[] = [
    { key: 'ALL', label: 'Alla', count: assets.length },
  ];
  for (const status of statuses) {
    const count = assets.filter((asset) => asset.status === status).length;
    if (count > 0) tabs.push({ key: status, label: assetStatusLabels[status], count });
  }
  return tabs;
};
