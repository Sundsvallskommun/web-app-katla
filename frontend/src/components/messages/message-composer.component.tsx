import { Attachment } from '@interfaces/attachment';
import { IErrand } from '@interfaces/errand';
import { ACCEPTED_UPLOAD_FILETYPES, getAttachmentLabel } from '@services/casedata-attachment-service';
import { isErrandLocked, validateAction } from '@services/casedata-errand-service';
import { renderMessageWithTemplates, sendMessage, sendSms } from '@services/casedata-message-service';
import { getOwnerStakeholder } from '@services/casedata-stakeholder-service';
// import CommonNestedEmailArrayV2 from '@commcomponents/commonNestedEmailArrayV2';
// import CommonNestedPhoneArrayV2 from '@common/components/commonNestedPhoneArrayV2';
import FileUpload from '@components/file-upload/file-upload.component';
import { RichTextEditor } from '@components/rich-text-editor/rich-text-editor.component';
import { User } from '@interfaces/user';
// import { isMEX, isPT } from '@common/services/application-service';
import {
  invalidPhoneMessage,
  phonePattern,
  supportManagementPhonePatternOrCountryCode,
} from '@services/helper-service';
import sanitized from '@services/sanitizer-service';
// import { yupResolver } from '@hookform/resolvers/yup';
import LucideIcon from '@sk-web-gui/lucide-icon';
import {
  Button,
  Chip,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  RadioButton,
  Select,
  Spinner,
  cx,
  useConfirm,
  useSnackbar,
} from '@sk-web-gui/react';
import { useContext, useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { MessageWrapper } from './message-wrapper.component';
import { Role } from '@interfaces/role';
import { MessageResponse } from '@interfaces/message';
import { AppContext } from '@contexts/app-context-interface';
import ReactQuill from 'react-quill';
// import { useTranslation } from 'next-i18next';

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
  contactMeans: 'email' as const,
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

// const formSchema = yup
//   .object({
//     headerReplyTo: yup.string(),
//     headerReferences: yup.string(),
//     contactMeans: yup.string(),
//     messageClassification: yup.string(),
//     messageTemplate: yup.string(),
//     emails: yup.array().when('contactMeans', {
//       is: (means: string) => means === 'email',
//       then: yup
//         .array()
//         .of(
//           yup
//             .object()
//             .shape({
//               value: yup.string().email('E-postadress har fel format'),
//             })
//             .required()
//         )
//         .min(1, 'Ange minst en E-postadress'),
//     }),
//     newEmail: yup.string().when('contactMeans', {
//       is: (means: string) => means === 'email',
//       then: yup.string().email('E-postadressen har fel format'),
//     }),
//     phoneNumbers: yup.array().when('contactMeans', {
//       is: (means: string) => means === 'sms',
//       then: yup
//         .array()
//         .of(
//           yup.object().shape({
//             value: yup
//               .string()
//               .required('Telefonnummer måste anges för sms-meddelande')
//               .trim()
//               .transform((val) => val && val.replace('-', ''))
//               .matches(supportManagementPhonePatternOrCountryCode, invalidPhoneMessage),
//           })
//         )
//         .min(1, 'Ange minst ett telefonnummer')
//         .required('Ange minst ett telefonnummer'),
//     }),
//     newPhoneNumber: yup
//       .string()
//       .trim()
//       .transform((val) => val && val.replace('-', ''))
//       .matches(phonePattern, invalidPhoneMessage),
//     messageBody: yup.string().required('Text måste anges'),
//     messageBodyPlaintext: yup.string(),
//     attachUtredning: yup.bool(),
//     existingAttachments: yup.array(
//       yup.object().shape({
//         category: yup.string(),
//         name: yup.string(),
//         note: yup.string(),
//         extension: yup.string(),
//         mimeType: yup.string(),
//         file: yup.string(),
//       })
//     ),
//     addExisting: yup.mixed(),
//     newAttachments: yup.array(),
//     addNew: yup.mixed(),
//   })
//   .required();

export const MessageComposer: React.FC<{
  message: MessageResponse;
  show: boolean;
  closeHandler: () => void;
  setUnsaved: (unsaved: boolean) => void;
  update: () => void;
}> = (props) => {
  const { municipalityId, errand, user }: { municipalityId: string; errand: IErrand; user: User } =
    useContext(AppContext);
    const quillRef = useRef<ReactQuill>(null);
  const [richText, setRichText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [textIsDirty, setTextIsDirty] = useState(false);
  const [replying, setReplying] = useState(false);
  const [filteredAttachments, setFilteredAttachments] = useState([]);
  const submitConfirm = useConfirm();
  const closeConfirm = useConfirm();
  const toastMessage = useSnackbar();
  const [allowed, setAllowed] = useState(false);
  // const { t } = useTranslation();
  useEffect(() => {
    const _a = validateAction(errand, user) && !!errand.administrator;
    setAllowed(_a);
  }, [user, errand]);

  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState<boolean>(false);

  const closeAttachmentModal = () => {
    setIsAttachmentModalOpen(false);
  };

  const {
    register,
    // control,
    // handleSubmit,
    // watch,
    // reset,
    // trigger,
    // formState,
    // getFieldState,
    // getValues,
    setValue,
    // formState: { errors },
  } = useForm<CasedataMessageTabFormModel>({
    // resolver: yupResolver(formSchema),
    defaultValues: defaultMessage,
    mode: 'onChange', // NOTE: Needed if we want to disable submit until valid
  });

  // const { fields, remove, append } = useFieldArray({
  //   control,
  //   name: 'existingAttachments',
  // });

  // const {
  //   fields: newAttachmentsFields,
  //   append: appendNewAttachment,
  //   remove: removeNewAttachment,
  // } = useFieldArray({
  //   control,
  //   name: 'newAttachments',
  // });

  // const {
  //   fields: messageAttachments,
  //   append: appendMessageAttachment,
  //   remove: removeMessageAttachment,
  // } = useFieldArray({
  //   control,
  //   name: 'messageAttachments',
  // });

  const clearAndClose = () => {
    setTimeout(() => {
      setValue('messageBody', '', { shouldDirty: true });
      setValue('emails', [], { shouldDirty: true });
      // removeNewAttachment();
      setRichText('');
      // remove();
      props.closeHandler();
    }, 0);
  };

  // const onSubmit = async (data: CasedataMessageTabFormModel) => {
  //   const apiCall = data.contactMeans === 'sms' ? sendSms : sendMessage;
  //   setIsLoading(true);

  //   // isMEX() ? (data.messageClassification = 'Informationsmeddelande') : null;

  //   const renderedHtml = await renderMessageWithTemplates(data.messageBody);
  //   data.messageBody = renderedHtml.html;

  //   apiCall(municipalityId, errand, data)
  //     .then(() => {
  //       toastMessage({
  //         position: 'bottom',
  //         closeable: false,
  //         message: `${
  //           data.contactMeans === 'sms' ? 'SMS:et'
  //           : data.contactMeans === 'email' ? 'E-postmeddelandet'
  //           : 'Meddelandet'
  //         } skickades`,
  //         status: 'success',
  //       });
  //       setIsLoading(false);
  //       props.update();
  //       clearAndClose();
  //     })
  //     .catch(() => {
  //       toastMessage({
  //         position: 'bottom',
  //         closeable: false,
  //         message: `Något gick fel när ${
  //           data.contactMeans === 'sms' ? 'SMS:et'
  //           : data.contactMeans === 'email' ? 'e-postmeddelandet'
  //           : 'meddelandet'
  //         } skickades`,
  //         status: 'error',
  //       });
  //       setError(true);
  //       setIsLoading(false);
  //       return;
  //     });
  // };

  // const abortHandler = () => {
  //   if (getFieldState('messageBody').isDirty && getValues().messageBody !== props.message?.message) {
  //     closeConfirm
  //       .showConfirmation('Vill du avbryta?', 'Du har osparade ändringar.', 'Ja', 'Nej', 'info', 'info')
  //       .then((confirmed) => {
  //         if (confirmed) {
  //           clearAndClose();
  //         }
  //       });
  //   } else {
  //     clearAndClose();
  //   }
  // };

  // const addExisting = watch('addExisting');
  // const existingAttachments = watch('existingAttachments');
  // const newAttachments = watch('newAttachments');
  // const { contactMeans } = watch();

  const onRichTextChange = (val: string) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const length = editor.getLength();
      setRichText(val);
      setValue('messageBody', length > 1 ? val : '');
    }
  };

  // useEffect(() => {
  //   errand.attachments;
  //   setFilteredAttachments(
  //     errand.attachments?.filter((a) => !fields.map((f) => (f as Attachment).name).includes(a.name))
  //   );
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [existingAttachments]);

  // useEffect(() => {
  //   if (contactMeans === 'sms') {
  //     setValue('newPhoneNumber', getOwnerStakeholder(errand)?.phoneNumbers?.[0]?.value || '+46');
  //   }
  //   setTimeout(() => {
  //     props.setUnsaved(false);
  //   }, 0);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [contactMeans]);

  // const defaultSignature = () => {
  //   return t('messages:templates.case_data_default_signature', {
  //     user: errand.administratorName,
  //     department: 'Gatuavdelningen, Trafiksektionen',
  //   });
  // };

  // useEffect(() => {
  //   setReplying(!!props.message?.messageId);
  //   setValue('messageTemplate', '');
  //   if (props.message) {
  //     const replyTo = props.message?.emailHeaders.find((h) => h.header === 'MESSAGE_ID')?.values[0];
  //     const references = props.message?.emailHeaders.find((h) => h.header === 'REFERENCES')?.values || [];
  //     references.push(replyTo);
  //     setValue('headerReplyTo', replyTo);
  //     setValue('headerReferences', references.join(','));
  //     setValue('emails', [{ value: props.message.email }]);
  //     setValue('contactMeans', props.message.messageType === 'WEBMESSAGE' ? 'webmessage' : 'email');
  //     const historyHeader = `<br><br>-----Ursprungligt meddelande-----<br>Från: ${props.message.email}<br>Skickat: ${props.message.sent}<br>Till: Sundsvalls kommun<br>Ämne: ${props.message.subject}<br><br>`;
  //     setRichText(defaultSignature() + historyHeader + props.message.message);
  //     trigger();
  //   } else {
  //     setRichText(defaultSignature());
  //     setValue('headerReplyTo', '');
  //     setValue('headerReferences', '');
  //     setValue('contactMeans', !!errand.externalCaseId ? 'webmessage' : 'email');
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.message, errand]);

  // const changeTemplate = (inTemplateValue: string) => {
  //   if (inTemplateValue === 'mex-feedbackPrio') {
  //     setRichText(
  //       t('messages:templates.email.MEX.priority') +
  //         defaultSignature() +
  //         t('messages:templates.email.MEX.public_documents')
  //     );
  //   } else if (inTemplateValue === 'mex-feedbackNormal') {
  //     setRichText(
  //       t('messages:templates.email.MEX.normal') +
  //         defaultSignature() +
  //         t('messages:templates.email.MEX.public_documents')
  //     );
  //   } else if (inTemplateValue === 'mex-additionalInformation') {
  //     setRichText(t('messages:templates.email.MEX.additional_information') + defaultSignature());
  //   } else if (inTemplateValue === 'mex-internalReferralBuildingPermit') {
  //     setRichText(t('messages:templates.email.MEX.internal_referral_building_permit') + defaultSignature());
  //   } else if (inTemplateValue === 'mex-internalReferralWire') {
  //     setRichText(t('messages:templates.email.MEX.internal_referral_wire') + defaultSignature());
  //   } else if (inTemplateValue === 'mex-internalReferralWireCheck') {
  //     setRichText(t('messages:templates.email.MEX.internal_referral_wire_check') + defaultSignature());
  //   } else {
  //     setRichText(t('messages:templates.email.default') + defaultSignature());
  //   }
  // };

  return (
    <>
      <MessageWrapper label="Nytt meddelande" closeHandler={clearAndClose} show={props.show}>
        <div className="my-md py-8 px-40 flex flex-col gap-12 ">
          <Input type="hidden" {...register('headerReplyTo')} />
          <Input type="hidden" {...register('headerReferences')} />

          {/* <RichTextEditor
          
                  containerLabel="text"
                  value={richText}
                  onChange={(value) => {
                    return onRichTextChange(value);
                  }}
                /> */}
  
        </div>
      </MessageWrapper>

      <Modal show={isAttachmentModalOpen} onClose={closeAttachmentModal} label="Ladda upp bilaga" className="w-[40rem]">
        <Modal.Content>
          <FormControl id="newAttachments" className="w-full">
            <FormLabel className="flex-grow"></FormLabel>
            {/* <FileUpload
              editing={false}
              fieldName="newAttachments"
              fields={newAttachmentsFields}
              uniqueFileUploaderKey="message-tab"
              items={newAttachments}
              register={register}
              setValue={setValue}
              watch={watch}
              errors={errors}
              append={appendNewAttachment}
              remove={removeNewAttachment}
              allowMultiple={true}
              accept={ACCEPTED_UPLOAD_FILETYPES}
              dragDrop={false}
            /> */}
          </FormControl>
        </Modal.Content>

        <Modal.Footer>
          <Button
            className="w-full"
            // disabled={!newAttachments.length}
            onClick={() => {
              // newAttachmentsFields.forEach((field) => {
              //   appendMessageAttachment(field);
              // });

              // closeAttachmentModal();
            }}
            data-cy="upload-button"
          >
            Ladda upp
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
