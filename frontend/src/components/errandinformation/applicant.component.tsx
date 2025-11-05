import { ErrandDisclosure } from '@components/errand-disclosures/errand-disclosure.component';
import { StakeholderList } from '@components/stakeholder-list.component';
import { Role } from '@interfaces/role';

export const Applicant: React.FC = () => {
  const allowedRoles = [Role.APPLICANT];

  return (
    <ErrandDisclosure header="Sökande" lucideIconName="users">
      <StakeholderList roles={allowedRoles} />
    </ErrandDisclosure>
  );
};
