import { Admin } from '@services/user-service';
import { Button } from '@sk-web-gui/react';
import React from 'react';
import CasedataFilterTags from './errand-filter-tags-mobile.component';
import { CasedataFilterCaseTypeMobile } from './errand-filter-casetype-combobox.component';
import { CasedataFilterStatusMobile } from './errand-filter-status-combobox.component';
import { useFormContext } from 'react-hook-form';

interface Props {
  ownerFilterHandler: (b: boolean) => void;
  ownerFilter?: boolean;
  administrators?: Admin[];
  numberOfFilters: number;
  setShouldTriggerFilter: React.Dispatch<React.SetStateAction<boolean>>;
}

const CaseDataFilteringMobile: React.FC<Props> = ({ setShouldTriggerFilter }) => {
  const { getValues } = useFormContext<{ status: string[]; caseType: string[] }>();
  const values = getValues();
  const hasTags = (values.status?.length ?? 0) > 0 || (values.caseType?.length ?? 0) > 0;

  return (
    <div className="flex flex-col px-[1.2rem] py-[3.2rem]">
      <div className={`w-full ${hasTags ? 'pt-0' : 'pt-[2.4rem]'}`}>
        <div className="flex h-[0.43rem] gap-[1.6rem] justify-center self-stretch" />
        <CasedataFilterTags />
      </div>

      <div className={`w-full flex flex-col gap-[2.4rem] ${hasTags ? 'pt-[2.4rem]' : 'pt-0'}`}>
        <CasedataFilterStatusMobile />
        <CasedataFilterCaseTypeMobile />
        {/* Lägg till fler filter här eftersom de läggs till */}
      </div>

      <div className="mt-[2.4rem]">
        <Button
          size="md"
          variant="primary"
          color="vattjom"
          className="flex w-full h-auto items-center justify-center"
          rounded={false}
          onClick={() => setShouldTriggerFilter(true)}
        >
          <span>Filtrera</span>
        </Button>
      </div>
    </div>
  );
};

export default CaseDataFilteringMobile;
