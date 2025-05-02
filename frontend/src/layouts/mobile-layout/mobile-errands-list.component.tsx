import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppContext } from '@contexts/app-context-interface';
import { Button } from '@sk-web-gui/react';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { useOngoingCaseDataErrands } from '@utils/useOngoingCaseDataErrands';
import { FormProvider } from 'react-hook-form';
import { getCaseLabels } from '@services/casedata-errand-service';
import { IErrand } from '@interfaces/errand';
import MobileErrandItem from './mobile-errand-item';
import { MobilePage } from './moible-page.component';
import CaseDataFilteringMobile from '@components/filtering/mobileFiltering/errand-filtering-mobile.component';

interface MobileErrandsListProps {
  allErrands: IErrand[];
  setAllErrands: React.Dispatch<React.SetStateAction<IErrand[]>>;
  visibleCount: number;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
  initialLoaded: boolean;
  setInitialLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MobileErrandsList: React.FC<MobileErrandsListProps> = ({
  allErrands,
  setAllErrands,
  visibleCount,
  setVisibleCount,
  initialLoaded,
  setInitialLoaded,
}) => {
  const { sidebarLabel } = useContext(AppContext);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterTriggeredRef = useRef(false);

  const {
    errands = { errands: [], page: 0, totalPages: 0, isLoading: false },
    filterForm,
    tableForm,
    sidebarLabel: errandSidebarLabel,
    ownerFilter,
    setOwnerFilter,
    administrators,
    setShouldTriggerFilter,
  } = useOngoingCaseDataErrands({ manualFilterTrigger: true });

  const caseType = filterForm.watch('caseType');
  const status = filterForm.watch('status');
  const priority = filterForm.watch('priority');
  const channel = filterForm.watch('channel');
  const startdate = filterForm.watch('startdate');
  const enddate = filterForm.watch('enddate');

  const currentFilter = useMemo(
    () => ({
      caseType,
      status,
      priority,
      channel,
      startdate,
      enddate,
      ownerFilter,
    }),
    [caseType, status, ownerFilter, priority, channel, startdate, enddate]
  );

  const currentFilterKey = JSON.stringify(currentFilter);
  const previousFilterKeyRef = useRef<string>(currentFilterKey);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const isLoading = errands.isLoading || isFetchingMore;

  useEffect(() => {
    if (!initialLoaded && errands && !filterTriggeredRef.current) {
      setAllErrands(errands.errands);
      setVisibleCount(4);
      setInitialLoaded(true);
      setIsFetchingMore(false);
    }
  }, [initialLoaded, errands, setAllErrands, setVisibleCount, setInitialLoaded]);

  const clearErrands = useCallback(() => {
    setAllErrands([]);
    setVisibleCount(4);
    setInitialLoaded(false);
    filterTriggeredRef.current = false;
  }, [setAllErrands, setVisibleCount, setInitialLoaded]);

  useEffect(() => {
    if (previousFilterKeyRef.current !== currentFilterKey) {
      clearErrands();
      previousFilterKeyRef.current = currentFilterKey;
      filterTriggeredRef.current = true;
      setShouldTriggerFilter(true);
    }
  }, [currentFilterKey, clearErrands, setShouldTriggerFilter]);

  useEffect(() => {
    if (!initialLoaded || !errands?.errands?.length || filterTriggeredRef.current) return;

    setAllErrands((prev) => {
      const existingIds = new Set(prev.map((e) => e.id));
      const newOnes = errands.errands.filter((e) => !existingIds.has(e.id));
      return [...prev, ...newOnes];
    });
  }, [errands, initialLoaded, setAllErrands]);

  useEffect(() => {
    if (isFetchingMore && !errands.isLoading) {
      setIsFetchingMore(false);
    }
  }, [errands.isLoading, isFetchingMore]);

  useEffect(() => {
    if (errands?.errands?.length && (filterTriggeredRef.current || isFetchingMore)) {
      filterTriggeredRef.current = false;
      setAllErrands((prev) => [...prev, ...errands.errands]);
      setVisibleCount((prev) => Math.min(prev + 4, allErrands.length + errands.errands.length));
      setIsFetchingMore(false);
    }
  }, [errands, setAllErrands, setVisibleCount, isFetchingMore, allErrands.length]);

  useEffect(() => {
    if (isFetchingMore && errands.errands.length === 0 && !errands.isLoading) {
      setIsFetchingMore(false);
    }
  }, [errands.errands.length, errands.isLoading, isFetchingMore]);

  const handleLoadMore = () => {
    if (isLoading) return;

    const stillHasMoreLocally = visibleCount + 4 <= allErrands.length;
    const hasMoreInApi = errands.page + 1 < errands.totalPages;

    if (stillHasMoreLocally) {
      setVisibleCount((prev) => prev + 4);
    } else if (hasMoreInApi) {
      setIsFetchingMore(true);
      tableForm.setValue('page', errands.page + 1);
      setShouldTriggerFilter(true);
    }
  };

  const totalTags = (caseType?.length || 0) + (priority?.length || 0) + (channel?.length || 0);

  return (
    <div className="w-full p-[1rem] py-[1.6rem] relative">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-bold">{errandSidebarLabel || sidebarLabel || 'Ärenden'}</div>
        <div>
          <Button
            size="md"
            variant="primary"
            color="vattjom"
            inverted={true}
            className="flex items-center py-[0.8rem] pl-[1.6rem] pr-[1.8rem]"
            onClick={() => setFilterOpen(true)}
          >
            <LucideIcon name="list-filter" color="vattjom" size="1.8rem" />
            <span className="text-vattjom-text ml-2">Filter{totalTags > 0 ? ` (${totalTags})` : ''}</span>
          </Button>
        </div>
      </div>

      {isLoading && allErrands.length === 0 && <div className="text-center py-10 text-gray-500">Laddar ärenden...</div>}

      <div className="flex flex-col gap-4">
        {allErrands.slice(0, visibleCount).map((errand) => {
          const labels = getCaseLabels();
          const label = labels[errand.caseType as keyof typeof labels] || 'Okänd typ';

          return (
            <MobileErrandItem
              key={errand.id}
              errand={{
                id: errand.id,
                title: errand.label || 'Namnlöst ärende',
                statusType: errand.status?.statusType || 'Okänd',
                type: label,
                registeredDate: new Date(errand.created).toLocaleDateString('sv-SE'),
              }}
            />
          );
        })}
      </div>

      {allErrands.length > 0 && (visibleCount < allErrands.length || errands.page + 1 < errands.totalPages) && (
        <div className="mt-4">
          <Button
            size="md"
            rounded={false}
            color="vattjom"
            inverted={true}
            className="w-full px-[1.8rem] pt-[1.6rem]"
            onClick={handleLoadMore}
            disabled={errands.isLoading || isLoading}
            loading={isLoading}
          >
            <span className="text-vattjom-text">Läs in fler</span>
          </Button>
        </div>
      )}

      <MobilePage open={filterOpen} setOpen={setFilterOpen} lucideIconName="list-filter" title="Filter">
        <FormProvider {...filterForm}>
          <CaseDataFilteringMobile
            ownerFilterHandler={setOwnerFilter}
            ownerFilter={ownerFilter}
            administrators={administrators}
            setShouldTriggerFilter={setShouldTriggerFilter}
            onClearErrands={() => {
              setAllErrands([]);
              setVisibleCount(4);
              setInitialLoaded(false);
            }}
            onClose={() => setFilterOpen(false)}
          />
        </FormProvider>
      </MobilePage>
    </div>
  );
};
