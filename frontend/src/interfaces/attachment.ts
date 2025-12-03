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
  file: string;
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
