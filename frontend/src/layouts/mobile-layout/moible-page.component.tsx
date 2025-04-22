import { Button, Logo } from '@sk-web-gui/react';
import LucideIcon from '@sk-web-gui/lucide-icon';
import React from 'react';
import { IconName } from 'lucide-react/dynamic';

interface MobilePageProps {
  open: boolean;
  setOpen?: (state: boolean) => void;
  lucideIconName?: IconName;
  title?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  sundsvallHeader?: boolean;
}

export const MobilePage: React.FC<MobilePageProps> = ({
  open,
  setOpen,
  lucideIconName,
  title,
  children,
  onClose,
  sundsvallHeader = false,
}) => {
  if (!open) return null;

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (setOpen) {
      setOpen(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 bg-vattjom-background-200 flex flex-col`}>
      <div className="flex h-[7rem] p-[1.6rem] gap-[1.2rem] items-center flex-shrink-0 self-stretch bg-vattjom-background-200 shadow-100 relative z-10">
        {sundsvallHeader ?
          <div className="flex items-center flex-1">
            <Logo variant="service" title={'Draken'} subtitle={'Färdtjänst'} className="flex-shrink-0" />
          </div>
        : <div className="flex items-center gap-[1.2rem] flex-1 min-w-0">
            <LucideIcon name={lucideIconName} className="w-[2rem] h-[2rem]" />
            <div className="font-raleway text-xl font-normal leading-7 text-text-dark-primary overflow-ellipsis whitespace-nowrap flex-1 h-full flex items-center">
              {title}
            </div>
          </div>
        }
        <div className="gap-[1.2rem] flex items-center">
          <Button
            color="primary"
            size="md"
            variant="tertiary"
            iconButton
            leftIcon={<LucideIcon name="x" />}
            onClick={handleClose}
          />
        </div>
      </div>
      <div className={`flex-1 overflow-auto bg-vattjom-background-200`}>{children}</div>
    </div>
  );
};
