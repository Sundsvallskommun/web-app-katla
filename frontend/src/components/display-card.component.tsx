import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, useThemeQueries } from '@sk-web-gui/react';
import { useState } from 'react';
import { getRoleDisplayName, Role } from '@interfaces/role';
import { StakeholderFormModal } from './stakeholder-form.component';

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
  onUpdate?: (updatedData: {
    newEmail?: string;
    newPhoneNumber?: string;
    street?: string;
    zip?: string;
    city?: string;
    careof?: string;
  }) => void;
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

  return (
    <div className="border-1 rounded-12 bg-background-content w-full max-w-[52.5rem] my-15">
      <div className="rounded-t-12 bg-vattjom-background-200 h-[4rem] flex items-center mb-[1.5rem]">
        <strong className="px-[1rem]">
          {Array.isArray(roles) ? roles.map(getRoleDisplayName).join(', ') : getRoleDisplayName(roles)}
        </strong>
      </div>
      <div className="px-[1rem]">
        <p className="text-[1.6rem] font-semibold">{firstName + ' ' + lastName}</p>
        <div className={`flex text-md mb-10 ${isMaxLargeDevice ? 'flex-col' : 'flex-row'}`}>
          {userName && <div className="mr-30">{userName}</div>}

          <div className="flex flex-col mr-10">
            <div className={!personalNumber ? 'italic text-text-secondary' : ''}>
              {personalNumber || 'Personnummer saknas'}
            </div>
            <div className={!(street?.trim() && city?.trim()) ? 'italic text-text-secondary' : ''}>
              {street?.trim() && city?.trim() ? `${street}, ${city}` : 'Adress saknas'}
            </div>
          </div>

          <div className="flex flex-col">
            <div className={!newEmail?.trim() ? 'italic text-text-secondary' : ''}>
              {newEmail?.trim() || 'E-post saknas'}
            </div>
            <div className={!newPhoneNumber?.trim() ? 'italic text-text-secondary' : ''}>
              {newPhoneNumber?.trim() || 'Telefonnummer saknas'}
            </div>
          </div>
        </div>

        {isEditable && (
          <div className="flex flex-col sm:flex-row gap-[1rem] mb-10">
            <Button
              data-cy="edit-card-button"
              leftIcon={<LucideIcon name="pen" size={16} />}
              variant="tertiary"
              size="sm"
              onClick={() => setIsOpen(true)}
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
        )}

        <StakeholderFormModal
          show={isOpen}
          onClose={() => setIsOpen(false)}
          initialValues={{
            ssn: personalNumber,
            firstName,
            lastName,
            newEmail,
            newPhoneNumber,
            street,
            careof,
            zip,
            city,
            roles,
          }}
          roles={roles}
          onSubmit={(data) => {
            onUpdate?.({
              newEmail: data.newEmail,
              newPhoneNumber: data.newPhoneNumber,
              street: data.street,
              zip: data.zip,
              city: data.city,
              careof: data.careof,
            });
            setIsOpen(false);
          }}
        />
      </div>
    </div>
  );
};
