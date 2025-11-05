import { AppContext } from '@contexts/app-context-interface';
import { yupResolver } from '@hookform/resolvers/yup';
import { IErrand } from '@interfaces/errand';
import { Role, RoleDisplayNames } from '@interfaces/role';
import { CasedataOwnerOrContact, emptyCasedataOwnerOrContact, StakeholderType } from '@interfaces/stakeholder';
import { searchPerson } from '@services/adress-service';
import { addStakeholder } from '@services/casedata-stakeholder-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, FormControl, FormErrorMessage, FormLabel, Input, Select } from '@sk-web-gui/react';
import { isErrandReadOnly } from '@utils/errand-utils';
import { ssnSchema, stakeholderSchema } from '@utils/validation-schema';
import React, { useContext, useState } from 'react';
import { FormProvider, Resolver, useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { DisplayCard } from './display-card.component';
import { StakeholderFormModal } from './stakeholder-form.component';

export const StakeholderList: React.FC<{
  roles: Role[];
}> = ({ roles }) => {
  const [fetchedSsn, setFetchedSsn] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [outsideMunicipalityWarning, setOutsideMunicipalityWarning] = useState<boolean>(false);
  const [manualEntryOpen, setManualEntryOpen] = useState(false);

  const { municipalityId, errand } = useContext(AppContext);

  const context = useFormContext<IErrand>();

  const { fields, append, update, remove } = useFieldArray({
    control: context.control,
    name: 'stakeholders',
  });

  const method = useForm<CasedataOwnerOrContact>({
    defaultValues: { ...emptyCasedataOwnerOrContact },
    mode: 'onSubmit',
    resolver: yupResolver(stakeholderSchema) as unknown as Resolver<CasedataOwnerOrContact>,
  });

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors, isValid },
  } = method;

  const { personalNumber, firstName, lastName, street, city } = watch();

  const isApplicantList = roles.includes(Role.APPLICANT);
  const municipalityMismatch = isApplicantList && !!outsideMunicipalityWarning;
  const manualEntryAllowed = !isApplicantList;

  const doSearch = () => {
    ssnSchema
      .validate(personalNumber)
      .then(() => {
        setFetchedSsn(true);
        setSearching(true);
        setSearchResult(false);
        setNotFound(false);

        searchPerson(personalNumber ?? '')
          .then((res) => {
            if (res.municipality !== process.env.NEXT_PUBLIC_MUNICIPALITY_ID && isApplicantList) {
              setOutsideMunicipalityWarning(true);
              return;
            }

            const normalizedData = {
              personalNumber,
              ...res,
              roles: roles.length === 1 ? [roles[0]] : [],
              stakeholderType: 'PERSON' as StakeholderType,
            };
            reset(normalizedData);
            setSearching(false);
            setSearchResult(true);
          })
          .catch(() => {
            setFetchedSsn(false);
            setSearching(false);
            setSearchResult(false);
          });
      })
      .catch((e) => {
        console.error('Error when searching stakeholder', e);
      });
  };

  const addStakeholderToErrand = () => {
    const values = getValues();
    append({
      ...values,
      stakeholderType: 'PERSON',
      newEmail: values?.emails?.[0]?.value,
      newPhoneNumber: values?.phoneNumbers?.[0]?.value,
    });

    if (errand.id) addStakeholder(municipalityId, errand.id, getValues());

    setSearchResult(false);
  };

  return (
    <FormProvider {...method}>
      <FormControl className="w-full">
        {!isErrandReadOnly(errand) ?
          <>
            <FormLabel>Sök på personnummer</FormLabel>
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
                  invalid={!!errors.personalNumber}
                />
                <Input.RightAddin icon className="flex gap-2">
                  <Button
                    data-cy="clear-person-button"
                    iconButton
                    size="sm"
                    variant="primary"
                    inverted
                    className="min-w-[2.5rem] h-full"
                    onClick={() => {reset();
                      setFetchedSsn(false)
                    }}
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
            </div>
          </>
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
                        {...register('emails.0.value')}
                      />
                      {errors.emails?.[0]?.value && (
                        <FormErrorMessage className='text-error'>{errors.emails[0].value.message}</FormErrorMessage>
                      )}
                    </div>
                    <div className="flex-col w-full">
                      <FormLabel>Telefonnummer</FormLabel>
                      <Input
                        data-cy="stakeholder-mobilephone-input"
                        className="w-full"
                        placeholder="Ange telefonnummer"
                        {...register('phoneNumbers.0.value')}
                      />
                      {errors.phoneNumbers?.[0]?.value && (
                        <FormErrorMessage className='text-error'>{errors.phoneNumbers[0].value.message}</FormErrorMessage>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col">
                      <FormLabel>Personens roll*</FormLabel>
                      <Select
                        data-cy="stakeholder-role-select"
                        className="w-full"
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
                            <Select.Option key={role} value={role}>
                              {RoleDisplayNames[role]}
                            </Select.Option>
                          ))}
                      </Select>

                      {errors.roles && (
                        <FormErrorMessage className='text-error'>{errors.roles.message}</FormErrorMessage>
                      )}
                    </div>
                  </div>
                  <div className="py-10">
                    <Button
                      data-cy="add-stakeholder-button"
                      leftIcon={<LucideIcon name="plus" size={16} />}
                      variant="primary"
                      onClick={handleSubmit(addStakeholderToErrand)}
                      className="w-full lg:w-auto"
                      disabled={municipalityMismatch
                        || isValid 
                      }
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
                      Den sökande som du försöker lägga till är inte folkbokförd i kommunen.
                    </span>
                  </div>
                  <Button variant="primary" size="sm" className="w-full sm:w-auto" onClick={() => reset()}>
                    Ny sökning
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {fields.map((person, index) => {
          if (!person.roles?.some((r) => roles.includes(r))) return null;

          return (
            <DisplayCard
              key={person.id || index}
              person={person}
              isEditable
              availableRoles={roles}
              onRemove={() => {remove(index); reset(emptyCasedataOwnerOrContact)}}
              onUpdate={(values) => update(index, { ...person, ...values })}
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
            onClick={() => {
              setManualEntryOpen(true);
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
            reset(values);
            addStakeholderToErrand();
            setManualEntryOpen(false);
          }}
        />
      </FormControl>
    </FormProvider>
  );
};
 