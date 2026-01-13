import { AppContext } from '@contexts/app-context-interface';
import { Spinner } from '@sk-web-gui/react';
import { useDebounceEffect } from '@utils/useDebounceEffect';
import { TableForm } from '@utils/useOngoingCaseDataErrands';
import { useContext, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import MobileErrandItem from './mobile-errand-item';
import { CasedataFilterTags } from '@components/filtering/desktop-filtering/casedata-filter-tags.component';

interface MobileErrandsListProps {
  tableForm: UseFormReturn<TableForm, unknown, undefined>;
  sidebarLabel: string;
}

export const MobileErrandsList: React.FC<MobileErrandsListProps> = ({
  tableForm,
  sidebarLabel,
}) => {
  const { errands, isLoading, setIsLoading } = useContext(AppContext);

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
      </div>
      <div className="pt-[1.2rem] pb-[0.5rem]">
        Valda filter och sökord
      </div>
      <CasedataFilterTags />

      <div className="flex flex-col gap-4 pt-[1.2rem]">
        {errands.errands.map((errand) => {
          return <MobileErrandItem key={errand.id} errand={errand} />;
        })}
      </div>

      <div className="mt-4 flex justify-center items-center">
        {isLoading && <Spinner className="flex items-center" />}
      </div>
    </div>
  );
};
