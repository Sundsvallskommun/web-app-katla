import { AppContext } from '@contexts/app-context-interface';
import { Notification } from '@interfaces/notification';
import { getCasedataNotifications } from '@services/casedata-notification-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, Divider, cx, useThemeQueries } from '@sk-web-gui/react';
import { useContext, useEffect } from 'react';
import { NotificationItem } from './notification-item';

const sortByCreated = (notifications: Notification[]) => {
  return notifications.sort((a, b) => {
    const dateA = new Date(a.created);
    const dateB = new Date(b.created);
    return dateB.getTime() - dateA.getTime();
  });
};

export const NotificationsWrapper: React.FC<{
  show: boolean;
  setShow: (arg0: boolean) => void;
  withSidebar?: boolean;
}> = ({ show, setShow, withSidebar = true }) => {
  const { municipalityId, notifications, setNotifications } = useContext(AppContext);
  const { isMaxLargeDevice } = useThemeQueries();

  useEffect(() => {
    if (municipalityId) {
      getCasedataNotifications(municipalityId)
        .then((res) => {
          setNotifications(res);
        })
        .catch((e) => {
          console.error('Something went wrong when fetching notifications', e);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [municipalityId]);

  const acknowledgedNotifications = sortByCreated(notifications.filter((n) => n.acknowledged));
  const newNotifications = sortByCreated(notifications.filter((n) => !n.acknowledged));

  return (
    <div className="static">
      {show && (
        <>
          {!isMaxLargeDevice && (
            <div
              className={cx(
                'top-0 bottom-0 h-full absolute bg-primitives-overlay-darken-6 transition-opacity duration-150',
                withSidebar ? 'w-[calc(100vw-32rem)] ml-[32rem]' : 'w-full'
              )}
            ></div>
          )}

          <div
            className={cx(
              'border-1 border-t-0 absolute top-0 bottom-0 bg-background-content h-auto transition-all ease-in-out duration-150 z-[20] overflow-y-auto',
              isMaxLargeDevice ?
                show ? 'w-full left-0 right-0'
                : 'w-0 px-0'
              : show ?
                withSidebar ? 'w-[48rem] right-0 ml-[32rem]'
                : 'w-[48rem] right-0'
              : 'w-0 right-[-48rem]'
            )}
          >
            <div className="py-16 px-40 w-full flex justify-between items-center shadow-lg h-[8rem]">
              <div className="text-h4-sm flex items-center gap-12">
                <LucideIcon name="bell" /> Notiser
              </div>
              <Button
                tabIndex={show ? 0 : -1}
                aria-label="Stäng notiser"
                iconButton
                variant="tertiary"
                onClick={() => setShow(false)}
              >
                <LucideIcon name="x" />
              </Button>
            </div>

            <section className="flex-grow mt-sm mb-0 p-24 pt-0 flex flex-col gap-24 overflow-auto left-0 right-0 max-h-[calc(100vh-8rem)]">
              <div className="flex flex-col gap-4">
                <Divider.Section>
                  <div className="flex gap-sm items-center">
                    <h2 className="text-h4-sm">Nya</h2>
                  </div>
                </Divider.Section>
                {newNotifications.length > 0 ?
                  <ul>
                    {newNotifications.map((notification) => (
                      <li key={notification.id}>
                        <NotificationItem notification={notification} />
                      </li>
                    ))}
                  </ul>
                : <div className="m-md">Inga nya notifieringar</div>}
              </div>
              <div>
                <Divider.Section>
                  <div className="flex gap-sm items-center">
                    <h2 className="text-h4-sm">Tidigare</h2>
                  </div>
                </Divider.Section>
                {acknowledgedNotifications.length > 0 ?
                  <ul>
                    {acknowledgedNotifications.map((notification) => (
                      <li key={notification.id}>
                        <NotificationItem notification={notification} />
                      </li>
                    ))}
                  </ul>
                : <div className="m-md">Inga notifieringar</div>}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
};
