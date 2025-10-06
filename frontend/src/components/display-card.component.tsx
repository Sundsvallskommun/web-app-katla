import { AppContext } from '@contexts/app-context-interface';
import { getRoleDisplayName, Role } from '@interfaces/role';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, useThemeQueries } from '@sk-web-gui/react';
import { phoneNumberFormatter } from '@utils/contact-form-utils';
import { isErrandReadOnly } from '@utils/errand-utils';
import { useContext, useState } from 'react';
import { StakeholderFormModal } from './stakeholder-form.component';

export const DisplayCard: React.FC<{
  isEditable: boolean;
  roles: Role[];
  availableRoles: Role[];
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
    role?: Role[];
  }) => void;
}> = ({
  isEditable,
  roles,
  availableRoles,
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
  const { isMaxMediumDevice } = useThemeQueries();
  const { errand } = useContext(AppContext);

  return (
    <div className="border-1 rounded-12 bg-background-content w-full max-w-[52.5rem] my-15">
      <div className="rounded-t-12 bg-vattjom-background-200 h-[4rem] flex items-center mb-[1.5rem]">
        <strong className="px-[1rem]">
          {Array.isArray(roles) ? roles.map(getRoleDisplayName).join(', ') : getRoleDisplayName(roles)}
        </strong>
      </div>
      <div className="px-[1rem]">
        <p className="text-[1.6rem] font-semibold">
          {firstName + ' ' + lastName}
          {userName && ` (${userName})`}
        </p>
        <div className={`flex text-md mb-10 ${isMaxMediumDevice ? 'flex-col' : 'flex-row'}`}>
          {!roles.includes(Role.REPORTER) && (
            <div className="flex flex-col mr-10">
              <div className={!personalNumber ? 'italic text-text-secondary' : ''}>
                {personalNumber || 'Personnummer saknas'}
              </div>
              <div className={!(street?.trim() && city?.trim()) ? 'italic text-text-secondary' : ''}>
                {street?.trim() && city?.trim() ? `${street}, ${city}` : 'Adress saknas'}
              </div>
            </div>
          )}
          <div className="flex flex-col">
            <div className={!newEmail?.trim() ? 'italic text-text-secondary' : ''}>
              {newEmail?.trim() || 'E-post saknas'}
            </div>
            <div className={!phoneNumberFormatter(newPhoneNumber) ? 'italic text-text-secondary' : ''}>
              {phoneNumberFormatter(newPhoneNumber) || 'Telefonnummer saknas'}
            </div>
          </div>
        </div>

        {isEditable && !isErrandReadOnly(errand) && (
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
          roles={availableRoles}
          onSubmit={(data) => {
            onUpdate?.({
              newEmail: data.newEmail,
              newPhoneNumber: phoneNumberFormatter(data.newPhoneNumber),
              street: data.street,
              zip: data.zip,
              city: data.city,
              careof: data.careof,
              role: data.roles,
            });
            setIsOpen(false);
          }}
        />
      </div>
    </div>
  );
};
