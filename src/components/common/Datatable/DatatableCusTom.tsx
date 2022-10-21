import useWindowDimensions from 'hook/useWindowDimension';
import md5 from 'md5';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import {
  PaginationChangePage,
  PaginationChangeRowsPerPage,
  SortOrder,
} from 'react-data-table-component/dist/src/DataTable/types';
import { usePrevious } from 'utils/hooks';
import LoadingInline from '../Loading/LoadingInline';
import Nodata from '../NoData/Nodata';
import _ from 'lodash';

interface DataTableCustomProp {
  dataList: any;
  className?: string;
  isLoading?: boolean | any;
  isShowDisplayRowOption?: boolean;
  columns: any[];
  selectableRows?: boolean;
  title?: string;
  defaultColumn?: any;
  fixedHeader?: boolean;
  fixedHeaderScrollHeight?: string;
  t: (a: string) => string;
  nameDataTable?: string;
  isNotPaginationServer?: boolean;
  imageDataEmpty?: string;
  messageDataEmpty?: string;
  paginationTotalRows?: number;
  onSelectedRowsChange?: (state: any) => void;
  onChangeRowsPerPage?: PaginationChangeRowsPerPage;
  onChangePage?: PaginationChangePage;
  onRowSelected?: any;
  pagination?: boolean;
  defaultRowsPerPage?: number;
  selectableRowsVisibleOnly?: boolean;
  clearSelectedRows?: boolean;
  selectableRowDisabled?: (state: boolean) => boolean;
  getDataList?: (  // get data list
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
    submitForm?: boolean;
    setSubmitForm?: (a: boolean) => void;
  };
  isSorting?: boolean;
  isLimitData?: boolean;
  isNotHaveTotalRows?: boolean;
  isGetAllData?: boolean;
  isIndex?: boolean;
  indexLink?: string;
  hasFooter?: boolean;
  hidePagination?: boolean;
  rest?: any;
  csToolCheck?:boolean;
}

