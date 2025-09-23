import { getApplicationEnvironment } from '@services/application-service';
import { Logo } from '@sk-web-gui/react';
import { appConfig } from 'src/config/app-config';

export const MobileHeaderLogo: React.FC = () => {
  return (
    <div className="flex items-center min-w-0 flex-1">
      <Logo
        variant="service"
        title="Draken"
        subtitle={`${appConfig.applicationName} ${getApplicationEnvironment()}`}
        className="min-w-0 flex-1 overflow-hidden whitespace-nowrap"
      />
    </div>
  );
};
