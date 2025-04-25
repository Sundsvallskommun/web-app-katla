import { Controller, useFormContext } from 'react-hook-form';
import { Priority } from '@interfaces/priority';
import { Combobox } from '@sk-web-gui/react';
import { CasePriorityFilter } from '../errand-filter';

export const CasedataFilterPriorityMobile: React.FC = () => {
  const { control } = useFormContext<CasePriorityFilter>();

  const priorityOptions = Object.entries(Priority).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <div className="w-full">
      <Controller
        name="priority"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <Combobox
            className="w-full"
            multiple
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            placeholder="Prioritet"
          >
            <Combobox.Input className="w-full" />
            <Combobox.List>
              {priorityOptions
                .sort((a, b) => a.label.localeCompare(b.label))
                .map((option) => (
                  <Combobox.Option key={option.value} value={option.value}>
                    {option.label}
                  </Combobox.Option>
                ))}
            </Combobox.List>
          </Combobox>
        )}
      />
    </div>
  );
};
