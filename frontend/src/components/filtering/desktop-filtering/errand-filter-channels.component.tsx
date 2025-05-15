import { Channels } from '@interfaces/channels'; // Anpassa efter din enum eller interface
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Checkbox, PopupMenu, useThemeQueries } from '@sk-web-gui/react';
import { useFormContext } from 'react-hook-form';
import { CaseChannelFilter } from '../errand-filter';

export const CasedataFilterChannel: React.FC = () => {
  const { register } = useFormContext<CaseChannelFilter>();
  const { isMaxLargeDevice } = useThemeQueries();
  return (
    <PopupMenu>
      <PopupMenu.Button
        rightIcon={<LucideIcon name="chevron-down" />}
        data-cy="Channel-filter"
        variant={isMaxLargeDevice ? 'secondary' : 'tertiary'}
        showBackground={false}
        size={isMaxLargeDevice ? 'md' : 'sm'}
        className={isMaxLargeDevice ? 'w-full flex justify-between items-center text-left' : 'max-md:w-full'}
      >
        Inkom via
      </PopupMenu.Button>
      <PopupMenu.Panel className="max-md:w-full">
        <PopupMenu.Items>
          {Object.entries(Channels).map(([key, label], idx) => (
            <PopupMenu.Item key={`${label}-${idx}`}>
              <Checkbox labelPosition="left" value={key} {...register('channel')} data-cy={`Channel-filter-${key}`}>
                {label}
              </Checkbox>
            </PopupMenu.Item>
          ))}
        </PopupMenu.Items>
      </PopupMenu.Panel>
    </PopupMenu>
  );
};
