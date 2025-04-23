import { PTCaseLabel } from '@interfaces/case-label';
import { IErrand } from '@interfaces/errand';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Checkbox, cx, Disclosure, Select } from '@sk-web-gui/react';
import { useState } from 'react';
import { useFormContext, UseFormReturn } from 'react-hook-form';

export const AboutErrand: React.FC = () => {
  const [doneMark, setDoneMark] = useState(false);

  const { register }: UseFormReturn<IErrand, unknown, undefined> = useFormContext();
  return (
    <Disclosure
      icon={<LucideIcon name="info" />}
      header="Om ärendet"
      variant="alt"
      className="w-full px-32"
      open={true}
      label={doneMark ? 'Komplett' : ''}
      labelColor={'gronsta'}
    >
      <div className="flex flex-col">
        <strong className="mb-10">Ärendetyp*</strong>
        <Select className="w-full" {...register('caseType')}>
          {Object.entries(PTCaseLabel)
            .filter(([, label]) => label !== 'Överklagan')
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
      <div className="mt-24">
        <Checkbox
          onClick={() => {
            setDoneMark(!doneMark);
          }}
          checked={doneMark}
        >
          Markera avsnittet som komplett
        </Checkbox>
      </div>
    </Disclosure>
  );
};
