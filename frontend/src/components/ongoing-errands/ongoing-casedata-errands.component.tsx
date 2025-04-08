import { CaseDataFilter, CaseDataValues } from '@components/filtering/errand-filter';
import CaseDataFiltering from '@components/filtering/errand-filtering.component';
import { AppContext } from '@contexts/app-context-interface';
import { Disclosure } from '@headlessui/react';
import { getStatusLabel, useErrands } from '@services/casedata-errand-service';
import store from '@services/storage-service';
import { useDebounceEffect } from '@utils/useDebounceEffect';
import { useContext, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ErrandsTable } from './components/errands-table.component';
import { ErrandStatus } from '@interfaces/errand-status';

export interface TableForm {
  sortOrder: 'asc' | 'desc';
  sortColumn: string;
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}

export const OngoingCaseDataErrands: React.FC = () => {
  const filterForm = useForm<CaseDataFilter>({ defaultValues: CaseDataValues });
  const { watch: watchFilter, reset: resetFilter, trigger: triggerFilter, setValue, getValues } = filterForm;
  const tableForm = useForm<TableForm>({ defaultValues: { sortColumn: 'updated', sortOrder: 'desc', pageSize: 12 } });
  const { watch: watchTable, setValue: setTableValue } = tableForm;
  const { sortOrder, sortColumn, pageSize, page } = watchTable();

  const {
    municipalityId,
    administrators,
    selectedErrandStatuses,
    setSelectedErrandStatuses,
    setSidebarLabel,
    sidebarLabel,
    closedErrands,
    user,
  } = useContext(AppContext);

  const [ownerFilter, setOwnerFilter] = useState(false);
  const caseTypeFilter = watchFilter('caseType');
  const statusFilter = watchFilter('status');
  const sortObject = useMemo(() => ({ [sortColumn]: sortOrder }), [sortColumn, sortOrder]);
  const [filterObject, setFilterObject] = useState<{ [key: string]: string | boolean }>();
  const errands = useErrands(municipalityId, page, pageSize, filterObject, sortObject);
  useEffect(() => {
    setValue('status', selectedErrandStatuses);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedErrandStatuses]);

  useEffect(() => {
    const filterdata = store.get('filter');

    if (filterdata) {
      let filter;
      let storedFilters;
      try {
        filter = JSON.parse(filterdata);
        storedFilters = {
          caseType: filter?.caseType?.split(',') || CaseDataValues.caseType,
          status: filter?.status !== '' ? filter?.status?.split(',') || CaseDataValues.status : CaseDataValues.status,
        };
        const filterStatuses = filter?.status?.split(',') || CaseDataValues.status;
        setSelectedErrandStatuses(filterStatuses);
        const selectedStatusLabel = getStatusLabel(
          filterStatuses.map((s: keyof typeof ErrandStatus) => ErrandStatus[s as keyof typeof ErrandStatus])
        );
        setSidebarLabel(selectedStatusLabel);
      } catch {
        store.set('filter', JSON.stringify({}));
        storedFilters = {
          caseType: CaseDataValues.caseType,
          priority: CaseDataValues.priority,
          status: CaseDataValues.status,
        };
      }
      if (filter?.stakeholders === user.username) {
        setOwnerFilter(true);
      }
      resetFilter(storedFilters);
      triggerFilter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetFilter, triggerFilter, user.username]);

  useEffect(() => {
    const sortData = store.get('sort');

    if (sortData) {
      try {
        const sort = JSON.parse(sortData);
        setTableValue('size', sort.size);
        setTableValue('pageSize', sort.pageSize);
        setTableValue('sortOrder', sort.sortOrder);
        setTableValue('sortColumn', sort.sortColumn);
      } catch {
        store.set('sort', JSON.stringify({}));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTableValue('page', 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterObject, sortColumn, sortOrder, pageSize]);

  useEffect(() => {
    if (errands) {
      setTableValue('page', errands.page);
      setTableValue('size', errands.size);
      setTableValue('totalPages', errands.totalPages);
      setTableValue('totalElements', errands.totalElements);
    }
    //eslint-disable-next-line
  }, [errands]);

  useDebounceEffect(
    () => {
      const fObj: { [key: string]: string | boolean } = {};
      if (caseTypeFilter && caseTypeFilter.length > 0) {
        fObj['caseType'] = caseTypeFilter.join(',');
      }
      if (statusFilter && statusFilter.length > 0) {
        fObj['status'] = statusFilter.join(',');
      }
      if (ownerFilter) {
        fObj['stakeholders'] = user.username;
      }
      setFilterObject(fObj);
      store.set('filter', JSON.stringify(fObj));
    },
    200,
    [ownerFilter, caseTypeFilter, statusFilter]
  );

  useDebounceEffect(
    () => {
      store.set('sort', JSON.stringify(watchTable()));
    },
    200,
    [watchTable, sortObject, pageSize]
  );

  const numberOfFilters = getValues().caseType.length + (ownerFilter ? 1 : 0);

  return (
    <div className="w-full">
      <div className="box-border px-40 w-full flex justify-center shadow-lg min-h-[8rem] max-small-device-max:px-24">
        <div className="w-full container px-0">
          <FormProvider {...filterForm}>
            <CaseDataFiltering
              numberOfFilters={numberOfFilters}
              ownerFilterHandler={(e) => {
                return setOwnerFilter(e);
              }}
              ownerFilter={ownerFilter}
              administrators={administrators}
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
                {sidebarLabel === 'Avslutade ärenden' ?
                  ' : ' + (closedErrands.totalElements ? closedErrands.totalElements : '')
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