const DataTableCustom: React.FC<DataTableCustomProp> = ({
  dataList,
  columns,
  defaultColumn = [],
  isLoading = false,
  nameDataTable,
  className,
  fixedHeader,
  fixedHeaderScrollHeight,
  isGetAllData,
  isNotPaginationServer,
  isShowDisplayRowOption = true,
  imageDataEmpty,
  messageDataEmpty,
  paginationTotalRows,
  pagination = true,
  onChangePage,
  onChangeRowsPerPage,
  onRowSelected,
  defaultRowsPerPage = 20,
  getDataList,
  isSorting = false,
  isLimitData = false,
  isNotHaveTotalRows = false,
  isIndex = false, // thêm cột index vào đầu table
  indexLink = '',
  hasFooter = false,
  hidePagination, // ẩn section phân trang
  t,
  csToolCheck = false,
  ...rest
}) => {
  const [listCol, setListCol] = useState<any[]>([]);
  const firstUpdate = useRef(true);
  const divTableRef = useRef<HTMLDivElement>(null);

  let { payload, getList, submitForm, setSubmitForm } = (getDataList && getDataList()) || {};
  const { filter } = payload || {};
  const { width: screenWidth } = useWindowDimensions();
  const { from, to } = filter?.createdAt || {};
  const [tablePaging, setTablePaging] = useState<{
    start: number;
    limit: number;
  }>({ start: 0, limit: 21 });
  const [sortByDate, setSortByDate] = useState<any>(payload?.sort);
  const stringifyPayload = JSON.stringify(payload);
  const stringifyTablePaging = JSON.stringify(tablePaging);
  const stringifySorting = JSON.stringify(sortByDate);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const totalRow = dataList?.length;
  const dataListWithNoTotalRows =
    totalRow! > rowsPerPage ? dataList.slice(0, totalRow! - 1) : dataList;
  // const [dataListWithNoTotalRows, setDataListWithNoTotalRows] = useState<any[]>(totalRow! > rowsPerPage ? dataList.slice(0, totalRow! - 1) : dataList);
  const [dataListWithFooter, setDataListWithFooter] = useState<any[]>([]);
  const [oldPayload, setOldPayload] = useState<string>(stringifyPayload);
  const oldPayloadRef = useRef<string>(oldPayload);
  const [oldTablePaging, setOldtablePaging] = useState<string>(stringifyTablePaging);
  const oldTablePagingRef = useRef<string>(oldTablePaging);

  const [toggleColumn, setToggleColumn] = useState<any>(false);
  const router = useRouter();
  const [heightTable, setHeightTable] = useState<number>(0);
  const rectTable = useRef<number>();
  const [changeComponent, setChangeComponent] = useState<number>(0);
  const tableChange = document.getElementsByClassName('table-payment')[0]?.getBoundingClientRect();
  const [positionFooterTable, setPositionFooterTable] = useState<number>(0);
  const { refreshTable, disableFixHeight = false } = rest as any;

  if (isSorting) {
    payload = {
      ...payload,
      sort: stringifySorting && JSON.parse(stringifySorting),
    };
  }
  if (!to) {
    delete payload?.filter?.createdAt?.to;
  }
  if (!from && !to) {
    delete payload?.filter?.createdAt?.to;
    delete payload?.filter?.createdAt?.from;
  }

  useEffect(() => {
    if (!disableFixHeight) {
      const headerContainer = document.getElementsByClassName('header-top')[0]?.clientHeight;
      const footerContainer = document.getElementsByClassName('footer')[0]?.clientHeight;
      const pagination = document.getElementsByClassName('rdt_Pagination')[0]?.clientHeight;
      const rect = document.getElementsByClassName('table-payment')[0]?.getBoundingClientRect();
      const content = window.innerHeight - (headerContainer + footerContainer + 43);
      const headerContent = rect?.top - (headerContainer + 17);
      const table = content - (headerContent + pagination);
      rectTable.current = rect.top;
      if (table < 350) setHeightTable(350);
      else setHeightTable(table);
      setHeightTable(table);
    }
  }, [changeComponent, tableChange, disableFixHeight]);

  useEffect(() => {
    if (!disableFixHeight) {
      window.addEventListener('click', (e) => {
        const rect = document.getElementsByClassName('table-payment')[0]?.getBoundingClientRect();
        if (rect) {
          if (rect.top !== rectTable.current) {
            const isChange: number = changeComponent + 1;
            setChangeComponent(isChange);
          }
        }
      });
      return () => {
        window.removeEventListener('click', (e) => {
          setChangeComponent(0);
        });
      };
    }
  }, []);

  useEffect(() => {
    oldPayloadRef.current = oldPayload;
    oldTablePagingRef.current = oldTablePaging;
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    const result = {
      ...payload,
      paging: {
        start: 0,
        limit: rowsPerPage + 1,
      },
      sort: sortByDate,
    };

    submitForm && getList && getList(result);
  }, [submitForm]);

  useEffect(() => {
    const result = {
      ...payload,
      paging: tablePaging,
      sort: sortByDate,
    };
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    getList && getList(result);
  }, [tablePaging]);

  const getKeyDataTable = () => {
    var key = md5(nameDataTable ? nameDataTable : JSON.stringify(columns));
    return { data: localStorage.getItem(key) || null, key };
  };

  const handleChangeRowsPerPage = async (newRowsPerPage: number, page: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
    setTablePaging({
      ...tablePaging,
      start: 0,
      limit: ++newRowsPerPage,
    });
  };

  const handleChangePage = (page: number) => {
    setTablePaging({
      ...tablePaging,
      start: (page - 1) * tablePaging.limit,
    });
  };

  const handleChangePageWithNoTotalRows = (action: string) => {
    if (action === 'first-page') {
      setTablePaging({
        ...tablePaging,
        start: rowsPerPage,
        limit: tablePaging.limit,
      });
      setCurrentPage(1);
    }
    if (action === 'previous') {
      setTablePaging({
        ...tablePaging,
        start: (currentPage - 2) * rowsPerPage,
        limit: tablePaging.limit,
      });
      setCurrentPage((currentPage) => --currentPage);
    }
    if (action === 'next') {
      setTablePaging({
        ...tablePaging,
        start: currentPage * rowsPerPage,
        limit: tablePaging.limit,
      });
      setCurrentPage((currentPage) => ++currentPage);
    }
  };

  const handleSort = async (selectedColumn: any, sortDirection: SortOrder) => {
    const sortField = selectedColumn.sortField;
    if (sortDirection === 'asc') {
      setSortByDate({
        ...sortByDate,
        [sortField]: 1,
      }); // 'asc' === ascent (sort: 1)
    } else {
      setSortByDate({
        ...sortByDate,
        [sortField]: -1,
      }); // 'desc' === descent (sort: -1)
    }
  };

  const getKeyTableStyle = () => {
    let key = md5(router.route);
    return { data: localStorage.getItem(key) || false, key };
  };

  useEffect(() => {
    const dataTableCl = getKeyTableStyle();
    setToggleColumn(dataTableCl.data);
  }, []);

  useEffect(() => {
    const dataTableCl = getKeyTableStyle();
    localStorage.setItem(dataTableCl.key, toggleColumn);
  }, [toggleColumn, localStorage]);

  const toggleColumnView = () => {
    const dataTableCl: any = getKeyTableStyle();
    setToggleColumn(!JSON.parse(dataTableCl.data));
  };

  const onChangeCol = (e: ChangeEvent<HTMLInputElement>, key: number) => {
    const dataTableCl = getKeyDataTable();
    // console.log('dataTableCl', dataTableCl, e.target);
    const { checked } = e.target as HTMLInputElement;
    const arr: any[] = [...listCol];
    arr[key] = {
      ...arr[key],
      omit: !checked,
    };
    setListCol([...arr]);
    const arrCol: any[] = [];
    // [...arr].map(item => !item.omit)
    arr.map((item) => {
      if (item.name) arrCol.push({ name: item.name, isShow: !item.omit });
    });
    // console.log('arrCol', arrCol);
    // console.log('dataTableCl.key', dataTableCl.key, arrCol);
    localStorage.setItem(dataTableCl.key, JSON.stringify(arrCol));
  };

  const renderListCol = () => {
    return listCol.map((item, key) => {
      if (!item.name) return null;
      return (
        <div className='checkbox-theme-default custom-checkbox item-col' key={key}>
          <input
            className='checkbox'
            type='checkbox'
            id={'checkbox' + key}
            onChange={(e) => onChangeCol(e, key)}
            checked={item?.omit ? false : true}
            hidden
          />
          <label htmlFor={'checkbox' + key}>
            <span className='checkbox-text'>{t(item?.name)}</span>
          </label>
        </div>
      );
    });
  };

  const renderPaginationComponent = useMemo(
    () => ({
      rowsPerPageText: `${t('Rows per page')}:`,
      rangeSeparatorText: t('of'),
      noRowsPerPage: false,
      selectAllRowsItem: false,
      selectAllRowsItemText: t('All'),
    }),
    [t]
  );

  const generateCell = (item: { name: string; cell: any; footer?: any; footerName?: string }) => {
    const cloneCell = item?.cell;

    return (row: any, index: number, column: any, id: number | string) => {
      if (item?.footer && index === dataListWithFooter.length - 1) {
        return (
          <>
            {item && item.footerName && (
              <b className='data-table-label' style={{ marginRight: '8px', display: 'none' }}>
                {item?.footerName}:
              </b>
            )}
            <div className='d-flex font-weight-bold'>
              {typeof item?.footer === 'function'
                ? item?.footer(row, index, column, id)
                : item?.footer}
            </div>
          </>
        );
      }
      return (
        <>
          {item && item.name && (
            <b className='data-table-label' style={{ marginRight: '8px', display: 'none' }}>
              {item?.name}:
            </b>
          )}
          <div className='d-flex'>{cloneCell && cloneCell(row, index, column, id)}</div>
        </>
      );
    };
  };

  useEffect(() => {
    if (!hasFooter) {
      const dataTableCl = getKeyDataTable();

      if (!dataTableCl.data) {
        const arrCol: any[] = [];
        let arr = [...columns];

        arr.map((item, index) => {
          // custom cell
          item.cell = generateCell(item);
          if (item.name) {
            let isShowCL = true;
            if (defaultColumn.length > 0) {
              isShowCL = defaultColumn.find((i: any) => i === item.name) ? true : false;
            }
            arr[index] = { ...item, omit: !isShowCL };
            arrCol.push({ name: item.name, isShow: isShowCL });
          }
        });
        localStorage.setItem(dataTableCl.key, JSON.stringify(arrCol));

        setListCol([...arr]);
      } else {
        const dataOmitCl = JSON.parse(dataTableCl.data);
        let arr = [...columns].map((item, index) => {
          // custom cell
          item.cell = generateCell(item);

          const find = dataOmitCl.find((i: any) => i.name === item.name);

          if (find) {
            return { ...item, omit: !find.isShow };
          }
          return { ...item, omit: false };
        });
        setListCol([...arr]);
      }
    }
  }, [localStorage, t]);

  useEffect(() => {
    if (!hasFooter) return;
    const dataTableCl = getKeyDataTable();

    if (!dataTableCl.data) {
      const arrCol: any[] = [];
      let arr = [...columns];

      arr.map((item, index) => {
        // custom cell
        item.cell = generateCell(item);
        if (item.name) {
          let isShowCL = true;
          if (defaultColumn.length > 0) {
            isShowCL = defaultColumn.find((i: any) => i === item.name) ? true : false;
          }
          arr[index] = { ...item, omit: !isShowCL };
          arrCol.push({ name: item.name, isShow: isShowCL });
        }
      });
      localStorage.setItem(dataTableCl.key, JSON.stringify(arrCol));

      setListCol([...arr]);
    } else {
      const dataOmitCl = JSON.parse(dataTableCl.data);
      let arr = [...columns].map((item, index) => {
        // custom cell
        item.cell = generateCell(item);

        const find = dataOmitCl.find((i: any) => i.name === item.name);

        if (find) {
          return { ...item, omit: !find.isShow };
        }
        return { ...item, omit: false };
      });
      setListCol([...arr]);
    }
  }, [localStorage, t, columns]);

  useEffect(() => {
    if (dataListWithFooter) {
      const pagination = document
        .getElementsByClassName('rdt_Pagination')[0]
        ?.getBoundingClientRect();
      setPositionFooterTable(pagination?.top - 48);
    }
  }, [dataListWithFooter]);

  useEffect(() => {
    if (dataList && hasFooter) {
      const existsFooter = !!columns.filter((column) => column.footer).length;
      const newDataList =
        dataList?.length! > rowsPerPage ? dataList.slice(0, totalRow! - 1) : dataList;
      if (
        existsFooter &&
        newDataList?.length &&
        Object.keys(newDataList[newDataList?.length - 1]).length
      ) {
        setDataListWithFooter([...newDataList, {}]);
      } else {
        setDataListWithFooter(newDataList);
      }
    }
  }, [dataList]);

  return (
    <div
      ref={divTableRef}
      className={`table-payment cls-datatable  ${isGetAllData && 'hide-total-row'} ${className}
        ${JSON.parse(toggleColumn) ?  `${csToolCheck ? 'datatable-vertical datatable-cstool' : "datatable-vertical"}` : ''} ${
        hasFooter ? 'datatable-fix-footer' : ''
      } ${hidePagination ? 'hide-pagination' : ''}`}
      style={
        {
          '--data-bottom': `${positionFooterTable}px`,
          '--data-width': `${divTableRef?.current?.offsetWidth}px`,
        } as React.CSSProperties
      }>
      <LoadingInline loading={isLoading || false} />
      <DataTable
        striped
        noHeader
        pagination={true}
        highlightOnHover
        customStyles={{
          table: {
            style: {
              minHeight: `${heightTable}px`,
            },
          },
        }}
        columns={
          isIndex
            ? [
                {
                  name: t('STT'),
                  minWidth: '60px',
                  maxWidth: '80px',
                  cell: (row, index) => (
                    <span
                      className={`${indexLink ? 'text-link' : ''}`}
                      onClick={() => (indexLink ? router.push(indexLink) : undefined)}>
                      {tablePaging.start + index + 1}
                    </span>
                  ),
                },
                ...listCol,
              ]
            : listCol
        }
        data={isGetAllData ? dataList : !hasFooter ? dataListWithNoTotalRows : dataListWithFooter}
        className='data-table-custom'
        paginationServer={isNotPaginationServer ? false : true}
        fixedHeader={true}
        fixedHeaderScrollHeight={!disableFixHeight ? `${heightTable}px` : fixedHeaderScrollHeight}
        noDataComponent={
          <Nodata imageDataEmpty={imageDataEmpty} messageDataEmpty={messageDataEmpty} />
        }
        paginationTotalRows={totalRow || 0}
        paginationPerPage={rowsPerPage || 20}
        paginationComponentOptions={renderPaginationComponent}
        onRowClicked={onRowSelected}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        onChangePage={handleChangePage}
        onSort={handleSort}
        paginationIconFirstPage={<></>}
        paginationIconLastPage={<></>}
        paginationIconPrevious={<></>}
        paginationIconNext={<></>}
        {...rest}
      />

      {dataListWithNoTotalRows?.length > 0 && (
        <div className={`${hidePagination ? 'd-none' : ''}`}>
          <div className='page-wrapper'>
            <p>Trang: {currentPage}</p>
          </div>
          <div className='pagination-btn-wrapper'>
            <button
              className='btn'
              onClick={() => handleChangePageWithNoTotalRows('previous')}
              disabled={currentPage === 1 || isLoading}>
              <i className='fas fa-angle-left'></i>
            </button>
            <button
              className='btn'
              onClick={() => handleChangePageWithNoTotalRows('next')}
              disabled={totalRow! <= rowsPerPage || isLoading}>
              <i className='fas fa-angle-right'></i>
            </button>
          </div>
        </div>
      )}

      {isShowDisplayRowOption && dataList?.length > 0 && (
        <div className='show-hide-col'>
          <Dropdown>
            <Dropdown.Toggle id='dropdown-button-drop-up'>
              <i className='fas fa-list'></i>
              <div>{t('Display options')}</div>
              <div className='icon-up'>
                <i className='fas fa-caret-up'></i>
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ overflowY: 'scroll', maxHeight: 400 }}>
              {renderListCol()}
            </Dropdown.Menu>
            <button
              className='btn btn-primary btn-hover__push ml-3 d-flex justify-content-center'
              style={{ padding: '8px', borderRadius: '8px' }}
              onClick={toggleColumnView}>
              <img src='/assets/img/grid.svg' alt='toggle' />
            </button>
          </Dropdown>
        </div>
      )}
    </div>
  );
};

export default DataTableCustom;
