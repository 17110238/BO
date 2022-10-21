import LoadingInline from 'components/common/Loading/LoadingInline';
import { typeGetTopTransactionByAccountReponsed, typeGetTopTransactionByDate } from 'models';
import { merchantTopIncomeType } from 'models/chartmerchant/chartmerchant';
import { useRouter } from 'next/router';
import React, { memo, useMemo } from 'react'
import { Collapse } from 'react-bootstrap';
import DataTable, { TableColumn } from 'react-data-table-component'
import { useTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
interface TypeTopTransactionDataTableAdvance {
  show: boolean;
  handleShow: () => void;
  data: typeGetTopTransactionByAccountReponsed[];
  loadingAccount: boolean;
}

const TopTransactionDataTableAdvance = ({ show, handleShow, data ,loadingAccount}: TypeTopTransactionDataTableAdvance) => {
  let url_string = window.location.href
  let url = new URL(url_string);
  let check = url.searchParams.get("typeSort");
  

  const lang = localStorage.getItem('NEXT_LOCALE');
  const { t } = useTranslation('common');
  let columnsFormat: TableColumn<typeGetTopTransactionByAccountReponsed>[] = []
  const columns: TableColumn<typeGetTopTransactionByAccountReponsed>[] = useMemo(
    () =>
      [
        {
          minWidth: '150px',
          name: t('ID'),
          selector: row => row?.accountId,
          sortable: true,

          cell: (row) => row?.accountId,
        },
        {
          minWidth: '150px',

          name: t('Tên khách hàng'),
          selector: row => row?.fullname,
          sortable: true,

          cell: (row) => row?.fullname,
        },
        {
          minWidth: '250px',
          name: t('Số GD'),
          sortable: true,
          right: true,
          selector: row => row?.count,
          cell: (row) => (
            <span>
              {
                <NumberFormat
                  value={row?.count}
                  className='foo'
                  displayType={'text'}
                  thousandSeparator={true}
                />
              }{' '}
              đ
            </span>
          ),
        },

      ],
    [lang]
  );
  const columnsSum: TableColumn<typeGetTopTransactionByAccountReponsed>[] = useMemo(
    () =>
      [
        {
          minWidth: '150px',

          name: t('ID'),
          selector: row => row?.accountId,
          sortable: true,

          cell: (row) => row?.accountId,
        },
        {
          minWidth: '150px',

          name: t('Tên khách hàng'),
          selector: row => row?.fullname,
          sortable: true,

          cell: (row) => row?.fullname,
        },

        {

          name: t('AVG'),
          minWidth: '250px',
          selector: row => row?.average,
          sortable: true,
          right: true,
          cell: (d) => (
            <span>
              {
                <NumberFormat
                  value={d?.average}
                  className='foo'
                  displayType={'text'}
                  thousandSeparator={true}
                />
              }{' '}
              đ
            </span>
          ),
        },
      ],
    [lang]
  );
  const columnsAgv: TableColumn<typeGetTopTransactionByAccountReponsed>[] = useMemo(
    () =>
      [
        {
          minWidth: '150px',
          name: t('ID'),
          selector: row => row?.accountId,
          sortable: true,
          cell: (row) => row?.accountId,
        },
        {
          minWidth: '150px',
          name: t('Tên khách hàng'),
          selector: row => row?.fullname,
          sortable: true,
          cell: (row) => row?.fullname,
        },
        {
          name: t('AVG'),
          minWidth: '250px',
          selector: row => row?.average,
          sortable: true,
          right: true,
          cell: 
            row => (
              <span>
                {
                  <NumberFormat
                    value={row?.average}
                    className='foo'
                    displayType={'text'}
                    thousandSeparator={true}
                  />
                }{' '}
                đ
              </span>
            ),
          
        },
      ],
    [lang]
  );
  const columnsCount: TableColumn<typeGetTopTransactionByAccountReponsed>[] = useMemo(
    () =>
      [
        {
          minWidth: '150px',
          name: t('ID'),
          selector: row => row?.accountId,
          sortable: true,
          cell: (row) => row?.accountId,
        },
        {
          minWidth: '150px',

          name: t('Tên khách hàng'),
          selector: row => row?.fullname,
          sortable: true,
          cell: (row) => row?.fullname,
        },
        {
          name: t('Số GD'),
          minWidth: '250px',
          sortable: true,
          right: true,
          selector: row => row?.count,
          cell: (row) =>  <span>
          {
            <NumberFormat
              value={row?.count}
              className='foo'
              displayType={'text'}
              thousandSeparator={true}
            />
          }
        </span> 
        },

      ],
    [lang]
  );
  const columnsMax: TableColumn<typeGetTopTransactionByAccountReponsed>[] = useMemo(
    () =>
      [
        {
          minWidth: '150px',

          name: t('ID'),
          selector: row => row?.accountId,
          sortable: true,
          cell: (row) => row?.accountId,
        },
        {
          minWidth: '150px',
          name: t('Tên khách hàng'),
          selector: row => row?.fullname,
          sortable: true,
          cell: (row) => row?.fullname,
        },

        {
          name: t('Max'),
          minWidth: '250px',
          selector: row => row?.max,
          sortable: true,
          right: true,
          cell: (d) => (
            <span>
              {
                <NumberFormat
                  value={d.max}
                  className='foo'
                  displayType={'text'}
                  thousandSeparator={true}
                />
              }{' '}
              đ
            </span>
          ),
        },

      ],
    [lang]
  );
  switch (check) {
    case "SUM":
      columnsFormat = columnsSum;
      break;
    case "MAX":
      columnsFormat = columnsMax;
      break;
    case "AVG":
      columnsFormat = columnsAgv;
      break;
    case "COUNT":
      columnsFormat = columnsCount;
      break;
    default:
      columnsFormat = columnsSum;
      break;
  }
  return (
    <>
      <div className="table-content ">
        <div className="table-header">
          <div className="table-header__title">
            <h2>{t("Thống kê nâng cao")}</h2>
          </div>
          <div className="table-header__show">

            <div className="show-icon">
              <button onClick={() => handleShow()} aria-controls="TopTransactionDataTableDefaultDay" aria-expanded={show}>
                {show ? <i className="fas fa-times"></i> : <i className="fas fa-plus fa-2xl"></i>}</button>
            </div>
          </div>
        </div>
        <Collapse in={show}>

          <div className={'border table-payment cls-datatable'} id="TopTransactionDataTableDefaultDay" >
            {loadingAccount && <LoadingInline loading={loadingAccount} />}
            <DataTable
              className='data-table-custom'
              columns={columnsFormat}
              data={data}
              noDataComponent={
                <>
                  <div className='d-flex justify-content-center align-items-center nodata' style={{height: "350px"}}>
                    <div className='d-flex flex-column'>
                      <img src='/assets/img/no-data.png' />
                      <p className='d-flex justify-content-center mt-3'>{t('No data')}</p>
                    </div>
                  </div>
                   {/* <div style={{ textAlign: 'center', alignItems: 'center', display: "flex", height: "350px", justifyContent: 'center' }}><h5>{t('Không có dữ liệu để hiển thị')}</h5></div> */}
                </>


              }
              fixedHeader
              fixedHeaderScrollHeight='300px'
              noHeader
              defaultSortAsc={false}
              highlightOnHover
            />
          </div>
        </Collapse>
      </div>

    </>
  )
}

export default memo(TopTransactionDataTableAdvance)