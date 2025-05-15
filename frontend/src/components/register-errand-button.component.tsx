'use client';
import { AppContext } from '@contexts/app-context-interface';
import { Channels } from '@interfaces/channels';
import { IErrand } from '@interfaces/errand';
import { ErrandStatus } from '@interfaces/errand-status';
import { CasedataOwnerOrContact } from '@interfaces/stakeholder';
import { editAttachment, sendAttachments } from '@services/casedata-attachment-service';
import { getErrand, saveErrand } from '@services/casedata-errand-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, Dialog, Spinner, UploadFile, useSnackbar } from '@sk-web-gui/react';
import { prepareAttachmentsForSubmit } from '@utils/prepare-attachments';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { useFormContext, UseFormReturn } from 'react-hook-form';

export const RegisterErrandButton: React.FC<{ owners: CasedataOwnerOrContact[] }> = ({ owners }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toastMessage = useSnackbar();
  const router = useRouter();
  const { municipalityId, setErrand, isLoading, setIsLoading } = useContext(AppContext);

  const { getValues }: UseFormReturn<IErrand, unknown, undefined> = useFormContext();

  const openHandler = () => {
    setIsOpen(!isOpen);
  };

  const onSubmit = async () => {
    setIsLoading(true);

    const data = getValues() as IErrand & { attachments: UploadFile[] };
    const { newAttachments, existingAttachments } = prepareAttachmentsForSubmit(data.attachments || []);

    console.log('data', data);

    data.channel = Channels.WEB_UI; //Change to correct channel when available
    data.stakeholders = owners;
    data.status = {
      statusType: ErrandStatus.ArendeInkommit,
    };

    try {
      const res = await saveErrand(data, municipalityId);
      if (!res.errandSuccessful) {
        throw new Error('Errand could not be registered');
      }

      if (res.errandId) {
        const e = await getErrand(municipalityId, res.errandId);
        if (e.errand && e.errand.errandNumber) {
          // Hantera nya bilagor
          if (newAttachments.length > 0) {
            await sendAttachments(
              municipalityId,
              e.errand.id,
              e.errand.errandNumber,
              newAttachments
                .filter((attachment) => attachment.meta.category)
                .map((attachment) => ({
                  type: attachment.meta.category as string,
                  file: [attachment.file],
                  attachmentName: attachment.meta.name,
                  ending: attachment.meta.ending,
                }))
            );
          }

          // Hantera befintliga bilagor
          if (existingAttachments.length > 0) {
            await Promise.all(
              existingAttachments.map(async (attachment) => {
                if (e.errand && attachment.id && attachment.meta.name && attachment.meta.category) {
                  await editAttachment(
                    municipalityId,
                    e.errand.id,
                    attachment.id,
                    attachment.meta.name,
                    attachment.meta.category
                  );
                }
              })
            );
          }

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
    } catch (error) {
      console.error(error);
      toastMessage({
        position: 'bottom',
        closeable: false,
        message: 'Ett fel uppstod vid registrering av ärendet',
        status: 'error',
      });
      setIsLoading(false);
    }
  };

  // Logik för att kontrollera om sökande finns, annars vill vi eventuellt inte kunna skapa ett ärende.
  // const hasApplicant = useMemo(() => owners.some((owner) => owner.roles.includes(Role.APPLICANT)), [owners]); //disabled={!hasApplicant}

  return (
    <div className="flex mb-0 w-full">
      <Button
        variant="primary"
        color="vattjom"
        className="w-full"
        onClick={openHandler}
        disabled={isLoading}
        rightIcon={isLoading ? <Spinner size={2} /> : undefined}
      >
        Registrera ärende
      </Button>

      {isOpen && (
        <Dialog className="max-w-[36rem]" show={isOpen}>
          <Dialog.Content className="flex flex-col items-center justify-center text-center">
            <LucideIcon color="vattjom" name="inbox" size={32} />
            <div className="text-h4">Registrera ärende</div>
            <div>
              När du registrerar ett ärende, kommer det automatiskt att placeras under kategorin &apos;Inkomna
              ärende&apos;. Därefter blir ärendet tillgängligt för alla behöriga medarbetare inom din verksamhet.
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
              onClick={onSubmit}
              disabled={isLoading}
              rightIcon={isLoading ? <Spinner size={2} /> : undefined}
            >
              Ja
            </Button>
          </Dialog.Buttons>
        </Dialog>
      )}
    </div>
  );
};
