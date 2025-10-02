'use client';

import { CancelRegistrationButton } from '@components/cancel-registration-button.component';
import { RegisterErrandButton } from '@components/errand-buttons/register-errand-button.component';
import { DraftErrandButton } from '@components/errand-buttons/save-draft-errand-button.component';
import { AppContext } from '@contexts/app-context-interface';
import { ErrandStatus } from '@interfaces/errand-status';
import { CasedataOwnerOrContact } from '@interfaces/stakeholder';
import { useContext } from 'react';
import { SaveErrandButton } from './errand-buttons/save-errand-button.component';

interface Props {
  owners: CasedataOwnerOrContact[];
  className?: string;
}

export const ErrandActionButtons: React.FC<Props> = ({ owners, className = '' }) => {
  const { errand } = useContext(AppContext);
  const draftErrand = errand?.status?.statusType === ErrandStatus.Utkast;
  const errandRegistredState = errand?.created === undefined || null;
  return (
    <div className={className}>
      {draftErrand ?
        <>
          <SaveErrandButton owners={owners} />
          <RegisterErrandButton owners={owners} />
        </>
      : errandRegistredState ?
        <>
          <CancelRegistrationButton />
          <DraftErrandButton owners={owners} />
          <RegisterErrandButton owners={owners} />
        </>
      : null}
    </div>
  );
};
