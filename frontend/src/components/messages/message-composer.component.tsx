import { AppContext } from '@contexts/app-context-interface';
import { Attachment } from '@interfaces/attachment';
import { IErrand } from '@interfaces/errand';
import { MessageResponse } from '@interfaces/message';
import { User } from '@interfaces/user';
import { createConversation, sendInternalMessage } from '@services/casedata-conversation-service';
import sanitized from '@services/sanitizer-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import {
  Button,
  CustomOnChangeEventUploadFile,
  FileUpload,
  Input,
  Modal,
  Spinner,
  UploadFile,
  useConfirm,
  useSnackbar,
} from '@sk-web-gui/react';
import dynamic from 'next/dynamic';
import type Quill from 'quill';
import { Delta } from 'quill';
import { useContext, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MessageWrapper } from './message-wrapper.component';
const TextEditor = dynamic(() => import('@sk-web-gui/text-editor'), { ssr: false });

export interface CasedataMessageTabFormModel {
  contactMeans: 'email' | 'sms' | 'webmessage' | 'digitalmail' | 'paper';
  messageClassification: string;
  messageTemplate?: string;
  emails: { value: string }[];
  newEmail: string;
  phoneNumbers: string[];
  newPhoneNumber: string;
  messageBody: string;
  messageBodyPlaintext: string;
  attachUtredning: boolean;
  existingAttachments: Attachment[];
  addExisting: string;
  messageAttachments: { file: FileList | undefined }[];
  newAttachments: { file: FileList | undefined }[];
  newItem: FileList | undefined;
  headerReplyTo: string;
  headerReferences: string;
}

const defaultMessage = {
  contactMeans: 'webmessage' as const,
  emails: [],
  newEmail: '',
  phoneNumbers: [],
  newPhoneNumber: '',
  messageBody: '',
  messageBodyPlaintext: '',
  attachUtredning: false,
  existingAttachments: [],
  addExisting: '',
  newAttachments: [],
  newItem: undefined,
  headerReplyTo: '',
  headerReferences: '',
};

