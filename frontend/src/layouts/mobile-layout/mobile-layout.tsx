'use client';

import { CasedataFilterSidebarStatusSelector } from '@components/filtering/desktop-filtering/errand-filter-sidebarstatus-selector.component';
import { CaseDataFilter, CaseStatusValues } from '@components/filtering/errand-filter';
import { LogoutButton } from '@components/logout-button.component';
import { NotificationsWrapper } from '@components/notifications/notifications-wrapper';
import { MobileErrandsList } from '@layouts/mobile-layout/mobile-errands-list.component';
import { MobileMainPageHeader } from '@layouts/mobile-layout/mobile-main-page-header.component';
import { MobileMenuBody } from '@layouts/mobile-layout/mobile-meny-body.component';
import { MobileSearchBody } from '@layouts/mobile-layout/mobile-search-body.component';
import { Divider } from '@sk-web-gui/react';
import { useOngoingCaseDataErrands } from '@utils/useOngoingCaseDataErrands';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { MobilePage } from './mobile-page.component';

const MobileLayout: React.FC = () => {
  const [openNotification, setOpenNotification] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const casedataFilterForm = useForm<CaseDataFilter>({ defaultValues: CaseStatusValues });

  const { filterForm, tableForm, ownerFilter, setOwnerFilter, sidebarLabel } = useOngoingCaseDataErrands();

  return (
    <>
      <FormProvider {...filterForm}>
        {!openSearch && !openNotification && !openMenu && (
          <MobileMainPageHeader
            openNotification={openNotification}
            setOpenNotification={setOpenNotification}
            openSearch={openSearch}
            setOpenSearch={setOpenSearch}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          >
            <MobileErrandsList tableForm={tableForm} sidebarLabel={sidebarLabel} />
          </MobileMainPageHeader>
        )}

        {openSearch && (
          <MobilePage open={openSearch} setOpen={setOpenSearch} lucideIconName="search" title="Sök / Filter">
            <MobileSearchBody
              ownerFilter={ownerFilter}
              setOwnerFilter={setOwnerFilter}
              onDone={() => setOpenSearch(false)}
            />
          </MobilePage>
        )}

        {openNotification && (
          <div className="flex-1 overflow-auto">
            <NotificationsWrapper show={openNotification} setShow={setOpenNotification} />
          </div>
        )}

        {openMenu && (
          <MobilePage open={openMenu} setOpen={setOpenMenu}>
            <MobileMenuBody>
              <FormProvider {...casedataFilterForm}>
                <CasedataFilterSidebarStatusSelector iconButton={false} />
              </FormProvider>
              <div className="py-24">
                <Divider />
              </div>
              <LogoutButton />
            </MobileMenuBody>
          </MobilePage>
        )}
      </FormProvider>
    </>
  );
};
export default MobileLayout;
