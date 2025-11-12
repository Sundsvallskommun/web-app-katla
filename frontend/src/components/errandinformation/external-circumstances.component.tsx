import { ErrandDisclosure } from '@components/errand-disclosures/errand-disclosure.component';
import { UppgiftFieldRenderer } from './uppgift-field-renderer';
import { useUppgiftFields } from './useUppgiftFields';

export const ExternalCircumstances: React.FC = () => {
  const fields = useUppgiftFields('Yttre omständigheter');
  return (
    <ErrandDisclosure header='Yttre omständigheter' lucideIconName='clipboard-signature' errandInformationSection>
   
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
