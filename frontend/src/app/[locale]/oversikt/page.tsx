'use client';

// import { OngoingCaseDataErrands } from '@casedata/components/ongoing-casedata-errands/ongoing-casedata-errands.component';
// import Layout from '@common/components/layout/layout.component';
// import SidebarLayout from '@common/components/layout/sidebar-layout.component';
// import { useAppContext } from '@common/contexts/app.context';
// import { getApplicationName, isKC, isPT, isMEX, isLOP, isIK } from '@common/services/application-service';
// import { getAdminUsers } from '@common/services/user-service';
// import { OngoingSupportErrands } from '@supportmanagement/components/ongoing-support-errands/ongoing-support-errands.component';
// import { getSupportMetadata } from '@supportmanagement/services/support-metadata-service';
// import { useRouter } from 'next/router';
// import { useEffect, useRef, useState } from 'react';
// import { AttestationTab } from '@supportmanagement/components/attestation-tab/attestation-tab.component';

import { OngoingErrands } from '@components/ongoing-errands/ongoing-errands.component';
import { AppContext } from '@contexts/app-context-interface';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { getAdminUsers } from '@services/user-service';
import { useContext, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import { useEffect, useRef } from 'react';

const Oversikt: React.FC = () => {
  // const router = useRouter();

  //  const { user, isLoggedIn, administrators, setAdministrators, municipalityId, setMunicipalityId, setSupportMetadata } =
  //  useAppContext();
  //   const [showAttestationTable, setShowAttestationTable] = useState<boolean>(false);

  //  useEffect(() => {
  //    if (!isLoggedIn) {
  //      // router.push('/login');
  //    }
  //  }, [isLoggedIn, router]);

  //  const initialFocus = useRef(null);
  //  const setInitalFocus = (e) => {
  //    setTimeout(() => {
  //      initialFocus.current && initialFocus.current.focus();
  //    });

  const { setAdministrators, setMunicipalityId } = useContext(AppContext);

  useEffect(() => {
    setMunicipalityId(process.env.NEXT_PUBLIC_MUNICIPALITY_ID || '');
    getAdminUsers().then(setAdministrators);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DefaultLayout>
      <OngoingErrands></OngoingErrands>
    </DefaultLayout>
  );
};

//   useEffect(() => {
//     setMunicipalityId(process.env.NEXT_PUBLIC_MUNICIPALITY_ID);
//     getAdminUsers().then(setAdministrators);
//   }, []);

//   useEffect(() => {
//     (isKC() || isIK() || isLOP()) &&
//       municipalityId &&
//       getSupportMetadata(municipalityId).then((res) => setSupportMetadata(res.metadata));
//   }, [municipalityId]);

export default Oversikt;
