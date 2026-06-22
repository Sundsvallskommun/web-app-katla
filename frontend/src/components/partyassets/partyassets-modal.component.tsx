'use client';

import { Asset } from '@interfaces/asset';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, Modal, Spinner, useThemeQueries } from '@sk-web-gui/react';
import { useEffect, useMemo, useState } from 'react';
import { useResolvedAssets } from '@hooks/use-resolved-assets';
import { PartyAssetsDetail } from './partyassets-detail.component';
import { PartyAssetsRow } from './partyassets-row.component';
import { assetHeading, buildStatusTabs, sortAssets, StatusFilter } from './partyassets-utils';

const PANE_HEIGHT = 'max-h-[72vh] overflow-y-auto';

/**
 * Master–detail view of all of a person's assets ("insatser"): status tabs, a
 * selectable list and a detail pane for the selected insats. On small screens
 * the list and detail are shown one at a time with a back action.
 */
export const PartyAssetsModal: React.FC<{
  assets: Asset[];
  loading: boolean;
  error: boolean;
  name: string;
  show: boolean;
  onClose: () => void;
}> = ({ assets, loading, error, name, show, onClose }) => {
  const { isMaxMediumDevice } = useThemeQueries();
  const { fieldsById, loading: fieldsLoading } = useResolvedAssets(show ? assets : []);

  const [statusTab, setStatusTab] = useState<StatusFilter>('ALL');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDetailOnMobile, setShowDetailOnMobile] = useState(false);

  const tabs = useMemo(() => buildStatusTabs(assets), [assets]);
  const listAssets = useMemo(
    () => sortAssets(statusTab === 'ALL' ? assets : assets.filter((asset) => asset.status === statusTab)),
    [assets, statusTab]
  );

  // Reset to the first item (and the list view on mobile) whenever the tab changes.
  useEffect(() => {
    setSelectedId(listAssets[0]?.id ?? null);
    setShowDetailOnMobile(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusTab]);

  // Start on the "Alla" tab each time the modal is opened.
  useEffect(() => {
    if (show) setStatusTab('ALL');
  }, [show]);

  const selectedAsset = listAssets.find((asset) => asset.id === selectedId) ?? listAssets[0] ?? null;

  const selectAsset = (id: string) => {
    setSelectedId(id);
    setShowDetailOnMobile(true);
  };

  const headingFor = (asset: Asset) => assetHeading(asset, fieldsById[asset.id] ?? []);

  const list = (
    <ul className="flex flex-col gap-8 list-none p-0 m-0" aria-label="Insatser">
      {listAssets.map((asset) => (
        <li key={asset.id}>
          <PartyAssetsRow
            asset={asset}
            heading={headingFor(asset)}
            selected={asset.id === selectedAsset?.id}
            onSelect={() => selectAsset(asset.id)}
          />
        </li>
      ))}
    </ul>
  );

  const detail =
    selectedAsset ?
      <PartyAssetsDetail
        asset={selectedAsset}
        heading={headingFor(selectedAsset)}
        fields={fieldsById[selectedAsset.id] ?? []}
        loading={fieldsLoading}
      />
    : <p className="text-dark-secondary italic">Välj en insats för att se detaljer.</p>;

  const tabBar = (
    <div role="tablist" aria-label="Filtrera insatser på status" className="flex gap-8 flex-wrap mb-16">
      {tabs.map(({ key, label, count }) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={statusTab === key}
          data-cy={`asset-tab-${key.toLowerCase()}`}
          onClick={() => setStatusTab(key)}
          className={`px-12 py-6 rounded-12 text-small whitespace-nowrap ${
            statusTab === key ?
              'bg-vattjom-background-200 text-dark-primary font-semibold'
            : 'text-dark-secondary hover:bg-background-200'
          }`}
        >
          {label} ({count})
        </button>
      ))}
    </div>
  );

  const body = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-40">
          <Spinner size={4} aria-label="Hämtar insatser" />
        </div>
      );
    }
    if (error) {
      return (
        <p className="text-error py-16" role="alert">
          Insatserna kunde inte hämtas. Försök igen senare.
        </p>
      );
    }
    if (!assets.length) {
      return <p className="text-dark-secondary italic py-16">Inga insatser hittades.</p>;
    }

    if (isMaxMediumDevice) {
      return (
        <div>
          {tabBar}
          {showDetailOnMobile ?
            <div>
              <Button
                variant="tertiary"
                size="sm"
                className="mb-12"
                leftIcon={<LucideIcon name="arrow-left" size={16} />}
                onClick={() => setShowDetailOnMobile(false)}
              >
                Tillbaka till listan
              </Button>
              {detail}
            </div>
          : list}
        </div>
      );
    }

    return (
      <div>
        {tabBar}
        <div className="flex gap-20">
          <div className={`w-[22rem] shrink-0 border-r border-divider pr-12 ${PANE_HEIGHT}`}>{list}</div>
          <div className={`flex-1 pl-4 ${PANE_HEIGHT}`}>{detail}</div>
        </div>
      </div>
    );
  };

  return (
    <Modal
      show={show}
      onClose={onClose}
      label={name ? `Insatser – ${name}` : 'Insatser'}
      className="w-full max-w-[96rem]"
    >
      <Modal.Content>{body()}</Modal.Content>
    </Modal>
  );
};
