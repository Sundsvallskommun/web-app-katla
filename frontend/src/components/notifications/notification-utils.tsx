import { Notification } from '@interfaces/notification';

export const labelBySubType: Record<string, string> = {
  ATTACHMENT: 'Ny bilaga',
  DECISION: 'Nytt beslut',
  ERRAND: 'Ärende uppdaterat',
  MESSAGE: 'Nytt meddelande',
  NOTE: 'Ny kommentar/anteckning',
  SYSTEM: 'Fasbyte',
  SUSPENSION: 'Parkering upphört',
};

export const getNotificationKey = (notification: Notification): string | undefined => {
  return notification.subType?.toUpperCase();
};

export const sortByCreatedDesc = (notifications: Notification[]): Notification[] => {
  return [...notifications].sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
};
