import { IErrand } from '@interfaces/errand';
import { Button } from '@sk-web-gui/react';
import React from 'react';
import { CasedataFilterTags } from '../desktop-filtering/casedata-filter-tags.component';
import { CasedataFilterBase } from '../desktop-filtering/errand-filter-base.component';

interface Props {
    ownerFilterHandler: (b: boolean) => void;
    ownerFilter?: boolean;
    errands: IErrand[];
    open: boolean;
    setOpen: (state: boolean) => void;
}

const CaseDataFilteringMobile: React.FC<Props> = ({
  ownerFilterHandler = () => false, ownerFilter = false, errands, open, setOpen
}) => {

  return (
    <div className="flex flex-col px-[1.2rem] py-[3.2rem]">
      <div className="w-full">
        <div className="flex h-[0.43rem] gap-[1.6rem] justify-center self-stretch" />
        <CasedataFilterTags errands={errands} />
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
            setOpen(!open);
          }}
        >
          Filtrera
        </Button>
      </div>
    </div>
  );
};

export default CaseDataFilteringMobile;
