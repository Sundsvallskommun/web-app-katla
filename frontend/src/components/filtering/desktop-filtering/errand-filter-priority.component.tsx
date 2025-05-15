import { Priority } from '@interfaces/priority';
import { getPriorityColor } from '@services/casedata-errand-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Checkbox, PopupMenu, useThemeQueries } from '@sk-web-gui/react';
import { useFormContext } from 'react-hook-form';
import { CasePriorityFilter } from '../errand-filter';

export const CasedataFilterPriority: React.FC = () => {
  const { register } = useFormContext<CasePriorityFilter>();
  const { isMaxMediumDevice } = useThemeQueries();

  return (
    <PopupMenu>
      <PopupMenu.Button
        rightIcon={<LucideIcon name="chevron-down" />}
        data-cy="Prioritet-filter"
        variant={isMaxMediumDevice ? 'secondary' : 'tertiary'}
        showBackground={false}
        size={isMaxMediumDevice ? 'md' : 'sm'}
        className={isMaxMediumDevice ? 'w-full flex justify-between items-center text-left' : 'max-md:w-full'}
      >
        Prio
      </PopupMenu.Button>
      <PopupMenu.Panel className="max-md:w-full">
        <PopupMenu.Items>
          {Object.entries(Priority).map(([key, label], idx) => {
            return (
              <PopupMenu.Item key={`${label}-${idx}`}>
                <Checkbox
                  labelPosition="left"
                  value={key}
                  {...register('priority')}
                  data-cy={`Prioritet-filter-${key}`}
                >
                  <span className="flex gap-12 items-center">
                    <LucideIcon name="circle-dot" color={getPriorityColor(key as keyof typeof Priority)} />
                    {label}
                  </span>
                </Checkbox>
              </PopupMenu.Item>
            );
          })}
        </PopupMenu.Items>
      </PopupMenu.Panel>
    </PopupMenu>
  );
};
