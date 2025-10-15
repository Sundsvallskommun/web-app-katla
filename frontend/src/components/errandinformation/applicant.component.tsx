import { StakeholderList } from '@components/stakeholder-list.component';
import { AppContext } from '@contexts/app-context-interface';
import { Role } from '@interfaces/role';
import { CasedataOwnerOrContact } from '@interfaces/stakeholder';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Disclosure, FormControl } from '@sk-web-gui/react';
import { isErrandReadOnly } from '@utils/errand-utils';
import { useContext, useState } from 'react';
import { SectionCompletion } from './sectionCompletion.component';

export const Applicant: React.FC<{
  owners: CasedataOwnerOrContact[];
  setOwners: React.Dispatch<React.SetStateAction<CasedataOwnerOrContact[]>>;
}> = ({ owners, setOwners }) => {
  const [doneMark, setDoneMark] = useState(false);
  const allowedRoles = [Role.APPLICANT];
  const { errand } = useContext(AppContext);
  const isReadOnly = isErrandReadOnly(errand);

  return (
    <FormControl className="w-full" disabled={isReadOnly}>
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
