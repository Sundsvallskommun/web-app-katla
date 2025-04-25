import { CasedataStatusLabelComponent } from '@components/ongoing-errands/components/casedata-status-label.component';
import { findStatusLabelForStatusKey } from '@services/casedata-errand-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button } from '@sk-web-gui/react';
interface ErrandItemProps {
  errand: {
    id: number;
    title: string;
    type: string;
    registeredDate: string;
    statusType: string;
  };
}

const MobileErrandItem: React.FC<ErrandItemProps> = ({ errand }) => {
  return (
    <div className="py-4">
      <div className="flex min-h-[8rem] items-end self-stretch rounded-[20px] border border-opacity-30 pt-[2.0rem] pb-[1.2rem] pl-[2.0rem] pr-[0.8rem] gap-4">
        <div className="flex flex-1 flex-col">
          <CasedataStatusLabelComponent
            status={findStatusLabelForStatusKey(errand.statusType) as string}
            className="text-white font-arial text-md lining-nums proportional-nums w-fit max-w-full py-[0.6rem] px-[1.2rem] rounded-[1.2rem] text-center"
          />

          <div className="text-primary-900 font-arial text-xl font-bold lining-nums proportional-nums leading-[2.8rem] pt-[1.2rem]">
            {errand.title}
          </div>

          <div className="flex flex-col items-start gap-1.5 pt-[2.4rem] flex-1">
            <div className="text-primary-900 font-arial text-base lining-nums proportional-nums leading-[2.4rem]">
              <span className="font-[700]">Ärendetyp:</span> {errand.type}
            </div>
            <div className="text-primary-900 font-arial text-base lining-nums proportional-nums leading-[2.4rem]">
              <span className="font-[700]">Registrerat</span> {errand.registeredDate}
            </div>
          </div>
        </div>

        <Button
          className="flex items-center justify-center p-[1.2rem] bg-white"
          iconButton={true}
          type="button"
          size="lg"
          leftIcon={<LucideIcon name="arrow-right" />}
          color="primary"
          variant="tertiary"
        />
      </div>
    </div>
  );
};

export default MobileErrandItem;
