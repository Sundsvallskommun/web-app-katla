import { DisplayCard } from '@components/display-card.component';
import { AppContext } from '@contexts/app-context-interface';
import { Role } from '@interfaces/role';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Checkbox, Disclosure } from '@sk-web-gui/react';
import { useContext, useState } from 'react';

export const HealthCareStaff: React.FC = () => {
  const [doneMark, setDoneMark] = useState(false);
  const { user } = useContext(AppContext);
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
          userName={user?.username}
          personalNumber={'yyyymmdd-xxxx'}
          street={'Adress 1'}
          city={'Sundsvall'}
          newEmail={user?.email}
          newPhoneNumber={'070-000 00 00'}
          roles={[Role.DOCTOR]}
          firstName={user?.firstName}
          lastName={user?.lastName}
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
