import { DisplayCard } from '@components/display-card.component';
import { AppContext } from '@contexts/app-context-interface';
import { Role } from '@interfaces/role';
import { CasedataOwnerOrContact } from '@interfaces/stakeholder';
import { searchADUser } from '@services/adress-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Checkbox, Disclosure, useThemeQueries, isArray } from '@sk-web-gui/react';
import { useContext, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

export const HealthCareStaff: React.FC<{
  staff?: CasedataOwnerOrContact[];
  setStaff: React.Dispatch<React.SetStateAction<CasedataOwnerOrContact[]>>;
  isNewErrand: boolean;
}> = ({ setStaff, isNewErrand }) => {
  const [doneMark, setDoneMark] = useState(false);
  const { user } = useContext(AppContext);
  const { isMaxLargeDevice } = useThemeQueries();
  const { control, getValues, watch, setValue } = useForm<CasedataOwnerOrContact>({
    mode: 'onChange', // NOTE: Needed if we want to disable submit until valid
    defaultValues: {
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

  const username = watch('adAccount');
  const firstName = watch(`firstName`);
  const lastName = watch(`lastName`);
  const street = watch(`street`);
  const city = watch(`city`);
  const emails = watch(`emails`);
  const phoneNumbers = watch(`phoneNumbers`);
  const personNumber = watch(`personalNumber`);
  const roles = watch('roles');

  const { append: appendPhonenumber } = useFieldArray({
    control,
    name: `phoneNumbers`,
  });

  const { append: appendEmail } = useFieldArray({ control, name: 'emails' });

  useEffect(() => {
    if (!user?.username || !isNewErrand) {
      console.warn('user.username is missing:', user);
      return;
    }

    searchADUser(user.username)
      .then((res) => {
        if (!isArray(res)) {
          setValue(`firstName`, res.firstName, { shouldDirty: true });
          setValue(`lastName`, res.lastName, { shouldDirty: true });
          setValue(`street`, res.street || '', { shouldDirty: true });
          setValue(`careof`, res.careof || '', { shouldDirty: true });
          setValue(`zip`, res.zip, { shouldDirty: true });
          setValue(`city`, res.city, { shouldDirty: true });
          setValue(`personId`, res.personId, { shouldDirty: true });
          setValue(`roles`, [Role.REPORTER], { shouldDirty: true });
          setValue(`newRole`, Role.REPORTER, { shouldDirty: true });
          setValue(`stakeholderType`, 'PERSON', { shouldDirty: true });
          if (res.phone) {
            appendPhonenumber({ value: res.phone });
          }
          if (res.workPhone) {
            appendPhonenumber({ value: res.workPhone });
          }
          if (res.email) {
            appendEmail({ value: res.email });
          }
          if (res.loginName) {
            setValue('adAccount', res.loginName);
          }
          const formData = getValues();
          setStaff([formData]);
        }
      })
      .catch(() => {
        console.error('Kunde inte hämta vårdpersonal från AD');
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isNewErrand]);

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
        <div className={`${isMaxLargeDevice ? '' : 'px-16'}`}>
          <p>Vårdpersonal är den person som initierat ärendet och vår primära kontakt när ärendet handläggs.</p>

          {firstName &&
            lastName && ( // TEMP
              <DisplayCard
                isEditable={false}
                userName={username}
                personalNumber={personNumber}
                street={street}
                city={city}
                newEmail={emails?.[0]?.value}
                newPhoneNumber={phoneNumbers?.[0]?.value}
                roles={roles}
                firstName={firstName}
                lastName={lastName}
              />
            )}
        </div>
      </div>
      <div className={`${isMaxLargeDevice ? 'mt-24' : 'mt-24 px-16'}`}>
        <Checkbox onClick={() => setDoneMark(!doneMark)} checked={doneMark}>
          Markera avsnittet som komplett
        </Checkbox>
      </div>
    </Disclosure>
  );
};
