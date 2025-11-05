import { StakeholderList } from '@components/stakeholder-list.component';
import { OTHER_PARTY_ROLES } from '@interfaces/role';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Disclosure, FormControl } from '@sk-web-gui/react';
import { useState } from 'react';
import { SectionCompletion } from './sectionCompletion.component';

export const OtherParties: React.FC = () => {
  const [doneMark, setDoneMark] = useState(false);
  const allowedRoles = [...OTHER_PARTY_ROLES];
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
        <div data-cy="otherparties-disclosure">
          <StakeholderList roles={allowedRoles} />
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
