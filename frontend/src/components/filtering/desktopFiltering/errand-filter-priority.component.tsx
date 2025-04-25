import { Priority } from '@interfaces/priority';
import { getPriorityColor } from '@services/casedata-errand-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Checkbox, PopupMenu } from '@sk-web-gui/react';
import { useFormContext } from 'react-hook-form';
import { CasePriorityFilter } from '../errand-filter';

export const CasedataFilterPriority: React.FC = () => {
  const { register } = useFormContext<CasePriorityFilter>();

  return (
    <PopupMenu>
      <PopupMenu.Button
        rightIcon={<LucideIcon name="chevron-down" />}
        data-cy="Prioritet-filter"
        variant="tertiary"
        showBackground={false}
        size="sm"
        className="max-md:w-full"
      >
        Prio
      </PopupMenu.Button>
      <PopupMenu.Panel className="max-md:w-full">
        <PopupMenu.Items>
          {Object.entries(Priority).map(([key, label], idx) => (
            <PopupMenu.Item key={`${label}-${idx}`}>
              <Checkbox labelPosition="left" value={key} {...register('priority')} data-cy={`Prioritet-filter-${key}`}>
                <span className="flex gap-12 items-center">
                  <LucideIcon name="circle-dot" className={getPriorityColor(key as Priority)} />

                  {label}
                </span>
              </Checkbox>
            </PopupMenu.Item>
          ))}
        </PopupMenu.Items>
      </PopupMenu.Panel>
    </PopupMenu>
  );
};
