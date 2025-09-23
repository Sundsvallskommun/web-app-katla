import { AppContext } from '@contexts/app-context-interface';
import { extraParametersToUppgiftMapper, UppgiftField } from '@services/casedata-extra-parameters-service';
import { useContext } from 'react';
import { useWatch } from 'react-hook-form';

export const useUppgiftFields = (section: string): UppgiftField[] => {
  const { errand } = useContext(AppContext);

  const caseType = useWatch({ name: 'caseType' });

  if (!caseType) return [];

  const uppgifter = extraParametersToUppgiftMapper({
    caseType,
    extraParameters: errand?.extraParameters ?? [],
  });

  return (uppgifter[caseType] ?? []).filter((f) => f.section === section);
};
