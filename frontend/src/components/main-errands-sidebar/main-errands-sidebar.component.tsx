import { CaseDataFilter } from '@components/filtering/errand-filter';
import { NotificationsBell } from '@components/notifications/notifications-bell';
import { NotificationsWrapper } from '@components/notifications/notifications-wrapper';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Avatar, Button, cx, Divider, Logo } from '@sk-web-gui/react';
import NextLink from 'next/link';
import { useState } from 'react';

interface SidebarProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  user: {
    firstName: string;
    lastName: string;
  };
  isLoading: boolean;
  applicationName: string;
  applicationEnvironment: string;
  isNotificationEnabled: boolean;
  casedataFilterForm?: CaseDataFilter;
  onFilterChange: () => void;

  children: React.ReactNode;
}

export const MainErrandsSidebar: React.FC<SidebarProps> = ({
  open,
  setOpen,
  children,
  user,
  applicationName,
  applicationEnvironment,
}) => {
  const MainTitle = (open: boolean) => (
    <NextLink href="/" className="no-underline" aria-label={`Go to homepage`}>
      <Logo
        className={cx(open ? '' : 'w-[2.8rem]')}
        variant={open ? 'service' : 'symbol'}
        title={'Draken'}
        subtitle={applicationName + (applicationEnvironment ? ` ${applicationEnvironment}` : '')}
      />
    </NextLink>
  );

  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <aside
      data-cy="overview-aside"
      className={cx(
        'fixed left-0 transition-all ease-in-out duration-150 flex grow z-10 bg-vattjom-background-200 min-h-screen',
        open ? 'max-lg:shadow-100 sm:w-[32rem] sm:min-w-[32rem]' : 'w-[5.6rem]'
      )}
    >
      <div className={cx('h-full w-full', open ? 'p-24' : '')}>
        <div className={cx('mb-24', open ? '' : 'flex flex-col items-center justify-center pt-[1rem]')}>
          {MainTitle(open)}
        </div>
        <div
          className={cx(
            'h-fit items-center',
            open ? 'pb-24 flex gap-12 justify-between' : 'pb-15 flex flex-col items-center justify-center'
          )}
        >
          {open && (
            <div className="flex gap-12 justify-between items-center">
              <Avatar
                data-cy="avatar-aside"
                className="flex-none"
                size="md"
                initials={`${user.firstName.charAt(0).toUpperCase()}${user.lastName.charAt(0).toUpperCase()}`}
                color="vattjom"
              />
              <span className="leading-tight h-fit font-bold mb-0" data-cy="userinfo">
                {user.firstName} {user.lastName}
              </span>
            </div>
          )}

          <NotificationsBell toggleShow={() => setShowNotifications(!showNotifications)} />
        </div>
        <Divider className={cx(open ? '' : 'w-[4rem] mx-auto')} />
        <div className={cx('flex flex-col gap-8', open ? 'py-24' : 'items-center justify-center py-15')}>
          {children}
        </div>
        <div
          className={cx('absolute bottom-[2.4rem]', open ? 'right-[2.4rem]' : 'left-1/2 transform -translate-x-1/2')}
        >
          <Button
            color="primary"
            size={'md'}
            variant="tertiary"
            aria-label={open ? 'Stäng sidomeny' : 'Öppna sidomeny'}
            iconButton
            leftIcon={open ? <LucideIcon name="chevrons-left" /> : <LucideIcon name="chevrons-right" />}
            onClick={() => setOpen(!open)}
          />
        </div>
      </div>

      <NotificationsWrapper show={showNotifications} setShow={setShowNotifications} />
    </aside>
  );
};
