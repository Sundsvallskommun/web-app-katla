import { getCaseLabels } from '@services/casedata-errand-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Checkbox, PopupMenu, SearchField, useThemeQueries } from '@sk-web-gui/react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { CaseTypeFilter } from '../errand-filter';

export const CasedataFilterCaseType: React.FC = () => {
  const { register } = useFormContext<CaseTypeFilter>();
  const [query, setQuery] = useState<string>('');
  const { isMaxMediumDevice } = useThemeQueries();
  return (
    <PopupMenu>
      <PopupMenu.Button
        rightIcon={<LucideIcon name="chevron-down" />}
        data-cy="Ärendetyp-filter"
        variant={isMaxMediumDevice ? 'secondary' : 'tertiary'}
        showBackground={false}
        size={isMaxMediumDevice ? 'md' : 'sm'}
        className={isMaxMediumDevice ? 'w-full flex justify-between items-center text-left' : 'w-full'}
      >
        <span>Ärendetyp</span>
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
        <PopupMenu.Items autoFocus={false}>
          {Object.entries(getCaseLabels())
            .sort((a, b) => a[1].localeCompare(b[1]))
            .filter(
              ([caseType, label]) =>
                caseType.toLowerCase().includes(query.toLowerCase()) ||
                label.toLowerCase().includes(query.toLowerCase())
            )
            .map(([caseType, label], idx) => (
              <PopupMenu.Item key={`${label}-${idx}`}>
                <Checkbox
                  labelPosition="left"
                  value={caseType}
                  {...register('caseType')}
                  data-cy={`Ärendetyp-filter-${caseType}`}
                >
                  {label}
                </Checkbox>
              </PopupMenu.Item>
            ))}
        </PopupMenu.Items>
      </PopupMenu.Panel>
    </PopupMenu>
  );
};
