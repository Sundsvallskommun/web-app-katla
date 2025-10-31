import { AppContext } from '@contexts/app-context-interface';
import { Role, RoleDisplayNames } from '@interfaces/role';
import { CasedataOwnerOrContact } from '@interfaces/stakeholder';
import { searchPerson } from '@services/adress-service';
import { addStakeholder, editStakeholder, removeStakeholder } from '@services/casedata-stakeholder-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, FormControl, FormLabel, Input, Select } from '@sk-web-gui/react';
import { isErrandReadOnly } from '@utils/errand-utils';
import { emailSchema, phoneSchema, ssnSchema } from '@utils/validation-schema';
import React, { useContext, useEffect, useState } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import * as yup from 'yup';
import { getApplicantError } from './errand-buttons/errand-buttons-utils';
import { DisplayCard } from './display-card.component';
import { StakeholderFormModal } from './stakeholder-form.component';

export const StakeholderList: React.FC<{
  owners: CasedataOwnerOrContact[];
  setOwners: React.Dispatch<React.SetStateAction<CasedataOwnerOrContact[]>>;
  roles: Role[];
}> = ({ owners, setOwners, roles }) => {
  const { formState } = useFormContext();
  const applicantValidationError = getApplicantError(formState.errors as Record<string, unknown>);
  const [fetchedSsn, setFetchedSsn] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [outsideMunicipalityWarning, setOutsideMunicipalityWarning] = useState<string | null>(null);
  const [manualEntryOpen, setManualEntryOpen] = useState(false);

  const [validationMessages, setValidationMessages] = useState({
    email: '',
    phone: '',
    role: '',
    municipality: '',
    address: '',
  });

  const { municipalityId, errand } = useContext(AppContext);

  const {
    register,
    watch,
    setValue,
    getValues,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CasedataOwnerOrContact>({ mode: 'onChange' });

  const personId = watch('personId');
  const personalNumber = watch('personalNumber');
  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const street = watch('street');
  const careof = watch('careof');
  const zip = watch('zip');
  const city = watch('city');
  const isApplicantList = roles.includes(Role.APPLICANT);
  const displayApplicantError = isApplicantList ? applicantValidationError : null;
  const ownerAlreadyExists = owners?.length > 0;
  const municipalityMismatch = isApplicantList && !!outsideMunicipalityWarning;
  const manualEntryAllowed = !isApplicantList;

  const clearSearch = () => {
    reset({
      personId: '',
      personalNumber: '',
      firstName: '',
      lastName: '',
      street: '',
      careof: '',
      zip: '',
      city: '',
      roles: roles.length === 1 ? [roles[0]] : [],
    });
    setValue('personalNumber', '');
    setFetchedSsn(false);
    setSearchResult(false);
    setSearching(false);
    setNotFound(false);
    setOutsideMunicipalityWarning(null);
    clearErrors();
    setValidationMessages({
      email: '',
      phone: '',
      role: '',
      municipality: '',
      address: '',
    });
  };

  useEffect(() => {
    const currentRoles = getValues('roles');
    if (roles.length === 1 && (!currentRoles || currentRoles.length === 0)) {
      setValue('roles', [roles[0]], { shouldDirty: true });
    }
  }, [roles, setValue, getValues]);

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
    ssnSchema
      .validate(personalNumber)
      .then(() => {
        clearErrors('personalNumber');
        setFetchedSsn(true);
        setSearching(true);
        setSearchResult(false);
        setNotFound(false);

        searchPerson(personalNumber ?? '')
          .then((res) => {
            const norm = (s?: string) => ((s ?? '').trim() ? s![0].toUpperCase() + s!.slice(1).toLowerCase() : '');

            const defaultValues = {
              personId: res.personId,
              firstName: res.firstName,
              lastName: res.lastName,
              street: norm(res.street),
              city: norm(res.city),
              careof: res.careof ?? '',
              zip: res.zip ?? '',
              personalNumber: personalNumber,
              roles: roles.length === 1 ? [roles[0]] : [],
            };

            reset(defaultValues, { keepDefaultValues: true });
            clearErrors(['firstName', 'lastName']);
            setSearching(false);
            setSearchResult(true);

            if (res.municipality !== municipalityId && isApplicantList) {
              setOutsideMunicipalityWarning('Den sökande som du försöker lägga till är inte folkbokförd i kommunen.');
            } else {
              setOutsideMunicipalityWarning(null);
            }
          })
          .catch(() => {
            setFetchedSsn(false);
            setSearching(false);
            setSearchResult(false);
          });
      })
      .catch((err: yup.ValidationError) => {
        setError('personalNumber', {
          type: 'manual',
          message: err.message,
        });
      });
  };

  const addStakeholderToErrand = () => {
    const emailValue = getValues('emails.0.value');
    const phoneValue = getValues('phoneNumbers.0.value');
    const role = getValues('roles');
    const selectedRoleLocal = role?.[0] as Role | undefined;
    const isOwner = selectedRoleLocal === Role.APPLICANT;

    let emailError = '';
    let phoneError = '';
    let roleError = '';
    let municipalityError = '';
    let addressError = '';

    if (isOwner) {
      const hasStreet = !!(street && street.trim());
      const hasZip = !!(zip && zip.trim());
      const hasCity = !!(city && city.trim());
      if (!hasStreet || !hasZip || !hasCity) {
        addressError = 'Adress, postnummer och ort krävs för ärendeägare.';
      }
    }

    if (selectedRoleLocal && ownerAlreadyExists) {
      setValidationMessages((v) => ({
        ...v,
        role: `${RoleDisplayNames[selectedRoleLocal]} kan bara finnas en per ärende`,
      }));
      return;
    }

    if (emailValue) {
      try {
        emailSchema.validateSync(emailValue);
      } catch (err) {
        emailError = (err as yup.ValidationError).message;
      }
    }

    if (phoneValue) {
      try {
        phoneSchema.validateSync(phoneValue);
      } catch (err) {
        phoneError = (err as yup.ValidationError).message;
      }
    }

    if (!role || role.length === 0 || (typeof role[0] === 'string' && role[0].trim() === '')) {
      roleError = 'Välj roll';
    }

    if (municipalityMismatch || (isOwner && !personId)) {
      municipalityError = 'Personen är inte folkbokförd i kommunen';
    }

    const hasErrors = emailError || phoneError || roleError || municipalityError || addressError;

    if (hasErrors) {
      setValidationMessages({
        email: emailError,
        phone: phoneError,
        role: roleError,
        municipality: municipalityError,
        address: addressError,
      });
      return;
    }

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
      roles: role,
      id: '',
      stakeholderType: 'PERSON',
      newRole: role[0],
      newEmail: emailValue,
    };

    if (errand?.id) addStakeholder(municipalityId, errand.id, updatedOwner);
    setOwners((prevOwners) => [...prevOwners, updatedOwner]);
    reset();
    setSearchResult(false);
    setFetchedSsn(false);
  };

  return (
    <FormControl className="w-full">
      {!isErrandReadOnly(errand) ?
        <FormLabel>
          Sök på personnummer
          {isApplicantList && <span className="text-error ml-4">*</span>}
        </FormLabel>
      : null}
      {!isErrandReadOnly(errand) ?
        <div className="w-full max-w-[52.5rem]">
          <Input.Group size="md" className="rounded-12 flex items-stretch overflow-hidden">
            <Input.LeftAddin icon>
              <LucideIcon name="search" />
            </Input.LeftAddin>

            <Input
              data-cy="personal-number-input"
              className="w-full"
              {...register('personalNumber')}
              readOnly={fetchedSsn}
              invalid={!!errors.personalNumber || !!displayApplicantError}
            />
            <Input.RightAddin icon className="flex gap-2">
              <Button
                data-cy="clear-person-button"
                iconButton
                size="sm"
                variant="primary"
                inverted
                className="min-w-[2.5rem] h-full"
                onClick={clearSearch}
              >
                <LucideIcon name="x" />
              </Button>

              <Button
                data-cy="search-person-button"
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

          {errors.personalNumber && <div className="text-error text-md mt-1">{errors.personalNumber.message}</div>}
          {displayApplicantError && <div className="text-error text-md mt-1">{displayApplicantError}</div>}
        </div>
      : null}

      {searchResult && !notFound && (
        <div className="border-1 rounded-12 bg-background-content w-max-[52.5rem] my-15">
          <div className="px-16 py-8">
            <p className="text-[1.6rem] font-semibold py-10">
              {firstName?.trim() || lastName?.trim() ?
                `${firstName} ${lastName}`
              : <span className="italic text-text-secondary">Namn saknas</span>}
            </p>

            <div className="flex text-md mb-10">
              <div className="flex flex-col mr-10">
                <div className={!personalNumber ? 'italic text-text-secondary' : ''}>
                  {personalNumber || 'Personnummer saknas'}
                </div>
                <div className={!(street?.trim() && city?.trim()) ? 'italic text-text-secondary' : ''}>
                  {street?.trim() && city?.trim() ? `${street}, ${city}` : 'Adress saknas'}
                </div>
              </div>
            </div>

            {!municipalityMismatch && (
              <>
                <div className="flex flex-col lg:flex-row py-10 gap-10">
                  <div className="flex-col w-full">
                    <FormLabel>E-postadress</FormLabel>
                    <Input
                      className="w-full"
                      data-cy="stakeholder-email-input"
                      placeholder="Ange e-postadress"
                      invalid={!!validationMessages.email}
                      {...register('emails.0.value')}
                    />
                    {validationMessages.email && (
                      <div className="text-error text-md mt-1">{validationMessages.email}</div>
                    )}
                  </div>
                  <div className="flex-col w-full">
                    <FormLabel>Telefonnummer</FormLabel>
                    <Input
                      data-cy="stakeholder-mobilephone-input"
                      className="w-full"
                      placeholder="Ange telefonnummer"
                      invalid={!!validationMessages.phone}
                      {...register('phoneNumbers.0.value')}
                    />
                    {validationMessages.phone && (
                      <div className="text-error text-md mt-1">{validationMessages.phone}</div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-8">
                  <div className="flex flex-col">
                    <FormLabel>Personens roll*</FormLabel>
                    <Select
                      data-cy="stakeholder-role-select"
                      className="w-full"
                      invalid={!!validationMessages.role}
                      disabled={roles.length === 1}
                      value={watch('roles')?.[0] ?? ''}
                      onChange={(e) => {
                        const selected = e.target.value;
                        if (selected) {
                          setValue('roles', [selected as Role], { shouldDirty: true });
                        } else {
                          setValue('roles', [], { shouldDirty: true });
                        }
                      }}
                    >
                      {roles.length > 1 && <Select.Option value="">Välj roll</Select.Option>}
                      {roles
                        .sort((a, b) => RoleDisplayNames[a].localeCompare(RoleDisplayNames[b]))
                        .map((role) => (
                          <Select.Option
                            key={role}
                            value={role}
                            disabled={ownerAlreadyExists && watch('roles')?.[0] !== role}
                          >
                            {RoleDisplayNames[role]}
                          </Select.Option>
                        ))}
                    </Select>
                    {validationMessages.role && (
                      <div className="text-error text-md mt-1">{validationMessages.role}</div>
                    )}
                  </div>

                  {validationMessages.address && (
                    <div className="text-error text-md mt-1">{validationMessages.address}</div>
                  )}
                </div>

                {validationMessages.municipality && (
                  <div className="mb-10 p-8 bg-warning-light border-l-4 border-warning text-warning-dark">
                    {validationMessages.municipality}
                  </div>
                )}

                <div className="py-10">
                  <Button
                    data-cy="add-stakeholder-button"
                    leftIcon={<LucideIcon name="plus" size={16} />}
                    variant="primary"
                    onClick={addStakeholderToErrand}
                    className="w-full lg:w-auto"
                    disabled={ownerAlreadyExists || municipalityMismatch}
                  >
                    Lägg till person
                  </Button>
                </div>
              </>
            )}

            {outsideMunicipalityWarning && (
              <div className="flex flex-col gap-10 rounded-2xl bg-warning-background-200 p-12 mt-12 mb-16 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-12">
                  <LucideIcon color="warning" name="info" className="w-24 h-24 mt-0.5 shrink-0" />
                  <span className="text-warning text-md leading-[1.8rem] font-normal font-sans break-words flex-1 min-w-0">
                    {outsideMunicipalityWarning}
                  </span>
                </div>
                <Button variant="primary" size="sm" className="w-full sm:w-auto" onClick={clearSearch}>
                  Ny sökning
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {owners?.map((owner, index) => {
        const email = owner.newEmail || owner.emails?.[0]?.value?.trim() || '';
        const phone = owner.newPhoneNumber || owner.phoneNumbers?.[0]?.value?.trim() || '';
        const streetVal = owner.street?.trim() || '';
        const cityVal = owner.city?.trim() || '';

        return (
          <DisplayCard
            key={index}
            isEditable
            roles={owner.roles}
            availableRoles={roles}
            userName={owner.adAccount}
            firstName={owner.firstName}
            lastName={owner.lastName}
            personalNumber={owner.personalNumber}
            newEmail={email}
            newPhoneNumber={phone}
            street={streetVal}
            city={cityVal}
            careof={owner.careof}
            zip={owner.zip}
            onRemove={() => {
              if (errand?.id) removeStakeholder(municipalityId, errand.id, owner.id);
              setOwners((prev) => prev.filter((_, i) => i !== index));
            }}
            onUpdate={(updatedData) => updateOwner(index, updatedData)}
          />
        );
      })}

      {manualEntryAllowed && !isErrandReadOnly(errand) && (
        <Button
          data-cy="add-manual-person-button"
          variant="primary"
          size="sm"
          color="vattjom"
          inverted={true}
          className="mt-6 w-fit"
          leftIcon={<LucideIcon name="pen" />}
          disabled={ownerAlreadyExists}
          onClick={() => {
            setManualEntryOpen((prev) => !prev);
            reset();
          }}
        >
          Lägg till manuellt
        </Button>
      )}

      <StakeholderFormModal
        show={manualEntryOpen}
        onClose={() => setManualEntryOpen(false)}
        roles={roles}
        onSubmit={(values) => {
          const transformedOwner: CasedataOwnerOrContact = {
            id: '',
            stakeholderType: 'PERSON',
            roles: values.roles ?? [],
            newRole: values.roles?.[0] ?? Role.APPLICANT,
            personalNumber: values.ssn ?? '',
            personId: '',
            firstName: values.firstName,
            lastName: values.lastName,
            street: values.street,
            careof: values.careof ?? '',
            zip: values.zip ?? '',
            city: values.city,
            newPhoneNumber: values.newPhoneNumber ?? '',
            phoneNumbers: values.newPhoneNumber ? [{ value: values.newPhoneNumber }] : [],
            newEmail: values.newEmail ?? '',
            emails: values.newEmail ? [{ value: values.newEmail }] : [],
          };

          setOwners((prev) => [...prev, transformedOwner]);
          setManualEntryOpen(false);
        }}
      />
    </FormControl>
  );
};
