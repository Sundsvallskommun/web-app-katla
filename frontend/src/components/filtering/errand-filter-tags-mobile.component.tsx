import { Chip } from '@sk-web-gui/react';
import { ErrandStatus } from '@interfaces/errand-status';
import { useFilterTags } from '@utils/useFilterTags';

const CasedataFilterTagsMobile: React.FC = () => {
  const { types, statuses, handleRemoveType, handleRemoveStatus, handleReset } = useFilterTags();

  const hasTags = types.length > 0 || statuses.length > 0;
  return (
    <div className="flex gap-8 flex-wrap justify-start">
      {types.map((type, idx) => (
        <Chip data-cy="tag-caseType" key={`caseType-${idx}`} onClick={() => handleRemoveType(type)}>
          {type}
        </Chip>
      ))}
      {statuses.map((status, idx) => (
        <Chip data-cy={`tag-status-${status}`} key={`caseStatus-${idx}`} onClick={() => handleRemoveStatus(status)}>
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

export default CasedataFilterTagsMobile;
