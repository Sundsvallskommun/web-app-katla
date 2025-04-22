import { AppContext } from '@contexts/app-context-interface';
import { Avatar, Button, Divider } from '@sk-web-gui/react';
import React, { useContext } from 'react';

interface MobileMenuBodyProps {
  children?: React.ReactNode;
  onNewCaseClick?: () => void;
}

export const MobileMenuBody: React.FC<MobileMenuBodyProps> = ({ children, onNewCaseClick }) => {
  const { user } = useContext(AppContext);

  return (
    <div className="flex flex-col w-full bg-vattjom-background-200 p-[1.2rem]">
      <div className="flex items-center p-4 gap-[1.2rem]">
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

      <div className="flex justify-center w-full px-4 mt-[2.4rem]">
        <Button
          size="md"
          color="vattjom"
          className="flex items-center justify-center w-full gap-2 px-4 py-2 text-white"
          onClick={onNewCaseClick}
        >
          <span>Nytt ärende</span>
        </Button>
      </div>

      <div className="py-[2.4rem]">
        <Divider />
      </div>

      <div className="flex flex-col gap-4 p-4">{children}</div>
    </div>
  );
};
