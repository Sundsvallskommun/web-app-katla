import { StakeholderList } from '@components/stakeholder-list.component';
import { Role } from '@interfaces/role';
import { CasedataOwnerOrContact } from '@interfaces/stakeholder';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Checkbox, Disclosure } from '@sk-web-gui/react';
import { useState } from 'react';

export const Applicant: React.FC<{
  owners: CasedataOwnerOrContact[];
  setOwners: React.Dispatch<React.SetStateAction<CasedataOwnerOrContact[]>>;
}> = ({ owners, setOwners }) => {
  const [doneMark, setDoneMark] = useState(false);
  const allowedRoles = [Role.APPLICANT];

  return (
    <Disclosure
      data-cy="applicant-diclosure"
      open={true}
      icon={<LucideIcon name="users" />}
      header="Sökande"
      variant="alt"
      className="w-full mobileVersion"
      label={doneMark ? 'Komplett' : ''}
      labelColor={'gronsta'}
    >
      <p>En sökande kan vara en individ som berörs av ärendet.</p>
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
