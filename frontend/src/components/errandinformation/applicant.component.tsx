import { StakeholderList } from '@components/stakeholder-list.component';
import { AppContext } from '@contexts/app-context-interface';
import { Role } from '@interfaces/role';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Disclosure, FormControl } from '@sk-web-gui/react';
import { isErrandReadOnly } from '@utils/errand-utils';
import { useContext, useState } from 'react';
import { SectionCompletion } from './sectionCompletion.component';

export const Applicant: React.FC<{}> = ({}) => {
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
        <StakeholderList roles={allowedRoles} />
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
