'use client';

import { OngoingCaseDataErrands } from '@components/ongoing-errands/ongoing-casedata-errands.component';
import { AppContext } from '@contexts/app-context-interface';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { getMe } from '@services/user-service';
import { useContext, useEffect, useState } from 'react';
import { MobileMenuBody } from '@layouts/mobile-layout/mobile-meny-body.component';
import { MobilePage } from '@layouts/mobile-layout/moible-page.component';
import { CaseDataFilter, CaseStatusValues } from '@components/filtering/errand-filter';
import { FormProvider, useForm } from 'react-hook-form';
import { CasedataFilterSidebarStatusSelector } from '@components/filtering/desktopFiltering/errand-filter-sidebarstatus-selector.component';
import { NotificationsWrapper } from '@components/notifications/notifications-wrapper';
import { MobileSearchBody } from '@layouts/mobile-layout/mobile-search-body.component';
import { MobileErrandsList } from '@layouts/mobile-layout/mobile-errands-list.component';
import { IErrand } from '@interfaces/errand';
import { MobileMainPageHeader } from '@layouts/mobile-layout/mobile-main-page-header.component';
import { Button, Divider, useThemeQueries } from '@sk-web-gui/react';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { useRouter } from 'next/navigation';

const Oversikt: React.FC = () => {
  const { setMunicipalityId, setUser } = useContext(AppContext);
  const [openNotification, setOpenNotification] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const casedataFilterForm = useForm<CaseDataFilter>({ defaultValues: CaseStatusValues });

  const [allErrands, setAllErrands] = useState<IErrand[]>([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const { isMaxLargeDevice } = useThemeQueries();

  const resetErrandList = () => {
    setAllErrands([]);
    setVisibleCount(4);
    setInitialLoaded(false);
  };

  useEffect(() => {
    setMunicipalityId(process.env.NEXT_PUBLIC_MUNICIPALITY_ID || '');
    getMe().then((user) => {
      setUser(user);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeAll = () => {
    setOpenNotification(false);
    setOpenSearch(false);
    setOpenMenu(false);
  };

  const router = useRouter();
  const handleLogout = () => {
    router.push('/logout');
  };

  return isMaxLargeDevice ?
      <>
        {!openSearch && !openNotification && !openMenu && (
          <MobileMainPageHeader
            openNotification={openNotification}
            setOpenNotification={setOpenNotification}
            openSearch={openSearch}
            setOpenSearch={setOpenSearch}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          >
            <MobileErrandsList
              allErrands={allErrands}
              setAllErrands={setAllErrands}
              visibleCount={visibleCount}
              setVisibleCount={setVisibleCount}
              initialLoaded={initialLoaded}
              setInitialLoaded={setInitialLoaded}
            />
          </MobileMainPageHeader>
        )}

        {openSearch && (
          <MobilePage open={openSearch} setOpen={setOpenSearch} lucideIconName="search" title="Sök" onClose={closeAll}>
            <FormProvider {...casedataFilterForm}>
              <MobileSearchBody onDone={() => setOpenSearch(false)} onResetList={resetErrandList} />
            </FormProvider>
          </MobilePage>
        )}

        {openNotification && (
          <div className="flex-1 overflow-auto">
            <NotificationsWrapper show={openNotification} setShow={setOpenNotification} />
          </div>
        )}

        {openMenu && (
          <MobilePage open={openMenu} setOpen={setOpenMenu} onClose={closeAll}>
            <MobileMenuBody>
              <FormProvider {...casedataFilterForm}>
                <CasedataFilterSidebarStatusSelector iconButton={!open} />
              </FormProvider>
              <div className="py-24">
                <Divider />
              </div>

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
            </MobileMenuBody>
          </MobilePage>
        )}
      </>
    : <DefaultLayout>
        <OngoingCaseDataErrands />
      </DefaultLayout>;
};
export default Oversikt;
