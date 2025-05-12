import { StakeholderList } from '@components/stakeholder-list.component';
import { Role } from '@interfaces/role';
import { CasedataOwnerOrContact } from '@interfaces/stakeholder';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Checkbox, Disclosure } from '@sk-web-gui/react';
import { useState } from 'react';

export const OtherParties: React.FC<{
  owners: CasedataOwnerOrContact[];
  setOwners: React.Dispatch<React.SetStateAction<CasedataOwnerOrContact[]>>;
}> = ({ owners, setOwners }) => {
  const [doneMark, setDoneMark] = useState(false);
  const allowedRoles = [Role.CONTACT_PERSON, Role.FELLOW_APPLICANT, Role.DOCTOR];
  return (
    <Disclosure
      icon={<LucideIcon name="users" />}
      header="Övriga parter"
      open={owners.length > 0}
      variant="alt"
      className="w-full mobileVersion"
      label={doneMark ? 'Komplett' : ''}
      labelColor={'gronsta'}
    >
      <p>En part kan vara en kontaktperson, läkare eller en anhörig vars roll är viktig för ärendet.</p>
      <StakeholderList owners={owners} setOwners={setOwners} roles={allowedRoles} />
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
