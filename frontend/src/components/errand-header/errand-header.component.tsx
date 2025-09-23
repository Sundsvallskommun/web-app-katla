'use client';

import { getMenuGroups } from '@components/errand-header/menu-groups';
import { NotificationsWrapper } from '@components/notifications/notifications-wrapper';
import { StatusLabelComponent } from '@components/ongoing-errands/components/casedata-status-label.component';
import { AppContext } from '@contexts/app-context-interface';
import { SidebarMode } from '@interfaces/sidebarmode';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, Divider, Link, Logo, UserMenu, cx, useThemeQueries } from '@sk-web-gui/react';
import { useContext, useState } from 'react';

export const ErrandHeader: React.FC = () => {
  const { user, errand } = useContext(AppContext);
  const { isMaxMediumDevice } = useThemeQueries();
  const [showNotifications, setShowNotifications] = useState(false);

  const LogoPart = (
    <div className="flex items-center flex-shrink-0">
      <a href={`${process.env.NEXT_PUBLIC_BASE_PATH}`} className="flex-shrink-0">
        <Logo variant="symbol" className={isMaxMediumDevice ? 'h-32' : 'h-40'} />
      </a>
      <Divider orientation="vertical" className="mx-[2.4rem]" />
      {!isMaxMediumDevice && (
        <>
          <StatusLabelComponent status={errand?.status?.statusType} />
          <strong className="text-large ml-8 font-bold">{!errand.errandNumber ? 'Nytt ärende' : 'Ärende:'}</strong>
          {errand.errandNumber && <span className="text-large ml-4">{` ${errand.errandNumber}`}</span>}
        </>
      )}
    </div>
  );

  const RightPart = (
    <div className="flex items-right flex-shrink-0 gap-[2.4rem]">
      <UserMenu
        initials={`${user.firstName.charAt(0).toUpperCase()}${user.lastName.charAt(0).toUpperCase()}`}
        menuTitle={`${user.firstName} ${user.lastName} (${user.username})`}
        menuSubTitle=""
        menuGroups={getMenuGroups(true)}
        buttonSize={isMaxMediumDevice ? 'sm' : 'md'}
        className="flex-shrink-0"
        buttonRounded={false}
      />

      <Button
        variant="tertiary"
        iconButton
        size={isMaxMediumDevice ? 'sm' : 'md'}
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
          size={isMaxMediumDevice ? 'sm' : 'md'}
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
        className={cx(
          'w-full h-[7rem] flex items-center bg-background-DEFAULT shadow-100 relative z-10',
          isMaxMediumDevice ? 'p-[1.2rem] gap-[2.4rem] justify-between' : 'px-24 justify-between'
        )}
      >
        {LogoPart}
        {RightPart}
      </nav>

      {showNotifications && isMaxMediumDevice ?
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
      : <NotificationsWrapper show={showNotifications} setShow={setShowNotifications} sidebarMode={SidebarMode.NONE} />}
    </>
  );
};
