import { AppContext } from '@contexts/app-context-interface';
import { deleteAttachment, PTAttachmentLabels } from '@services/casedata-attachment-service';
import { CustomOnChangeEventUploadFile, FileUpload, Switch, UploadFile } from '@sk-web-gui/react';
import { useContext, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const FileUploadComponent: React.FC = () => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { setValue, watch } = useFormContext();

  const { municipalityId, errand } = useContext(AppContext);

  const files: UploadFile[] = watch('attachments') || [];

  const onChange = (e: CustomOnChangeEventUploadFile) => {
    if (e.target.value !== null) {
      const updatedFiles = files.concat(
        ...e.target.value.map((file) => ({
          ...file,
          id: '',
          meta: { ...file.meta, category: Object.keys(PTAttachmentLabels)[0] },
        }))
      );
      console.log(updatedFiles);
      setValue('attachments', updatedFiles);
    }
  };

  const handleRemoveFile = (file: UploadFile) => {
    const updatedFiles = files.filter((f) => f !== file);
    const errandIdNum = typeof errand.id === 'string' ? Number(errand.id) : errand.id;

    deleteAttachment(municipalityId, errandIdNum, file);
    setValue('attachments', updatedFiles);
  };

  const handleOnChangeName = (file: UploadFile) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedFiles = files.map((f) => (f === file ? { ...f, meta: { ...f.meta, name: e.target.value } } : f));
    setValue('attachments', updatedFiles);
  };

  const handleOnChangeCategory = (file: UploadFile) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedFiles = files.map((f) => (f === file ? { ...f, meta: { ...f.meta, category: e.target.value } } : f));
    console.log('Updated files with category:', updatedFiles);
    setValue('attachments', updatedFiles);
  };

  return (
    <FileUpload.Area onChange={onChange}>
      <div className="w-full pb-[2rem] pt-[5rem] lg:px-32">
        <div className="flex justify-between">
          <h2>Bilagor</h2>
          <FileUpload.Button onChange={onChange} />
        </div>
        <div className="py-[1rem]">
          <Switch value={isEdit.toString()} checked={isEdit} onChange={() => setIsEdit((value) => !value)}>
            Redigera
          </Switch>
        </div>
        <FileUpload.List isEdit={isEdit}>
          {files.map((file, i) => (
            <FileUpload.ListItem
              key={file.file?.name || `file-${i}`}
              file={file}
              index={i}
              nameProps={{
                inputProps: {
                  onChange: handleOnChangeName(file),
                },
              }}
              categoryProps={{
                categories: PTAttachmentLabels,
                selectProps: {
                  onChange: handleOnChangeCategory(file),
                },
              }}
              actionsProps={{
                showRemove: true,
                onRemove: () => handleRemoveFile(file),
              }}
            />
          ))}
        </FileUpload.List>
      </div>
    </FileUpload.Area>
  );
};

export default FileUploadComponent;
