import { searchPerson } from '@services/adress-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, FormLabel, Input, Select } from '@sk-web-gui/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DisplayCard } from './display-card.component';
import { CasedataOwnerOrContact } from '@interfaces/stakeholder';
import { Role } from '@interfaces/role';

export interface CardProps {
  role: string;
  firstName: string;
  lastName: string;
  ssn: string;
  emails: string;
  street: string;
  city: string;
  zip: string;
  phoneNumber: string;
  isEditable: boolean;
  careof: string;
  personalNumber: string;
}

// React.FC<{ setOwners: React.Dispatch<React.SetStateAction<Stakeholder[]>> }> = ({ setOwners }) => {
export const StakeholderList: React.FC<{
  owners: CasedataOwnerOrContact[];
  setOwners: React.Dispatch<React.SetStateAction<CasedataOwnerOrContact[]>>;
  roles: string[];
}> = ({ owners, setOwners, roles }) => {
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(false);
  const [searchResult, setSearchResult] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const { register, watch, setValue, getValues, clearErrors, reset } = useForm<CasedataOwnerOrContact>({
    mode: 'onChange', // NOTE: Needed if we want to disable submit until valid
  });

  const personId = watch(`personId`);
  const firstName = watch(`firstName`);
  const lastName = watch(`lastName`);
  const street = watch(`street`);
  const careof = watch(`careof`);
  const zip = watch(`zip`);
  const city = watch(`city`);
  const personalNumber = watch(`personalNumber`);

  const updateOwner = (index: number, updatedData: { newEmail?: string; newPhoneNumber?: string }) => {
    setOwners((prevOwners) =>
      prevOwners.map((owner, i) => {
        if (i === index) {
          const updatedOwner = { ...owner, ...updatedData };

          if (updatedData.newEmail) {
            updatedOwner.emails = [{ value: updatedData.newEmail }];
          }

          if (updatedData.newPhoneNumber) {
            updatedOwner.phoneNumbers = [{ value: updatedData.newPhoneNumber }];
          }

          return updatedOwner;
        }

        return owner;
      })
    );
  };

  const doSearch = () => {
    const search = () => searchPerson(personalNumber as string);
    setSearching(true);
    setSearchResult(false);
    setNotFound(false);
    search()
      .then((res) => {
        setValue(`personId`, res.personId, { shouldDirty: true });
        setValue(`firstName`, res.firstName, { shouldDirty: true });
        setValue(`lastName`, res.lastName, { shouldDirty: true });
        setValue(`street`, res.street.charAt(0).toUpperCase() + res.street.slice(1).toLowerCase(), {
          shouldDirty: true,
        });
        setValue(`city`, res.city.charAt(0).toUpperCase() + res.city.slice(1).toLowerCase(), { shouldDirty: true });
        setValue(`careof`, res.careof, { shouldDirty: true });
        setValue(`zip`, res.zip, { shouldDirty: true });
        clearErrors([`firstName`, `lastName`]);
        setSearching(false);
        setSearchResult(true);
      })
      .catch(() => {
        setSearching(false);
        setNotFound(true);
        setSearchResult(false);
      });
  };

  const addStakeholder: () => void = () => {
    const email = [{ value: getValues(`emails.0.value`) }];
    const phone = [{ value: getValues(`phoneNumbers.0.value`) }];
    const role = getValues(`roles`).toString() === 'Sökande' ? Role.APPLICANT : ''; //TODO: Better mapping of roles

    if (email && phone && role) {
      setError(false);
      console.log('role', role);
      const updatedOwner: CasedataOwnerOrContact = {
        personId,
        firstName,
        lastName,
        street,
        careof,
        zip,
        city,
        emails: email,
        personalNumber,
        phoneNumbers: phone,
        newPhoneNumber: phone[0].value,
        roles: [role],
        id: '',
        stakeholderType: 'PERSON',
        newRole: role,
        newEmail: email[0].value,
      };
      console.log('updatedowner', updatedOwner);
      setOwners((prevOwners) => [...prevOwners, updatedOwner]);
      reset();
      setSearchResult(false);
    } else {
      setError(true);
    }
  };

  return (
    <div>
      <FormLabel>Sök på personnummer</FormLabel>
      <Input.Group size="md" className="rounded-12 w-[52.5rem] mt-5" disabled={false}>
        <Input.LeftAddin icon>
          <LucideIcon name="search" />
        </Input.LeftAddin>
        <Input
          disabled={false}
          aria-disabled={false}
          readOnly={false}
          className="read-only:cursor-not-allowed"
          data-cy={`contact-personalNumber-${1}`}
          {...register(`personalNumber`)}
        />
        <Input.RightAddin icon>
          <Button
            iconButton
            variant="primary"
            disabled={false}
            inverted
            onClick={() => {
              reset();
              setValue('personalNumber', '');
              setSearchResult(false);
            }}
          >
            <LucideIcon name="x" />
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={false}
            data-cy={`search-button-${1}`}
            onClick={doSearch}
            loading={searching}
            loadingText="Söker"
          >
            Sök
          </Button>
        </Input.RightAddin>
      </Input.Group>
      {searchResult && !notFound ?
        <div className="border-1 rounded-12 bg-background-content w-[52.5rem] my-15">
          <div className="px-[1rem]">
            <p className="text-[1.6rem] font-semibold py-10">{firstName + ' ' + lastName}</p>
            <div className="flex text-md mb-10">
              <div className="flex flex-col mr-10">
                <div>{personalNumber}</div>
                <div>{street + ', ' + city}</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex py-10">
                <div className="flex-col  mx-5">
                  <FormLabel>E-postadress*</FormLabel>
                  <Input
                    className="w-full"
                    placeholder="Ange e-postadress"
                    invalid={error}
                    {...register(`emails.0.value`, { required: true })}
                  />
                </div>
                <div className="flex-col mx-5">
                  <FormLabel>Telefonnummer*</FormLabel>
                  <Input
                    className="w-full"
                    placeholder="Ange telefonnummer"
                    invalid={error}
                    {...register(`phoneNumbers.0.value`, { required: true })}
                  />
                </div>
              </div>
              <div className="flex flex-col py-10">
                <FormLabel>Personens roll*</FormLabel>
                <Select className="w-full" {...register('roles', { required: true })}>
                  {roles.map((role, index) => (
                    <Select.Option key={index} value={role}>
                      {role}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div className="py-10">
                <Button leftIcon={<LucideIcon name="plus" size={16} />} variant="primary" onClick={addStakeholder}>
                  Lägg till person
                </Button>
              </div>
            </div>
          </div>
        </div>
      : null}

      {owners?.map((owner, index) => (
        <DisplayCard
          isEditable={true}
          key={index}
          {...owner}
          onRemove={() => {
            setOwners((prevOwners) => prevOwners.filter((_, i) => i !== index));
          }}
          onUpdate={(updatedData) => updateOwner(index, updatedData)}
        />
      ))}
    </div>
  );
};
