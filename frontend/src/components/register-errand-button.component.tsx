'use client';
import { AppContext } from '@contexts/app-context-interface';
import { IErrand } from '@interfaces/errand';
import { CasedataOwnerOrContact } from '@interfaces/stakeholder';
import { getErrand, saveErrand } from '@services/casedata-errand-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, Dialog, Spinner, useSnackbar } from '@sk-web-gui/react';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { useFormContext, UseFormReturn } from 'react-hook-form';

export const RegisterErrandButton: React.FC<{ owners: CasedataOwnerOrContact[] }> = ({ owners }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toastMessage = useSnackbar();
  const router = useRouter();
  const { municipalityId, setErrand, isLoading, setIsLoading } = useContext(AppContext);

  const {
    getValues,
    formState: { errors },
  }: UseFormReturn<IErrand, any, undefined> = useFormContext();

  const openHandler = () => {
    setIsOpen(!isOpen);
  };

  const onSubmit = () => {
    setIsLoading(true);
    const data: IErrand = getValues();
    data.stakeholders = owners;
    return saveErrand(data, municipalityId).then(async (res) => {
      if (!res.errandSuccessful) {
        throw new Error('Errand could not be registered');
      }

      if (res.errandId) {
        const e = await getErrand(municipalityId, res.errandId);
        if (e.errand) {
          setErrand(e.errand);
          router.push(`/arende/${municipalityId}/${e.errand.errandNumber}`);
        }
        toastMessage({
          position: 'bottom',
          closeable: false,
          message: 'Ärendet sparades',
          status: 'success',
        });
      }
      setIsLoading(false);
      openHandler();
      return true;
    });
  };
  return (
    <>
      <Button variant="primary" color="vattjom" onClick={openHandler}>
        Registrera ärende
      </Button>
      <Dialog className="max-w-[36rem]" show={isOpen}>
        <Dialog.Content className="flex flex-col items-center justify-center text-center">
          <LucideIcon color="vattjom" name="inbox" size={32} />
          <div className="text-h4">Registrera ärende</div>
          <div>
            När du registrerar ett ärende, kommer det automatiskt att placeras under kategorin &apos;Inkomna
            ärende&apos;. Därefter blir ärendet tillgängligt för alla behäriga medarbetare inom din verksamhet.
          </div>
          <p>Vill du fortsätta med registreringen?</p>
        </Dialog.Content>
        <Dialog.Buttons className="flex justify-center gap-7">
          <Button className="w-[12.8rem]" variant="secondary" onClick={openHandler}>
            Nej
          </Button>
          <Button
            className="w-[12.8rem]"
            variant="primary"
            onClick={() => onSubmit()}
            disabled={isLoading}
            rightIcon={isLoading ? <Spinner size={2} /> : undefined}
          >
            Ja
          </Button>
        </Dialog.Buttons>
      </Dialog>
    </>
  );
};
