'use client';

import { usePartyAssets } from '@services/partyassets-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, Spinner } from '@sk-web-gui/react';
import { useState } from 'react';
import { PartyAssetsModal } from './partyassets-modal.component';

/**
 * Compact "Insatser" summary for a person card: shows active/total counts and a
 * button that opens the full insatser view in a modal. Keeps the card clean by
 * moving the list and details into a dedicated, spacious surface.
 */
export const PartyAssetsSection: React.FC<{ partyId: string; name?: string }> = ({ partyId, name }) => {
  const { assets, loading, error } = usePartyAssets(partyId);
  const [showModal, setShowModal] = useState(false);

  const total = assets.length;
  const activeCount = assets.filter((asset) => asset.status === 'ACTIVE').length;

  const action = () => {
    if (loading) {
      return <Spinner size={2} aria-label="Hämtar insatser" />;
    }
    if (error) {
      return (
        <span className="text-small text-error" role="alert">
          Insatserna kunde inte hämtas
        </span>
      );
    }
    if (total === 0) {
      return <span className="text-small text-dark-secondary italic">Inga insatser</span>;
    }
    return (
      <Button
        type="button"
        size="sm"
        variant="secondary"
        color="vattjom"
        data-cy="show-assets-button"
        rightIcon={<LucideIcon name="arrow-right" size={16} />}
        onClick={() => setShowModal(true)}
      >
        Visa insatser
      </Button>
    );
  };

  return (
    <div className="mt-12 pt-12 pb-20 border-t-1">
      <div className="flex items-center justify-between gap-12 flex-wrap">
        <div className="flex items-center gap-8">
          <LucideIcon name="list-checks" size={18} />
          <span className="font-semibold">Insatser</span>
          {!loading && !error && total > 0 && (
            <span className="text-small text-dark-secondary">
              {activeCount} aktiva · {total} totalt
            </span>
          )}
        </div>

        {action()}
      </div>

      <PartyAssetsModal
        assets={assets}
        loading={loading}
        error={error}
        name={name ?? ''}
        show={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};
