import { CaseQueryFilter } from '@components/filtering/errand-filter';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, Input } from '@sk-web-gui/react';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface MobileSearchBodyProps {
  onDone?: () => void;
}

export const MobileSearchBody: React.FC<MobileSearchBodyProps> = ({ onDone }) => {
  const { watch, setValue } = useFormContext<CaseQueryFilter>();
  const value = watch('query');
  const [query, setQuery] = useState<string>(value);

  const handleSearch = () => {
    setValue('query', query);
    onDone?.();
  };

  return (
    <div className="w-full bg-vattjom-background-200 px-[1.2rem] pb-[3.2rem]">
      <div className="w-full pt-[1.2rem] flex flex-col">
        <div className="flex gap-2 w-full pt-[3.2rem]">
          <Input.Group className="flex-grow max-w-full">
            <Input.LeftAddin icon>
              <LucideIcon name="search" />
            </Input.LeftAddin>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              placeholder="Skriv för att söka"
            />
          </Input.Group>
        </div>
        <div className="h-[2.4rem]" />
        <Button
          size="md"
          color="vattjom"
          onClick={() => {
            handleSearch();
          }}
        >
          Sök
        </Button>
      </div>
    </div>
  );
};
