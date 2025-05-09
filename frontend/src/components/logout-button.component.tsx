import { Button, cx } from '@sk-web-gui/react';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { useRouter } from 'next/navigation';

interface LogoutButtonProps {
  collapsed?: boolean;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ collapsed = false }) => {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/logout');
  };

  return (
    <div className="flex justify-center w-full">
      <Button
        onClick={handleLogout}
        variant="ghost"
        size="md"
        color="primary"
        className={cx('w-full hover:bg-dark-ghost', !collapsed ? 'justify-start' : '')}
        leftIcon={<LucideIcon name="log-out" />}
        aria-label="Logga ut"
        iconButton={collapsed}
      >
        {!collapsed && <span className="w-full flex justify-between">Logga ut</span>}
      </Button>
    </div>
  );
};