import { CaseDataFilter } from '../components/filtering/errand-filter';
import { useFormContext } from 'react-hook-form';
import {
  ongoingStatuses,
  assignedStatuses,
  draftStatuses,
  closedStatuses,
  findStatusKeyForStatusLabel,
} from '../services/casedata-errand-service';

export const useHasTags = () => {
  const { getValues } = useFormContext<CaseDataFilter>();
  const filter = getValues();

  const nonTaggableStatusKeys: string[] = [
    ...ongoingStatuses,
    ...assignedStatuses,
    ...draftStatuses,
    ...closedStatuses,
  ]
    .map(findStatusKeyForStatusLabel)
    .filter((key): key is string => typeof key === 'string');

  const { status = [], caseType = [], priority = [], startdate, enddate } = filter;

  const taggableStatuses = status.filter((s) => !nonTaggableStatusKeys.includes(s));

  const hasTags =
    taggableStatuses.length > 0 ||
    caseType.length > 0 ||
    priority.length > 0 ||
    !!startdate ||
    !!enddate;

  return hasTags;
};
