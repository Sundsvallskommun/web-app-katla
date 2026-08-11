import { Attachment } from '@interfaces/attachment';
import { ApiResponse, apiService } from '@services/api-service';
import { UploadFile } from '@sk-web-gui/react';

export const MAX_FILE_SIZE_MB = 50;

export const imageMimeTypes = ['image/jpeg', 'image/gif', 'image/png', 'image/tiff', 'image/bmp'];

export const documentMimeTypes = [
  'application/pdf',
  'application/rtf',
  'application/msword',
  'application/x-tika-msoffice',
  'text/plain',
  'application/vnd.ms-excel',
  'application/vnd.ms-outlook',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.oasis.opendocument.text',
  'application/vnd.oasis.opendocument.spreadsheet',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];

export const ACCEPTED_UPLOAD_FILETYPES = [
  'bmp',
  'gif',
  'tif',
  'tiff',
  'jpeg',
  'jpg',
  'png',
  'htm',
  'html',
  'pdf',
  'rtf',
  'docx',
  'doc',
  'txt',
  'xlsx',
  'xls',
  'pptx',
  'odt',
  'ods',
  'text/html',
  'msg',
  ...imageMimeTypes,
  ...documentMimeTypes,
];

export type FTAttachmentCategory = 'MEDICAL_CONFIRMATION' | 'MEDICAL_OPINION';

export enum FTAttachmentLabels {
  'MEDICAL_CONFIRMATION' = 'Läkarintyg',
  'MEDICAL_OPINION' = 'Medicinskt utlåtande',
}

export const getFTAttachmentKey: (label: string) => FTAttachmentCategory | undefined = (label) => {
  switch (label) {
    case 'Läkarintyg':
      return 'MEDICAL_CONFIRMATION';
    case 'Medicinskt utlåtande':
      return 'MEDICAL_OPINION';
    default:
      return undefined;
  }
};

export const getAttachmentLabel = (attachment: Attachment) =>
  FTAttachmentLabels[attachment?.category as keyof typeof FTAttachmentLabels] || 'Okänt';

export const mapAttachmentsToUploadFiles = (attachments: Attachment[]): UploadFile[] => {
  return attachments.map((attachment) => {
    // Casedata v13 no longer returns the file content in the attachment list (only
    // metadata + a SHA-256 hash). The list widget only needs metadata, so we build an
    // empty File that carries the name/type. The raw bytes are fetched on demand via
    // downloadAttachment when the user opens/downloads a specific attachment.
    const file = new File([], attachment.name + '.' + (attachment.extension || ''), { type: attachment.mimeType });

    const nameWithoutExtension = attachment.name.replace(/\.[^/.]+$/, '');

    return {
      id: attachment.id || '',
      file,
      meta: {
        name: nameWithoutExtension,
        ending: attachment.extension,
        category: attachment.category,
        note: attachment.note,
        created: attachment.created,
        ...attachment.extraParameters,
      },
    };
  });
};

export const withRetries: <T>(retries: number, func: () => Promise<T>) => Promise<T | boolean> = (retries, func) => {
  return func().catch((e) => {
    if (retries > 0) {
      return withRetries(retries - 1, func);
    } else {
      console.error('Out of retries, throwing original exception');
      throw e;
    }
  });
};

export const editAttachment = (
  municipalityId: string,
  errandId: number,
  attachmentId: string,
  attachmentName: string,
  attachmentType: string
) => {
  const obj: Partial<Attachment> = {
    name: attachmentName,
    category: attachmentType,
  };
  return apiService
    .patch<boolean, Partial<Attachment>>(
      `casedata/${municipalityId}/errands/${errandId}/attachments/${attachmentId}`,
      obj
    )
    .then((res) => {
      return res;
    })
    .catch((e) => {
      console.error('Something went wrong when creating attachment ', obj.category);
      throw e;
    });
};

