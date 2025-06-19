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

export const getFilteredNotifications = (notifications: Notification[], currentUsername: string): Notification[] => {
  const username = currentUsername.toLowerCase();

  return notifications.filter((n) => {
    const subType = getNotificationKey(n);
    const createdBy = (n.createdBy || '').toLowerCase();

    return !(subType === 'SYSTEM' && (createdBy === username || createdBy === 'unknown'));
  });
};

export const sortByCreatedDesc = (notifications: Notification[]): Notification[] => {
  return [...notifications].sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
};
