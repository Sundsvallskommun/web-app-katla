'use client';

import { CaseDataFilter, CaseDataValues } from '@components/filtering/errand-filter';
import { AppContext } from '@contexts/app-context-interface';
import { ErrandStatus } from '@interfaces/errand-status';
import { getStatusLabel, ongoingStatuses, useErrands } from '@services/casedata-errand-service';
import store from '@services/storage-service';
import { useThemeQueries } from '@sk-web-gui/react';
import { useDebounceEffect } from '@utils/useDebounceEffect';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

export interface TableForm {
  sortOrder: 'asc' | 'desc';
  sortColumn: string;
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}

export const useOngoingCaseDataErrands = () => {
  const filterForm = useForm<CaseDataFilter>({ defaultValues: CaseDataValues });
  const { isMaxLargeDevice } = useThemeQueries();
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

  const [ownerFilter, setOwnerFilter] = useState<boolean>(true);
  const caseTypeFilter = watchFilter('caseType');
  const queryFilter = watchFilter('query');
  const statusFilter = watchFilter('status');
  const priorityFilter = watchFilter('priority');
  const startdate = watchFilter('startdate');
  const enddate = watchFilter('enddate');
  const channelFilter = watchFilter('channel');

  const sortObject = useMemo(() => {
    if (!sortColumn) return undefined;
    return { [sortColumn]: sortOrder };
  }, [sortColumn, sortOrder]);

  const mobileUpdate = useRef(isMaxLargeDevice ? true : false);

  const [filterObject, setFilterObject] = useState<{ [key: string]: string | boolean }>();

  const [shouldFetchErrands, setShouldFetchErrands] = useState(true);

  const errandsData = useErrands(municipalityId, page, pageSize, filterObject, sortObject);

  const errands = useMemo(() => {
    if (!shouldFetchErrands) return undefined;
    return errandsData;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldFetchErrands]);

  useEffect(() => {
    setValue('status', selectedErrandStatuses);
    setTableValue('pageSize', 12);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedErrandStatuses]);

  useEffect(() => {
    if (mobileUpdate.current) {
      mobileUpdate.current = false;
      return;
    }

    const filterdata = store.get('filter');
    if (filterdata) {
      let filter;
      let storedFilters;
      try {
        filter = JSON.parse(filterdata);
        storedFilters = {
          caseType: filter?.caseType?.split(',') || CaseDataValues.caseType,
          status: filter?.status !== '' ? filter?.status?.split(',') || CaseDataValues.status : CaseDataValues.status,
          priority: filter?.priority?.split(',') || CaseDataValues.priority,
          startdate: filter?.start || CaseDataValues.startdate,
          enddate: filter?.end || CaseDataValues.enddate,
          channel: filter?.channel?.split(',') || CaseDataValues.channel,
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
          startdate: CaseDataValues.startdate,
          enddate: CaseDataValues.enddate,
          channel: CaseDataValues.channel,
        };
      }
      if (filter?.stakeholders === user.username) {
        setOwnerFilter(true);
      }

      resetFilter(storedFilters);
      triggerFilter();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const sortData = store.get('sort');
    const sort = JSON.parse(sortData);
    if (sortData) {
      try {
        setTableValue('size', sort.size || 12);
        setTableValue('pageSize', sort.pageSize);
        setTableValue('sortOrder', sort.sortOrder);
        setTableValue('sortColumn', sort.sortColumn);
      } catch {
        store.set('sort', JSON.stringify({}));
        setTableValue('pageSize', sort.pageSize);
      }
    }
  }, [setTableValue]);

  useDebounceEffect(
    () => {
      if (mobileUpdate.current) {
        mobileUpdate.current = false;
        return;
      }
      const fObj: { [key: string]: string | boolean } = {};

      const multiValueFilters: Record<string, string[] | undefined> = {
        caseType: caseTypeFilter,
        status: statusFilter,
        priority: priorityFilter,
        channel: channelFilter,
      };

      Object.entries(multiValueFilters).forEach(([key, value]) => {
        if (value && value.length) {
          fObj[key] = value.join(',');
        }
      });

      if (startdate) {
        fObj.start = startdate;
      }
      if (enddate) {
        fObj.end = enddate;
      }
      if (queryFilter) {
        fObj.query = queryFilter.replace(/\+/g, '').replace(/ /g, '+');
      }
      if (ownerFilter) {
        fObj.stakeholders = user.username;
      }
      setFilterObject(fObj);
      store.set('filter', JSON.stringify(fObj));
    },
    200,
    [ownerFilter, caseTypeFilter, statusFilter, priorityFilter, startdate, enddate, channelFilter, queryFilter]
  );

  const currentValues = getValues();
  const selectedStatuses = selectedErrandStatuses.map((s) => ErrandStatus[s as keyof typeof ErrandStatus]);
  const numberOfFilters =
    currentValues.caseType?.length +
    (currentValues.priority?.length || 0) +
    (currentValues.startdate ? 1 : 0) +
    (currentValues.enddate ? 1 : 0) +
    (currentValues.channel?.length || 0) +
    (ownerFilter ? 1 : 0) +
    (JSON.stringify(selectedStatuses) === JSON.stringify(ongoingStatuses) ? currentValues.status?.length : 0);

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
    shouldFetchErrands,
    setShouldFetchErrands,
  };
};
