import { AppContext } from '@contexts/app-context-interface';
import { Checkbox } from '@sk-web-gui/react';
import { isErrandReadOnly } from '@utils/errand-utils';
import React, { useContext } from 'react';

interface SectionCompletionProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const SectionCompletion: React.FC<SectionCompletionProps> = ({ checked, onChange }) => {
  const { errand } = useContext(AppContext);
  return (
    !isErrandReadOnly(errand) && (
      <div className={'mt-24'}>
        <Checkbox onClick={() => onChange(!checked)} checked={checked}>
          Markera avsnittet som komplett
        </Checkbox>
      </div>
    )
  );
};
