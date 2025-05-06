import { Role } from '@interfaces/role';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, FormLabel, Input, Modal, useThemeQueries } from '@sk-web-gui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { stakeholderSchema } from '@utils/validation-schema';
import { yupResolver } from '@hookform/resolvers/yup';

type StakeholderFormValues = {
  ssn?: string;
  firstName: string;
  lastName: string;
  newEmail?: string;
  newPhoneNumber?: string;
  street: string;
  careof?: string;
  zip?: string;
  city: string;
};

export const DisplayCard: React.FC<{
  isEditable: boolean;
  roles: Role[];
  userName?: string;
  firstName: string;
  lastName: string;
  personalNumber?: string;
  street: string;
  newEmail?: string;
  newPhoneNumber?: string;
  careof?: string;
  zip?: string;
  city: string;
  onRemove?: () => void;
  onUpdate?: (updatedData: { newEmail?: string; newPhoneNumber?: string }) => void;
}> = ({
  isEditable,
  roles,
  userName,
  firstName,
  lastName,
  personalNumber,
  street,
  newEmail,
  newPhoneNumber,
  careof,
  zip,
  city,
  onRemove,
  onUpdate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isMaxLargeDevice } = useThemeQueries();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StakeholderFormValues>({
    mode: 'onSubmit',
    resolver: yupResolver(stakeholderSchema),
    defaultValues: {
      ssn: personalNumber,
      firstName,
      lastName,
      newEmail,
      newPhoneNumber,
      street,
      careof,
      zip,
      city,
    },
  });

  const openHandler = () => {
    setIsOpen(!isOpen);
    reset({
      ssn: personalNumber,
      firstName,
      lastName,
      newEmail,
      newPhoneNumber,
      street,
      careof,
      zip,
      city,
    });
  };

  const onSubmit = (data: StakeholderFormValues) => {
    onUpdate?.({
      newEmail: data.newEmail,
      newPhoneNumber: data.newPhoneNumber,
    });
    openHandler();
  };

  return (
    <div className="border-1 rounded-12 bg-background-content w-full max-w-[52.5rem] my-15">
      <div className="rounded-t-12 bg-vattjom-background-200 h-[4rem] flex items-center mb-[1.5rem]">
        <strong className="px-[1rem]">{roles}</strong>
      </div>
      <div className="px-[1rem]">
        <p className="text-[1.6rem] font-semibold">{firstName + ' ' + lastName}</p>
        <div className={`flex text-md mb-10 ${isMaxLargeDevice ? 'flex-col' : 'flex-row'}`}>
          {userName ?
            <div className="mr-30">{userName}</div>
          : null}

          <div className="flex flex-col mr-10">
            <div>{personalNumber}</div>
            <div>
              {street}, {city}
            </div>
          </div>
          <div className="flex flex-col">
            <div>{newEmail}</div>
            <div>{newPhoneNumber}</div>
          </div>
        </div>

        {isEditable ?
          <div className="flex flex-col sm:flex-row gap-[1rem] mb-10">
            <Button
              data-cy="edit-card-button"
              leftIcon={<LucideIcon name="pen" size={16} />}
              variant="tertiary"
              size="sm"
              onClick={openHandler}
            >
              Redigera uppgifter
            </Button>
            <Button
              data-cy="remove-card-button"
              leftIcon={<LucideIcon name="x" size={16} />}
              variant="tertiary"
              size="sm"
              onClick={onRemove}
            >
              Ta bort
            </Button>
          </div>
        : null}

        <Modal className=" w-full max-w-[48rem]" show={isOpen} onClose={openHandler} label={'Redigera uppgifter'}>
          <Modal.Content>
            <FormLabel>Personnummer*</FormLabel>
            <Input {...register('ssn')} name="ssn" readOnly={isEditable} disabled={isEditable} invalid={!!errors.ssn} />
            {errors.ssn && <div className="text-error text-md mt-1">{errors.ssn.message}</div>}

            <div className="flex gap-8">
              <div className="flex flex-col">
                <FormLabel>Förnamn*</FormLabel>
                <Input
                  {...register('firstName')}
                  name="firstName"
                  readOnly={isEditable}
                  disabled={isEditable}
                  className="w-full"
                  invalid={!!errors.firstName}
                />
                {errors.firstName && <div className="text-error text-md mt-1">{errors.firstName.message}</div>}
              </div>
              <div className="flex flex-col">
                <FormLabel>Efternamn*</FormLabel>
                <Input
                  {...register('lastName')}
                  name="lastName"
                  readOnly={isEditable}
                  disabled={isEditable}
                  className="w-full"
                  invalid={!!errors.lastName}
                />
                {errors.lastName && <div className="text-error text-md mt-1">{errors.lastName.message}</div>}
              </div>
            </div>

            <div className="flex gap-8">
              <div className="flex flex-col">
                <FormLabel>E-postadress*</FormLabel>
                <Input {...register('newEmail')} name="newEmail" className="w-full" invalid={!!errors.newEmail} />
                {errors.newEmail && <div className="text-error text-md mt-1">{errors.newEmail.message}</div>}
              </div>
              <div className="flex flex-col">
                <FormLabel>Telefonnummer*</FormLabel>
                <Input
                  {...register('newPhoneNumber')}
                  name="newPhoneNumber"
                  className="w-full"
                  invalid={!!errors.newPhoneNumber}
                />
                {errors.newPhoneNumber && (
                  <div className="text-error text-md mt-1">{errors.newPhoneNumber.message}</div>
                )}
              </div>
            </div>

            <div className="flex gap-8">
              <div className="flex flex-col">
                <FormLabel>Adress*</FormLabel>
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
                <FormLabel>Postnummer*</FormLabel>
                <Input {...register('zip')} name="zip" className="w-full" invalid={!!errors.zip} />
                {errors.zip && <div className="text-error text-md mt-1">{errors.zip.message}</div>}
              </div>
              <div className="flex flex-col">
                <FormLabel>Ort*</FormLabel>
                <Input {...register('city')} name="city" className="w-full" invalid={!!errors.city} />
                {errors.city && <div className="text-error text-md mt-1">{errors.city.message}</div>}
              </div>
            </div>
          </Modal.Content>

          <Modal.Footer>
            <Button variant="secondary" onClick={openHandler}>
              Avbryt
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)}>
              Uppdatera
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};
