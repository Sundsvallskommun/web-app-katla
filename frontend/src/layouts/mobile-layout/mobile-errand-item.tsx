import { CasedataStatusLabelComponent } from '@components/ongoing-errands/components/casedata-status-label.component';
import { FTCaseType, getCaseShortLabels } from '@interfaces/case-type';
import { IErrand } from '@interfaces/errand';
import { findStatusLabelForStatusKey } from '@services/casedata-errand-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button } from '@sk-web-gui/react';
interface ErrandItemProps {
  errand: IErrand;
}

const MobileErrandItem: React.FC<ErrandItemProps> = ({ errand }) => {
  return (
    <div className="py-4">
      <div className="flex min-h-[8rem] items-end self-stretch rounded-[20px] border border-opacity-30 pt-[2.0rem] pb-[1.2rem] pl-[2.0rem] pr-[0.8rem] gap-4">
        <div className="flex flex-1 flex-col">
          <CasedataStatusLabelComponent
            status={findStatusLabelForStatusKey(errand?.status?.statusType as string) as string}
            className="text-white font-arial text-md lining-nums proportional-nums w-fit max-w-full py-[0.6rem] px-[1.2rem] rounded-[1.2rem] text-center"
          />

          <div className="font-arial text-xl font-bold lining-nums proportional-nums leading-[2.8rem] pt-[1.2rem]">
            {getCaseShortLabels()[errand.caseType as FTCaseType] ?? ''}
          </div>

          <div className="flex flex-col items-start gap-1.5 pt-[2.4rem] flex-1">
            <div className=" font-arial text-base lining-nums proportional-nums leading-[2.4rem]">
              <span className="font-[700]">Ärendetyp:</span> {errand.label}
            </div>
            <div className="font-arial text-base lining-nums proportional-nums leading-[2.4rem]">
              <span className="font-[700]">Registrerat</span> {errand.created}
            </div>
          </div>
        </div>

        <Button
          className="flex items-center justify-center p-[1.2rem]"
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
