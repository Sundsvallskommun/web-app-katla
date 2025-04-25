import { ErrandStatus } from '@interfaces/errand-status';
import { Controller, useFormContext } from 'react-hook-form';
import { CaseStatusFilter } from '../errand-filter';
import { Combobox } from '@sk-web-gui/react';

export const CasedataFilterStatusMobile: React.FC = () => {
  const { control } = useFormContext<CaseStatusFilter>();

  const statusOptions = Object.entries(ErrandStatus).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <div className="w-full">
      <Controller
        name="status"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <Combobox
            className="w-full"
            multiple
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            placeholder="Status"
          >
            <Combobox.Input className="w-full" />
            <Combobox.List>
              {statusOptions.map((option) => (
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
