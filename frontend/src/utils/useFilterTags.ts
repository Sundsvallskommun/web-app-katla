import { useFormContext } from 'react-hook-form';
import { useContext } from 'react';
import { AppContext } from '@contexts/app-context-interface';
import store from '@services/storage-service';

export const useFilterTags = () => {
  const { setSelectedErrandStatuses, setSidebarLabel } = useContext(AppContext);

  const { getValues, setValue, reset } = useFormContext<{
    status: string[];
    caseType: string[];
  }>();

  const types = getValues('caseType') ?? [];
  const statuses = getValues('status') ?? [];

  const handleRemoveType = (typeToRemove: string) => {
    const updatedTypes = types.filter((type) => type !== typeToRemove);
    setValue('caseType', updatedTypes);
  };

  const handleRemoveStatus = (statusToRemove: string) => {
    const updatedStatuses = statuses.filter((status) => status !== statusToRemove);
    setValue('status', updatedStatuses);

    if (updatedStatuses.length === 0) {
      setSelectedErrandStatuses([]);
      setSidebarLabel('');
    }
  };

  const handleReset = () => {
    reset({
      status: [],
      caseType: [],
    });

    setSelectedErrandStatuses([]);
    setSidebarLabel('');

    const stored = store.get('filter');
    if (stored) {
      const parsed = JSON.parse(stored);
      parsed.status = '';
      parsed.caseType = '';
      store.set('filter', JSON.stringify(parsed));
    }
  };

  return {
    types,
    statuses,
    handleRemoveType,
    handleRemoveStatus,
    handleReset,
  };
};
