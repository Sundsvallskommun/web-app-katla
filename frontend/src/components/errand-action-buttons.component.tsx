'use client';
import { CancelRegistrationButton } from '@components/cancel-registration-button.component';
import { RegisterErrandButton } from '@components/errand-buttons/register-errand-button.component';
import { DraftErrandButton } from '@components/errand-buttons/save-draft-errand-button.component';
import { CasedataOwnerOrContact } from '@interfaces/stakeholder';

interface Props {
  owners: CasedataOwnerOrContact[];
  className?: string;
}

export const ErrandActionButtons: React.FC<Props> = ({ owners, className = '' }) => {
  return (
    <div className={className}>
      <CancelRegistrationButton />
      <DraftErrandButton owners={owners} />
      <RegisterErrandButton owners={owners} />
    </div>
  );
};
