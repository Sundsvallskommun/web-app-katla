import { AppContext } from '@contexts/app-context-interface';
import { ErrandStatus } from '@interfaces/errand-status';
import {
  closedStatuses,
  draftStatuses,
  getStatusLabel,
  newStatuses,
  ongoingStatuses,
} from '@services/casedata-errand-service';
import store from '@services/storage-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Badge, Button } from '@sk-web-gui/react';
import { IconName } from 'lucide-react/dynamic';
import { useContext, useMemo } from 'react';

export interface SidebarButton {
  label: string;
  key: ErrandStatus;
  statuses: ErrandStatus[];
  icon: IconName;
  totalStatusErrands: number;
}

export const CasedataFilterSidebarStatusSelector: React.FC<{ iconButton: boolean }> = ({ iconButton }) => {
  const {
    isLoading,
    setSelectedErrandStatuses,
    selectedErrandStatuses,
    setSidebarLabel,
    newErrands,
    ongoingErrands,
    draftErrands,
    closedErrands,
  } = useContext(AppContext);

  const updateStatusFilter = (ss: ErrandStatus[]) => {
    try {
      const labelsToKeys: Record<string, string> = {};
      Object.entries(ErrandStatus).forEach(([k, v]) => {
        labelsToKeys[v] = k;
      });
      const statusKeys = ss.map((s) => labelsToKeys[s]);
      const storedFilter = store.get('filter');
      const jsonparsedstatus = JSON.parse(storedFilter);
      const status = statusKeys.join(',');
      jsonparsedstatus.status = status;
      const stringified = JSON.stringify(jsonparsedstatus);
      store.set('filter', stringified);
      setSelectedErrandStatuses(statusKeys as ErrandStatus[]);
    } catch (error) {
      console.error('Error updating status filter', error);
    }
  };

  const casedataSidebarButtons: SidebarButton[] = useMemo(
    () => [
      {
        label: getStatusLabel(newStatuses),
        key: newStatuses[0],
        statuses: newStatuses,
        icon: 'inbox',
        totalStatusErrands: newErrands.totalElements,
      },
      {
        label: getStatusLabel(ongoingStatuses),
        key: ongoingStatuses[0],
        statuses: ongoingStatuses,
        icon: 'clipboard-pen',
        totalStatusErrands: ongoingErrands.totalElements,
      },
      {
        label: getStatusLabel(draftStatuses),
        key: draftStatuses[0],
        statuses: draftStatuses,
        icon: 'square-pen',
        totalStatusErrands: draftErrands.totalElements,
      },
      {
        label: getStatusLabel(closedStatuses),
        key: closedStatuses[0],
        statuses: closedStatuses,
        icon: 'circle-check-big',
        totalStatusErrands: closedErrands.totalElements,
      },
    ],
    [newErrands, ongoingErrands, draftErrands, closedErrands]
  );

  return (
    <>
      {casedataSidebarButtons?.map((button) => {
        const buttonIsActive = button.statuses.some((s) => {
          const selectedStatusValues = selectedErrandStatuses.map(
            (status) => ErrandStatus[status as keyof typeof ErrandStatus]
          );
          return selectedStatusValues.includes(s as ErrandStatus);
        });
        return (
          <Button
            onClick={() => {
              updateStatusFilter(button.statuses);
              setSidebarLabel(button.label);
            }}
            aria-label={`status-button-${button.key}`}
            variant={buttonIsActive ? 'primary' : 'ghost'}
            className={`${!iconButton && 'justify-start'} ${!buttonIsActive && 'hover:bg-dark-ghost'}`}
            leftIcon={<LucideIcon name={button.icon as IconName} />}
            key={button.key}
            iconButton={iconButton}
          >
            {!iconButton && (
              <span className="w-full flex justify-between">
                {button.label}
                <Badge
                  className="min-w-fit px-4"
                  inverted={!buttonIsActive}
                  color={buttonIsActive ? 'tertiary' : 'vattjom'}
                  counter={
                    isLoading ? '-'
                    : button.totalStatusErrands > 999 ?
                      '999+'
                    : button.totalStatusErrands || '0'
                  }
                />
              </span>
            )}
          </Button>
        );
      })}
    </>
  );
};
