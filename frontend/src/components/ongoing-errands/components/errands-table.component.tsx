import NextLink from 'next/link';
import { Badge, Button, cx, Input, Pagination, Select, SortMode, Table } from '@sk-web-gui/react';
import { useContext, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AppContext } from '@contexts/app-context-interface';
import { IErrand } from '@interfaces/errand';
import { CasedataStatusLabelComponent } from './casedata-status-label.component';
import { findStatusLabelForStatusKey, getCaseLabels, isErrandClosed } from '@services/casedata-errand-service';
import { TableForm } from '@utils/useOngoingCaseDataErrands';
import { Priority } from '@interfaces/priority';
import { FTCaseType } from '@interfaces/case-type';

export const ErrandsTable: React.FC = () => {
  const { watch, setValue, register } = useFormContext<TableForm>();
  const { municipalityId, errands: data } = useContext(AppContext);
  const [rowHeight, setRowHeight] = useState<string>('normal');
  const sortOrder = watch('sortOrder');
  const sortColumn = watch('sortColumn');
  const totalPages = watch('totalPages');
  const page = watch('page');

  const serverSideSortableColsPT: { [key: number]: string } = {
    0: 'status.statusType',
    1: 'caseType',
    2: 'errandNumber',
    3: 'priority',
    4: 'created',
    5: 'channel',
  };

  const sortOrders: { [key: string]: 'ascending' | 'descending' } = {
    asc: 'ascending',
    desc: 'descending',
  };

  const handleSort = (index: number) => {
    if (sortColumn === serverSideSortableColsPT[index]) {
      setValue('sortOrder', sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setValue('sortColumn', serverSideSortableColsPT[index]);
    }
  };

  const headers = data.labels.map((header, index) => (
    <Table.HeaderColumn key={`header-${index}`} sticky={header.sticky}>
      {header.screenReaderOnly ?
        <span className="sr-only">{header.label}</span>
      : header.sortable ?
        <Table.SortButton
          isActive={sortColumn === serverSideSortableColsPT[index]}
          sortOrder={sortOrders[sortOrder] as SortMode}
          onClick={() => handleSort(index)}
        >
          {header.label}
        </Table.SortButton>
      : header.label}
    </Table.HeaderColumn>
  ));

  const rows = (data.errands || []).map((errand: IErrand, index) => {
    const url = `${process.env.NEXT_PUBLIC_BASE_PATH}/arende/${municipalityId}/${errand.errandNumber}`;

    return (
      <Table.Row
        key={`row-${index}`}
        aria-label={`Ärende ${errand.errandNumber}, öppna ärende i ny flik`}
        onClick={() => {
          window.open(url, '_blank');
          return false;
        }}
        className="cursor-pointer hover:bg-gray-50"
      >
        <Table.HeaderColumn scope="row" className="w-[200px] whitespace-nowrap text-ellipsis table-caption">
          <CasedataStatusLabelComponent
            status={findStatusLabelForStatusKey(errand?.status?.statusType as string) as string}
          />
        </Table.HeaderColumn>

        <Table.Column scope="row" className="font-bold max-w-[190px] whitespace-nowrap overflow-x-hidden">
          {getCaseLabels()[errand.caseType as FTCaseType] ?? errand.caseType}
        </Table.Column>

        <Table.Column>
          <time dateTime={errand.created}>{errand.created}</time>
        </Table.Column>

        <Table.Column>
          <>
            <Badge
              className="w-[0.8rem] h-[0.8rem] mr-2"
              color={
                errand.priority === Priority.HIGH ? 'error'
                : errand.priority === Priority.MEDIUM ?
                  'warning'
                : 'vattjom'
              }
              rounded
            />
            {errand.priority}
          </>
        </Table.Column>

        <Table.Column>{errand.channel || ''}</Table.Column>

        <Table.Column sticky>
          <div className="w-full flex justify-end">
            <NextLink
              href={url}
              onClick={() => {
                return false;
              }}
              target="_blank"
              title="Visa ärende"
              className={cx(
                'no-underline sk-btn max-lg:sk-btn-icon sk-btn-sm bg-primary text-light-primary w-full hover:text-dark-secondary',
                rowHeight === 'normal' ? 'sk-btn-md' : 'sk-btn-sm',
                isErrandClosed(errand) ? 'sk-btn-secondary' : 'sk-btn-tertiary'
              )}
            >
              <Button.Content>
                <span className="hidden md:inline">Öppna</span>
              </Button.Content>
            </NextLink>
          </div>
        </Table.Column>
      </Table.Row>
    );
  });

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
            {headers}
            <Table.HeaderColumn sticky>
              <span className="sr-only">Hantera</span>
            </Table.HeaderColumn>
          </Table.Header>
          <Table.Body>{rows}</Table.Body>
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
