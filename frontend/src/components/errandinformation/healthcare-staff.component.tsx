import { DisplayCard } from '@components/display-card.component';
import { AppContext } from '@contexts/app-context-interface';
import { IErrand } from '@interfaces/errand';
import { Role } from '@interfaces/role';
import { CasedataOwnerOrContact } from '@interfaces/stakeholder';
import { searchADUser } from '@services/adress-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Disclosure, FormControl, isArray } from '@sk-web-gui/react';
import { isErrandReadOnly } from '@utils/errand-utils';
import { useContext, useEffect, useRef, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { SectionCompletion } from './sectionCompletion.component';

export const HealthCareStaff: React.FC = () => {
  const [doneMark, setDoneMark] = useState(false);
  const { user, errand } = useContext(AppContext);
  const hasAddedReporter = useRef(false);

  const { control } = useFormContext<IErrand>();

  const { fields, append } = useFieldArray({
    control,
    name: 'stakeholders',
  });

  const reporterStakeholder = fields.filter((s) => s.roles?.includes(Role.REPORTER));

  useEffect(() => {
    if (reporterStakeholder.length === 0 && user?.username && !hasAddedReporter.current) {
      hasAddedReporter.current = true;
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
    <FormControl className="w-full" disabled={isErrandReadOnly(errand)}>
      <Disclosure
        icon={<LucideIcon name="user" />}
        header="Vårdpersonal"
        variant="alt"
        className="w-full mobileVersion"
        open={true}
        label={doneMark ? 'Komplett' : ''}
        labelColor={'gronsta'}
      >
        <div className="w-full">
          <p>Vårdpersonal är den person som initierat ärendet och vår primära kontakt när ärendet handläggs.</p>

          {reporterStakeholder?.map((person, index) => (
            <DisplayCard key={index} person={person} availableRoles={[Role.REPORTER]} />
          ))}
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
