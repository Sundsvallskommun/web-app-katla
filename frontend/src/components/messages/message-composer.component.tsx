import { AppContext } from '@contexts/app-context-interface';
import { IErrand } from '@interfaces/errand';
import { User } from '@interfaces/user';
import { ACCEPTED_UPLOAD_FILETYPES } from '@services/casedata-attachment-service';
import { createConversation, sendInternalMessage } from '@services/casedata-conversation-service';
import { isErrandLocked } from '@services/casedata-errand-service';
import sanitized from '@services/sanitizer-service';
import {
  Button,
  FileUpload,
  FormControl,
  FormErrorMessage,
  Modal,
  UploadFile,
  useSnackbar,
  useThemeQueries,
} from '@sk-web-gui/react';
import dynamic from 'next/dynamic';
import { useContext, useMemo, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

const TextEditor = dynamic(() => import('@sk-web-gui/text-editor'), { ssr: false });

interface TextEditorValue {
  markup?: string;
  plainText?: string;
}

interface MessageFormModel {
  files: UploadFile[];
  messageBody: string;
  messageBodyPlaintext: string;
}

const MESSAGE_CHARACTER_LIMIT = 10000;

export const MessageComposer: React.FC<{ update: () => void }> = ({ update }) => {
  const { municipalityId, errand, user }: { municipalityId: string; errand: IErrand; user: User } =
    useContext(AppContext);
  const { isMaxMediumDevice, isMinDesktop } = useThemeQueries();
  const toastMessage = useSnackbar();
  const [showFiletypesModal, setShowFiletypesModal] = useState(false);

  const context = useForm<MessageFormModel>({
    defaultValues: { files: [], messageBody: '', messageBodyPlaintext: '' },
    mode: 'onChange',
  });

  const files = context.watch('files');
  const messageBody = context.watch('messageBody');
  const messageBodyPlaintext = context.watch('messageBodyPlaintext');
  const editorValue = useMemo(() => ({ markup: messageBody }), [messageBody]);

  context.register('messageBodyPlaintext', {
    required: 'Skriv ett meddelande',
    validate: (value) =>
      value.length <= MESSAGE_CHARACTER_LIMIT || `Du får skriva max ${MESSAGE_CHARACTER_LIMIT} tecken.`,
  });

  const messageLength = messageBodyPlaintext?.length ?? 0;
  const isMessageOverLimit = messageLength > MESSAGE_CHARACTER_LIMIT;

  if (isErrandLocked(errand)) {
    return null;
  }

  const handleOnSubmit: SubmitHandler<MessageFormModel> = async (data) => {
    if (!data.messageBodyPlaintext?.trim()) {
      context.setError('messageBodyPlaintext', { message: 'Skriv ett meddelande' });
      return;
    }

    try {
      const res = await createConversation(municipalityId, errand.id, user, `Ärende: #${errand.errandNumber}`);

      await sendInternalMessage(
        municipalityId,
        errand.id,
        res.data.id || '',
        user,
        sanitized(data.messageBody),
        data.files
      );

      toastMessage({
        position: 'bottom',
        closeable: false,
        message: 'Meddelandet skickades',
        status: 'success',
      });

      context.reset();
      update();
    } catch {
      toastMessage({
        position: 'bottom',
        closeable: false,
        message: 'Något gick fel när meddelandet skickades',
        status: 'error',
      });
    }
  };

  const handleRemoveFile = (file: UploadFile) => {
    context.setValue(
      'files',
      files.filter((x) => x !== file)
    );
  };

  return (
    <>
      <div className="flex flex-col gap-y-24 py-24">
        <FormProvider {...context}>
          <form className="flex flex-col gap-lg" onSubmit={context.handleSubmit(handleOnSubmit)}>
            <p className="font-bold">Skicka ett meddelande för att kontakta handläggaren för ditt ärende</p>

            <FormControl className="w-full">
              <TextEditor
                className={isMaxMediumDevice ? 'h-[10rem]' : 'h-[20rem]'}
                onChange={(e: { target: { value: TextEditorValue } }) => {
                  context.setValue('messageBody', e.target.value.markup ?? '', { shouldDirty: true });
                  context.setValue('messageBodyPlaintext', e.target.value.plainText ?? '', {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
                value={editorValue}
                disableToolbar
              />
              <div className="flex justify-between text-small mt-8">
                <span className="text-dark-secondary">Max {MESSAGE_CHARACTER_LIMIT} tecken.</span>
                <span className={isMessageOverLimit ? 'text-error' : 'text-dark-secondary'}>
                  {messageLength}/{MESSAGE_CHARACTER_LIMIT}
                </span>
              </div>
              {context.formState.errors.messageBodyPlaintext && (
                <FormErrorMessage className="text-small text-error" role="alert">
                  {context.formState.errors.messageBodyPlaintext.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FileUpload.Button
              appendFiles={files}
              className="mt-16"
              maxFileSizeMB={25}
              {...context.register('files')}
            />
            <div className="flex items-row text-small gap-5">
              <span className="text-dark-secondary">Maximal filstorlek: 25 MB.</span>
              <Button variant="link" onClick={() => setShowFiletypesModal(true)}>
                Visa tillåtna filtyper
              </Button>
            </div>

            {files.length > 0 && (
              <div className="flex flex-col py-16 gap-y-16">
                <h3 className="text-large font-normal">Valda filer</h3>
                <FileUpload.List name="files" showBorder>
                  {files.map((file, i) => (
                    <FileUpload.ListItem
                      key={`${file?.meta.name}-${i}`}
                      index={i}
                      actionsProps={{ showRemove: true, onRemove: () => handleRemoveFile(file) }}
                      file={file}
                    />
                  ))}
                </FileUpload.List>
              </div>
            )}

            <div className="flex desktop:justify-start">
              <Button
                className="w-full desktop:w-fit"
                size={isMinDesktop ? 'md' : 'lg'}
                type="submit"
                color="vattjom"
                loading={context.formState.isSubmitting}
                disabled={isMessageOverLimit || context.formState.isSubmitting}
                data-cy="send-message-button"
              >
                Skicka meddelande
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>

      <Modal
        className="w-full max-w-[43.3rem]"
        show={showFiletypesModal}
        onClose={() => setShowFiletypesModal(false)}
        label="Tillåtna filtyper"
      >
        <Modal.Content>
          <ul className="text-dark-secondary space-y-3">
            {ACCEPTED_UPLOAD_FILETYPES.filter((type) => !type.includes('/')).map((type) => (
              <li key={type}>.{type}</li>
            ))}
          </ul>
        </Modal.Content>
      </Modal>
    </>
  );
};
