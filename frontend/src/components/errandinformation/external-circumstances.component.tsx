import { ErrandDisclosure } from '@components/errand-disclosures/errand-disclosure.component';
import { buildRenderableFields } from '@components/field-rendering/renderable-fields';
import { AppContext } from '@contexts/app-context-interface';
import { IErrand } from '@interfaces/errand';
import {
  EXTRAPARAMETER_SEPARATOR,
  extraParametersToUppgiftMapper,
  UppgiftFieldExtended,
} from '@services/casedata-extra-parameters-service';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { RepeatableFieldGroup } from './repeatable-field-group';
import { UppgiftFieldRenderer } from './uppgift-field-renderer';

export const ExternalCircumstances: React.FC = () => {
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
    <ErrandDisclosure header="Yttre omständigheter" lucideIconName="clipboard-signature" errandInformationSection>
      <div className="mt-24">
        {fields.length > 0 ?
          <div className="flex flex-col gap-32">{renderable}</div>
        : <p>Inga fält att visa.</p>}
      </div>
    </ErrandDisclosure>
  );
};
