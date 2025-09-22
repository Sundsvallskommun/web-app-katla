import { yupResolver } from '@hookform/resolvers/yup';
import { Role, RoleDisplayNames } from '@interfaces/role';
import { Button, FormLabel, Input, Modal, Select } from '@sk-web-gui/react';
import { stakeholderSchema } from '@utils/validation-schema';
import { useEffect } from 'react';
import { Resolver, useForm } from 'react-hook-form';

export type StakeholderFormValues = {
  ssn?: string;
  firstName: string;
  lastName: string;
  newEmail?: string;
  newPhoneNumber?: string;
  street: string;
  careof?: string;
  zip?: string;
  city: string;
  roles?: Role[];
};

export const StakeholderFormModal: React.FC<{
  onSubmit: (values: StakeholderFormValues) => void;
  onClose: () => void;
  show: boolean;
  roles: Role[];
  initialValues?: StakeholderFormValues;
}> = ({ onSubmit, onClose, show, roles, initialValues }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<StakeholderFormValues>({
    mode: 'onSubmit',
    resolver: yupResolver(stakeholderSchema) as Resolver<StakeholderFormValues>,
    defaultValues: initialValues ?? {
      ssn: '',
      firstName: '',
      lastName: '',
      newEmail: '',
      newPhoneNumber: '',
      street: '',
      careof: '',
      zip: '',
      city: '',
      roles: roles.length === 1 ? [roles[0]] : [],
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
      label="Lägg till person manuellt"
    >
      <Modal.Content>
        <FormLabel>Personnummer*</FormLabel>
        <Input {...register('ssn')} name="ssn" invalid={!!errors.ssn} readOnly={true} />
        {errors.ssn && <div className="text-error text-md mt-1">{errors.ssn.message}</div>}

        <div className="flex gap-8">
          <div className="flex flex-col">
            <FormLabel>Förnamn*</FormLabel>
            <Input {...register('firstName')} name="firstName" className="w-full" invalid={!!errors.firstName} />
            {errors.firstName && <div className="text-error text-md mt-1">{errors.firstName.message}</div>}
          </div>
          <div className="flex flex-col">
            <FormLabel>Efternamn*</FormLabel>
            <Input {...register('lastName')} name="lastName" className="w-full" invalid={!!errors.lastName} />
            {errors.lastName && <div className="text-error text-md mt-1">{errors.lastName.message}</div>}
          </div>
        </div>

        <div className="flex gap-8">
          <div className="flex flex-col">
            <FormLabel>E-postadress</FormLabel>
            <Input {...register('newEmail')} name="newEmail" className="w-full" invalid={!!errors.newEmail} />
            {errors.newEmail && <div className="text-error text-md mt-1">{errors.newEmail.message}</div>}
          </div>
          <div className="flex flex-col">
            <FormLabel>Telefonnummer</FormLabel>
            <Input
              {...register('newPhoneNumber')}
              name="newPhoneNumber"
              className="w-full"
              invalid={!!errors.newPhoneNumber}
            />
            {errors.newPhoneNumber && <div className="text-error text-md mt-1">{errors.newPhoneNumber.message}</div>}
          </div>
        </div>

        <div className="flex gap-8">
          <div className="flex flex-col">
            <FormLabel>Adress{isOwner ? '*' : ''}</FormLabel>
            <Input {...register('street')} name="street" className="w-full" invalid={!!errors.street} />
            {errors.street && <div className="text-error text-md mt-1">{errors.street.message}</div>}
          </div>
          <div className="flex flex-col">
            <FormLabel>C/o adress</FormLabel>
            <Input {...register('careof')} name="careof" className="w-full" />
          </div>
        </div>

        <div className="flex gap-8">
          <div className="flex flex-col">
            <FormLabel>Postnummer{isOwner ? '*' : ''}</FormLabel>
            <Input {...register('zip')} name="zip" className="w-full" invalid={!!errors.zip} />
            {errors.zip && <div className="text-error text-md mt-1">{errors.zip.message}</div>}
          </div>
          <div className="flex flex-col">
            <FormLabel>Ort{isOwner ? '*' : ''}</FormLabel>
            <Input {...register('city')} name="city" className="w-full" invalid={!!errors.city} />
            {errors.city && <div className="text-error text-md mt-1">{errors.city.message}</div>}
          </div>
        </div>

        <div className="flex flex-col">
          <FormLabel>Roll*</FormLabel>
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
            }}
          >
            {roles.length > 1 && <Select.Option value="">Välj roll</Select.Option>}
            {roles.map((role) => (
              <Select.Option key={role} value={role}>
                {RoleDisplayNames[role]}
              </Select.Option>
            ))}
          </Select>
          {errors.roles && <div className="text-error text-md mt-1">{errors.roles.message}</div>}
        </div>
      </Modal.Content>

      <Modal.Footer>
        <Button data-cy="modal-cancel-person-button" variant="secondary" onClick={onClose}>
          Avbryt
        </Button>
        <Button data-cy="modal-add-person-button" variant="primary" onClick={handleSubmit(onSubmit)}>
          Lägg till
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
