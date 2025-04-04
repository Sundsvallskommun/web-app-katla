import { SearchField } from '@sk-web-gui/react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { CaseQueryFilter } from './errand-filter';

export const CasedataFilterQuery: React.FC = () => {
  const { watch, setValue } = useFormContext<CaseQueryFilter>();
  const value = watch('query');
  const [query, setQuery] = useState<string>(value);
  //const gui = useGui();

  //   const isMobile = useMediaQuery(`screen and (max-width: ${gui.theme.screens.md})`);

  //   useDebounceEffect(
  //     () => {
  //       if (query !== value) {
  //         setValue('query', query);
  //       }
  //     },
  //     1000,
  //     [query]
  //   );

  return (
    <SearchField
      value={query}
      size="md"
      data-cy="query-filter"
      onChange={(e) => {
        setQuery(e.target.value);
      }}
      showSearchButton={value !== query}
      className="flex-grow max-w-full"
      onSearch={() => setValue('query', query)}
      onReset={() => {
        setQuery('');
        setValue('query', '');
      }}
      placeholder="Skriv för att söka"
    />
  );
};
