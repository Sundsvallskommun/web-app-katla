'use client';

import { AppWrapper } from '@contexts/app.context';
import { ColorSchemeMode, GuiProvider } from '@sk-web-gui/react';
import dayjs from 'dayjs';
import 'dayjs/locale/sv';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import { ReactNode } from 'react';

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
  //const colorScheme = useLocalStorage(useShallow((state) => state.colorScheme));
  // const getMe = useUserStore((state) => state.getMe);
  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   getMe();
  //   setMounted(true);
  // }, [getMe, setMounted]);

  // if (!mounted) {
  //   return <LoaderFullScreen />;
  // }

  return (
    <GuiProvider colorScheme={'light' as ColorSchemeMode}>
      <AppWrapper>{children}</AppWrapper>
    </GuiProvider>
  ); //change to colorScheme
};

export default AppLayout;
