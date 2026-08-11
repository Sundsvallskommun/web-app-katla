import { GenericExtraParameters } from './extra-parameters';

export interface Attachment {
  id?: string;
  name: string;
  version?: number;
  created?: string;
  updated?: string;
  category: string;
  note: string;
  extension: string;
  /** Only set locally for new uploads; Casedata v13 no longer returns file content on fetched attachments. */
  file?: string;
  /** SHA-256 hash (hex encoded) of the attachment's raw content, returned by Casedata v13. */
  hash?: string;
  extraParameters?: GenericExtraParameters;
  mimeType: string;
}

export interface MessageAttachment {
  id?: string;
  name: string;
  attachmentId?: string;
  contentType?: string;
  mimeType?: string;
}
