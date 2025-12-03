import { AppContext } from '@contexts/app-context-interface';
import { Checkbox, cx, useThemeQueries } from '@sk-web-gui/react';
import React, { useContext } from 'react';
import { CasedataFilterStatus } from './casedata-filter-status.component';
import { CasedataFilterCaseType } from './errand-filter-casetype.component';
import { CasedataFilterDates } from './errand-filter-dates.component';
import { CasedataFilterPriority } from './errand-filter-priority.component';

interface Props {
  ownerFilterHandler: (b: boolean) => void;
  ownerFilter?: boolean;
}

export const CasedataFilterBase: React.FC<Props> = ({ ownerFilterHandler, ownerFilter = true }) => {
  const { isMaxMediumDevice } = useThemeQueries();
  const { sidebarLabel } = useContext(AppContext);

  const layoutWrapperClass = isMaxMediumDevice ? 'flex-col' : 'flex-row gap-[1.6rem] items-center';

  const filterContainerClass = cx(
    'w-full flex justify-start items-center gap-[0.4rem] rounded-groups',
    isMaxMediumDevice ? 'flex-col' : 'flex-row flex-wrap bg-background-200 p-[1rem]'
  );

  const filterItemClass = isMaxMediumDevice ? 'relative w-full mb-24' : 'relative w-auto';

  return (
    <div className={`flex w-full ${layoutWrapperClass}`}>
      <div className={filterContainerClass}>
        <div className={filterItemClass}>
          <CasedataFilterCaseType />
        </div>
        {sidebarLabel === 'Öppna ärenden' && (
          <div className={filterItemClass}>
            <CasedataFilterStatus />
          </div>
        )}
        <div className={filterItemClass}>
          <CasedataFilterPriority />
        </div>
        <div className={filterItemClass}>
          <CasedataFilterDates />
        </div>
      </div>

      <div className={isMaxMediumDevice ? 'mb-24 flex justify-center w-full' : 'min-w-fit'}>
        <Checkbox data-cy="myErrands-filter" checked={!!ownerFilter} onChange={() => ownerFilterHandler(!ownerFilter)}>
          Mina ärenden
        </Checkbox>
      </div>
    </div>
  );
};
