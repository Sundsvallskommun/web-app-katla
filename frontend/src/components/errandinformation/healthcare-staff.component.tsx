import { DisplayCard } from '@components/display-card.component';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Checkbox, Disclosure } from '@sk-web-gui/react';
import { useState } from 'react';

export const HealthCareStaff: React.FC = () => {
  const [doneMark, setDoneMark] = useState(false);
  return (
    <Disclosure
      icon={<LucideIcon name="user" />}
      header="Vårdpersonal"
      variant="alt"
      className="w-full px-32"
      open={true}
      label={doneMark ? 'Komplett' : ''}
      labelColor={'gronsta'}
    >
      <div className="flex flex-col">
        <p>Vårdpersonal är den person som initierat ärendet och vår primära kontakt när ärendet handläggs.</p>
        <DisplayCard
          isEditable={true}
          userName="abc01abc"
          ssn={'20000000-0000'}
          street={'Adress 1'}
          city={'Sundsvall'}
          mail={'mail@example.com'}
          phoneNumber={'070-000 00 00'}
          role={'Vårdpersonal'}
          firstName={'Förnamn'}
          lastName={'Efternamn'}
        />
      </div>
      <div className="mt-24">
        <Checkbox
          onClick={() => {
            setDoneMark(!doneMark);
          }}
          checked={doneMark}
        >
          Markera avsnittet som komplett
        </Checkbox>
      </div>
    </Disclosure>
  );
};
