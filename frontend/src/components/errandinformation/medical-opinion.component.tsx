import { ErrandDisclosure } from '@components/errand-disclosures/errand-disclosure.component';
import { AppContext } from '@contexts/app-context-interface';
import { IErrand } from '@interfaces/errand';
import { Priority } from '@interfaces/priority';
import { EXTRAPARAMETER_SEPARATOR } from '@services/casedata-extra-parameters-service';
import { isErrandReadOnly } from '@utils/errand-utils';
import { useContext, useEffect, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { UppgiftFieldRenderer } from './uppgift-field-renderer';
import { useUppgiftFields } from './useUppgiftFields';

export const MedicalOpinion: React.FC = () => {
  const fields = useUppgiftFields('Medicinskt utlåtande');
  const { errand } = useContext(AppContext);
  const readOnly = isErrandReadOnly(errand);
  const { setValue } = useFormContext<IErrand>();
  const diagnosesFieldName = `medical${EXTRAPARAMETER_SEPARATOR}diagnoses`;
  const diagnoses = useWatch({ name: diagnosesFieldName });
  const priority = useWatch({ name: 'priority' });
  const autoSetByPalliativeRef = useRef(false);

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
        setValue('priority', Priority.HIGH, { shouldDirty: true });
      }
      return;
    }

    if (autoSetByPalliativeRef.current) {
      autoSetByPalliativeRef.current = false;
      if (priority !== Priority.MEDIUM) {
        setValue('priority', Priority.MEDIUM, { shouldDirty: true });
      }
    }
  }, [diagnoses, priority, readOnly, setValue]);

  return (
    <ErrandDisclosure header="Medicinskt utlåtande" lucideIconName="clipboard-signature" errandInformationSection>
      <div className="mt-24">
        {fields.length > 0 ?
          <div className="flex flex-col gap-32">
            {fields.map((field, index) => (
              <UppgiftFieldRenderer key={`${field.field}-${index}`} field={field} />
            ))}
          </div>
        : <p>Inga fält att visa.</p>}
      </div>
    </ErrandDisclosure>
  );
};
