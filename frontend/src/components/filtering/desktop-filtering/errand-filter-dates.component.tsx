import LucideIcon from '@sk-web-gui/lucide-icon';
import { PopupMenu, DatePicker, Button, useThemeQueries } from '@sk-web-gui/react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

export interface CaseDatesFilter {
  startdate: string;
  enddate: string;
}

export const CasedataFilterDates: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { setValue, watch } = useFormContext<CaseDatesFilter>();
  const [startDate, setStartDate] = useState<string>(watch('startdate'));
  const [endDate, setEndDate] = useState<string>(watch('enddate'));
  const { isMaxLargeDevice } = useThemeQueries();

  const handleApply = () => {
    setValue('startdate', startDate);
    setValue('enddate', endDate);
    setOpen(false);
  };
  return (
    <PopupMenu type="dialog" open={open} onToggleOpen={setOpen}>
      <PopupMenu.Button
        rightIcon={<LucideIcon name="chevron-down" />}
        data-cy="Tidsperiod-filter"
        variant={isMaxLargeDevice ? 'secondary' : 'tertiary'}
        showBackground={false}
        size={isMaxLargeDevice ? 'md' : 'sm'}
        className={isMaxLargeDevice ? 'w-full flex justify-between items-center text-left' : 'max-md:w-full'}
      >
        Tidsperiod
      </PopupMenu.Button>
      <PopupMenu.Panel className="max-md:w-full">
        <DatePicker
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          data-cy="casedata-validFrom-input"
          max={dayjs(endDate).format('YYYY-MM-DD')}
        />
        <DatePicker
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          data-cy="casedata-validTo-input"
          min={startDate ? dayjs(startDate).format('YYYY-MM-DD') : undefined}
        />
        <Button onClick={() => handleApply()}>Visa tidsperiod</Button>
      </PopupMenu.Panel>
    </PopupMenu>
  );
};
