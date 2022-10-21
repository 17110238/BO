import { merchantTopIncomeType } from 'models/chartmerchant/chartmerchant';
import React, { memo, useMemo } from 'react'
import { Collapse } from 'react-bootstrap';
import DataTable, { TableColumn } from 'react-data-table-component'
import { useTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';
import LoadingInline from 'components/common/Loading/LoadingInline';
import { typeGetTopTransactionByAccountReponsed, typeGetTopTransactionByDate } from 'models'

interface TypeTopTransactionDataTableDefaultCount {
  show: boolean;
  handleShow: () => void;
  data: typeGetTopTransactionByAccountReponsed[];
  loading: boolean;
}
const TopTransactionDataTableDefaultCount = ({ show, handleShow, data, loading }: TypeTopTransactionDataTableDefaultCount) => {
  const dataFormatCount = data.sort((item1, item2) => {return  item2.count - item1.count})
  const lang = localStorage.getItem('NEXT_LOCALE');
  const { t } = useTranslation('common');
  const columns: TableColumn<typeGetTopTransactionByAccountReponsed>[] = useMemo(
    () => [
      {
        minWidth: '150px',
        maxWidth: '200px',
        selector: row => row?.accountId,
        sortable: true,
      
        name: t('ID'),
        cell: (row) => row?.accountId,
      },
      {
        minWidth: '150px',
        maxWidth: '200px',
        selector: row => row?.fullname,
        sortable: true,
      
        name: t('Tên khách hàng'),
        cell: (row) => row?.fullname,
      },
      {
        selector: row => row?.count,
        sortable: true,
        right: true,
        minWidth: '150px',
        name: t('Số GD'),
        cell: (row) => row?.count,
      },
      {
        name: t('Giá trị'),
        minWidth: '150px',
        selector: row => row?.amount,
        sortable: true,
        right: true,
        cell: (d) => (
          <span>
            {
              <NumberFormat
                value={d.amount}
                className='foo'
                displayType={'text'}
                thousandSeparator={true}
              />
            }{' '}
            đ
          </span>
        ),
      },
      // {
      //   maxWidth: '70px',
      //   minWidth: '80px',
      //   name: t('Tháng'),
      //   cell: (row) => row.month,
      // },
      // {
      //   maxWidth: '70px',
      //   minWidth: '70px',
      //   name: t('Năm'),
      //   cell: (row) => row.year,
      // },
    ],
    [lang]
  );
  return (
    <>
      <div className="table-content mt-2">
        <div className="table-header">
          <div className="table-header__title">
            <h2>{t("Khách hàng có số GD nhiều")}</h2>
          </div>
          <div className="table-header__show">

            <div className="show-icon">
            <button onClick={() => handleShow()} aria-controls="TopTransactionDataTableDefaultAmount" aria-expanded={show}>
                {show ?<i className="fas fa-times"></i> : <i className="fas fa-plus fa-2xl"></i>}</button>
            </div>
          </div>
        </div>
        <Collapse in={show}>
        <div>
     
            <div className={'border table-payment cls-datatable'} id="TopTransactionDataTableDefaultCount" >
            {loading && <LoadingInline loading={loading}/>}
              <DataTable
                className='data-table-custom'
                columns={columns}
                data={dataFormatCount}
                // noDataComponent={t("Không có dữ liệu để hiển thị")}
                noDataComponent={
                  <div className='d-flex justify-content-center align-items-center nodata' style={{height: "350px"}}>
                  <div className='d-flex flex-column'>
                    <img src='/assets/img/no-data.png' />
                    <p className='d-flex justify-content-center mt-3'>{t('No data')}</p>
                  </div>
                </div>
                }
                fixedHeader
                fixedHeaderScrollHeight='300px'
                noHeader
                highlightOnHover
              />
            </div>
            </div>
          </Collapse>

      </div>

    </>
  )
}

export default memo(TopTransactionDataTableDefaultCount)