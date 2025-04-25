import { useFormContext } from 'react-hook-form';
import { useContext } from 'react';
import { AppContext } from '@contexts/app-context-interface';
import store from '@services/storage-service';

export const useFilterTags = () => {
  const { setSelectedErrandStatuses, setSidebarLabel } = useContext(AppContext);

  const { getValues, setValue, reset } = useFormContext<{
    status: string[];
    caseType: string[];
    priority: string[];
    startdate: string;
    enddate: string;
    channel: string[];
  }>();

  const types = getValues('caseType') ?? [];
  const statuses = getValues('status') ?? [];
  const priorities = getValues('priority') ?? [];
  const channels = getValues('channel') ?? [];
  const startdate = getValues('startdate');
  const enddate = getValues('enddate');

  const handleRemoveType = (typeToRemove: string) => {
    const updatedTypes = types.filter((type) => type !== typeToRemove);
    setValue('caseType', updatedTypes);
  };

  const handleRemovePriority = (priorityToRemove: string) => {
    const updatedPriorities = priorities.filter((priority) => priority !== priorityToRemove);
    setValue('priority', updatedPriorities);
  };

  const handleRemoveStatus = (statusToRemove: string) => {
    const updatedStatuses = statuses.filter((status) => status !== statusToRemove);
    setValue('status', updatedStatuses);

    if (updatedStatuses.length === 0) {
      setSelectedErrandStatuses([]);
      setSidebarLabel('');
    }
  };

  const handleRemoveChannel = (channelToRemove: string) => {
    const updatedChannels = channels.filter((channel) => channel !== channelToRemove);
    setValue('channel', updatedChannels);
  };

  const handleRemoveDates = () => {
    setValue('startdate', '');
    setValue('enddate', '');
  };

  const handleReset = () => {
    reset({
      status: [],
      caseType: [],
      priority: [],
      startdate: '',
      enddate: '',
      channel: [],
    });

    setSelectedErrandStatuses([]);
    setSidebarLabel('');

    const stored = store.get('filter');
    if (stored) {
      const parsed = JSON.parse(stored);
      parsed.status = [];
      parsed.caseType = [];
      parsed.priority = [];
      parsed.startdate = '';
      parsed.enddate = '';
      parsed.channel = [];
      store.set('filter', JSON.stringify(parsed));
    }
  };

  return {
    types,
    statuses,
    priorities,
    channels,
    startdate,
    enddate,
    handleRemoveChannel,
    handleRemoveType,
    handleRemoveStatus,
    handleRemovePriority,
    handleRemoveDates,
    handleReset,
  };
};
