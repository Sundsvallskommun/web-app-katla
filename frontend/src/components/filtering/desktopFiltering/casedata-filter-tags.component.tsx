import { AppContext } from '@contexts/app-context-interface';
import { ErrandStatus } from '@interfaces/errand-status';
import {
  assignedStatuses,
  closedStatuses,
  draftStatuses,
  findCaseLabelForCaseType,
  findStatusKeyForStatusLabel,
  newStatuses,
} from '@services/casedata-errand-service';

import { Chip } from '@sk-web-gui/react';
import React, { useContext, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { CaseDataFilter, CaseDataValues } from '../errand-filter';
import { Priority } from '@interfaces/priority';
import dayjs from 'dayjs';
import { IErrand } from '@interfaces/errand';
import { Channels } from '@interfaces/channels';
import { useHasTags } from '@utils/has-taggable-filters';

interface CasedataFilterTagsProps {
  errands: IErrand[];
}

export const CasedataFilterTags: React.FC<CasedataFilterTagsProps> = () => {
  const { control, setValue, reset } = useFormContext<CaseDataFilter>();
  const values = useWatch({ control });

  const types = values.caseType ?? [];
  const statuses = values.status ?? [];
  const startdate = values.startdate;
  const enddate = values.enddate;
  const priorities = Array.isArray(values.priority) ? values.priority : [];
  const channels =
    Array.isArray(values.channel) ? values.channel
    : values.channel ? [values.channel]
    : [];

  const { selectedErrandStatuses } = useContext(AppContext);

  const handleRemoveType = (type: string) => {
    const newTypes = types.filter((caseType) => caseType !== type);
    setValue('caseType', newTypes);
  };

  const handleRemoveStatus = (status: string) => {
    const newStatuses = statuses.filter((caseStatus) => caseStatus !== status);
    setValue('status', newStatuses);
  };

  const handleReset = () => {
    reset({
      ...CaseDataValues,
      status: selectedErrandStatuses,
    });
  };

  const handleRemoveDates = () => {
    setValue('startdate', '');
    setValue('enddate', '');
  };

  useEffect(() => {
    setValue('status', selectedErrandStatuses);
  }, [selectedErrandStatuses, setValue]);

  const hasTags = useHasTags();
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
            ![...newStatuses, ...closedStatuses, ...assignedStatuses, ...draftStatuses]
              .map(findStatusKeyForStatusLabel)
              .includes(status)
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
          {Channels[channel as keyof typeof Channels] || channel}
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
