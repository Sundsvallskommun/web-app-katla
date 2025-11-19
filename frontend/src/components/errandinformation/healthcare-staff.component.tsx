import { DisplayCard } from '@components/display-card.component';
import { ErrandDisclosure } from '@components/errand-disclosures/errand-disclosure.component';
import { IErrand } from '@interfaces/errand';
import { Role } from '@interfaces/role';
import { useFormContext } from 'react-hook-form';

export const HealthCareStaff: React.FC = () => {
  const { watch } = useFormContext<IErrand>();

  const stakeholders = watch('stakeholders') || [];
  const reporterStakeholder = stakeholders.filter((s) => s.roles?.includes(Role.REPORTER));

  return (
    <ErrandDisclosure header="Vårdpersonal" lucideIconName="user">
      <div className="w-full">
        <p>Vårdpersonal är den person som initierat ärendet och vår primära kontakt när ärendet handläggs.</p>

        {reporterStakeholder?.map((person, index) => (
          <DisplayCard key={index} person={person} availableRoles={[Role.REPORTER]} />
        ))}
      </div>
    </ErrandDisclosure>
  );
};
