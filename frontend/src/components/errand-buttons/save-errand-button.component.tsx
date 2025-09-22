'use client';
import { AppContext } from '@contexts/app-context-interface';
import { IErrand } from '@interfaces/errand';
import { ErrandStatus } from '@interfaces/errand-status';
import { CasedataOwnerOrContact } from '@interfaces/stakeholder';
import { editAttachment, sendAttachments } from '@services/casedata-attachment-service';
import { getErrand, saveErrand } from '@services/casedata-errand-service';
import { Button, Spinner, UploadFile, useSnackbar } from '@sk-web-gui/react';
import { useContext } from 'react';
import { useFormContext, UseFormReturn } from 'react-hook-form';
import { scrollToFirstError } from './errand-buttons-utils';

export const SaveErrandButton: React.FC<{ owners: CasedataOwnerOrContact[] }> = ({ owners }) => {
  const toastMessage = useSnackbar();
  const { municipalityId, setErrand, isLoading, setIsLoading, errand } = useContext(AppContext);
  const { getValues, trigger, formState }: UseFormReturn<IErrand, unknown, undefined> = useFormContext();
  const draftErrand = errand.status.statusType === ErrandStatus.Utkast;

  const onSubmit = async () => {
    setIsLoading(true);

    if (!draftErrand) {
      const isValid = await trigger();
      if (!isValid) {
        setIsLoading(false);
        scrollToFirstError(formState.errors);
        return;
      }
    }

    const data = getValues() as IErrand & { attachments: UploadFile[] };

    data.stakeholders = owners;
    delete (data as Partial<IErrand>).errandNumber;
    delete (data as Partial<IErrand>).channel;

    const newAttachments = (data.attachments || [])
      .filter((attachment: UploadFile) => !attachment.id)
      .map((attachment: UploadFile) => ({
        mimeType: attachment.file.type,
        file: attachment.file,
        meta: {
          name: attachment.meta.name,
          ending: attachment.meta.ending,
          category: attachment.meta.category,
        },
      }));

    const attachments = (data.attachments || []).map((attachment: UploadFile) => {
      if (attachment.id) {
        return {
          id: attachment.id,
          mimeType: attachment.file.type,
          file: attachment.file,
          meta: {
            name: attachment.meta.name,
            ending: attachment.meta.ending,
            category: attachment.meta.category,
          },
        };
      }
    });

    try {
      const res = await saveErrand(data, municipalityId);
      if (!res.errandSuccessful) {
        throw new Error('Errand could not be registered');
      }
      if (res.errandId) {
        const e = await getErrand(municipalityId, res.errandId);
        if (e.errand && e.errand.errandNumber) {
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
                  attachmentName: attachment.file.name,
                }))
            );
          }
          if (attachments.length > 0) {
            attachments.map(async (attachment) => {
              if (e.errand && attachment?.id && attachment?.meta.name && attachment?.meta.category) {
                await editAttachment(
                  municipalityId,
                  e.errand.id,
                  attachment.id,
                  attachment.meta.name,
                  attachment.meta.category
                );
              }
            });
          }

          setErrand(e.errand);
        }
        toastMessage({
          position: 'bottom',
          closeable: false,
          message: 'Ärendet sparades',
          status: 'success',
        });
      }
    } catch (error) {
      console.error(error);
      toastMessage({
        position: 'bottom',
        closeable: false,
        message: 'Ett fel uppstod vid sparande av ärendet',
        status: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      data-cy="update-draft-errand-button"
      variant="primary"
      color="vattjom"
      onClick={onSubmit}
      disabled={isLoading}
      rightIcon={isLoading ? <Spinner size={2} /> : undefined}
    >
      Uppdatera ärende
    </Button>
  );
};
