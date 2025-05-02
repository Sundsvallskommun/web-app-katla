import { Checkbox, useThemeQueries } from '@sk-web-gui/react';
import { CasedataFilterCaseType } from '../mobileFiltering/errand-filter-casetype.component';
import { CasedataFilterStatus } from './casedata-filter-status.component';
import { CasedataFilterPriority } from './errand-filter-priority.component';
import { CasedataFilterDates } from './errand-filter-dates.component';
import { CasedataFilterChannel } from './errand-filter-channels.component';
import React, { useContext } from 'react';
import { AppContext } from '@contexts/app-context-interface';
interface Props {
  ownerFilterHandler: (b: boolean) => void;
  ownerFilter?: boolean;
  backgroundColor?: string;
}

export const CasedataFilterBase: React.FC<Props> = ({
  ownerFilterHandler,
  ownerFilter = true,
  backgroundColor = 'primary-50',
}) => {
  const { isMaxLargeDevice } = useThemeQueries();
  const mobileSpacing = isMaxLargeDevice ? 'mb-24' : '';
  const { sidebarLabel } = useContext(AppContext);

  return (
    <div className={`flex w-full ${isMaxLargeDevice ? 'flex-col' : 'flex-row gap-16 items-center'} `}>
      <div
        className={`w-full flex ${isMaxLargeDevice ? 'flex-col' : 'flex-row flex-wrap'} justify-start items-center lg:p-10 gap-4 rounded-groups ${backgroundColor}`}
      >
        <div className={`relative w-full lg:w-auto ${mobileSpacing}`}>
          <CasedataFilterCaseType />
        </div>
        {sidebarLabel === 'Öppna ärenden' && (
          <div className={`relative w-full lg:w-auto ${mobileSpacing}`}>
            <CasedataFilterStatus />
          </div>
        )}
        <div className={`relative w-full lg:w-auto ${mobileSpacing}`}>
          <CasedataFilterPriority />
        </div>
        <div className={`relative w-full lg:w-auto ${mobileSpacing}`}>
          <CasedataFilterDates />
        </div>
        <div className={`relative w-full lg:w-auto ${mobileSpacing}`}>
          <CasedataFilterChannel />
        </div>
      </div>
      <div className={isMaxLargeDevice ? 'mb-24 flex justify-center w-full' : 'min-w-fit'}>
        <Checkbox data-cy="myErrands-filter" checked={!!ownerFilter} onChange={() => ownerFilterHandler(!ownerFilter)}>
          Mina ärenden
        </Checkbox>
      </div>
    </div>
  );
};
