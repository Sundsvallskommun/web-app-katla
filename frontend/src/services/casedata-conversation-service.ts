import { Attachment, MessageAttachment } from '@interfaces/attachment';
import { User } from '@interfaces/user';
import { UploadFile } from '@sk-web-gui/react';
import { ApiResponse, apiService } from './api-service';
import { MessageNode } from '@interfaces/message';

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
  attachments?: MessageAttachment[];
}

//Count functions can be removed if it wont be used for FT
export const countAllMessages = (tree: MessageNode[]): number => {
  if (!tree) {
    return 0;
  }
  let c = 0;
  c += tree.length;
  tree.forEach((root) => {
    c += countAllMessages(root.children ?? []);
  });
  return c;
};

export const countUnreadMessages = (tree: MessageNode[]): number => {
  if (!tree) {
    return 0;
  }
  let c = 0;
  c += tree.filter((node) => !node.viewed).length;
  tree.forEach((root) => {
    c += countUnreadMessages(root.children ?? []);
  });
  return c;
};


export const getConversations: (errandId: number) => Promise<ApiResponse<Conversation[]>> = (
  errandId
) => {
  if (!errandId) {
    console.error('No errand id found, cannot fetch. Returning.');
  }

  const url = `casedata/namespace/errands/${errandId}/communication/conversations`;
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
  errandId: number,
  conversationId: string
) => Promise<ApiResponse<MessageNode[]>> = (errandId, conversationId) => {
  if (!errandId) {
    console.error('No errand id found, cannot fetch. Returning.');
  }

  const url = `casedata/namespace/errands/${errandId}/communication/conversations/${conversationId}/messages`;
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

export const createConversation = async (errandId: number, user: User, topic: string) => {
  const res = await getConversations(errandId);
if (res && res.data && res.data.length > 0) {
  const conversation = res.data.find(
    (item) => item.type === "INTERNAL" && Array.isArray(item.relationIds) && item.relationIds.length === 0
  );
  if (conversation) {
    return {
      data: {
        id: conversation.id,
      },
    };
  }
}

  const url = `casedata/namespace/errand/${errandId}/communication/conversations`;

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
  errandId: number,
  conversationId: string,
  user: User,
  message: string,
  files?: UploadFile[]
) => {
  const url = `casedata/namespace/errand/${errandId}/communication/conversations/${conversationId}/messages`;

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
  errandId: number,
  conversationId: string,
  messageId: string,
  attachmentId: string
) => Promise<ApiResponse<Attachment>> = (
  errandId,
  conversationId,
  messageId,
  attachmentId
) => {
  if (!errandId) {
    console.error('No errand id found, cannot fetch. Returning.');
  }

  const url = `casedata/namespace/errands/${errandId}/communication/conversations/${conversationId}/messages/${messageId}/attachments/${attachmentId}`;
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
