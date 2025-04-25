import { Controller, useFormContext } from 'react-hook-form';
import { Channels } from '@interfaces/channels';
import { Combobox } from '@sk-web-gui/react';
import { CaseChannelFilter } from '../errand-filter';

export const CasedataFilterChannelMobile: React.FC = () => {
  const { control } = useFormContext<CaseChannelFilter>();

  const channelOptions = Object.entries(Channels).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <div className="w-full">
      <Controller
        name="channel"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <Combobox
            className="w-full"
            multiple
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            placeholder="Inkom via"
          >
            <Combobox.Input className="w-full" />
            <Combobox.List>
              {channelOptions
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
