import { acknowledgeCasedataNotification, getCasedataNotifications } from '@services/casedata-notification-service';
import { Notification } from '@interfaces/notification';
import { prettyTime } from '@services/helper-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Avatar, cx, useSnackbar } from '@sk-web-gui/react';
import NextLink from 'next/link';
import { useContext } from 'react';
import { AppContext } from '@contexts/app-context-interface';

const iconConfig = {
  'Meddelande mottaget': { icon: 'message-circle', defaultColor: 'gronsta' },
  'Parkering av ärendet har upphört': { icon: 'bell-ring', defaultColor: 'juniskar' },
  'Ärende uppdaterat': { icon: 'bell-ring', defaultColor: 'juniskar' },
  'En bilaga har lagts till i ärendet.': { icon: 'file', defaultColor: 'vattjom' },
  'Notering skapad': { avatar: true, defaultColor: 'juniskar' },
  default: { icon: 'bell', defaultColor: 'vattjom' },
};

const labelBySubType: Record<string, string> = {
  ATTACHMENT: 'Ny bilaga',
  DECISION: 'Nytt beslut',
  ERRAND: 'Ärende uppdaterat',
  MESSAGE: 'Nytt meddelande',
  NOTE: 'Ny kommentar/anteckning',
  SYSTEM: 'Fasbyte',
  SUSPENSION: 'Parkering upphört',
};

const renderIcon = (notification: Notification) => {
  const config = iconConfig[notification.description as keyof typeof iconConfig] ?? iconConfig.default;
  const color = notification.acknowledged ? 'primary' : config.defaultColor;

  if ('avatar' in config && config.avatar) {
    return (
      <div className={cx(`w-[4rem] h-[4rem] rounded-12 flex items-center justify-center bg-${color}-surface-accent`)}>
        <Avatar
          data-cy="avatar-aside"
          className="flex-none"
          size="md"
          initials={`${notification.createdByFullName?.split(' ')[1]?.charAt(0).toUpperCase()}${notification.createdByFullName?.split(' ')[0]?.charAt(0).toUpperCase()}`}
          color={color}
        />
      </div>
    );
  }

  return (
    <div
      className={cx(
        `w-[4rem] h-[4rem] rounded-12 flex items-center justify-center ${
          notification.acknowledged ? 'bg-tertiary-surface' : `bg-${color}-surface-accent`
        }`
      )}
    >
      {'icon' in config && (
        <LucideIcon
          name={config.icon as 'message-circle' | 'bell-ring' | 'file' | 'bell'}
          color={
            color as
              | 'gronsta'
              | 'juniskar'
              | 'vattjom'
              | 'primary'
              | 'error'
              | 'info'
              | 'success'
              | 'warning'
              | 'bjornstigen'
              | 'tertiary'
          }
          size="2.4rem"
        />
      )}
    </div>
  );
};

export const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const { municipalityId, setNotifications } = useContext(AppContext);
  const toastMessage = useSnackbar();
  const subTypeLabel = notification.subType?.toUpperCase() && labelBySubType[notification.subType?.toUpperCase()];

  return (
    <div className="p-16 flex gap-12 items-start justify-between text-small">
      <div className="flex items-center my-xs">{renderIcon(notification)}</div>
      <div className="flex-grow">
        <div>
          <strong>{notification.description + ' › '}</strong>
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
        <div>Från {notification.createdByFullName || notification.createdBy || '(Okänt)'}</div>
        {subTypeLabel ?
          <div>Händelse: {subTypeLabel}</div>
        : null}
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
