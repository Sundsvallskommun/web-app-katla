import { Controller, useFormContext } from 'react-hook-form';
import { CaseTypeFilter } from '../errand-filter';
import { getCaseLabels } from '@services/casedata-errand-service';
import { Combobox } from '@sk-web-gui/react';

export const CasedataFilterCaseTypeMobile: React.FC = () => {
  const { control } = useFormContext<CaseTypeFilter>();

  const caseTypeOptions = Object.entries(getCaseLabels()).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <div className="w-full">
      <Controller
        name="caseType"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <Combobox
            className="w-full"
            multiple
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            placeholder="Ärendetyp"
          >
            <Combobox.Input className="w-full" />
            <Combobox.List>
              {caseTypeOptions
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
