import { Role, RoleDisplayNames } from '@interfaces/role';
import { CasedataOwnerOrContact, emptyCasedataOwnerOrContact } from '@interfaces/stakeholder';
import { Button, FormControl, FormErrorMessage, FormLabel, Input, Modal, Select } from '@sk-web-gui/react';
import { stakeholderSchema } from '@utils/validation-schema';
import { useEffect } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export const StakeholderFormModal: React.FC<{
  onSubmit: (values: CasedataOwnerOrContact) => void;
  onClose: () => void;
  show: boolean;
  roles: Role[];
  initialValues?: Partial<CasedataOwnerOrContact>;
  edit?: boolean;
}> = ({ onSubmit, onClose, show, roles, initialValues, edit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CasedataOwnerOrContact>({
    mode: 'onSubmit',
    resolver: yupResolver(stakeholderSchema) as unknown as Resolver<CasedataOwnerOrContact>,
    defaultValues: initialValues ?? {
      firstName: '',
      lastName: '',
      emails: [],
      phoneNumbers: [],
      street: '',
      careof: '',
      zip: '',
      city: '',
      roles: [roles[0]],
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const selectedRole = watch('roles')?.[0];
  const isOwner = selectedRole === Role.APPLICANT;

  return (
    <Modal
      data-cy="manual-person-modal"
      className="w-full max-w-[48rem]"
      show={show}
      onClose={onClose}
      label={
        edit && selectedRole ?
          `Redigera ${RoleDisplayNames[selectedRole].toLocaleLowerCase()}`
        : 'Lägg till person manuellt'
      }
    >
      <Modal.Content>
        <FormControl className="w-full">
          <FormLabel>Personnummer</FormLabel>
          <Input {...register('personalNumber')} className="w-full" invalid={!!errors} readOnly={true} />
        </FormControl>
        <div className="flex gap-8">
          <div className="flex flex-col">
            <FormControl required>
              <FormLabel>Förnamn</FormLabel>
              <Input {...register('firstName')} className="w-full" invalid={!!errors.firstName} />
              {errors.firstName && (
                <FormErrorMessage className="text-error">{errors.firstName.message}</FormErrorMessage>
              )}
            </FormControl>
          </div>
          <div className="flex flex-col">
            <FormControl required>
              <FormLabel>Efternamn</FormLabel>
              <Input {...register('lastName')} className="w-full" invalid={!!errors.lastName} />
              {errors.lastName && <FormErrorMessage className="text-error">{errors.lastName.message}</FormErrorMessage>}
            </FormControl>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="flex flex-col">
            <FormControl>
              <FormLabel>E-postadress</FormLabel>
              <Input {...register('emails.0.value')} className="w-full" invalid={!!errors.emails?.[0]?.value} />
              {errors.emails?.[0]?.value && <FormErrorMessage className="text-error">{errors.emails[0].value.message}</FormErrorMessage>}
            </FormControl>
          </div>
          <div className="flex flex-col">
            <FormControl>
              <FormLabel>Telefonnummer</FormLabel>
              <Input {...register('phoneNumbers.0.value')} className="w-full" invalid={!!errors.phoneNumbers?.[0]?.value} />
              {errors.phoneNumbers?.[0]?.value && (
                <FormErrorMessage className="text-error">{errors.phoneNumbers[0].value.message}</FormErrorMessage>
              )}
            </FormControl>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="flex flex-col">
            <FormControl readOnly={isOwner} required={isOwner}>
              <FormLabel>Adress</FormLabel>
              <Input {...register('street')} className="w-full" invalid={!!errors.street} />
              {errors.street && <FormErrorMessage className="text-error">{errors.street?.message}</FormErrorMessage>}
            </FormControl>
          </div>
          <div className="flex flex-col">
            <FormControl>
              <FormLabel>C/o adress</FormLabel>
              <Input {...register('careof')} name="careof" className="w-full" />
            </FormControl>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="flex flex-col">
            <FormControl readOnly={isOwner} required={isOwner} invalid={!!errors.zip}>
              <FormLabel>Postnummer</FormLabel>
              <Input {...register('zip')} className="w-full" />
              {errors.zip && <FormErrorMessage className="text-error">{errors.zip?.message}</FormErrorMessage>}
            </FormControl>
          </div>
          <div className="flex flex-col">
            <FormControl readOnly={isOwner} required={isOwner}>
              <FormLabel>Ort</FormLabel>
              <Input {...register('city')} className="w-full" invalid={!!errors.city} />
              {errors.city && <FormErrorMessage className="text-error">{errors.city?.message}</FormErrorMessage>}
            </FormControl>
          </div>
        </div>

        <FormControl className="w-full" required>
          <FormLabel>Roll</FormLabel>
          <Select
            data-cy="modal-stakeholder-role-select"
            className="w-full"
            invalid={!!errors.roles}
            value={watch('roles')?.[0] ?? ''}
            onChange={(e) => {
              const value = e.target.value as Role;
              setValue('roles', value ? [value] : [], {
                shouldDirty: true,
                shouldValidate: true,
              });
              setValue('newRole', value);
            }}
          >
            {roles.length > 1 && <Select.Option value="">Välj roll</Select.Option>}
            {roles.map((role) => (
              <Select.Option key={role} value={role}>
                {RoleDisplayNames[role]}
              </Select.Option>
            ))}
          </Select>
          {errors.roles && <FormErrorMessage className="text-error">{errors.roles.message}</FormErrorMessage>}
        </FormControl>
      </Modal.Content>

      <Modal.Footer>
        <Button data-cy="modal-cancel-person-button" variant="secondary" onClick={onClose}>
          Avbryt
        </Button>
        <Button
          data-cy="modal-add-person-button"
          variant="primary"
          onClick={handleSubmit((values) => {
            onSubmit(values);
            reset(emptyCasedataOwnerOrContact)
          })}
        >
          {edit ? 'Ändra uppgifter' : 'Lägg till'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
