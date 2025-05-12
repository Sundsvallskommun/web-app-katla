'use client';

import { Logo, Divider, Button, Link } from '@sk-web-gui/react';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { UserMenu } from '@sk-web-gui/react';
import { useContext, useState } from 'react';
import { AppContext } from '@contexts/app-context-interface';
import { NotificationsWrapper } from '@components/notifications/notifications-wrapper';
import { useThemeQueries } from '@sk-web-gui/react';
import { menuGroups } from '@components/errand-header/menu-groups';

export const ErrandHeader: React.FC = () => {
  const { user, errand } = useContext(AppContext);
  const { isMaxLargeDevice } = useThemeQueries();
  const [showNotifications, setShowNotifications] = useState(false);

  const LogoPart = (
    <div className="flex items-center flex-shrink-0">
      <a href={`${process.env.NEXT_PUBLIC_BASE_PATH}`} className="flex-shrink-0">
        <Logo variant="symbol" className={isMaxLargeDevice ? 'h-32' : 'h-40'} />
      </a>
      <Divider orientation="vertical" className="mx-[2.4rem]" />
      {!errand.errandNumber ?
        <strong className="text-large">Nytt ärende</strong>
      : <strong className="text-large">{`Ärende ${errand.errandNumber}`}</strong>}
    </div>
  );

  const RightPart = (
    <div className="flex items-center flex-shrink-0 gap-[2.4rem]">
      <UserMenu
        initials={`${user.firstName.charAt(0).toUpperCase()}${user.lastName.charAt(0).toUpperCase()}`}
        menuTitle={`${user.firstName} ${user.lastName} (${user.username})`}
        menuSubTitle=""
        menuGroups={menuGroups}
        buttonSize={isMaxLargeDevice ? 'sm' : 'md'}
        className="flex-shrink-0"
        buttonRounded={false}
      />

      <Button
        variant="tertiary"
        iconButton
        size={isMaxLargeDevice ? 'sm' : 'md'}
        onClick={() => setShowNotifications(true)}
        className="flex-shrink-0"
      >
        <LucideIcon name="bell" />
      </Button>

      <Divider orientation="vertical" />

      <Link href={`${process.env.NEXT_PUBLIC_BASE_PATH}/registrera`} target="_blank">
        <Button
          color="primary"
          variant="tertiary"
          size={isMaxLargeDevice ? 'sm' : 'md'}
          rightIcon={<LucideIcon name="external-link" />}
          className="flex-shrink-0"
        >
          Nytt ärende
        </Button>
      </Link>
    </div>
  );

  return (
    <>
      <nav
        className={
          isMaxLargeDevice ?
            'w-full h-[7rem] px-[1.2rem] py-[1.2rem] flex justify-between items-center bg-background-DEFAULT shadow-100 relative z-10'
          : 'w-full h-[7rem] px-24 flex justify-between items-center bg-background-DEFAULT shadow-100 relative z-10'
        }
      >
        {LogoPart}
        {RightPart}
      </nav>

      {showNotifications && isMaxLargeDevice ?
        <div className="fixed inset-0 z-50 bg-vattjom-background-200">
          <div className="h-[7rem] px-[1.6rem] py-[1.6rem] flex items-center justify-between bg-background-DEFAULT shadow-lg">
            <div className="flex items-center gap-12 text-h4-sm">
              <LucideIcon name="bell" /> Notiser
            </div>
            <Button iconButton variant="tertiary" onClick={() => setShowNotifications(false)}>
              <LucideIcon name="x" />
            </Button>
          </div>
          <div className="overflow-auto p-6">
            <NotificationsWrapper show={showNotifications} setShow={setShowNotifications} />
          </div>
        </div>
      : <NotificationsWrapper show={showNotifications} setShow={setShowNotifications} withSidebar={false} />}
    </>
  );
};
