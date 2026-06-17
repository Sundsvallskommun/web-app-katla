import { ErrandDisclosure } from '@components/errand-disclosures/errand-disclosure.component';
import { buildRenderableFields } from '@components/field-rendering/renderable-fields';
import { AppContext } from '@contexts/app-context-interface';
import { Channels } from '@interfaces/channels';
import { IErrand } from '@interfaces/errand';
import { Priority } from '@interfaces/priority';
import {
  EXTRAPARAMETER_SEPARATOR,
  extraParametersToUppgiftMapper,
  UppgiftFieldExtended,
} from '@services/casedata-extra-parameters-service';
import { isErrandReadOnly } from '@utils/errand-utils';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { RepeatableFieldGroup } from './repeatable-field-group';
import { UppgiftFieldRenderer } from './uppgift-field-renderer';

export const MedicalOpinion: React.FC = () => {
  const { errand } = useContext(AppContext);
  const readOnly = isErrandReadOnly(errand);
  const diagnosesFieldName = `medical${EXTRAPARAMETER_SEPARATOR}diagnoses`;
  const diagnoses = useWatch({ name: diagnosesFieldName });
  const priority = useWatch({ name: 'priority' });
  const autoSetByPalliativeRef = useRef(false);

  const [fields, setFields] = useState<UppgiftFieldExtended[]>([]);
  const context = useFormContext<IErrand>();
  const caseType = context.watch('caseType');

  useEffect(() => {
    if (readOnly) return;
    const diagnosesList =
      Array.isArray(diagnoses) ? diagnoses
      : diagnoses ? [diagnoses]
      : [];
    const hasPalliativeCare = diagnosesList.includes('PALLIATIVE_CARE');

    if (hasPalliativeCare) {
      autoSetByPalliativeRef.current = true;
      if (priority !== Priority.HIGH) {
        context.setValue('priority', Priority.HIGH, { shouldDirty: true });
      }
      return;
    }

    if (autoSetByPalliativeRef.current) {
      autoSetByPalliativeRef.current = false;
      if (priority !== Priority.MEDIUM) {
        context.setValue('priority', Priority.MEDIUM, { shouldDirty: true });
      }
    }
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [diagnoses, priority, readOnly, context.setValue]);

  useEffect(() => {
    const uppgifter = extraParametersToUppgiftMapper({
      caseType: caseType || '',
      extraParameters: errand?.extraParameters ?? [],
    });
    const f = caseType ? (uppgifter[caseType] ?? []).filter((f) => f.section === 'Medicinskt utlåtande') : [];
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
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        context.setValue<any>(key, normalizedArray, { shouldDirty: false });
      } else {
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        context.setValue<any>(key, rawValue, { shouldDirty: false });
      }
    });
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [caseType, errand]);

  const renderable = useMemo(
    () => buildRenderableFields(fields, { RepeatableFieldGroup, UppgiftFieldRenderer }),
    [fields]
  );

  // Visa "Medicinskt utlåtande" som egen sektion endast när ärendet kommit in via
  // katla-färdtjänsten. För övriga kanaler visas fälten i stället under "Yttre omständigheter".
  // Hooks ovan körs fortfarande (default-värden + palliativ prioritetslogik) oavsett kanal.
  const isKatlaChannel = errand?.channel === Channels.ESERVICE_KATLA;

  if (fields.length === 0 || !isKatlaChannel) {
    return null;
  }

  return (
    <ErrandDisclosure header="Medicinskt utlåtande" lucideIconName="clipboard-signature" errandInformationSection>
      <div className="mt-24">
        <div className="flex flex-col gap-32">{renderable}</div>
      </div>
    </ErrandDisclosure>
  );
};
