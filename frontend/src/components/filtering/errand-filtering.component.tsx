import { Admin } from '@services/user-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, Checkbox, cx, Link } from '@sk-web-gui/react';
import { useState } from 'react';
import { CasedataFilterCaseType } from './errand-filter-casetype.component';
import { CasedataFilterQuery } from './errand-filter-query.component';
import { CasedataFilterStatus } from './casedata-filter-status.component';
import { CasedataFilterTags } from './casedata-filter-tags.component';

const CaseDataFiltering: React.FC<{
  ownerFilterHandler: (b: boolean) => void;
  ownerFilter?: boolean;
  administrators?: Admin[];
  numberOfFilters: number;
}> = ({ numberOfFilters, ownerFilterHandler = () => false, ownerFilter = false }) => {
  const [show, setShow] = useState<boolean>(true);
  return (
    <>
      <div className="flex flex-col w-full gap-16 py-19">
        <div className="w-full flex flex-wrap items-start md:items-center justify-between md:flex-row gap-16">
          <CasedataFilterQuery />
          <div className="flex gap-16">
            <Button
              onClick={() => setShow(!show)}
              data-cy="Show-filters-button"
              color="vattjom"
              variant={show ? 'tertiary' : 'primary'}
              inverted={show ? false : true}
              leftIcon={<LucideIcon name="list-filter" size="1.8rem" />}
            >
              {show ? 'Dölj filter' : `Visa filter ${numberOfFilters !== 0 ? `(${numberOfFilters})` : ''}`}
            </Button>
            <Link href={`/registrera`} target="_blank" data-cy="register-new-errand-button">
              <Button color={'vattjom'} variant={'primary'}>
                Nytt ärende
              </Button>
            </Link>
          </div>
        </div>

        <div className={cx(show ? 'visible' : 'hidden')}>
          <div className="flex gap-16 items-center">
            <div className="w-full flex flex-col md:flex-row justify-start items-center p-10 gap-4 bg-background-200 rounded-groups flex-wrap">
              <div className="relative max-md:w-full">
                <CasedataFilterCaseType />
              </div>
              <div className="relative max-md:w-full">
                <CasedataFilterStatus />
              </div>
            </div>
            <div className="min-w-fit">
              <Checkbox
                data-cy="myErrands-filter"
                checked={ownerFilter}
                onChange={() => ownerFilterHandler(!ownerFilter)}
              >
                Mina ärenden
              </Checkbox>
            </div>
          </div>
          <div className="mt-16">
            <CasedataFilterTags />
          </div>
        </div>
      </div>
    </>
  );
};

export default CaseDataFiltering;
