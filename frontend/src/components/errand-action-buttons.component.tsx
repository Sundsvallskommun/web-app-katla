'use client';

import { CancelRegistrationButton } from '@components/cancel-registration-button.component';
import { RegisterErrandButton } from '@components/errand-buttons/register-errand-button.component';
import { DraftErrandButton } from '@components/errand-buttons/save-draft-errand-button.component';
import { AppContext } from '@contexts/app-context-interface';
import { ErrandStatus } from '@interfaces/errand-status';
import { useContext } from 'react';

interface Props {
  className?: string;
}

export const ErrandActionButtons: React.FC<Props> = ({ className = '' }) => {
  const { errand } = useContext(AppContext);
  const draftErrand = errand?.status?.statusType === ErrandStatus.Utkast;
  const errandRegistredState = errand?.created === undefined || null;
  return (
    <div className={className}>
      {draftErrand ?
        <>
          <DraftErrandButton />
          <RegisterErrandButton />
        </>
      : errandRegistredState ?
        <>
          <CancelRegistrationButton />
          <DraftErrandButton />
          <RegisterErrandButton />
        </>
      : null}
    </div>
  );
};
