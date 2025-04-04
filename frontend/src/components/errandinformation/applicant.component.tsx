import { StakeholderList } from '@components/stakeholder-list.component';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Checkbox, Disclosure } from '@sk-web-gui/react';
import { useState } from 'react';

const roles: string[] = ['Sökande', 'Ärendeägare'];

export const Applicant: React.FC = () => {
  const [doneMark, setDoneMark] = useState(false);
  return (
    <Disclosure
      open={true}
      icon={<LucideIcon name="users" />}
      header="Sökande"
      variant="alt"
      className="w-full px-32"
      label={doneMark ? 'Komplett' : ''}
      labelColor={'gronsta'}
    >
      <p>En sökande kan vara en individ som berörs av ärendet.</p>
      <StakeholderList roles={roles} />
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
