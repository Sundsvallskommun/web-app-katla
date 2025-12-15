import { AppContext } from '@contexts/app-context-interface';
import { getCasedataNotifications } from '@services/casedata-notification-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, Divider, cx, useThemeQueries } from '@sk-web-gui/react';
import { useContext, useEffect } from 'react';
import { NotificationItem } from './notification-item';
import { sortByCreatedDesc } from './notification-utils';
import { SidebarMode } from '@interfaces/sidebarmode';
export interface NotificationsWrapperProps {
  show: boolean;
  setShow: (arg0: boolean) => void;
  sidebarMode?: SidebarMode;
}

export const NotificationsWrapper: React.FC<NotificationsWrapperProps> = ({
  show,
  setShow,
  sidebarMode = SidebarMode.EXPANDED,
}) => {
  const { notifications, setNotifications } = useContext(AppContext);
  const { isMaxMediumDevice } = useThemeQueries();

  useEffect(() => {
    getCasedataNotifications()
      .then((res) => {
        setNotifications(res);
      })
      .catch((e) => {
        console.error('Something went wrong when fetching notifications', e);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const acknowledgedNotifications = sortByCreatedDesc(notifications.filter((n) => n.acknowledged));
  const newNotifications = sortByCreatedDesc(notifications.filter((n) => !n.acknowledged));

  // Overlay till vänster om panelen (bara desktop)
  const overlayClass =
    isMaxMediumDevice ? ''
    : sidebarMode === SidebarMode.EXPANDED ? 'w-[calc(100vw-32rem)] ml-[32rem]'
    : sidebarMode === SidebarMode.COLLAPSED ? 'w-[calc(100vw-5.6rem)] ml-[5.6rem]'
    : 'w-full';

  // Panelens position och bredd
  const panelClass =
    isMaxMediumDevice ? 'w-full left-0'
    : sidebarMode === SidebarMode.EXPANDED ? 'w-[48rem] left-[32rem]'
    : sidebarMode === SidebarMode.COLLAPSED ? 'w-[48rem] left-[5.6rem]'
    : 'w-[48rem] left-0';

  return (
    <>
      {show && !isMaxMediumDevice && (
        <div
          className={cx(
            'fixed top-0 bottom-0 h-full bg-primitives-overlay-darken-6 transition-opacity duration-150 z-[10]',
            overlayClass
          )}
        />
      )}

      {show && (
        <div
          className={cx(
            'fixed top-0 right-0 bottom-0 bg-background-content z-[20] transition-all ease-in-out duration-150',
            panelClass
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
            <div className="flex flex-col gap-4 mt-[2.5rem]">
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
