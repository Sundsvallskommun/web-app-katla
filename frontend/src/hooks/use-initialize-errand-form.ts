import { AppContext } from '@contexts/app-context-interface';
import { IErrand } from '@interfaces/errand';
import { Role } from '@interfaces/role';
import { CasedataOwnerOrContact } from '@interfaces/stakeholder';
import { searchADUser } from '@services/adress-service';
import { emptyErrand } from '@services/casedata-errand-service';
import { getMe } from '@services/user-service';
import { isArray } from '@sk-web-gui/react';
import { useContext, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

export const useInitializeErrandForm = (method: UseFormReturn<IErrand>) => {
  const { setMunicipalityId, setUser } = useContext(AppContext);

  useEffect(() => {
    const initializeForm = async () => {
      setMunicipalityId(process.env.NEXT_PUBLIC_MUNICIPALITY_ID || '');

      try {
        const user = await getMe();
        setUser(user);

        const adUserInfo = await searchADUser(user.username);

        if (!isArray(adUserInfo)) {
          const reporterStakeholder: CasedataOwnerOrContact = {
            firstName: adUserInfo.firstName ?? '',
            lastName: adUserInfo.lastName ?? '',
            street: adUserInfo.street ?? '',
            city: adUserInfo.city ?? '',
            careof: adUserInfo.careof ?? '',
            zip: adUserInfo.zip ?? '',
            adAccount: adUserInfo.loginName ?? '',
            personalNumber: adUserInfo.personId ?? '',
            emails: adUserInfo.email ? [{ value: adUserInfo.email }] : [],
            phoneNumbers: adUserInfo.phone ? [{ value: adUserInfo.phone }] : [],
            newEmail: adUserInfo.email,
            newPhoneNumber: adUserInfo.phone,
            roles: [Role.REPORTER],
            stakeholderType: 'PERSON',
            id: '',
            newRole: Role.REPORTER,
          };

          method.reset({
            ...emptyErrand,
            stakeholders: [reporterStakeholder],
          });
        }
      } catch (error) {
        console.error('Failed to initialize form with REPORTER:', error);
      }
    };

    initializeForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
