import { AppContext } from '@contexts/app-context-interface';
import { IErrand } from '@interfaces/errand';
import { Priority } from '@interfaces/priority';
import { EXTRAPARAMETER_SEPARATOR } from '@services/casedata-extra-parameters-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Disclosure, Divider, FormControl } from '@sk-web-gui/react';
import { isErrandReadOnly } from '@utils/errand-utils';
import { useContext, useEffect, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { SectionCompletion } from './sectionCompletion.component';
import { UppgiftFieldRenderer } from './uppgift-field-renderer';
import { useUppgiftFields } from './useUppgiftFields';

export const MedicalOpinion: React.FC = () => {
  const [doneMark, setDoneMark] = useState(false);
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
    <FormControl className="w-full" disabled={readOnly}>
      <Disclosure
        icon={<LucideIcon name="clipboard-signature" />}
        header="Medicinskt utlåtande"
        variant="alt"
        open={fields.length > 0}
        className="w-full"
        label={doneMark ? 'Komplett' : ''}
        labelColor="gronsta"
      >
        <div className="mt-24">
          {fields.length > 0 ?
            <div className="flex flex-col gap-32">
              {(() => {
                const renderedFields = new Set<string>();
                return fields.map((field, index) => {
                  if (renderedFields.has(field.field)) {
                    return null;
                  }

                  if (field.pairWith) {
                    const pairedField = fields.find((f) => f.field === field.pairWith);
                    if (pairedField && !renderedFields.has(pairedField.field)) {
                      renderedFields.add(field.field);
                      renderedFields.add(pairedField.field);
                      return (
                        <div key={`pair-${field.field}-${index}`} className="grid grid-cols-2 gap-16 w-full">
                          <div className="min-w-0">
                            <UppgiftFieldRenderer field={field} />
                          </div>
                          <div className="min-w-0">
                            <UppgiftFieldRenderer field={pairedField} />
                          </div>
                        </div>
                      );
                    }
                  }

                  renderedFields.add(field.field);
                  return (
                    <UppgiftFieldRenderer key={`${field.field}-${index}`} field={field} />
                  );
                });
              })()}
            </div>
          : <p>Inga fält att visa.</p>}

          {fields.length > 0 && !readOnly && (
            <>
              <Divider className="pt-20" />
              <SectionCompletion
                checked={doneMark}
                onChange={() => {
                  setDoneMark(!doneMark);
                }}
              />
            </>
          )}
        </div>
      </Disclosure>
    </FormControl>
  );
};
