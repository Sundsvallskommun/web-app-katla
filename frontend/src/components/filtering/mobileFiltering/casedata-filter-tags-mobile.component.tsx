import { Chip } from '@sk-web-gui/react';
import { ErrandStatus } from '@interfaces/errand-status';
import { useFilterTags } from '@utils/useFilterTags';
import { PTCaseLabel } from '@interfaces/case-label';
import { Priority } from '@interfaces/priority';
import { Channels } from '@interfaces/channels';
import dayjs from 'dayjs';

const CasedataFilterTagsMobile: React.FC = () => {
  const {
    types,
    statuses,
    priorities,
    channels,
    startdate,
    enddate,
    handleRemoveType,
    handleRemoveStatus,
    handleRemovePriority,
    handleRemoveChannel,
    handleRemoveDates,
    handleReset,
  } = useFilterTags();

  const hasTags =
    types.length > 0 || statuses.length > 0 || priorities.length > 0 || channels.length > 0 || startdate || enddate;

  return (
    <div className="flex gap-8 flex-wrap justify-start">
      {types.map((type, idx) => (
        <Chip data-cy="tag-caseType" key={`caseType-${idx}`} onClick={() => handleRemoveType(type)}>
          {PTCaseLabel[type as keyof typeof PTCaseLabel]}
        </Chip>
      ))}
      {statuses.map((status, idx) => (
        <Chip data-cy={`tag-status-${status}`} key={`caseStatus-${idx}`} onClick={() => handleRemoveStatus(status)}>
          {ErrandStatus[status as keyof typeof ErrandStatus]}
        </Chip>
      ))}
      {priorities.map((priority, idx) => (
        <Chip
          data-cy={`tag-priority-${priority}`}
          key={`priority-${idx}`}
          onClick={() => handleRemovePriority(priority)}
        >
          {Priority[priority as keyof typeof Priority]}
        </Chip>
      ))}
      {channels.map((channel, idx) => (
        <Chip data-cy={`tag-channel-${channel}`} key={`channel-${idx}`} onClick={() => handleRemoveChannel(channel)}>
          {Channels[channel as keyof typeof Channels]}
        </Chip>
      ))}

      {(startdate || enddate) && (
        <Chip data-cy="tag-date" onClick={handleRemoveDates}>
          {startdate && !enddate && `Från ${dayjs(startdate).format('D MMM YYYY')}`}
          {!startdate && enddate && `Fram till ${dayjs(enddate).format('D MMM YYYY')}`}
          {startdate && enddate && `${dayjs(startdate).format('D MMM YYYY')} - ${dayjs(enddate).format('D MMM YYYY')}`}
        </Chip>
      )}

      {hasTags && (
        <button data-cy="tag-clearAll" className="sk-chip" onClick={() => handleReset()}>
          Rensa alla
        </button>
      )}
    </div>
  );
};

export default CasedataFilterTagsMobile;
