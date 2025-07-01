import { DisplayCard } from '@components/display-card.component';
import { AppContext } from '@contexts/app-context-interface';
import { Role } from '@interfaces/role';
import { CasedataOwnerOrContact } from '@interfaces/stakeholder';
import { searchADUser } from '@services/adress-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Checkbox, Disclosure, useThemeQueries, isArray } from '@sk-web-gui/react';
import { useContext, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { usePathname } from 'next/navigation';

export const HealthCareStaff: React.FC<{
  staff?: CasedataOwnerOrContact[];
  setStaff: React.Dispatch<React.SetStateAction<CasedataOwnerOrContact[]>>;
}> = ({ staff, setStaff }) => {
  const [doneMark, setDoneMark] = useState(false);
  const { user } = useContext(AppContext);
  const { isMaxMediumDevice } = useThemeQueries();
  const pathname = usePathname();
  const isOnRegisterPage = pathname?.includes('/registrera');
  const hasStaff = Array.isArray(staff) && staff.length > 0;
  const { control, getValues, setValue } = useForm<CasedataOwnerOrContact>({
    mode: 'onChange',
    defaultValues: staff?.[0] ?? {
      firstName: '',
      lastName: '',
      street: '',
      city: '',
      careof: '',
      zip: '',
      adAccount: '',
      emails: [],
      phoneNumbers: [],
      personalNumber: '',
    },
  });

  const { append: appendPhonenumber } = useFieldArray({
    control,
    name: `phoneNumbers`,
  });

  const { append: appendEmail } = useFieldArray({ control, name: 'emails' });

  useEffect(() => {
    // Endast hämta från AD om vi är på registrera och ingen vårdpersonal finns
    if (!user?.username || !isOnRegisterPage || (staff && staff.length > 0)) return;

    searchADUser(user.username)
      .then((res) => {
        if (!isArray(res)) {
          setValue(`firstName`, res.firstName, { shouldDirty: true });
          setValue(`lastName`, res.lastName, { shouldDirty: true });
          setValue(`street`, res.street, { shouldDirty: true });
          setValue(`careof`, res.careof, { shouldDirty: true });
          setValue(`zip`, res.zip, { shouldDirty: true });
          setValue(`city`, res.city, { shouldDirty: true });
          setValue(`personId`, res.personId, { shouldDirty: true });
          setValue(`roles`, [Role.REPORTER], { shouldDirty: true });
          setValue(`newRole`, Role.REPORTER, { shouldDirty: true });
          setValue(`stakeholderType`, 'PERSON', { shouldDirty: true });
          if (res.phone) appendPhonenumber({ value: res.phone });
          if (res.workPhone) appendPhonenumber({ value: res.workPhone });
          if (res.email) appendEmail({ value: res.email });
          if (res.loginName) setValue('adAccount', res.loginName);

          const formData = getValues();
          setStaff([formData]);
        }
      })
      .catch(() => {
        console.error('Kunde inte hämta vårdpersonal från AD');
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, staff, isOnRegisterPage]);

  return (
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
        <div className={`${isMaxMediumDevice ? '' : 'px-16'}`}>
          <p>Vårdpersonal är den person som initierat ärendet och vår primära kontakt när ärendet handläggs.</p>

          {hasStaff &&
            staff!.map((person, index) => (
              <DisplayCard
                key={index}
                isEditable={false}
                userName={person.adAccount}
                personalNumber={person.personalNumber}
                street={person.street}
                city={person.city}
                newEmail={person.newEmail || person.emails?.[0]?.value}
                newPhoneNumber={person.newPhoneNumber || person.phoneNumbers?.[0]?.value}
                roles={person.roles}
                availableRoles={[Role.REPORTER]}
                firstName={person.firstName}
                lastName={person.lastName}
              />
            ))}
        </div>
      </div>
      <div className={`${isMaxMediumDevice ? 'mt-24' : 'mt-24 px-16'}`}>
        <Checkbox onClick={() => setDoneMark(!doneMark)} checked={doneMark}>
          Markera avsnittet som komplett
        </Checkbox>
      </div>
    </Disclosure>
  );
};
