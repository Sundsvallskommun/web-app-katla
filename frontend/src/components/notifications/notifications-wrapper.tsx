import { AppContext } from '@contexts/app-context-interface';
import { getCasedataNotifications } from '@services/casedata-notification-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, Divider, cx, useThemeQueries } from '@sk-web-gui/react';
import { useContext, useEffect } from 'react';
import { NotificationItem } from './notification-item';
import { getFilteredNotifications, sortByCreatedDesc } from './notification-utils';

export const NotificationsWrapper: React.FC<{
  show: boolean;
  setShow: (arg0: boolean) => void;
  withSidebar?: boolean;
}> = ({ show, setShow, withSidebar = true }) => {
  const { municipalityId, notifications, setNotifications } = useContext(AppContext);
  const { isMaxMediumDevice } = useThemeQueries();
  const { user } = useContext(AppContext);

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

  const filteredNotifications = getFilteredNotifications(notifications, user?.username || '');

  const acknowledgedNotifications = sortByCreatedDesc(filteredNotifications.filter((n) => n.acknowledged));
  const newNotifications = sortByCreatedDesc(filteredNotifications.filter((n) => !n.acknowledged));

  return (
    <>
      {show && !isMaxMediumDevice && (
        <div
          className={cx(
            'fixed top-0 bottom-0 h-full bg-primitives-overlay-darken-6 transition-opacity duration-150 z-[10]',
            withSidebar ? 'w-[calc(100vw-32rem)] ml-[32rem]' : 'w-full'
          )}
        />
      )}

      {show && (
        <div
          className={cx(
            'fixed top-0 right-0 bottom-0 bg-background-content z-[20] transition-all ease-in-out duration-150',
            isMaxMediumDevice ? 'w-full left-0'
            : withSidebar ? 'w-[48rem] left-[32rem]'
            : 'w-[48rem] left-[5.6rem]'
          )}
        >
          <div className="sticky top-0 z-10 bg-background-content py-16 px-40 w-full flex justify-between items-center shadow-lg h-[8rem]">
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

          <section
            data-cy="notifications-panel"
            className="flex flex-col gap-24 overflow-y-auto max-h-[calc(100vh-8rem)] px-24 pb-24 pt-0"
          >
            <div className="flex flex-col gap-4">
              <Divider.Section>
                <div className="flex gap-sm items-center">
                  <h2 className="text-h4-sm">Nya</h2>
                </div>
              </Divider.Section>
              {newNotifications.length > 0 ?
                <ul data-cy="notifications-list">
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
      )}
    </>
  );
};
