import { ErrandDisclosure } from '@components/errand-disclosures/errand-disclosure.component';
import { StakeholderList } from '@components/stakeholder-list.component';
import { OTHER_PARTY_ROLES } from '@interfaces/role';

export const OtherParties: React.FC = () => {
  const allowedRoles = [...OTHER_PARTY_ROLES];
  return (
    <ErrandDisclosure header="Övriga parter" lucideIconName="users">
      <div data-cy="otherparties-disclosure">
        <StakeholderList roles={allowedRoles} />
      </div>
    </ErrandDisclosure>
  );
};
