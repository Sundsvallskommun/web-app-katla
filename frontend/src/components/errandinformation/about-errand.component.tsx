import { ErrandDisclosure } from '@components/errand-disclosures/errand-disclosure.component';
import { FTCaseLabel } from '@interfaces/case-type';
import { IErrand } from '@interfaces/errand';
import { cx, Select } from '@sk-web-gui/react';
import { useFormContext, UseFormReturn } from 'react-hook-form';

export const AboutErrand: React.FC = () => {
  const { register }: UseFormReturn<IErrand, unknown, undefined> = useFormContext();

  return (
    <ErrandDisclosure header="Om ärendet" lucideIconName="info">
      <div className="flex flex-col">
        <strong className="mb-10">Ärendetyp*</strong>
        <Select data-cy="errand-casetype-select" className="w-full" {...register('caseType')}>
          {Object.entries(FTCaseLabel)
            .sort((a, b) => a[1].localeCompare(b[1]))
            .map(([key, label]: [string, string]) => {
              return (
                <Select.Option
                  className={cx(`cursor-pointer select-none relative py-4 pl-10 pr-4`)}
                  key={`caseType-${key}`}
                  value={key}
                >
                  {label}
                </Select.Option>
              );
            })}
        </Select>
      </div>
    </ErrandDisclosure>
  );
};
