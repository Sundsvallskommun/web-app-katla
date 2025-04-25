import LucideIcon from '@sk-web-gui/lucide-icon';
import { PopupMenu, DatePicker, Button } from '@sk-web-gui/react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

export interface CaseDatesFilter {
  startdate: string;
  enddate: string;
}

export const CasedataFilterDatesMobile: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { setValue, watch } = useFormContext<CaseDatesFilter>();

  const [startDate, setStartDate] = useState<string>(watch('startdate'));
  const [endDate, setEndDate] = useState<string>(watch('enddate'));

  const handleApply = () => {
    setValue('startdate', startDate);
    setValue('enddate', endDate);
    setOpen(false);
  };

  return (
    <div className="relative">
      {' '}
      <PopupMenu
        type="dialog"
        open={open}
        onToggleOpen={setOpen}
        position="under"
        align="start"
        autoPosition={true}
        autoAlign={true}
      >
        <PopupMenu.Button
          rightIcon={
            <LucideIcon
              name="chevron-down"
              className="[&>svg]:w-[2.8rem] [&>svg]:h-[2.8rem] text-black"
              style={{ width: '2.5rem', height: '2.5rem' }}
            />
          }
          data-cy="Tidsperiod-filter"
          variant="tertiary"
          showBackground={true}
          size="md"
          className="w-full flex justify-between items-center gap-2 bg-white text-black border border-gray-300  hover:bg-white focus:bg-white active:bg-white"
        >
          Tidsperiod
        </PopupMenu.Button>
        <PopupMenu.Panel className="w-full bg-white text-black border border-gray-300 rounded-md shadow-lg">
          <div className="p-4 space-y-3">
            <DatePicker
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              data-cy="casedata-validFrom-input"
              max={dayjs(endDate).format('YYYY-MM-DD')}
              className="w-full"
            />
            <DatePicker
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              data-cy="casedata-validTo-input"
              min={startDate ? dayjs(startDate).format('YYYY-MM-DD') : undefined}
              className="w-full"
            />
            <Button onClick={handleApply} className="w-full">
              Visa tidsperiod
            </Button>
          </div>
        </PopupMenu.Panel>
      </PopupMenu>
    </div>
  );
};
