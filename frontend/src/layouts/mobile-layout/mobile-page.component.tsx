import { MobileHeaderLogo } from '@components/mobile-header-logo.component';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button } from '@sk-web-gui/react';
import React from 'react';

type LucideIconName = React.ComponentProps<typeof LucideIcon>['name'];

interface MobilePageProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  lucideIconName?: LucideIconName;
  title?: string;
  children?: React.ReactNode;
}

export const MobilePage: React.FC<MobilePageProps> = ({ open, setOpen, lucideIconName, title, children }) => {
  return (
    <div className="fixed inset-0 z-50 bg-vattjom-background-200 flex flex-col">
      <div className="flex h-[7rem] p-4 gap-3 items-center flex-shrink-0 self-stretch bg-vattjom-background-200 shadow-100 relative z-10">
        {lucideIconName ?
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <LucideIcon name={lucideIconName} className="w-[2rem] h-[2rem]" />
            <div className="font-raleway text-xl font-normal leading-7 text-text-dark-primary overflow-ellipsis whitespace-nowrap flex-1 h-full flex items-center">
              {title}
            </div>
          </div>
        : <MobileHeaderLogo />}
        <div className="gap-2 flex items-center">
          <Button
            color="primary"
            size="md"
            variant="tertiary"
            iconButton
            leftIcon={<LucideIcon name="x" />}
            onClick={() => setOpen(!open)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-vattjom-background-200">{children}</div>
    </div>
  );
};
