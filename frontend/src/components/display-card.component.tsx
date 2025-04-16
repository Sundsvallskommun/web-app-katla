import { AppContext } from '@contexts/app-context-interface';
import { Role } from '@interfaces/role';
import { editStakeholder } from '@services/casedata-stakeholder-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, FormLabel, Input, Modal } from '@sk-web-gui/react';
import { useContext, useState } from 'react';

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
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { municipalityId, errand } = useContext(AppContext);

  const openHandler = () => {
    setIsOpen(!isOpen);
  };

  const [formData, setFormData] = useState({
    personalNumber,
    firstName,
    lastName,
    newEmail,
    newPhoneNumber,
    street,
    careof,
    zip,
    city,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    if (onUpdate) {
      onUpdate({ newEmail: formData.newEmail, newPhoneNumber: formData.newPhoneNumber });
    }
    openHandler();
  };

  return (
    <div className="border-1 rounded-12 bg-background-content w-[52.5rem] my-15">
      <div className="rounded-t-12 bg-vattjom-background-200 h-[4rem] flex items-center mb-[1.5rem]">
        <strong className="px-[1rem]">{roles}</strong>
      </div>
      <div className="px-[1rem]">
        <p className="text-[1.6rem] font-semibold">{firstName + ' ' + lastName}</p>
        <div className="flex text-md mb-10">
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
          <div className="flex gap-[1rem] mb-10">
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

        <Modal className="w-[48rem]" show={isOpen} onClose={openHandler} label={'Redigera uppgifter'}>
          <Modal.Content>
            <FormLabel>Personnummer*</FormLabel>
            <Input name="ssn" value={formData.personalNumber} onChange={handleInputChange} readOnly={isEditable} />
            <div className="flex gap-8">
              <div className="flex flex-col">
                <FormLabel>Förnamn*</FormLabel>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  readOnly={isEditable}
                  className="w-full"
                />
              </div>
              <div className="flex flex-col">
                <FormLabel>Efternamn*</FormLabel>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  readOnly={isEditable}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex gap-8">
              <div className="flex flex-col">
                <FormLabel>E-postadress*</FormLabel>
                <Input name="newEmail" value={formData.newEmail} onChange={handleInputChange} className="w-full" />
              </div>
              <div className="flex flex-col">
                <FormLabel>Telefonnummer*</FormLabel>
                <Input
                  name="newPhoneNumber"
                  value={formData.newPhoneNumber}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex gap-8">
              <div className="flex flex-col">
                <FormLabel>Adress</FormLabel>
                <Input
                  name="address"
                  value={formData.street}
                  onChange={handleInputChange}
                  readOnly={isEditable}
                  className="w-full"
                />
              </div>
              <div className="flex flex-col">
                <FormLabel>C/o adress</FormLabel>
                <Input name="coAddress" value={formData.careof} onChange={handleInputChange} className="w-full" />
              </div>
            </div>
            <div className="flex gap-8">
              <div className="flex flex-col">
                <FormLabel>Postnummer</FormLabel>
                <Input
                  name="postalCode"
                  value={formData.zip}
                  onChange={handleInputChange}
                  readOnly={isEditable}
                  className="w-full"
                />
              </div>
              <div className="flex flex-col">
                <FormLabel>Ort</FormLabel>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  readOnly={isEditable}
                  className="w-full"
                />
              </div>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <Button variant="secondary" onClick={openHandler}>
              Avbryt
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
              Uppdatera
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};
