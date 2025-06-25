import LucideIcon from '@sk-web-gui/lucide-icon';
import { Checkbox, Disclosure, Divider } from '@sk-web-gui/react';
import { useState } from 'react';
import { UppgiftFieldRenderer } from './uppgift-field-renderer';
import { useUppgiftFields } from './useUppgiftFields';

export const PersonalInformation: React.FC = () => {
  const [doneMark, setDoneMark] = useState(false);
  const fields = useUppgiftFields('Personlig information');

  return (
    <Disclosure
      icon={<LucideIcon name="person-standing" />}
      header="Personlig information"
      variant="alt"
      open={fields.length > 0}
      className="w-full"
      label={doneMark ? 'Komplett' : ''}
      labelColor="gronsta"
    >
      <div className="mt-24">
        {fields.length > 0 ?
          <div className="flex flex-col gap-32">
            {fields.map((field, index) => (
              <UppgiftFieldRenderer key={`${field.field}-${index}`} field={field} />
            ))}
          </div>
        : <p>Inga fält att visa.</p>}

        {fields.length > 0 && (
          <>
            <Divider className="pt-20" />
            <Checkbox onClick={() => setDoneMark(!doneMark)} checked={doneMark} className="mt-24">
              Markera avsnittet som komplett
            </Checkbox>
          </>
        )}
      </div>
    </Disclosure>
  );
};
