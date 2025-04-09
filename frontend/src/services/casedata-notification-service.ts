import { PatchNotificationDto } from '@data-contracts/backend/data-contracts';
import { IErrand } from '@interfaces/errand';
import { Notification } from '@interfaces/notification';
import { apiService } from '@services/api-service';

export const getCasedataNotifications: (municipalityId: string) => Promise<Notification[]> = (municipalityId) => {
  return apiService
    .get<Notification[]>(`casedatanotifications/${municipalityId}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      console.error('Something went wrong when fetching notifications');
      throw e;
    });
};

export const acknowledgeCasedataNotification: (
  municipalityId: string,
  notification: Notification
) => Promise<boolean> = (municipalityId, notification) => {
  if (!notification.id) {
    return Promise.reject('Missing id on notification');
  }
  const data: PatchNotificationDto = {
    id: notification.id,
    errandId: notification.errandId,
    ownerId: notification.ownerId,
    type: notification.type,
    description: notification.description,
    content: notification.content,
    expires: notification.expires,
    acknowledged: true,
  };
  return apiService
    .patch<boolean, PatchNotificationDto>(`casedatanotifications/${municipalityId}`, data)
    .then(() => {
      return true;
    })
    .catch((e) => {
      console.error('Something went wrong when acknowledging notification');
      throw e;
    });
};

export const globalAcknowledgeCasedataNotification: (errand: IErrand, municipalityId: string) => Promise<boolean> = (
  errand,
  municipalityId
) => {
  if (!errand.id) {
    return Promise.reject('Missing id on notification');
  }
  return apiService
    .put(`casedatanotifications/${municipalityId}/${errand.id}/global-acknowledged`, {})
    .then(() => {
      return true;
    })
    .catch((e) => {
      console.error('Something went wrong when acknowledging notification');
      throw e;
    });
};
