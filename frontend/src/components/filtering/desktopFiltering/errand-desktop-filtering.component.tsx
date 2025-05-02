import { Admin } from '@services/user-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, cx, Link } from '@sk-web-gui/react';
import { useState } from 'react';
import { CasedataFilterQuery } from './errand-filter-query.component';
import { CasedataFilterTags } from './casedata-filter-tags.component';
import { IErrand } from '@interfaces/errand';
import { CasedataFilterBase } from './errand-filter-base.component';

const CaseDataFiltering: React.FC<{
  ownerFilterHandler: (b: boolean) => void;
  ownerFilter?: boolean;
  administrators?: Admin[];
  numberOfFilters: number;
  errands: IErrand[];
}> = ({ numberOfFilters, ownerFilterHandler = () => false, ownerFilter = false, errands }) => {
  const [show, setShow] = useState<boolean>(true);
  return (
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
          <Link
            href={`${process.env.NEXT_PUBLIC_BASE_PATH}/registrera`}
            target="_blank"
            data-cy="register-new-errand-button"
          >
            <Button color={'vattjom'} variant={'primary'}>
              Nytt ärende
            </Button>
          </Link>
        </div>
      </div>

      <div className={cx(show ? 'visible' : 'hidden')}>
        <CasedataFilterBase
          ownerFilter={ownerFilter}
          ownerFilterHandler={ownerFilterHandler}
          backgroundColor="bg-background-200"
        />
        <div className="mt-16">
          <CasedataFilterTags errands={errands} />
        </div>
      </div>
    </div>
  );
};

export default CaseDataFiltering;
