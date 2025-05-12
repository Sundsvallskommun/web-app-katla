'use client';

import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { AppWrapper } from '@contexts/app.context';
import store from '@services/storage-service';
import { getMe } from '@services/user-service';
import { ColorSchemeMode, GuiProvider } from '@sk-web-gui/react';
import { useLocalStorage } from '@utils/use-localstorage.hook';
import dayjs from 'dayjs';
import 'dayjs/locale/sv';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import { ReactNode, useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

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

  useEffect(() => {
    getMe();
    setMounted(true);
  }, [getMe, setMounted]);

  if (!mounted) {
    return <LoaderFullScreen />;
  }

  return (
    <GuiProvider colorScheme={colorScheme as ColorSchemeMode}>
      <AppWrapper>{children}</AppWrapper>
    </GuiProvider>
  ); //change to colorScheme
};

export default AppLayout;
