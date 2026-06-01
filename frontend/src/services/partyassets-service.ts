'use client';

import { Asset } from '@interfaces/asset';
import { ApiResponse, apiService } from '@services/api-service';
import { useCallback, useEffect, useState } from 'react';

/**
 * Assets in `DRAFT` status are being worked on in another errand and must never
 * be shown here. The PartyAssets `/assets` endpoint already omits them, but we
 * guard defensively in case that ever changes.
 */
const DRAFT_STATUS = 'DRAFT';

export interface PartyAssetsState {
  assets: Asset[];
  loading: boolean;
  error: boolean;
}

/**
 * Fetch the assets ("insatser") registered for a given party/person.
 *
 * @param partyId The party (person) identifier, i.e. the `personId` resolved
 *   through the citizen search. Returns an empty list when missing.
 */
export const getPartyAssets = async (partyId: string): Promise<Asset[]> => {
  if (!partyId) {
    return [];
  }

  const res = await apiService.get<ApiResponse<Asset[]>>(`partyassets/assets/${partyId}`);
  return (res.data.data ?? []).filter((asset) => (asset.status as string) !== DRAFT_STATUS);
};

/**
 * React hook that loads a party's assets and tracks loading/error state.
 * Re-fetches whenever `partyId` changes.
 */
export const usePartyAssets = (partyId?: string): PartyAssetsState & { refetch: () => void } => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchAssets = useCallback(async () => {
    if (!partyId) {
      setAssets([]);
      return;
    }

    setLoading(true);
    setError(false);

    try {
      setAssets(await getPartyAssets(partyId));
    } catch {
      setError(true);
      setAssets([]);
    } finally {
      setLoading(false);
    }
  }, [partyId]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return { assets, loading, error, refetch: fetchAssets };
};
