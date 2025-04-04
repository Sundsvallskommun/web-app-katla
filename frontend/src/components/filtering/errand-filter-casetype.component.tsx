import LucideIcon from '@sk-web-gui/lucide-icon';
import { PopupMenu, SearchField } from '@sk-web-gui/react';
import { useState } from 'react';

export const CasedataFilterCaseType: React.FC = () => {
  //const { register } = useFormContext<CaseTypeFilter>();
  const [query, setQuery] = useState<string>('');

  return (
    <PopupMenu>
      <PopupMenu.Button
        rightIcon={<LucideIcon name="chevron-down" />}
        data-cy="Ärendetyp-filter"
        variant="tertiary"
        showBackground={false}
        size="sm"
        className="max-md:w-full"
      >
        Ärendetyp
      </PopupMenu.Button>
      <PopupMenu.Panel className="max-md:w-full max-h-[70vh] h-auto overflow-hidden overflow-y-scroll">
        <SearchField
          size="md"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onReset={() => setQuery('')}
          placeholder="Skriv för att söka"
        />
        <PopupMenu.Items autoFocus={false}></PopupMenu.Items>
      </PopupMenu.Panel>
    </PopupMenu>
  );
};
