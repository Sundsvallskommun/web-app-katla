'use client';

import { NotificationsBell } from '@components/notifications/notifications-bell';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, Logo } from '@sk-web-gui/react';
import { getApplicationEnvironment } from 'src/common/application-service';
import { appConfig } from 'src/config/app-config';

interface MobileMainPageHeaderProps {
  openNotification: boolean;
  openSearch: boolean;
  openMenu: boolean;
  setOpenNotification: (state: boolean) => void;
  setOpenSearch: (state: boolean) => void;
  setOpenMenu: (state: boolean) => void;
  children: React.ReactNode;
}

export const MobileMainPageHeader: React.FC<MobileMainPageHeaderProps> = ({
  openNotification,
  openSearch,
  openMenu,
  setOpenNotification,
  setOpenSearch,
  setOpenMenu,
  children,
}) => {
  const applicationEnvironment = getApplicationEnvironment();

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <div className="flex h-[7rem] p-[1.6rem] gap-[1.2rem] items-center flex-shrink-0 self-stretch bg-vattjom-background-200 shadow-100 relative z-10">
        <div className="flex items-center flex-1">
          <Logo
            variant="service"
            title={'Draken'}
            subtitle={appConfig.applicationName + (applicationEnvironment ? ` ${applicationEnvironment}` : '')}
            className="flex-shrink-0"
          />
        </div>
        <div className="flex items-center gap-[2rem]">
          <NotificationsBell toggleShow={() => setOpenNotification(!openNotification)} />
          <Button
            color="primary"
            size="md"
            variant="tertiary"
            iconButton
            leftIcon={<LucideIcon name="search" />}
            onClick={() => setOpenSearch(!openSearch)}
            className="!p-0"
          />
          <Button
            color="primary"
            size="md"
            variant="tertiary"
            iconButton
            leftIcon={<LucideIcon name="menu" className="w-[2rem] h-[2rem]" />}
            onClick={() => setOpenMenu(!openMenu)}
            className="!p-0"
          />
        </div>
      </div>

      {children && <div className="flex-1 overflow-scroll bg-background-content">{children}</div>}
    </div>
  );
};
