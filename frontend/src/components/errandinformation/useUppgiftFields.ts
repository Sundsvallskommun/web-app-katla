import { AppContext } from '@contexts/app-context-interface';
import {
  extraParametersToUppgiftMapper,
  UppgiftFieldExtended,
} from '@services/casedata-extra-parameters-service';
import { useContext } from 'react';
import { useWatch } from 'react-hook-form';

export const useUppgiftFields = (section: string): UppgiftFieldExtended[] => {
  const { errand } = useContext(AppContext);
  const caseType = useWatch({ name: 'caseType' });

  const uppgifter = extraParametersToUppgiftMapper({
    caseType: caseType || '',
    extraParameters: errand?.extraParameters ?? [],
  });

  const fields = caseType ? (uppgifter[caseType] ?? []).filter((f) => f.section === section) : [];

  return fields;
};
