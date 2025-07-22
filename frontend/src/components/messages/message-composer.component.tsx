import { AppContext } from '@contexts/app-context-interface';
import { Attachment } from '@interfaces/attachment';
import { IErrand } from '@interfaces/errand';
import { MessageResponse } from '@interfaces/message';
import { User } from '@interfaces/user';
import { createConversation, sendInternalMessage } from '@services/casedata-conversation-service';
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
import { useContext, useEffect, useRef, useState } from 'react';
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
  const editorRef = useRef<Quill>(null);
  const [isLoading, setIsLoading] = useState(false);
  const closeConfirm = useConfirm();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const toastMessage = useSnackbar();
  const [editorText, setEditorText] = useState('');
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState<boolean>(false);

  const { register, handleSubmit, getValues, setValue } = useForm<CasedataMessageTabFormModel>({
    defaultValues: defaultMessage,
    mode: 'onChange', // NOTE: Needed if we want to disable submit until valid
  });

  useEffect(() => {
    if (props.show && editorRef.current) {
      setEditorText(editorRef.current.getText() || '');
    }
  }, [props.show]);

  const clearAndClose = () => {
    setTimeout(() => {
      setValue('messageBody', '', { shouldDirty: true });
      setValue('emails', [], { shouldDirty: true });
      editorRef?.current?.setText('');
      props.closeHandler();
    }, 0);
  };

  const onSubmit = async (data: CasedataMessageTabFormModel) => {
    setIsLoading(true);

    if (data.messageBodyPlaintext === '') {
      return;
    }

    createConversation(municipalityId, errand.id, user, `Ärende: #${errand.errandNumber}`).then((res) => {
      sendInternalMessage(municipalityId, errand.id, res.data.id || '', user, data.messageBodyPlaintext, files)
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
    if (editorText.trim().length !== 0) {
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

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !editor.on) return;

    const handleChange = () => {
      const text = editor.getText ? editor.getText() : '';
      setEditorText(text);
    };

    editor.on('text-change', handleChange);
    return () => {
      editor.off('text-change', handleChange);
    };
  }, [editorRef]);

  return (
    <>
      <MessageWrapper label="Nytt meddelande" closeHandler={clearAndClose} show={props.show}>
        <div className="my-md py-8 px-40 flex flex-col gap-12 ">
          <Input type="hidden" {...register('headerReplyTo')} />
          <Input type="hidden" {...register('headerReferences')} />

          <TextEditor className="h-[30rem] mb-[4rem]" ref={editorRef} />
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
              if (editorRef.current) {
                const content = editorRef.current.getText();
                const htmlContent = editorRef.current.root.innerHTML;
                setValue('messageBody', htmlContent, { shouldDirty: true });
                setValue('messageBodyPlaintext', content, { shouldDirty: true });
              }
              await onSubmit(getValues());
            })}
            variant="primary"
            color="primary"
            disabled={isLoading || editorText.trim().length === 0}
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
