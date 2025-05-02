import { Button } from '@sk-web-gui/react';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { useRouter } from 'next/navigation';

export const LogoutButton: React.FC = () => {
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
        className="justify-start w-full hover:bg-dark-ghost"
        leftIcon={<LucideIcon name="log-out" />}
      >
        <span className="w-full flex justify-between">Logga ut</span>
      </Button>
    </div>
  );
};
