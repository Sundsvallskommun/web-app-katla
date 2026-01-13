import { AppContext } from '@contexts/app-context-interface';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Badge, Button } from '@sk-web-gui/react';
import { useContext } from 'react';

export const NotificationsBell = (props: { toggleShow: () => void }) => {
  const { notifications } = useContext(AppContext);
  const newCount = notifications.filter((n) => !n.acknowledged).length;

  return (
    <Button
      role="menuitem"
      size="md"
      aria-label="Notifieringar"
      data-cy="notifications-toggle"
      onClick={() => {
        props.toggleShow();
      }}
      variant="tertiary"
      iconButton
      leftIcon={
        <>
          <LucideIcon name={'bell'} />
        </>
      }
    >
      {newCount > 0 && (
        <Badge
          className="absolute -top-10 -right-10 text-white"
          rounded
          color="vattjom"
          counter={newCount > 99 ? '99+' : newCount}
        />
      )}
    </Button>
  );
};
