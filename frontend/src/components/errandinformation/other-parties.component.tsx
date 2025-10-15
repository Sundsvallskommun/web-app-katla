import { StakeholderList } from '@components/stakeholder-list.component';
import { Role } from '@interfaces/role';
import { CasedataOwnerOrContact } from '@interfaces/stakeholder';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Disclosure, FormControl } from '@sk-web-gui/react';
import { useState } from 'react';
import { SectionCompletion } from './sectionCompletion.component';

export const OtherParties: React.FC<{
  owners: CasedataOwnerOrContact[];
  setOwners: React.Dispatch<React.SetStateAction<CasedataOwnerOrContact[]>>;
}> = ({ owners, setOwners }) => {
  const [doneMark, setDoneMark] = useState(false);
  const allowedRoles = [Role.CONTACT_PERSON, Role.FELLOW_APPLICANT, Role.DOCTOR];
  return (
    <FormControl className="w-full">
      <Disclosure
        icon={<LucideIcon name="users" />}
        header="Övriga parter"
        open={true}
        variant="alt"
        className="w-full mobileVersion"
        label={doneMark ? 'Komplett' : ''}
        labelColor={'gronsta'}
      >
        <p>En part kan vara en kontaktperson, läkare eller en anhörig vars roll är viktig för ärendet.</p>
        <div data-cy="otherparties-disclosure">
          <StakeholderList owners={owners} setOwners={setOwners} roles={allowedRoles} />
        </div>

        <SectionCompletion
          checked={doneMark}
          onChange={() => {
            setDoneMark(!doneMark);
          }}
        />
      </Disclosure>
    </FormControl>
  );
};
