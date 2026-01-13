import { UploadFile } from '@sk-web-gui/react';

export const prepareAttachmentsForSubmit = (attachments: UploadFile[]) => {
  const newAttachments = (attachments || [])
    .filter((attachment) => !attachment.id)
    .map((attachment) => ({
      mimeType: attachment.file.type,
      file: attachment.file,
      meta: {
        name: attachment.meta.name || attachment.file.name.replace(/\.[^/.]+$/, ''),
        ending: attachment.meta.ending || attachment.file.name.split('.').pop(),
        category: attachment.meta.category,
      },
    }));

  const existingAttachments = (attachments || [])
    .filter((attachment) => attachment.id)
    .map((attachment) => ({
      id: attachment.id,
      mimeType: attachment.file.type,
      file: attachment.file,
      meta: {
        name: attachment.meta.name,
        ending: attachment.meta.ending,
        category: attachment.meta.category,
      },
    }));

  return { newAttachments, existingAttachments };
};
