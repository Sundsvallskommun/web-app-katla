import { acknowledgeCasedataNotification, getCasedataNotifications } from '@services/casedata-notification-service';
import { Notification } from '@interfaces/notification';
import { prettyTime } from '@services/helper-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { cx, useSnackbar } from '@sk-web-gui/react';
import NextLink from 'next/link';
import { useContext } from 'react';
import { AppContext } from '@contexts/app-context-interface';

export const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const { municipalityId, setNotifications } = useContext(AppContext);
  const toastMessage = useSnackbar();

  const color = notification.acknowledged ? 'tertiary' : 'info';
  return (
    <div className="p-16 flex gap-12 items-start justify-between text-small">
      <div className="flex items-center my-xs">
        <LucideIcon.Padded name="message-circle" color={color} inverted size="4rem" />
      </div>
      <div className="flex-grow">
        <div>
          {notification.description}{' '}
          <NextLink
            href={`/arende/${municipalityId}/${notification.errandNumber}`}
            target="_blank"
            onClick={async () => {
              try {
                await acknowledgeCasedataNotification(municipalityId, notification as Notification).catch(() => {
                  throw new Error('Failed to acknowledge notification');
                });

                const getNotifications = getCasedataNotifications;
                const notifications = await getNotifications(municipalityId);
                setNotifications(notifications);
              } catch (error) {
                toastMessage({
                  position: 'bottom',
                  closeable: false,
                  message: 'Något gick fel när notifieringen skulle kvitteras',
                  status: 'error',
                });
                throw error;
              }
            }}
            className="underline whitespace-nowrap"
          >
            {notification.errandNumber || 'Till ärendet'}
          </NextLink>
        </div>
        <div>Från {notification.createdByFullName || notification.createdBy || '(okänt)'}</div>
      </div>
      <span className="whitespace-nowrap">{prettyTime(notification.created)}</span>
      {!notification.acknowledged ?
        <div>
          <span
            className={cx(
              notification.acknowledged ? 'bg-gray-200' : `bg-vattjom-surface-primary`,
              `w-12 h-12 my-xs rounded-full flex items-center justify-center text-lg`
            )}
          ></span>
        </div>
      : null}
    </div>
  );
};
