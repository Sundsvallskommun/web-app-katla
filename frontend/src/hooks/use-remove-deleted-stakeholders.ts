import { IErrand } from '@interfaces/errand';
import { CasedataOwnerOrContact } from '@interfaces/stakeholder';
import { removeStakeholder } from '@services/casedata-stakeholder-service';
import { useFormContext } from 'react-hook-form';

export const useRemoveDeletedStakeholders = () => {
  const { formState } = useFormContext<IErrand>();

  return async (currentData: Partial<IErrand>) => {
    if (!currentData.id) return;

    const originalStakeholders = (formState.defaultValues?.stakeholders || []) as CasedataOwnerOrContact[];
    const currentStakeholders = (currentData?.stakeholders || []) as CasedataOwnerOrContact[];

    const deletedStakeholders = originalStakeholders.filter(
      (original) => original.id && !currentStakeholders.some((current) => current.id === original.id)
    );

    if (deletedStakeholders.length > 0) {
      await Promise.all(
        deletedStakeholders.map(
          (stakeholder) => stakeholder.id && removeStakeholder(currentData.id as number, stakeholder.id)
        )
      );
    }
  };
};
