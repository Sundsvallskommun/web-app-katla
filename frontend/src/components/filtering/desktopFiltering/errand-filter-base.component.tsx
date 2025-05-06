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
}

export const CasedataFilterBase: React.FC<Props> = ({ ownerFilterHandler, ownerFilter = true }) => {
  const { isMaxLargeDevice } = useThemeQueries();
  const { sidebarLabel } = useContext(AppContext);

  const layoutWrapperClass = isMaxLargeDevice ? 'flex-col' : 'flex-row gap-16 items-center';

  const filterContainerClass = [
    'w-full',
    'flex',
    'justify-start',
    'items-center',
    'gap-4',
    'rounded-groups',
    isMaxLargeDevice ? 'flex-col' : 'flex-row flex-wrap bg-background-200 p-10',
  ].join(' ');

  const filterItemClass = isMaxLargeDevice ? 'relative w-full mb-24' : 'relative w-auto';

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
        <div className={filterItemClass}>
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
