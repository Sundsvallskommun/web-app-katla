import { CaseDataFilter } from '@components/filtering/errand-filter';
import CaseDataFilteringMobile from '@components/filtering/mobile-filtering/errand-filtering-mobile.component';
import { AppContext } from '@contexts/app-context-interface';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, Spinner } from '@sk-web-gui/react';
import { useDebounceEffect } from '@utils/useDebounceEffect';
import { TableForm } from '@utils/useOngoingCaseDataErrands';
import { useContext, useRef, useState } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import MobileErrandItem from './mobile-errand-item';
import { MobilePage } from './moible-page.component';

interface MobileErrandsListProps {
  filterForm: UseFormReturn<CaseDataFilter, unknown, undefined>;
  tableForm: UseFormReturn<TableForm, unknown, undefined>;
  ownerFilter: boolean;
  setOwnerFilter: (b: boolean) => void;
  numberOfFilters: number;
  sidebarLabel: string;
}

export const MobileErrandsList: React.FC<MobileErrandsListProps> = ({
  filterForm,
  tableForm,
  ownerFilter,
  setOwnerFilter,
  numberOfFilters,
  sidebarLabel,
}) => {
  const { errands, isLoading, setIsLoading } = useContext(AppContext);
  const [filterOpen, setFilterOpen] = useState(false);

  const handleLoadMore = () => {
    setIsLoading(true);
    tableForm.setValue('pageSize', tableForm.getValues('pageSize') + 12);
  };

  const isFetching = useRef(false);

  useDebounceEffect(
    () => {
      const scrollContainer = document.querySelector('.flex-1.overflow-scroll') || window;

      const handleScroll = () => {
        const scrollPosition =
          scrollContainer === window ?
            window.innerHeight + window.scrollY
          : (scrollContainer as HTMLElement).scrollTop + (scrollContainer as HTMLElement).clientHeight;
        const threshold =
          scrollContainer === window ? document.body.offsetHeight : (scrollContainer as HTMLElement).scrollHeight;

        if (scrollPosition >= threshold - 10 && !isLoading && !isFetching.current) {
          isFetching.current = true;
          handleLoadMore();
          setTimeout(() => {
            isFetching.current = false;
          }, 500);
        }
      };

      scrollContainer.addEventListener('scroll', handleScroll);
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    },
    300,
    [isLoading]
  );

  return (
    <div className="w-full p-[1rem] py-[1.6rem] relative">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-bold">{sidebarLabel || 'Ärenden'}</div>
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
            <span className="text-vattjom-text ml-2">Filter{numberOfFilters > 0 ? ` (${numberOfFilters})` : ''}</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {errands.errands.map((errand) => {
          return <MobileErrandItem key={errand.id} errand={errand} />;
        })}
      </div>

      <div className="mt-4 flex justify-center items-center">
        {isLoading && <Spinner className="flex items-center" />}
      </div>

      {filterOpen ?
        <MobilePage open={filterOpen} setOpen={setFilterOpen} lucideIconName="list-filter" title="Filter">
          <FormProvider {...filterForm}>
            <CaseDataFilteringMobile
              ownerFilterHandler={setOwnerFilter}
              ownerFilter={ownerFilter}
              errands={errands?.errands || []}
              open={filterOpen} 
              setOpen={setFilterOpen}
            />
          </FormProvider>
        </MobilePage>
      : null}
    </div>
  );
};
