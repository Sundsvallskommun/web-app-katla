import { AppContext } from '@contexts/app-context-interface';
import { hasRepeatableGroup } from '@services/casedata-extra-parameters-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Disclosure, Divider, FormControl } from '@sk-web-gui/react';
import { isErrandReadOnly } from '@utils/errand-utils';
import { useContext, useState } from 'react';
import { RepeatableFieldGroup } from './repeatable-field-group';
import { SectionCompletion } from './sectionCompletion.component';
import { UppgiftFieldRenderer } from './uppgift-field-renderer';
import { useUppgiftFields } from './useUppgiftFields';

export const ExternalCircumstances: React.FC = () => {
  const [doneMark, setDoneMark] = useState(false);
  const { errand } = useContext(AppContext);
  const fields = useUppgiftFields('Yttre omständigheter');
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
            <div className="flex flex-col gap-32">
              {(() => {
                const renderedFields = new Set<string>();
                return fields.map((field, index) => {
                  if (renderedFields.has(field.field)) {
                    return null;
                  }

                  if (hasRepeatableGroup(field)) {
                    renderedFields.add(field.field);
                    const groupConfig = field.repeatableGroup;
                    const initialData = field.initialData;
                    return (
                      <RepeatableFieldGroup
                        key={`repeatable-${field.field}-${index}`}
                        groupName={groupConfig.groupName}
                        basePath={groupConfig.basePath}
                        fields={groupConfig.fields}
                        minItems={groupConfig.repeatableConfig.minItems}
                        addButtonText={groupConfig.repeatableConfig.addButtonText}
                        removeButtonText={groupConfig.repeatableConfig.removeButtonText}
                        initialData={initialData}
                      />
                    );
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
                  return <UppgiftFieldRenderer key={`${field.field}-${index}`} field={field} />;
                });
              })()}
            </div>
          : <p>Inga fält att visa.</p>}

          {fields.length > 0 && !isErrandReadOnly(errand) && (
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