export const MessageComposer: React.FC<{
  message: MessageResponse;
  show: boolean;
  closeHandler: () => void;
  setUnsaved: (unsaved: boolean) => void;
  update: () => void;
}> = (props) => {
  const { municipalityId, errand, user }: { municipalityId: string; errand: IErrand; user: User } =
    useContext(AppContext);
  const quillRef = useRef<Quill>(null);
  const [isLoading, setIsLoading] = useState(false);
  const closeConfirm = useConfirm();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const toastMessage = useSnackbar();
  const [richText, setRichText] = useState<string>('');
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState<boolean>(false);

  const { register, handleSubmit, getValues, setValue, trigger, watch, formState, reset } = useForm<CasedataMessageTabFormModel>({
    defaultValues: defaultMessage,
    mode: 'onChange', // NOTE: Needed if we want to disable submit until valid
  });

  const messageBodyPlaintext = watch('messageBodyPlaintext')

  const clearAndClose = () => {
    setTimeout(() => {
      setValue('messageBody', '', { shouldDirty: false });
      setValue('messageBodyPlaintext', '', { shouldDirty: false });
      setValue('emails', [], { shouldDirty: false });
      quillRef?.current?.setText('');
      props.closeHandler();
      reset();
    }, 0);
  };

  const onSubmit = async (data: CasedataMessageTabFormModel) => {
    setIsLoading(true);

    if (data.messageBodyPlaintext === '') {
      return;
    }

    createConversation(municipalityId, errand.id, user, `Ärende: #${errand.errandNumber}`).then((res) => {
      sendInternalMessage(municipalityId, errand.id, res.data.id || '', user, data.messageBody, files)
        .then(() => {
          toastMessage({
            position: 'bottom',
            closeable: false,
            message: `Meddelandet skickades`,
            status: 'success',
          });
          setIsLoading(false);
          props.update();
          clearAndClose();
        })
        .catch(() => {
          toastMessage({
            position: 'bottom',
            closeable: false,
            message: `Något gick fel när meddelandet skickades`,
            status: 'error',
          });
          setIsLoading(false);
          return;
        });
    });

    setIsLoading(false);
  };

  const abortHandler = () => {
    console.log("dirty", formState.dirtyFields.messageBodyPlaintext)
    if (formState.dirtyFields.messageBodyPlaintext) {
      closeConfirm
        .showConfirmation('Vill du avbryta?', 'Du har osparade ändringar.', 'Ja', 'Nej', 'info', 'info')
        .then((confirmed) => {
          if (confirmed) {
            clearAndClose();
          }
        });
    } else {
      clearAndClose();
    }
  };

  const closeAttachmentModal = () => {
    setIsAttachmentModalOpen(false);
  };

  const onChange = (e: CustomOnChangeEventUploadFile) => {
    if (e.target.value !== null) {
      setFiles((prevFiles) => [...prevFiles, ...e.target.value]);
      setIsAttachmentModalOpen(false);
    }
  };

  const handleRemoveFile = (file: UploadFile) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f.id !== file.id));
  };

    const onRichTextChange = (delta: Delta, oldDelta: Delta, source: string) => {
    if (source === 'api') {
      return;
    }
    setValue('messageBody', sanitized(typeof delta.ops[0].retain === "number" && delta.ops[0].retain > 1 ? quillRef.current?.root.innerHTML ?? "" : ''), {
      shouldDirty: true,
    });
    setValue('messageBodyPlaintext', quillRef.current?.getText() ?? "", { shouldDirty: true });
    trigger('messageBody');
  };

  return (
    <>
      <MessageWrapper label="Nytt meddelande" closeHandler={clearAndClose} show={props.show}>
        <div className="my-md py-8 px-40 flex flex-col gap-12 ">
          <Input type="hidden" {...register('headerReplyTo')} />
          <Input type="hidden" {...register('headerReferences')} />

          <TextEditor
                  className="h-[30rem] mb-[4rem]"
                  key={richText}
                  ref={quillRef}
                  defaultValue={richText}
                  onTextChange={(delta, oldDelta, source) => {
                    props.setUnsaved(true);
                    return onRichTextChange(delta, oldDelta, source);
                  }}
                />
        </div>
        <div className="flex mb-24 mt-8 px-40">
          <Button
            variant="tertiary"
            color="primary"
            leftIcon={<LucideIcon name="paperclip" />}
            onClick={() => setIsAttachmentModalOpen(true)}
            data-cy="add-attachment-button"
          >
            Bifoga fil
          </Button>
        </div>
        <div className="px-40 mb-15">
          <FileUpload.List>
            {files.map((file, index) => (
              <FileUpload.ListItem
                key={file.id || index}
                index={index}
                actionsProps={{
                  showRemove: true,
                  onRemove: () => handleRemoveFile(file),
                }}
                nameProps={{
                  heading: file.meta.name,
                }}
              />
            ))}
          </FileUpload.List>
        </div>
        <div className="flex justify-start gap-lg px-40">
          <Button
            key="cancelButton"
            type="button"
            variant="tertiary"
            onClick={abortHandler}
            tabIndex={props.show ? 0 : -1}
          >
            Avbryt
          </Button>
          <Button
            tabIndex={props.show ? 0 : -1}
            data-cy="send-message-button"
            type="button"
            loading={isLoading}
            loadingText="Skickar meddelande"
            onClick={handleSubmit(async () => {
              await onSubmit(getValues());
            })}
            variant="primary"
            color="primary"
            disabled={isLoading || messageBodyPlaintext === ''}
            leftIcon={isLoading ? <Spinner size={2} className="mr-sm" /> : <></>}
          >
            Skicka meddelande
          </Button>
        </div>
      </MessageWrapper>

      <Modal show={isAttachmentModalOpen} onClose={closeAttachmentModal} label="Ladda upp bilaga" className="w-[40rem]">
        <Modal.Content>
          <div className="flex flex-col gap-lg">
            <FileUpload.Field onChange={onChange} variant="horizontal" invalid={false}>
              FileUpload
            </FileUpload.Field>
          </div>
        </Modal.Content>
      </Modal>
    </>
  );
};
