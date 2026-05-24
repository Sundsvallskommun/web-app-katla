import { AppContext } from '@contexts/app-context-interface';
import { deleteAttachment, editAttachment, FTAttachmentLabels } from '@services/casedata-attachment-service';
import { CustomOnChangeEventUploadFile, FileUpload, UploadFile, useConfirm, useSnackbar } from '@sk-web-gui/react';
import dayjs from 'dayjs';
import { useContext, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const FileUploadComponent: React.FC = () => {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [originalFile, setOriginalFile] = useState<UploadFile | null>(null);
  const { setValue, watch } = useFormContext();
  const removeConfirm = useConfirm();
  const toastMessage = useSnackbar();

  const { errand } = useContext(AppContext);

  const files: UploadFile[] = watch('attachments') || [];

  const onChange = async (e: CustomOnChangeEventUploadFile) => {
    if (e.target.value !== null) {
      const updatedFiles = files.concat(
        ...e.target.value.map((file) => ({
          ...file,
          id: '',
          meta: { ...file.meta, category: Object.keys(FTAttachmentLabels)[0] },
        }))
      );
      setValue('attachments', updatedFiles);
    }
  };

  const handleRemoveFile = async (file: UploadFile) => {
    const updatedFiles = files.filter((f) => f !== file);
    const errandIdNum = typeof errand.id === 'string' ? Number(errand.id) : errand.id;

    const confirmed = await removeConfirm.showConfirmation(
      'Ta bort?',
      'Vill du ta bort denna bilaga?',
      'Ja',
      'Nej',
      'info',
      'info'
    );
    if (!confirmed) return;

    await deleteAttachment(errandIdNum, file);
    setValue('attachments', updatedFiles);
  };

  const handleOnChangeName = (file: UploadFile) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedFiles = files.map((f) => (f === file ? { ...f, meta: { ...f.meta, name: e.target.value } } : f));
    setValue('attachments', updatedFiles);
  };

  const handleOnChangeCategory = (file: UploadFile) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedFiles = files.map((f) => (f === file ? { ...f, meta: { ...f.meta, category: e.target.value } } : f));
    setValue('attachments', updatedFiles);
  };

  return (
    <FileUpload.Area onChange={onChange}>
      <div className="w-full pb-[2rem] pt-[5rem] lg:px-32">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <h2>Bilagor</h2>
            <span>Ladda upp bilagor av relevans för ansökan.</span>
          </div>
          <div data-cy="upload-button-wrapper">
            <FileUpload.Button onChange={onChange} />
          </div>
        </div>
        <div className="py-[1rem]">
          <FileUpload.List>
            {files.map((file, i) => (
              <FileUpload.ListItem
                file={file}
                index={i}
                key={i}
                isEdit={editIndex === i}
                nameProps={{
                  description: `Uppladdad: ${dayjs(file?.meta?.created as string).format('YYYY-MM-DD HH:mm')}`,
                  inputProps: {
                    onChange: handleOnChangeName(file),
                  },
                }}
                categoryProps={{
                  categories: FTAttachmentLabels,
                  selectProps: {
                    onChange: handleOnChangeCategory(file),
                  },
                }}
                actionsProps={{
                  showEdit: true,
                  showEditSave: editIndex === i,
                  showEditCancel: editIndex === i,
                  onEdit: () => {
                    setOriginalFile(file);
                    setEditIndex(i);
                  },
                  onEditSave: () => {
                    if (file.meta.name === '') {
                      toastMessage({
                        position: 'bottom',
                        closeable: false,
                        message: 'Namn måste anges',
                        status: 'error',
                      });
                      return;
                    }
                    editAttachment(
                      Number(errand.id),
                      file.id,
                      `${file.meta.name}.${file.meta.ending}`,
                      file.meta.category as string
                    );
                    setEditIndex(null);
                  },
                  onEditCancel: () => {
                    if (originalFile) {
                      setValue(`attachments.${i}`, originalFile, {
                        shouldDirty: false,
                        shouldTouch: false,
                        shouldValidate: false,
                      });
                    }
                    setEditIndex(null);
                    setOriginalFile(null);
                  },
                  showRemove: editIndex !== i,
                  onRemove: () => handleRemoveFile(file),
                }}
              />
            ))}
          </FileUpload.List>
        </div>
      </div>
    </FileUpload.Area>
  );
};

export default FileUploadComponent;
