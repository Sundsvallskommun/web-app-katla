import { AppContext } from '@contexts/app-context-interface';
import { ErrandStatus } from '@interfaces/errand-status';
import {
  assignedStatuses,
  closedStatuses,
  findCaseLabelForCaseType,
  findStatusKeyForStatusLabel,
  newStatuses,
} from '@services/casedata-errand-service';
import { Chip } from '@sk-web-gui/react';
import React, { useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { CaseDataFilter, CaseDataValues } from '../errand-filter';
import { Priority } from '@interfaces/priority';
import dayjs from 'dayjs';
import { IErrand } from '@interfaces/errand';
import { Channels } from '@interfaces/channels';

interface CasedataFilterTagsProps {
  errands: IErrand[];
}

export const CasedataFilterTags: React.FC<CasedataFilterTagsProps> = () => {
  const { watch, setValue, reset } = useFormContext<CaseDataFilter>();
  const types = watch('caseType') ?? [];
  const statuses = watch('status') ?? [];
  const startdate = watch('startdate');
  const enddate = watch('enddate');

  const rawPriorities = watch('priority');
  const priorities = Array.isArray(rawPriorities) ? rawPriorities : [];

  const rawChannels = watch('channel');
  const channels =
    Array.isArray(rawChannels) ? rawChannels
    : rawChannels ? [rawChannels]
    : [];

  const { selectedErrandStatuses } = useContext(AppContext);

  const hasTags =
    types.length > 0 || statuses.length > 0 || priorities.length > 0 || startdate || enddate || channels.length > 0;

  const handleRemoveType = (type: string) => {
    const newTypes = types.filter((caseType) => caseType !== type);
    setValue('caseType', newTypes);
  };

  const handleRemoveStatus = (status: string) => {
    const newStatuses = statuses.filter((caseStatus) => caseStatus !== status);
    setValue('status', newStatuses);
  };

  const handleReset = () => {
    reset(CaseDataValues);
    setValue('status', selectedErrandStatuses);
  };

  const handleRemoveDates = () => {
    setValue('startdate', '');
    setValue('enddate', '');
  };

  // const getChannelLabel = (key: string) => {
  //   const labels: Record<string, string> = {
  //     EMAIL: 'E-post',
  //     ESERVICE: 'E-tjänst',
  //     WEB_UI: 'Webgränssnitt',
  //   };
  //   return labels[key] || key;
  // };

  return (
    <div className="flex gap-8 flex-wrap justify-start">
      {types.map((type, typeIndex) => (
        <Chip data-cy="tag-caseType" key={`caseType-${typeIndex}`} onClick={() => handleRemoveType(type)}>
          {findCaseLabelForCaseType(type)}
        </Chip>
      ))}

      {statuses
        .filter(
          (status) =>
            ![...newStatuses, ...closedStatuses, ...assignedStatuses].map(findStatusKeyForStatusLabel).includes(status)
        )
        .map((status, statusIndex) => (
          <Chip
            data-cy={`tag-status-${status}`}
            key={`caseStatus-${statusIndex}`}
            onClick={() => handleRemoveStatus(status)}
          >
            {ErrandStatus[status as keyof typeof ErrandStatus]}
          </Chip>
        ))}

      {priorities.map((priority, idx) => (
        <Chip
          data-cy="tag-prio"
          key={`priority-${idx}`}
          onClick={() => {
            const newPriorities = priorities.filter((p) => p !== priority);
            setValue('priority', newPriorities);
          }}
        >
          {Priority[priority as keyof typeof Priority]} prioritet
        </Chip>
      ))}

      {(startdate || enddate) && (
        <Chip data-cy="tag-date" onClick={handleRemoveDates}>
          {startdate && !enddate && `Från ${dayjs(startdate).format('D MMM YYYY')}`}
          {!startdate && enddate && `Fram till ${dayjs(enddate).format('D MMM YYYY')}`}
          {startdate && enddate && `${dayjs(startdate).format('D MMM YYYY')} - ${dayjs(enddate).format('D MMM YYYY')}`}
        </Chip>
      )}

      {channels.map((channel, idx) => (
        <Chip
          data-cy={`tag-channel-${channel}`}
          key={`channel-${idx}`}
          onClick={() => {
            const newChannels = channels.filter((c) => c !== channel);
            setValue('channel', newChannels);
          }}
        >
          {/* {getChannelLabel(channel)} */}
          {Channels[channel as keyof typeof Channels]}
        </Chip>
      ))}

      {hasTags && (
        <button data-cy="tag-clearAll" className="sk-chip" onClick={handleReset}>
          Rensa alla
        </button>
      )}
    </div>
  );
};
