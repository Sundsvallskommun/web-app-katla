'use client';
import { AppContext } from '@contexts/app-context-interface';
import { IErrand } from '@interfaces/errand';
import { editAttachment, sendAttachments } from '@services/casedata-attachment-service';
import { getErrand, saveErrand } from '@services/casedata-errand-service';
import { useRemoveDeletedStakeholders } from '@hooks/use-remove-deleted-stakeholders';
import { Button, Spinner, UploadFile, useSnackbar } from '@sk-web-gui/react';
import { prepareAttachmentsForSubmit } from '@utils/prepare-attachments';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { useFormContext, UseFormReturn } from 'react-hook-form';

export const DraftErrandButton: React.FC = () => {
  const toastMessage = useSnackbar();
  const router = useRouter();
  const { setErrand, isLoading, setIsLoading, errand } = useContext(AppContext);
  const { getValues, reset }: UseFormReturn<IErrand, unknown, undefined> = useFormContext();
  const handleRemoveDeletedStakeholders = useRemoveDeletedStakeholders();

  const onSubmit = async () => {
    setIsLoading(true);

    const data = getValues() as Partial<IErrand> & { attachments: UploadFile[] };

    const { newAttachments, existingAttachments } = prepareAttachmentsForSubmit(data.attachments || []);

    try {
      await handleRemoveDeletedStakeholders(data);

      const res = await saveErrand(data);
      if (!res.errandSuccessful) {
        throw new Error('Errand could not be registered');
      }

      if (res.errandId) {
        const e = await getErrand(res.errandId);
        if (e.errand && e.errand.errandNumber) {
          if (newAttachments.length > 0) {
            await sendAttachments(
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

          if (existingAttachments.length > 0) {
            await Promise.all(
              existingAttachments.map(async (attachment) => {
                if (e.errand && attachment.id && attachment.meta.name && attachment.meta.category) {
                  await editAttachment(e.errand.id, attachment.id, attachment.meta.name, attachment.meta.category);
                }
              })
            );
          }

          setErrand(e.errand);
          reset(e.errand);
          router.push(`/arende/${e.errand.errandNumber}`);
        }
        toastMessage({
          position: 'bottom',
          closeable: false,
          message: 'Ärendet sparades som utkast',
          status: 'success',
        });
      }
    } catch (error) {
      console.error(error);
      toastMessage({
        position: 'bottom',
        closeable: false,
        message: 'Ett fel uppstod vid sparande av utkast',
        status: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      data-cy="save-draft-errand-button"
      variant={errand.created === undefined ? 'primary' : 'secondary'}
      onClick={onSubmit}
      disabled={isLoading}
      rightIcon={isLoading ? <Spinner size={2} /> : undefined}
    >
      Spara utkast
    </Button>
  );
};
