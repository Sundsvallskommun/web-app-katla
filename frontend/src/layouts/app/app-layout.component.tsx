'use client';

import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { AppWrapper } from '@contexts/app.context';
import { ColorSchemeMode, ConfirmationDialogContextProvider, defaultTheme, GuiProvider } from '@sk-web-gui/react';
import store from '@services/storage-service';
import { getMe } from '@services/user-service';;
import dayjs from 'dayjs';
import 'dayjs/locale/sv';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import { ReactNode, useEffect, useState } from 'react';

dayjs.extend(utc);
dayjs.locale('sv');
dayjs.extend(updateLocale);
dayjs.updateLocale('sv', {
  months: [
    'Januari',
    'Februari',
    'Mars',
    'April',
    'Maj',
    'Juni',
    'Juli',
    'Augusti',
    'September',
    'Oktober',
    'November',
    'December',
  ],
  monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
});

interface ClientApplicationProps {
  children: ReactNode;
}

const AppLayout = ({ children }: ClientApplicationProps) => {
  const colorScheme = store.get('colorScheme');
  const [mounted, setMounted] = useState(false);

  const theme = {...defaultTheme, screens: {...defaultTheme.screens, 'medium-device-max': '800px', 'large-device-max': '960px',}};

  useEffect(() => {
    getMe();
    setMounted(true);
  }, [setMounted]);

  if (!mounted) {
    return <LoaderFullScreen />;
  }

  return (
    <GuiProvider colorScheme={colorScheme as ColorSchemeMode}>
      <ConfirmationDialogContextProvider>
        <AppWrapper>{children}</AppWrapper>
      </ConfirmationDialogContextProvider>
    </GuiProvider>
  );
};

export default AppLayout;
