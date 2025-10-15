import { AppContext } from '@contexts/app-context-interface';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Disclosure, Divider, FormControl } from '@sk-web-gui/react';
import { isErrandReadOnly } from '@utils/errand-utils';
import { useContext, useState } from 'react';
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
              {fields.map((field, index) => (
                <UppgiftFieldRenderer key={`${field.field}-${index}`} field={field} />
              ))}
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
