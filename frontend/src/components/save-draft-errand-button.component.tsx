'use client';
import { AppContext } from '@contexts/app-context-interface';
import { IErrand } from '@interfaces/errand';
import { ErrandStatus } from '@interfaces/errand-status';
import { CasedataOwnerOrContact } from '@interfaces/stakeholder';
import { getErrand, saveErrand } from '@services/casedata-errand-service';
import { Button, Spinner, useSnackbar } from '@sk-web-gui/react';
import { useContext } from 'react';
import { useFormContext, UseFormReturn } from 'react-hook-form';

export const DraftErrandButton: React.FC<{ owners: CasedataOwnerOrContact[] }> = ({ owners }) => {
  const toastMessage = useSnackbar();
  const { municipalityId, setErrand, isLoading, setIsLoading } = useContext(AppContext);

  const {
    getValues,
    formState: { errors },
  }: UseFormReturn<IErrand, any, undefined> = useFormContext();

  const onSubmit = () => {
    setIsLoading(true);
    const data: IErrand = getValues();
    data.stakeholders = owners;
    data.status = data.status || {};
    data.status.statusType = ErrandStatus.Utkast;
    delete (data as any).errandNumber;
    delete (data as any).channel;

    return saveErrand(data, municipalityId).then(async (res) => {
      if (!res.errandSuccessful) {
        throw new Error('Errand could not be registered');
      }
      if (res.errandId) {
        const e = await getErrand(municipalityId, res.errandId);
        if (e.errand) {
          setErrand(e.errand);
        }
        toastMessage({
          position: 'bottom',
          closeable: false,
          message: 'Ärendet sparades',
          status: 'success',
        });
      }
      setIsLoading(false);
      return true;
    });
  };

  return (
    <>
      <Button
        variant="primary"
        onClick={() => onSubmit()}
        disabled={isLoading}
        rightIcon={isLoading ? <Spinner size={2} /> : undefined}
      >
        Spara ärende
      </Button>
    </>
  );
};
