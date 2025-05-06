import { Admin } from '@services/user-service';
import { Button } from '@sk-web-gui/react';
import React, { useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { CasedataFilterBase } from '../desktopFiltering/errand-filter-base.component';
import { CasedataFilterTags } from '../desktopFiltering/casedata-filter-tags.component';

interface Props {
  ownerFilterHandler: (b: boolean) => void;
  ownerFilter?: boolean;
  administrators?: Admin[];
  setShouldTriggerFilter?: React.Dispatch<React.SetStateAction<boolean>>;
  onClearErrands: () => void;
  onClose?: () => void;
}

const CaseDataFilteringMobile: React.FC<Props> = ({
  ownerFilterHandler,
  ownerFilter = false,
  setShouldTriggerFilter,
  onClearErrands,
  onClose,
}) => {
  const { getValues } = useFormContext<{
    status: string[];
    caseType: string[];
    priority: string[];
    channel: string[];
    startdate: string;
    enddate: string;
  }>();
  const previousFilterKeyRef = useRef<string | null>(null);

  return (
    <div className="flex flex-col px-[1.2rem] py-[3.2rem]">
      <div className="w-full">
        <div className="flex h-[0.43rem] gap-[1.6rem] justify-center self-stretch" />
        <CasedataFilterTags errands={[]} />
      </div>

      <div className="w-full flex flex-col gap-[2.4rem] pt-24">
        <CasedataFilterBase ownerFilter={ownerFilter} ownerFilterHandler={ownerFilterHandler} />
      </div>

      <div className="mt-10">
        <Button
          size="md"
          variant="primary"
          color="vattjom"
          className="flex w-full h-auto items-center justify-center"
          rounded={false}
          onClick={() => {
            const currentFilter = {
              caseType: getValues('caseType'),
              status: getValues('status'),
              priority: getValues('priority'),
              channel: getValues('channel'),
              startdate: getValues('startdate'),
              enddate: getValues('enddate'),
              ownerFilter,
            };

            const currentFilterKey = JSON.stringify(currentFilter);

            if (previousFilterKeyRef.current !== currentFilterKey) {
              onClearErrands();
              setShouldTriggerFilter?.(true);
              previousFilterKeyRef.current = currentFilterKey;
            }

            onClose?.();
          }}
        >
          <span>Filtrera</span>
        </Button>
      </div>
    </div>
  );
};

export default CaseDataFilteringMobile;
