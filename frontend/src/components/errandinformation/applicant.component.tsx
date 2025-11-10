import { StakeholderList } from '@components/stakeholder-list.component';
import { AppContext } from '@contexts/app-context-interface';
import { Role } from '@interfaces/role';
import { CasedataOwnerOrContact } from '@interfaces/stakeholder';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Disclosure, FormControl, FormErrorMessage } from '@sk-web-gui/react';
import { isErrandReadOnly } from '@utils/errand-utils';
import { useContext, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { SectionCompletion } from './sectionCompletion.component';

export const Applicant: React.FC = () => {
  const [doneMark, setDoneMark] = useState(false);
  const allowedRoles = [Role.APPLICANT];
  const { errand } = useContext(AppContext);
  const isReadOnly = isErrandReadOnly(errand);

  const { watch } = useFormContext();

  const stakeholders = watch('stakeholders') || [];
  const applicantStakeholders = stakeholders.filter((s: CasedataOwnerOrContact) => s?.roles?.includes(Role.APPLICANT));
  const showWarning = !isReadOnly && applicantStakeholders.length === 0;

  return (
    <FormControl className="w-full" disabled={isReadOnly}>
      <Disclosure
        data-cy="applicant-disclosure"
        open={true}
        icon={<LucideIcon name="users" />}
        header="Sökande"
        variant="alt"
        className="w-full mobileVersion"
        label={doneMark ? 'Komplett' : ''}
        labelColor={'gronsta'}
      >
        <StakeholderList roles={allowedRoles} />
        {showWarning && (
          <FormErrorMessage className="text-error text-md mt-12">
            En sökande part krävs för att registrera ärendet.
          </FormErrorMessage>
        )}
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