export const sendAttachments = (
  municipalityId: string,
  errandId: number,
  errandNumber: string,
  attachmentData: { type: string; file: File[]; attachmentName: string }[]
) => {
  const attachmentPromises = attachmentData.map(async (attachment) => {
    const fileItem = attachment.file[0];

    if (fileItem.size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
      throw new Error('MAX_SIZE');
    }
    if (!attachment.type) {
      throw new Error('TYPE_MISSING');
    }

    const extension = fileItem.name.split('.').pop() || '';
    const nameWithoutExtension =
      attachment.attachmentName ?
        attachment.attachmentName.replace(/\.[^/.]+$/, '')
      : fileItem.name.replace(/\.[^/.]+$/, '');
    const mimeType = extension === 'msg' ? 'application/vnd.ms-outlook' : fileItem.type;

    // Send the raw file directly as multipart; the backend forwards it to Casedata v13
    // as binary. No base64 round-trip is needed.
    const formData = new FormData();
    formData.append('files', fileItem, fileItem.name);
    formData.append('category', attachment.type);
    formData.append('mimeType', mimeType);
    formData.append('extension', extension);
    formData.append('name', nameWithoutExtension);
    formData.append('note', '');
    formData.append('errandNumber', errandNumber);

    const postAttachment = () =>
      apiService
        .post<boolean, FormData>(`casedata/${municipalityId}/errands/${errandId}/attachments`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => res)
        .catch((e) => {
          console.error('Something went wrong when creating attachment ', attachment.type);
          throw e;
        });

    return withRetries(3, postAttachment);
  });

  return Promise.all(attachmentPromises).then(() => true);
};

export const deleteAttachment = (municipalityId: string, errandId: number, attachment: UploadFile) => {
  if (!attachment.id) {
    console.error('No id found, cannot continue.');
    return;
  }
  const attachmentId = attachment.id;

  return apiService
    .deleteRequest<boolean>(`casedata/${municipalityId}/errands/${errandId}/attachments/${attachmentId}`)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      console.error('Something went wrong when removing attachment ', attachmentId);
      throw e;
    });
};

// Fetches the raw file content of a single attachment. Casedata v13 streams the
// binary content, which the backend re-encodes to a base64 string, so `data` holds
// the base64-encoded file content (not attachment metadata).
export const fetchAttachment: (
  municipalityId: string,
  errandId: number,
  attachmentId: string
) => Promise<ApiResponse<string>> = (municipalityId, errandId, attachmentId) => {
  if (!attachmentId) {
    console.error('No attachment id found, cannot fetch. Returning.');
  }

  const url = `casedata/${municipalityId}/errands/${errandId}/attachments/${attachmentId}`;
  return apiService
    .get<ApiResponse<string>>(url)
    .then((res) => res.data)
    .catch((e) => {
      console.error('Something went wrong when fetching attachment: ', attachmentId);
      throw e;
    });
};

// Downloads a single attachment's content on demand: fetches the base64 content and
// triggers a browser download via a data: URI (mirrors the conversation-attachment
// download in rendered-message.component.tsx).
export const downloadAttachment = async (
  municipalityId: string,
  errandId: number,
  attachmentId: string,
  fileName: string,
  mimeType: string
): Promise<void> => {
  const res = await fetchAttachment(municipalityId, errandId, attachmentId);
  const base64 = res.data;
  if (!base64) {
    throw new Error('Attachment content is empty');
  }
  const uri = `data:${mimeType || 'application/octet-stream'};base64,${base64}`;
  const link = document.createElement('a');
  link.href = uri;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const fetchErrandAttachments: (
  municipalityId: string,
  errandId: number
) => Promise<ApiResponse<Attachment[]>> = (municipalityId, errandId) => {
  if (!errandId) {
    console.error('No errand id found, cannot fetch. Returning.');
  }
  const url = `casedata/${municipalityId}/errand/${errandId}/attachments`;
  return apiService
    .get<ApiResponse<Attachment[]>>(url)
    .then((res) => res.data)
    .catch(() => {
      console.error('Something went wrong when fetching attachments for errand: ', errandId);
      return { data: [], message: 'error' };
    });
};
