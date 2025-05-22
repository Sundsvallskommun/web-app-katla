import { getApplicationEnvironment } from '@services/application-service';
import { Logo } from '@sk-web-gui/react';
import { appConfig } from 'src/config/app-config';

export const MobileHeaderLogo: React.FC = () => {
  return (
    <div className="flex items-center flex-1">
      <Logo
        variant="service"
        title={'Draken'}
        subtitle={`${appConfig.applicationName} ` + ` ${getApplicationEnvironment()}`}
        className="flex-shrink-0"
      />
    </div>
  );
};
