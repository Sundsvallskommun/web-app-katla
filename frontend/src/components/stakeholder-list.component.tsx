import { searchPerson } from '@services/adress-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, FormLabel, Input, Select } from '@sk-web-gui/react';
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DisplayCard } from './display-card.component';
import { CasedataOwnerOrContact } from '@interfaces/stakeholder';
import { Role } from '@interfaces/role';
import { editStakeholder, removeStakeholder, addStakeholder } from '@services/casedata-stakeholder-service';
import { AppContext } from '@contexts/app-context-interface';
import { emailSchema, phoneSchema } from '@utils/validation-schema';
import * as yup from 'yup';

export const StakeholderList: React.FC<{
  owners: CasedataOwnerOrContact[];
  setOwners: React.Dispatch<React.SetStateAction<CasedataOwnerOrContact[]>>;
  roles: string[];
}> = ({ owners, setOwners, roles }) => {
  const [fetchedSsn, setFetchedSsn] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(false);
  const [searchResult, setSearchResult] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [validationMessages, setValidationMessages] = useState({
    email: '',
    phone: '',
    role: '',
    municipality: '',
  });
  const { municipalityId, errand } = useContext(AppContext);

  const { register, watch, setValue, getValues, clearErrors, reset } = useForm<CasedataOwnerOrContact>({
    mode: 'onChange',
  });

  const personId = watch('personId');
  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const street = watch('street');
  const careof = watch('careof');
  const zip = watch('zip');
  const city = watch('city');
  const personalNumber = watch('personalNumber');

  const updateOwner = (index: number, updatedData: { newEmail?: string; newPhoneNumber?: string }) => {
    setOwners((prevOwners) =>
      prevOwners.map((owner, i) => {
        if (i === index) {
          const updatedOwner = { ...owner, ...updatedData };
          if (updatedData.newEmail) updatedOwner.emails = [{ value: updatedData.newEmail }];
          if (updatedData.newPhoneNumber) updatedOwner.phoneNumbers = [{ value: updatedData.newPhoneNumber }];
          if (errand?.id) editStakeholder(municipalityId, errand.id, updatedOwner);
          return updatedOwner;
        }
        return owner;
      })
    );
  };

  const doSearch = () => {
    setFetchedSsn(true);
    const search = () => searchPerson(personalNumber as string);
    setSearching(true);
    setSearchResult(false);
    setNotFound(false);
    search()
      .then((res) => {
        setValue('personId', res.personId, { shouldDirty: true });
        setValue('firstName', res.firstName, { shouldDirty: true });
        setValue('lastName', res.lastName, { shouldDirty: true });
        setValue('street', res.street.charAt(0).toUpperCase() + res.street.slice(1).toLowerCase(), {
          shouldDirty: true,
        });
        setValue('city', res.city.charAt(0).toUpperCase() + res.city.slice(1).toLowerCase(), { shouldDirty: true });
        setValue('careof', res.careof, { shouldDirty: true });
        setValue('zip', res.zip, { shouldDirty: true });
        clearErrors(['firstName', 'lastName']);
        setSearching(false);
        setSearchResult(true);
      })
      .catch(() => {
        setFetchedSsn(false);
        setSearching(false);
        setNotFound(true);
        setSearchResult(false);
      });
  };

  const addStakeholderToErrand = () => {
    const emailValue = getValues('emails.0.value');
    const phoneValue = getValues('phoneNumbers.0.value');
    const role = getValues(`roles`).toString() === 'Sökande' ? Role.APPLICANT : (undefined as Role | undefined); // TODO: Fix the role mapping when all the roles are added.

    let emailError = '';
    let phoneError = '';
    //let roleError = ''; // TODO: Fix the role mapping when all the roles are added.
    let municipalityError = '';

    if (!emailValue) {
      emailError = 'E-postadress är obligatorisk';
    } else {
      try {
        emailSchema.validateSync(emailValue);
      } catch (err) {
        emailError = (err as yup.ValidationError).message;
      }
    }

    if (!phoneValue) {
      phoneError = 'Telefonnummer är obligatoriskt';
    } else {
      try {
        phoneSchema.validateSync(phoneValue);
      } catch (err) {
        phoneError = (err as yup.ValidationError).message;
      }
    }

    // if (!role) {
    //   roleError = 'Välj roll'; // TODO: Fix the role mapping when all the roles are added.
    // }

    if (!personId) {
      municipalityError = 'Personen är inte folkbokförd i kommunen';
    }

    const hasErrors = emailError || phoneError || municipalityError; //TODO: Add roleError when roles are implemented.

    if (hasErrors) {
      setError(true);
      setValidationMessages({ email: emailError, phone: phoneError, role: '', municipality: municipalityError });
      return;
    }

    setError(false);
    const updatedOwner: CasedataOwnerOrContact = {
      personId,
      firstName,
      lastName,
      street,
      careof,
      zip,
      city,
      emails: [{ value: emailValue }],
      personalNumber,
      phoneNumbers: [{ value: phoneValue }],
      newPhoneNumber: phoneValue,
      roles: role ? [role] : [], // TODO: Fix the role mapping when all the roles are added.
      id: '',
      stakeholderType: 'PERSON',
      newRole: role || Role.APPLICANT, // TODO: Fix the role mapping when all the roles are added.
      newEmail: emailValue,
    };

    if (errand?.id) addStakeholder(municipalityId, errand.id, updatedOwner);
    setOwners((prevOwners) => [...prevOwners, updatedOwner]);
    reset();
    setSearchResult(false);
    setFetchedSsn(false);
  };

  return (
    <div>
      <FormLabel>Sök på personnummer</FormLabel>
      <Input.Group size="md" className="rounded-12 flex w-full max-w-[52.5rem] mt-5 items-stretch overflow-hidden">
        <Input.LeftAddin icon>
          <LucideIcon name="search" />
        </Input.LeftAddin>
        <Input className="w-full" {...register('personalNumber')} readOnly={fetchedSsn} />
        <Input.RightAddin icon className="flex gap-2">
          <Button
            iconButton
            size="sm"
            variant="primary"
            inverted
            className="min-w-[2.5rem] h-full"
            onClick={() => {
              reset();
              setValue('personalNumber', '');
              setSearchResult(false);
            }}
          >
            <LucideIcon name="x" />
          </Button>
          <Button
            size="sm"
            variant="primary"
            className="h-full"
            onClick={doSearch}
            loading={searching}
            loadingText="Söker"
          >
            Sök
          </Button>
        </Input.RightAddin>
      </Input.Group>

      {searchResult && !notFound && (
        <div className="border-1 rounded-12 bg-background-content w-max-[52.5rem] my-15">
          <div className="px-[1rem]">
            <p className="text-[1.6rem] font-semibold py-10">{firstName + ' ' + lastName}</p>
            <div className="flex text-md mb-10">
              <div className="flex flex-col mr-10">
                <div>{personalNumber}</div>
                <div>{street + ', ' + city}</div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row py-10 gap-10">
              <div className="flex-col  lg:mx-5 w-full">
                <FormLabel>E-postadress*</FormLabel>
                <Input
                  className="w-full"
                  placeholder="Ange e-postadress"
                  invalid={!!validationMessages.email}
                  {...register('emails.0.value', { required: true })}
                />
                {validationMessages.email && <div className="text-error text-md mt-1">{validationMessages.email}</div>}
              </div>
              <div className="flex-col lg:mx-5 w-full">
                <FormLabel>Telefonnummer*</FormLabel>
                <Input
                  className="w-full"
                  placeholder="Ange telefonnummer"
                  invalid={!!validationMessages.phone}
                  {...register('phoneNumbers.0.value', { required: true })}
                />
                {validationMessages.phone && <div className="text-error text-md mt-1">{validationMessages.phone}</div>}
              </div>
            </div>
            <div className="flex flex-col lg:py-10">
              <FormLabel>Personens roll*</FormLabel>
              <Select className="w-full" invalid={!!validationMessages.role} {...register('roles', { required: true })}>
                <Select.Option value="">Välj roll</Select.Option>
                {roles.map((role, index) => (
                  <Select.Option key={index} value={role}>
                    {role}
                  </Select.Option>
                ))}
              </Select>
              {validationMessages.role && <div className="text-error text-md mt-1">{validationMessages.role}</div>}
            </div>

            {validationMessages.municipality && (
              <div className="mb-10 p-8 bg-warning-light border-l-4 border-warning text-warning-dark">
                {validationMessages.municipality}
              </div>
            )}

            <div className="py-10">
              <Button
                leftIcon={<LucideIcon name="plus" size={16} />}
                variant="primary"
                onClick={addStakeholderToErrand}
                className="w-full lg:w-auto"
              >
                Lägg till person
              </Button>
            </div>
          </div>
        </div>
      )}

      {owners?.map((owner, index) => (
        <DisplayCard
          isEditable={true}
          key={index}
          {...owner}
          onRemove={() => {
            if (errand?.id) removeStakeholder(municipalityId, errand.id, owner.id);
            setOwners((prevOwners) => prevOwners.filter((_, i) => i !== index));
          }}
          onUpdate={(updatedData) => updateOwner(index, updatedData)}
        />
      ))}
    </div>
  );
};
