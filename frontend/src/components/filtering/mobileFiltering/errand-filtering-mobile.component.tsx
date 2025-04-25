import { Admin } from '@services/user-service';
import { Button } from '@sk-web-gui/react';
import React from 'react';
import CasedataFilterTags from './casedata-filter-tags-mobile.component';
import { CasedataFilterCaseTypeMobile } from './errand-filter-casetype-combobox.component';
import { CasedataFilterStatusMobile } from './errand-filter-status-combobox.component';
import { useFormContext } from 'react-hook-form';
import { CasedataFilterPriorityMobile } from './errand-filter-priority-combobox.component';
import { CasedataFilterChannelMobile } from './errand-filter-channels-combobox.component';
import { CasedataFilterDatesMobile } from './errand-filter-dates-mobile.component';

interface Props {
  ownerFilterHandler: (b: boolean) => void;
  ownerFilter?: boolean;
  administrators?: Admin[];
  numberOfFilters: number;
  setShouldTriggerFilter?: React.Dispatch<React.SetStateAction<boolean>>;
  onClearErrands: () => void;
  onClose?: () => void;
}

const CaseDataFilteringMobile: React.FC<Props> = ({ setShouldTriggerFilter, onClearErrands, onClose }) => {
  const { getValues } = useFormContext<{
    status: string[];
    caseType: string[];
    priority: string[];
    channel: string[];
    startdate: string;
    enddate: string;
  }>();
  const values = getValues();
  const hasTags =
    (values.status?.length ?? 0) > 0 ||
    (values.caseType?.length ?? 0) > 0 ||
    (values.priority?.length ?? 0) > 0 ||
    (values.channel?.length ?? 0) > 0 ||
    values.startdate ||
    values.enddate;

  return (
    <div className="flex flex-col px-[1.2rem] py-[3.2rem]">
      <div className={`w-full ${hasTags ? 'pt-0' : 'pt-[2.4rem]'}`}>
        <div className="flex h-[0.43rem] gap-[1.6rem] justify-center self-stretch" />
        <CasedataFilterTags />
      </div>

      <div className={`w-full flex flex-col gap-[2.4rem] ${hasTags ? 'pt-[2.4rem]' : 'pt-0'}`}>
        <CasedataFilterStatusMobile />
        <CasedataFilterCaseTypeMobile />
        <CasedataFilterPriorityMobile />
        <CasedataFilterDatesMobile />
        <CasedataFilterChannelMobile />
      </div>

      <div className="mt-[2.4rem]">
        <Button
          size="md"
          variant="primary"
          color="vattjom"
          className="flex w-full h-auto items-center justify-center"
          rounded={false}
          onClick={() => {
            onClearErrands();
            setShouldTriggerFilter?.(true);
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
