// import { IErrand } from '@casedata/interfaces/errand';
// import { Priority } from '@casedata/interfaces/priority';
// import { findStatusLabelForStatusKey, getCaseLabels, isErrandClosed } from '@casedata/services/casedata-errand-service';
// import { getErrandPropertyDesignations } from '@casedata/services/casedata-facilities-service';
// import { isMEX, isPT } from '@common/services/application-service';
// import { useAppContext } from '@contexts/app.context';
// import { useMediaQuery } from '@mui/material';
// import LucideIcon from '@sk-web-gui/lucide-icon';
// import { Callout } from '@sk-web-gui/react';
// import { Badge, Button, Input, Label, Pagination, Select, Spinner, Table, cx, useGui } from '@sk-web-gui/react';
// import { SortMode } from '@sk-web-gui/table';
import NextLink from 'next/link';
// import { useState } from 'react';
// import { useFormContext } from 'react-hook-form';
// import { TableForm } from '../ongoing-casedata-errands.component';
// import { CasedataStatusLabelComponent } from './casedata-status-label.component';
// import dayjs from 'dayjs';
// import { globalAcknowledgeCasedataNotification } from '@casedata/services/casedata-notification-service';
// import { sortBy } from '@common/services/helper-service';

import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, Input, Pagination, Select, Table } from '@sk-web-gui/react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { TableForm } from '../ongoing-errands.component';

export const ErrandsTable: React.FC = () => {
  const { watch, setValue, register } = useFormContext<TableForm>();
  //   const { municipalityId, errands: data } = useAppContext();
  const [rowHeight, setRowHeight] = useState<string>('normal');
  //  const sortOrder = watch('sortOrder');
  //  const sortColumn = watch('sortColumn');
  const totalPages = watch('totalPages');
  const page = watch('page');

  // const { theme } = useGui();
  //   // const isMobile = useMediaQuery(`screen and (max-width: ${theme.screens.md})`);

  // const sortOrders: { [key: string]: 'ascending' | 'descending' } = {
  //   asc: 'ascending',
  //   desc: 'descending',
  // }

  // const handleSort = (index: number) => {
  //     if (sortColumn === serverSideSortableColsMEX[index]) {
  //       setValue('sortOrder', sortOrder === 'desc' ? 'asc' : 'desc');
  //     } else {
  //       setValue('sortColumn', serverSideSortableColsMEX[index]);
  //     }
  //   };

  const handleClick = async () => {
    //window.open(`${process.env.NEXT_PUBLIC_BASEPATH}/arende/${municipalityId}/${errand.errandNumber}`, '_blank');
  };

  //   const findLatestNotification = (errand: IErrand) => {
  //     return sortBy(errand?.notifications, 'created').reverse()[0];
  //   };

  const headers = () => {
    return (
      <Table.HeaderColumn key={`header-${1}`} sticky={undefined}>
        <Table.SortButton isActive={true} sortOrder={null} onClick={undefined}></Table.SortButton>
      </Table.HeaderColumn>
    );
  };

  const rows = () => {
    // const notification = findLatestNotification(errand);
    return (
      <Table.Row
        key={`row-${2}`}
        aria-label={`Ärende ${123}, öppna ärende i ny flik`}
        onClick={() => handleClick()}
        className="cursor-pointer"
      >
        <Table.HeaderColumn
          scope="row"
          className={'w-[200px] whitespace-nowrap text-ellipsis table-caption'}
        ></Table.HeaderColumn>
        <Table.Column></Table.Column>
        <Table.Column
          scope="row"
          className={'font-bold max-w-[190px] whitespace-nowrap overflow-x-hidden'}
        ></Table.Column>
        <Table.Column>{123}</Table.Column>
        <Table.Column></Table.Column>

        <Table.Column></Table.Column>

        <Table.Column>
          <time dateTime={'123'}>{123}</time>
        </Table.Column>
        <Table.Column></Table.Column>

        <Table.Column></Table.Column>

        <Table.Column sticky>
          <div className="w-full flex justify-end">
            <NextLink
              href={`/arende/${2281}/${1}`}
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              data-icon={undefined}
              title={undefined}
            >
              <Button.Content rightIcon={<LucideIcon name="external-link" />}>
                <>
                  <span className="hidden md:inline">Hantera</span>
                  <LucideIcon className="inline md:hidden" name="pencil" />
                </>
              </Button.Content>
            </NextLink>
          </div>
        </Table.Column>
      </Table.Row>
    );
  };

  return (
    <div className="max-w-full overflow-x-hidden">
      {/* <div className="z-100 absolute top-0 bottom-0 left-0 right-0 bg-background-content opacity-50 w-full h-full flex items-center justify-center">
          <div>
            <Spinner size={4} />
          </div>
        </div> */}

      <Table data-cy="main-casedata-table" dense={rowHeight === 'dense'} aria-describedby="errandTableCaption">
        <>
          <Table.Header>
            {headers()}
            <Table.HeaderColumn sticky>
              <span className="sr-only">Hantera</span>
            </Table.HeaderColumn>
          </Table.Header>
          <Table.Body>{rows()}</Table.Body>
        </>

        <Table.Footer>
          <div className="sk-table-bottom-section sk-table-pagination-mobile">
            <label className="sk-table-bottom-section-label" htmlFor="paginationSelect">
              Sida:
            </label>
            <Select id="paginationSelect" size="sm" variant="tertiary" value={undefined} onSelectValue={undefined}>
              {totalPages &&
                Array.from(Array(totalPages).keys()).map((page) => (
                  <Select.Option key={`pagipage-${page}`} value={page}>
                    {page + 1}
                  </Select.Option>
                ))}
            </Select>
          </div>
          <div className="sk-table-bottom-section">
            <label className="sk-table-bottom-section-label" htmlFor="pageSize">
              Rader per sida:
            </label>
            <Input
              {...register('pageSize')}
              size="sm"
              id="pageSize"
              type="number"
              min={1}
              max={1000}
              className="max-w-[6rem]"
            />
          </div>
          <div className="sk-table-paginationwrapper">
            <Pagination
              showFirst
              showLast
              pagesBefore={1}
              pagesAfter={1}
              showConstantPages={true}
              fitContainer
              pages={totalPages}
              activePage={page + 1}
              changePage={(page) => {
                setValue('page', page - 1);
              }}
            />
          </div>
          <div className="sk-table-bottom-section">
            <label className="sk-table-bottom-section-label" htmlFor="rowHeight">
              Radhöjd:
            </label>
            <Select
              size="sm"
              id="rowHeight"
              variant="tertiary"
              onChange={(e) => setRowHeight(e.target.value)}
              value={rowHeight}
            >
              <Select.Option value="normal">Normal</Select.Option>
              <Select.Option value="dense">Tät</Select.Option>
            </Select>
          </div>
        </Table.Footer>
      </Table>
    </div>
  );
};
