import { AppContext } from '@contexts/app-context-interface';
import { FTCaseLabel } from '@interfaces/case-type';
import { IErrand } from '@interfaces/errand';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { cx, Disclosure, FormControl, Select } from '@sk-web-gui/react';
import { isErrandReadOnly } from '@utils/errand-utils';
import { useContext, useState } from 'react';
import { useFormContext, UseFormReturn } from 'react-hook-form';
import { SectionCompletion } from './sectionCompletion.component';

export const AboutErrand: React.FC = () => {
  const [doneMark, setDoneMark] = useState(false);
  const { register }: UseFormReturn<IErrand, unknown, undefined> = useFormContext();
  const { errand } = useContext(AppContext);
  return (
    <FormControl className="w-full" disabled={isErrandReadOnly(errand)}>
      <Disclosure
        icon={<LucideIcon name="info" />}
        header="Om ärendet"
        variant="alt"
        className="w-full mobileVersion"
        open={true}
        label={doneMark ? 'Komplett' : ''}
        labelColor={'gronsta'}
      >
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
        <SectionCompletion
          checked={doneMark}
          onChange={() => {
            setDoneMark(!doneMark);
          }}
        />
      </Disclosure>
    </FormControl>
  );
};
