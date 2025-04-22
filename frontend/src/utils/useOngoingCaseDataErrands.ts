import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppContext } from '@contexts/app-context-interface';
import { useDebounceEffect } from '@utils/useDebounceEffect';
import { getStatusLabel, useErrands } from '@services/casedata-errand-service';
import store from '@services/storage-service';
import { CaseDataFilter, CaseDataValues } from '@components/filtering/errand-filter';
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

export const useOngoingCaseDataErrands = ({ manualFilterTrigger = false }: { manualFilterTrigger?: boolean } = {}) => {
  const filterForm = useForm<CaseDataFilter>({ defaultValues: CaseDataValues });
  const didInit = useRef(false);

  const tableForm = useForm<TableForm>({
    defaultValues: {
      sortColumn: 'updated',
      sortOrder: 'desc',
      pageSize: 12,
    },
  });

  const { watch: watchFilter, reset: resetFilter, trigger: triggerFilter, setValue, getValues } = filterForm;
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
  const [shouldTriggerFilter, setShouldTriggerFilter] = useState(true);

  const errands = useErrands(municipalityId, page, pageSize, filterObject, sortObject);

  const hasSyncedSelectedStatuses = useRef(false);

  useEffect(() => {
    if (hasSyncedSelectedStatuses.current) return;

    const current = getValues('status');
    const hasChanged = JSON.stringify(current) !== JSON.stringify(selectedErrandStatuses);
    if (hasChanged) {
      setValue('status', selectedErrandStatuses);
    }

    hasSyncedSelectedStatuses.current = true;
  }, [selectedErrandStatuses, getValues, setValue]);

  useEffect(() => {
    if (didInit.current) return;

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

    didInit.current = true;
  }, []);

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
  }, [setTableValue]);

  useEffect(() => {
    setTableValue('page', 0);
  }, [filterObject, sortColumn, sortOrder, pageSize, setTableValue]);

  useEffect(() => {
    if (errands) {
      setTableValue('page', errands.page);
      setTableValue('size', errands.size);
      setTableValue('totalPages', errands.totalPages);
      setTableValue('totalElements', errands.totalElements);
    }
  }, [errands, setTableValue]);

  useDebounceEffect(
    () => {
      if (manualFilterTrigger && !shouldTriggerFilter) return;

      const fObj: { [key: string]: string | boolean } = {};
      if (caseTypeFilter?.length) fObj.caseType = caseTypeFilter.join(',');
      if (statusFilter?.length) fObj.status = statusFilter.join(',');
      if (ownerFilter) fObj.stakeholders = user.username;

      setFilterObject(fObj);
      store.set('filter', JSON.stringify(fObj));

      if (manualFilterTrigger) {
        setShouldTriggerFilter(false);
      }
    },
    200,
    manualFilterTrigger ? [shouldTriggerFilter] : [ownerFilter, caseTypeFilter, statusFilter]
  );

  useDebounceEffect(
    () => {
      store.set('sort', JSON.stringify(watchTable()));
    },
    200,
    [watchTable, sortObject, pageSize]
  );

  const numberOfFilters = getValues().caseType.length + (ownerFilter ? 1 : 0);

  return {
    filterForm,
    tableForm,
    ownerFilter,
    setOwnerFilter,
    numberOfFilters,
    errands,
    closedErrands,
    sidebarLabel,
    administrators,
    setShouldTriggerFilter,
    ...(manualFilterTrigger && { setShouldTriggerFilter }),
  };
};
