'use client';

import { OngoingErrands } from '@components/ongoing-errands/ongoing-errands.component';
import { AppContext } from '@contexts/app-context-interface';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { getMe } from '@services/user-service';
import { useContext, useEffect } from 'react';

const Oversikt: React.FC = () => {
  const { setMunicipalityId, setUser } = useContext(AppContext);

  useEffect(() => {
    setMunicipalityId(process.env.NEXT_PUBLIC_MUNICIPALITY_ID || '');
    //getAdminUsers().then(setAdministrators);
    getMe().then((user) => {
      setUser(user);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DefaultLayout>
      <OngoingErrands></OngoingErrands>
    </DefaultLayout>
  );
};

export default Oversikt;
