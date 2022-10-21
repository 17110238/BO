import { merchantTopIncomeType } from 'models/chartmerchant/chartmerchant';
import React, { memo, useMemo } from 'react'
import { Collapse } from 'react-bootstrap';
import DataTable, { TableColumn } from 'react-data-table-component'
import { useTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';
import LoadingInline from 'components/common/Loading/LoadingInline';
import { typeGetTopTransactionByAccountReponsed, typeGetTopTransactionByDate } from 'models'

interface TypeTopTransactionDataTableDefaultAmount {
  show: boolean;
  handleShow: () => void;
  data: typeGetTopTransactionByAccountReponsed[];
  loading: boolean;
}
const TopTransactionDataTableDefaultAmount = ({ show, handleShow, data, loading }: TypeTopTransactionDataTableDefaultAmount) => {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const { t } = useTranslation('common');
  const columns: TableColumn<typeGetTopTransactionByAccountReponsed>[] =useMemo(
    () => 

    [
      {
        minWidth: '150px',
        maxWidth: '200px',
        name: t('ID'),
        selector: row => row?.accountId,
        sortable: true,
       
        cell: (row) => row?.accountId,
      },
      {
        minWidth: '150px',
        maxWidth: '200px',
        name: t('Tên khách hàng '),
        selector: row => row?.fullname,
        sortable: true,
      
        cell: (row) => row?.fullname,
      },
      {
        name: t('Số GD'),
        sortable: true,
        right: true,
        selector: row => row?.count,
        cell: (row) => row?.count,
      },
      {
        name: t('Giá trị'),
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
    ],[lang,data]
  )
  return (
    <>
      <div className="table-content mt-2">
        <div className="table-header">
          <div className="table-header__title">
            <h2>{t("Khách hàng có GD lớn")}</h2>
          </div>
          <div className="table-header__show">
            <div className="show-icon">
              <button onClick={() => handleShow()} aria-controls="TopTransactionDataTableDefaultAmount" aria-expanded={show}>
                {show ?<i className="fas fa-times fa-lg"></i>: <i className="fas fa-plus fa-lg"></i>}</button>
            </div>
          </div>
        </div>
        <Collapse in={show}>
          <div >
            <div className={'border table-payment cls-datatable'} id="TopTransactionDataTableDefaultAmount" >
            {loading && <LoadingInline loading={loading}/>}
              <DataTable
                className='data-table-custom'
                columns={columns}
                data={data}
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

export default memo(TopTransactionDataTableDefaultAmount)