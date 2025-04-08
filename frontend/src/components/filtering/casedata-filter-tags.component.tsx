import { AppContext } from '@contexts/app-context-interface';
import { ErrandStatus } from '@interfaces/errand-status';
import {
  assignedStatuses,
  closedStatuses,
  findCaseLabelForCaseType,
  findStatusKeyForStatusLabel,
  newStatuses,
} from '@services/casedata-errand-service';
import { Admin } from '@services/user-service';
import { Chip } from '@sk-web-gui/react';
import { useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { CaseDataFilter, CaseDataValues } from './errand-filter';

interface CasedataFilterTagsProps {
  administrators?: Admin[];
}

export const CasedataFilterTags: React.FC<CasedataFilterTagsProps> = () => {
  const { watch, setValue, reset } = useFormContext<CaseDataFilter>();
  const types = watch('caseType');
  const statuses = watch('status');

  const { selectedErrandStatuses } = useContext(AppContext);

  const hasTags = types.length > 0;

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

      {hasTags && (
        <button data-cy="tag-clearAll" className="sk-chip" onClick={() => handleReset()}>
          Rensa alla
        </button>
      )}
    </div>
  );
};
