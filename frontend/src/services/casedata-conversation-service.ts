import { Attachment } from '@interfaces/attachment';
import { User } from '@interfaces/user';
import { UploadFile } from '@sk-web-gui/react';
import { ApiResponse, apiService } from './api-service';
import { MessageNode } from './casedata-message-service';

export enum ConversationType {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
}

export interface Identifier {
  type?: string;
  value: string;
}

export interface KeyValues {
  key?: string;
  values?: string[];
}

export interface Conversation {
  id?: string;
  topic: string;
  type: ConversationType;
  relationIds?: string[];
  participants?: Identifier[];
  metadata?: KeyValues[];
}

export interface ReadBy {
  identifier?: Identifier;
  readAt?: string;
}

export interface Message {
  id?: string;
  inReplyToMessageId?: string;
  created?: string;
  createdBy?: Identifier;
  content: string;
  readBy?: ReadBy[];
  attachments?: Attachment[];
}

export const getConversations: (municipalityId: string, errandId: number) => Promise<ApiResponse<Conversation[]>> = (
  municipalityId,
  errandId
) => {
  if (!errandId) {
    console.error('No errand id found, cannot fetch. Returning.');
  }

  const url = `casedata/${municipalityId}/namespace/errands/${errandId}/communication/conversations`;
  return apiService
    .get<ApiResponse<Conversation[]>>(url)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      console.error('Something went wrong when fetching conversation for errand: ', errandId);
      throw e;
    });
};

export const getConversationMessages: (
  municipalityId: string,
  errandId: number,
  conversationId: string
) => Promise<ApiResponse<MessageNode[]>> = (municipalityId, errandId, conversationId) => {
  if (!errandId) {
    console.error('No errand id found, cannot fetch. Returning.');
  }

  const url = `casedata/${municipalityId}/namespace/errands/${errandId}/communication/conversations/${conversationId}/messages`;
  return apiService
    .get<ApiResponse<MessageNode[]>>(url)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      console.error('Something went wrong when fetching conversation messages for errand: ', errandId);
      throw e;
    });
};

export const createConversation = async (municipalityId: string, errandId: number, user: User, topic: string) => {
  const res = await getConversations(municipalityId, errandId);
  if (res && res.data && res.data.length > 0) {
    return {
      data: {
        id: res.data[0].id,
      },
    };
  }

  const url = `${municipalityId}/namespace/errand/${errandId}/communication/conversations`;

  const body: Partial<Conversation> = {
    topic: topic,
    type: ConversationType.INTERNAL,
    participants: [
      {
        type: 'adAccount',
        value: user.username,
      },
    ],
  };

  return apiService
    .post<ApiResponse<Conversation>, Partial<Conversation>>(url, body)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      console.error('Something went wrong when creating relation: ' + e);
      throw e;
    });
};

export const sendInternalMessage = (
  municipalityId: string,
  errandId: number,
  conversationId: string,
  user: User,
  message: string,
  files?: UploadFile[]
) => {
  const url = `${municipalityId}/namespace/errand/${errandId}/communication/conversations/${conversationId}/messages`;

  const formData = new FormData();
  formData.append(
    'message',
    JSON.stringify({
      content: message,
    })
  );
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append('attachments', file.file);
    });
  }

  return apiService
    .post<ApiResponse<Message>, FormData>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data)
    .catch((e) => {
      console.error('Something went wrong when creating relation: ' + e);
      throw e;
    });
};

export const getConversationAttachment: (
  municipalityId: string,
  namespace: string,
  errandId: number,
  conversationId: string,
  messageId: string,
  attachmentId: string
) => Promise<ApiResponse<Attachment>> = (
  municipalityId,
  namespace,
  errandId,
  conversationId,
  messageId,
  attachmentId
) => {
  if (!errandId) {
    console.error('No errand id found, cannot fetch. Returning.');
  }

  const url = `casedata/${municipalityId}/${namespace}/errands/${errandId}/communication/conversations/${conversationId}/messages/${messageId}/attachments/${attachmentId}`;
  return apiService
    .get<ApiResponse<Attachment>>(url)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      console.error('Something went wrong when fetching conversation attachment for errand: ', errandId);
      throw e;
    });
};
