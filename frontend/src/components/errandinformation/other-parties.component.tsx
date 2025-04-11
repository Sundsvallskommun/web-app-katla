import { StakeholderList } from '@components/stakeholder-list.component';
import { CasedataOwnerOrContact } from '@interfaces/stakeholder';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Checkbox, Disclosure } from '@sk-web-gui/react';
import { useState } from 'react';

const roles: string[] = ['Sökande', 'Ärendeägare'];

export const OtherParties: React.FC<{
  owners: CasedataOwnerOrContact[];
  setOwners: React.Dispatch<React.SetStateAction<CasedataOwnerOrContact[]>>;
}> = ({ owners, setOwners }) => {
  const [doneMark, setDoneMark] = useState(false);
  return (
    <Disclosure
      icon={<LucideIcon name="users" />}
      header="Övriga parter"
      variant="alt"
      className="w-full px-32"
      label={doneMark ? 'Komplett' : ''}
      labelColor={'gronsta'}
    >
      <p>En part kan vara en kontaktperson, läkare eller en anhörig vars rol är viktig för ärendet.</p>
      <StakeholderList owners={owners} setOwners={setOwners} roles={roles} />
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
