import { Attachment } from './attachment';

type MessageType = 'MESSAGE' | 'EMAIL' | 'SMS' | 'WEB_MESSAGE' | 'DIGITAL_MAIL';
export type MessageStatus =
  | 'AWAITING_FEEDBACK'
  | 'PENDING'
  | 'SENT'
  | 'FAILED'
  | 'NO_FEEDBACK_SETTINGS_FOUND'
  | 'NO_FEEDBACK_WANTED';

export enum MessageClassification {
  'Informationsmeddelande' = 'Informationsmeddelande',
  'Efterfrågan komplettering' = 'Efterfrågan komplettering',
  'Hämta yttrande' = 'Hämta yttrande',
  'Intern dialog' = 'Intern dialog',
}

enum Header {
  IN_REPLY_TO = 'IN_REPLY_TO',
  REFERENCES = 'REFERENCES',
  MESSAGE_ID = 'MESSAGE_ID',
}

interface EmailHeader {
  header?: Header;
  values?: string[];
}

interface EmailMessageContent {
  headers: [];
  emailAddress: string;
  subject: string;
  message: string;
  attachments: {
    name: string;
    contentType: string;
    content: string;
  }[];
}

export interface Message {
  content: EmailMessageContent;
  messageType: MessageType;
  status: MessageStatus;
  timestamp: string;
  messageId?: string;
}

export interface MessageResponse {
  messageId?: string;
  errandId?: string;
  municipalityId?: string;
  namespace?: string;
  direction?: string;
  familyId?: string;
  externalCaseId?: string;
  message?: string;
  sent?: string;
  subject?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  messageType?: string;
  mobileNumber?: string;
  recipients?: string[];
  email?: string;
  userId?: string;
  viewed?: string;
  classification?: string;
  attachments?: Attachment[];
  emailHeaders?: EmailHeader[];
}
