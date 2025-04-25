import { FormProvider } from 'react-hook-form';
import { Disclosure } from '@headlessui/react';
import { ErrandsTable } from './components/errands-table.component';
import { useOngoingCaseDataErrands } from '@utils/useOngoingCaseDataErrands';
import CaseDataFiltering from '@components/filtering/desktopFiltering/errand-filtering.component';

export const OngoingCaseDataErrands: React.FC = () => {
  const {
    filterForm,
    tableForm,
    ownerFilter,
    setOwnerFilter,
    numberOfFilters,
    closedErrands,
    sidebarLabel,
    administrators,
    errands,
  } = useOngoingCaseDataErrands();

  return (
    <div className="w-full">
      <div className="box-border px-40 w-full flex justify-center shadow-lg min-h-[8rem] max-small-device-max:px-24">
        <div className="w-full container px-0">
          <FormProvider {...filterForm}>
            <CaseDataFiltering
              numberOfFilters={numberOfFilters}
              ownerFilterHandler={setOwnerFilter}
              ownerFilter={ownerFilter}
              administrators={administrators}
              errands={errands?.errands || []}
            />
          </FormProvider>
        </div>
      </div>

      <main className="px-24 md:px-40 pb-40 w-full h-full">
        <div className="container mx-auto p-0 w-full">
          <Disclosure as="div" defaultOpen={false} className="mt-32 flex flex-col gap-16">
            <div>
              <h1 className="p-0 m-0">
                {sidebarLabel || 'Ärenden'}
                {sidebarLabel === 'Avslutade ärenden' && closedErrands?.totalElements ?
                  ` : ${closedErrands.totalElements}`
                : null}
              </h1>
            </div>

            <Disclosure.Panel static>
              <FormProvider {...tableForm}>
                <ErrandsTable />
              </FormProvider>
            </Disclosure.Panel>
          </Disclosure>
        </div>
      </main>
    </div>
  );
};
