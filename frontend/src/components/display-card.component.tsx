import { AppContext } from '@contexts/app-context-interface';
import { getRoleDisplayName, Role } from '@interfaces/role';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, useThemeQueries } from '@sk-web-gui/react';
import { phoneNumberFormatter } from '@utils/contact-form-utils';
import { isErrandReadOnly } from '@utils/errand-utils';
import { useContext, useState } from 'react';
import { StakeholderFormModal } from './stakeholder-form.component';
import { CasedataOwnerOrContact } from '@interfaces/stakeholder';
import { PartyAssetsSection } from './partyassets/partyassets-section.component';

export const DisplayCard: React.FC<{
  person: CasedataOwnerOrContact;
  availableRoles: Role[];
  isEditable?: boolean;
  onRemove?: () => void;
  onUpdate?: (values: CasedataOwnerOrContact) => void;
}> = ({ person, isEditable, availableRoles, onRemove, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isMaxMediumDevice } = useThemeQueries();
  const { errand } = useContext(AppContext);

  return (
    <div className="border-1 rounded-12 bg-background-content w-full max-w-[52.5rem] my-15">
      <div className="rounded-t-12 bg-vattjom-background-200 h-[4rem] flex items-center mb-[1.5rem]">
        <strong className="px-[1rem]">
          {Array.isArray(person.roles) ?
            person.roles.map(getRoleDisplayName).join(', ')
          : getRoleDisplayName(person.roles)}
        </strong>
      </div>
      <div className="px-[1rem]">
        <p className="text-[1.6rem] font-semibold">
          {person.firstName + ' ' + person.lastName}
          {person.adAccount && ` (${person.adAccount})`}
        </p>
        <div className={`flex text-md mb-10 ${isMaxMediumDevice ? 'flex-col' : 'flex-row'}`}>
          {!person.roles.includes(Role.REPORTER) && (
            <div className="flex flex-col mr-10">
              <div className={!person.personalNumber ? 'italic text-text-secondary' : ''}>
                {person.personalNumber || 'Personnummer saknas'}
              </div>
              <div className={!(person.street?.trim() && person.city?.trim()) ? 'italic text-text-secondary' : ''}>
                {person.street?.trim() && person.city?.trim() ? `${person.street}, ${person.city}` : 'Adress saknas'}
              </div>
            </div>
          )}
          <div className="flex flex-col">
            <div className={!person.emails?.[0]?.value?.trim() ? 'italic text-text-secondary' : ''}>
              {person.emails?.[0]?.value?.trim() || 'E-post saknas'}
            </div>
            <div className={!phoneNumberFormatter(person.phoneNumbers?.[0]?.value) ? 'italic text-text-secondary' : ''}>
              {phoneNumberFormatter(person.phoneNumbers?.[0]?.value) || 'Telefonnummer saknas'}
            </div>
          </div>
        </div>

        {person.roles.includes(Role.APPLICANT) && person.personId && (
          <PartyAssetsSection
            partyId={person.personId}
            name={`${person.firstName ?? ''} ${person.lastName ?? ''}`.trim()}
          />
        )}

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
          initialValues={person}
          roles={availableRoles}
          onSubmit={(updatedValues) => {
            onUpdate?.(updatedValues);
            setIsOpen(false);
          }}
          edit
        />
      </div>
    </div>
  );
};
