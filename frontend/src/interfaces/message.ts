import { MessageAttachment } from './attachment';

export interface MessageNode extends MessageResponse {
  children?: MessageNode[];
}

export interface MessageResponse {
  messageId?: string;
  direction?: string;
  message: string;
  sent?: string;
  subject?: string;
  firstName?: string;
  lastName?: string;
  messageType?: string;
  viewed?: string;
  attachments?: MessageAttachment[];
  conversationId?: string;
}
