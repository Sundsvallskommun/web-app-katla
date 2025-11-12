import { DisplayCard } from '@components/display-card.component';
import { ErrandDisclosure } from '@components/errand-disclosures/errand-disclosure.component';
import { AppContext } from '@contexts/app-context-interface';
import { IErrand } from '@interfaces/errand';
import { Role } from '@interfaces/role';
import { CasedataOwnerOrContact } from '@interfaces/stakeholder';
import { searchADUser } from '@services/adress-service';
import { isArray } from '@sk-web-gui/react';
import { useContext, useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

export const HealthCareStaff: React.FC = () => {
  const { user} = useContext(AppContext);

  const { control } = useFormContext<IErrand>();

  const { fields, append } = useFieldArray({
    control,
    name: 'stakeholders',
  });

  const reporterStakeholder = fields.filter((s) => s.roles?.includes(Role.REPORTER));

  useEffect(() => {
    if (reporterStakeholder.length === 0 && user?.username) {
      searchADUser(user.username)
        .then((res) => {
          if (!isArray(res)) {
            const newReporter: CasedataOwnerOrContact = {
              firstName: res.firstName ?? '',
              lastName: res.lastName ?? '',
              street: res.street ?? '',
              city: res.city ?? '',
              careof: res.careof ?? '',
              zip: res.zip ?? '',
              adAccount: res.loginName ?? '',
              personalNumber: res.personId ?? '',
              emails: res.email ? [{ value: res.email }] : [],
              phoneNumbers: res.phone ? [{ value: res.phone }] : [],
              newEmail: res.email,
              newPhoneNumber: res.phone,
              roles: [Role.REPORTER],
              stakeholderType: 'PERSON',
              id: '',
              newRole: Role.REPORTER,
            };
            append(newReporter);
          }
        })
        .catch(() => {
          console.error('Kunde inte hämta vårdpersonal från AD');
        });
    }
  }, [reporterStakeholder.length, user?.username, append]);

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
