import { Button, SearchField } from '@sk-web-gui/react';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface MobileSearchBodyProps {
  children?: React.ReactNode;
  onSearch?: (query: string) => void;
  onDone?: () => void;
  onResetList?: () => void;
}

export const MobileSearchBody: React.FC<MobileSearchBodyProps> = ({ onSearch, onDone, onResetList }) => {
  const [query, setQuery] = useState<string>('');
  const { setValue } = useFormContext<{ query: string }>();

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    onResetList?.();
    setValue('query', trimmed);
    onSearch?.(trimmed);
    onDone?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="w-full bg-vattjom-background-200 px-[1.2rem] pb-[3.2rem]">
      <div className="w-full pt-[1.2rem] flex flex-col">
        <div className="flex gap-2 w-full pt-[3.2rem]">
          <SearchField
            size="md"
            autoFocus
            value={query}
            showSearchButton={false}
            onChange={(e) => setQuery(e.target.value)}
            onReset={() => setQuery('')}
            onKeyDown={handleKeyDown}
            placeholder="Skriv för att söka"
            className="flex-grow"
          />
        </div>
        <div className="h-[2.4rem]" />
        <Button size="md" color="vattjom" onClick={handleSearch} className="whitespace-nowrap" disabled={!query.trim()}>
          Sök
        </Button>
      </div>
    </div>
  );
};
