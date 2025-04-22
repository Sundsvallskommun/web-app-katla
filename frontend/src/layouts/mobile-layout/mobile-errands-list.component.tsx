import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppContext } from '@contexts/app-context-interface';
import { Button } from '@sk-web-gui/react';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { useOngoingCaseDataErrands } from '@utils/useOngoingCaseDataErrands';
import { FormProvider } from 'react-hook-form';
import { getCaseLabels } from '@services/casedata-errand-service';
import { IErrand } from '@interfaces/errand';
import MobileErrandItem from './mobile-errand-item';
import { MobilePage } from './moible-page.component';
import CaseDataFilteringMobile from '@components/filtering/errand-filtering-mobile.component';

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

  const {
    errands,
    filterForm,
    tableForm,
    sidebarLabel: errandSidebarLabel,
    ownerFilter,
    setOwnerFilter,
    administrators,
    numberOfFilters,
    setShouldTriggerFilter,
  } = useOngoingCaseDataErrands({ manualFilterTrigger: true });

  const caseType = filterForm.watch('caseType');
  const status = filterForm.watch('status');

  const currentFilter = useMemo(
    () => ({
      caseType,
      status,
      ownerFilter,
    }),
    [caseType, status, ownerFilter]
  );

  const currentFilterKey = JSON.stringify(currentFilter);
  const previousFilterKeyRef = useRef<string>(currentFilterKey);

  useEffect(() => {
    if (!initialLoaded && errands?.errands?.length) {
      setAllErrands(errands.errands);
      setVisibleCount(4);
      setInitialLoaded(true);
    }
  }, [initialLoaded, errands?.errands]);

  useEffect(() => {
    if (previousFilterKeyRef.current !== currentFilterKey) {
      setAllErrands([]);
      setVisibleCount(4);
      setInitialLoaded(false);
      previousFilterKeyRef.current = currentFilterKey;
    }
  }, [currentFilterKey]);

  useEffect(() => {
    if (!initialLoaded || !errands?.errands?.length) return;

    setAllErrands((prev) => {
      const existingIds = new Set(prev.map((e) => e.id));
      const newOnes = errands.errands.filter((e) => !existingIds.has(e.id));
      return [...prev, ...newOnes];
    });
  }, [errands, initialLoaded]);

  const handleLoadMore = () => {
    const stillHasMoreLocally = visibleCount + 4 <= allErrands.length;
    const hasMoreInApi = errands.page + 1 < errands.totalPages;

    if (stillHasMoreLocally) {
      setVisibleCount((prev) => prev + 4);
    } else if (hasMoreInApi) {
      tableForm.setValue('page', errands.page + 1);
    }
  };

  const totalTags = (caseType?.length || 0) + (status?.length || 0);

  return (
    <div className="w-full p-[1rem] py-[1.6rem]">
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

      {errands?.isLoading && allErrands.length === 0 && (
        <div className="text-center py-10 text-gray-500">Laddar ärenden...</div>
      )}

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
                status: errand.status?.statusType || 'Okänd',
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
          >
            <span className="text-vattjom-text">Läs in fler</span>
          </Button>
        </div>
      )}

      <MobilePage open={filterOpen} setOpen={setFilterOpen} lucideIconName="list-filter" title="Filter">
        <FormProvider {...filterForm}>
          <CaseDataFilteringMobile
            numberOfFilters={numberOfFilters}
            ownerFilterHandler={setOwnerFilter}
            ownerFilter={ownerFilter}
            administrators={administrators}
            setShouldTriggerFilter={setShouldTriggerFilter}
          />
        </FormProvider>
      </MobilePage>
    </div>
  );
};
