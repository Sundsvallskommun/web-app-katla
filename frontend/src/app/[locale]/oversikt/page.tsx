'use client';

import { OngoingCaseDataErrands } from '@components/ongoing-errands/ongoing-casedata-errands.component';
import { AppContext } from '@contexts/app-context-interface';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import MobileLayout from '@layouts/mobile-layout/mobile-layout';
import { getMe } from '@services/user-service';
import { useThemeQueries } from '@sk-web-gui/react';
import { useContext, useEffect } from 'react';

const Oversikt: React.FC = () => {
  const { setMunicipalityId, setUser } = useContext(AppContext);
  const { isMaxLargeDevice } = useThemeQueries();

  useEffect(() => {
    setMunicipalityId(process.env.NEXT_PUBLIC_MUNICIPALITY_ID || '');
    getMe().then((user) => {
      setUser(user);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isMaxLargeDevice ?
      <MobileLayout />
    : <DefaultLayout>
        <OngoingCaseDataErrands />
      </DefaultLayout>;
};
export default Oversikt;
