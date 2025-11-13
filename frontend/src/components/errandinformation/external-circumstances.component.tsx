import { AppContext } from '@contexts/app-context-interface';
import { IErrand } from '@interfaces/errand';
import {
  EXTRAPARAMETER_SEPARATOR,
  extraParametersToUppgiftMapper,
  hasRepeatableGroup,
  UppgiftFieldExtended,
} from '@services/casedata-extra-parameters-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Disclosure, Divider, FormControl } from '@sk-web-gui/react';
import { isErrandReadOnly } from '@utils/errand-utils';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { RepeatableFieldGroup } from './repeatable-field-group';
import { SectionCompletion } from './sectionCompletion.component';
import { UppgiftFieldRenderer } from './uppgift-field-renderer';
import { buildRenderableFields } from '@components/field-rendering/renderable-fields';

export const ExternalCircumstances: React.FC = () => {
  const [doneMark, setDoneMark] = useState(false);
  const { errand } = useContext(AppContext);
  const [fields, setFields] = useState<UppgiftFieldExtended[]>([]);
  const context = useFormContext<IErrand>();
  const caseType = context.watch('caseType');

  useEffect(() => {
    const uppgifter = extraParametersToUppgiftMapper({
      caseType: caseType || '',
      extraParameters: errand?.extraParameters ?? [],
    });
    const f = caseType ? (uppgifter[caseType] ?? []).filter((f) => f.section === 'Yttre omständigheter') : [];
    setFields(f);

    f?.forEach((f) => {
      const key = f.field.replace(/\./g, EXTRAPARAMETER_SEPARATOR);
      const rawValue = f.value;
      if (f.formField.type === 'checkbox' || Array.isArray(rawValue)) {
        const normalizedArray =
          Array.isArray(rawValue) ? rawValue
          : typeof rawValue === 'string' ?
            rawValue
              .split(',')
              .map((v) => v.trim())
              .filter((v) => v !== '')
          : [];
        context.setValue<any>(key, normalizedArray, { shouldDirty: false });
      } else {
        context.setValue<any>(key, rawValue, { shouldDirty: false });
      }
    });
  }, [caseType, errand]);

  const renderable = useMemo(
    () => buildRenderableFields(fields, { RepeatableFieldGroup, UppgiftFieldRenderer }),
    [fields]
  );

  return (
    <FormControl className="w-full" disabled={isErrandReadOnly(errand)}>
      <Disclosure
        icon={<LucideIcon name="clipboard-signature" />}
        open={fields.length > 0}
        header="Yttre omständigheter"
        variant="alt"
        className="w-full"
        label={doneMark ? 'Komplett' : ''}
        labelColor="gronsta"
      >
        <div className="mt-24">
          {fields.length > 0 ?
            <div className="flex flex-col gap-32">{renderable}</div>
          : <p>Inga fält att visa.</p>}

          {fields.length > 0 && !isErrandReadOnly(errand) && (
            <>
              <Divider className="pt-20" />
              <SectionCompletion checked={doneMark} onChange={() => setDoneMark((s) => !s)} />
            </>
          )}
        </div>
      </Disclosure>
    </FormControl>
  );
};
