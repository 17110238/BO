import { merchantTopIncomeType } from 'models/chartmerchant/chartmerchant';
import React, { memo, useMemo } from 'react';
import { Collapse } from 'react-bootstrap';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';
import LoadingInline from 'components/common/Loading/LoadingInline';

import { typeGetTopTransactionByAccountReponsed, typeGetTopTransactionByDate } from 'models';
import dayjs from 'dayjs';
interface TypeTopTransactionDataTableDefaultDay {
  show: boolean;
  handleShow: () => void;
  data: typeGetTopTransactionByDate[];
  loading: boolean;
}

const TopTransactionDataTableDefaultDay = ({
  show,
  handleShow,
  data,
  loading,
}: TypeTopTransactionDataTableDefaultDay) => {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const { t } = useTranslation('common');
  const dataa = [
    { merchantId: 986933, merchantTitle: 'SỮA ÔNG THỌ', count: 2, amount: 700000, total: 695800 },
    { merchantId: 779493, merchantTitle: 'Phan Minh Tri', count: 2, amount: 100000, total: 99615 },
    { merchantId: 22, merchantTitle: 'Phi Zu', count: 1, amount: -10000, total: -10000 },
    { merchantId: 556705, merchantTitle: 'Mai Dương Tài', count: 2, amount: -10000, total: -10077 },
  ];

  const columns: TableColumn<typeGetTopTransactionByDate>[] = useMemo(
    () => [
      //   location(pin):"Tỉnh Khánh Hòa"
      // count(pin):72
      // amount(pin):18369778
      // {
      //   name: 'ID',
      //   minWidth: '30px',
      //   maxWidth: '40px',
      //   cell: (row, index) => <div className='position-relative w-100'>{index}</div>,
      // },
      {
        minWidth: '150px',
        maxWidth: '200px',
        selector: (row) => dayjs(row?.date).format('HH:mm:ss DD/MM/YYYY'),
        sortable: true,

        name: t('Ngày'),
        cell: (row) => dayjs(row?.date).format('HH:mm:ss DD/MM/YYYY'),
      },
      {
        selector: (row) => row?.count,
        sortable: true,
        right: true,
        name: t('Số GD'),
        cell: (row) => row?.count,
      },
      {
        selector: (row) => row?.amount,
        sortable: true,
        right: true,
        name: t('Giá trị'),
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
      <div className='table-content mt-2'>
        <div className='table-header'>
          <div className='table-header__title'>
            <h2>{t('Ngày có giá Trị GD lớn')}</h2>
          </div>
          <div className='table-header__show'>
            <div className='show-icon'>
              <button
                onClick={() => handleShow()}
                aria-controls='TopTransactionDataTableDefaultDay'
                aria-expanded={show}>
                {show ? <i className='fas fa-times'></i> : <i className='fas fa-plus fa-2xl'></i>}
              </button>
            </div>
          </div>
        </div>
        <Collapse in={show}>
          <div
            className={'border table-payment cls-datatable'}
            id='TopTransactionDataTableDefaultDay'>
            {loading && <LoadingInline loading={loading} />}

            <DataTable
              className='data-table-custom'
              columns={columns}
              data={data}
              // noDataComponent={t("Không có dữ liệu để hiển thị")}
              noDataComponent={
                <div
                  className='d-flex justify-content-center align-items-center nodata'
                  style={{ height: '350px' }}>
                  <div className='d-flex flex-column'>
                    <img src='/assets/img/no-data.png' />
                    <p className='d-flex justify-content-center mt-3'>{t('No data')}</p>
                  </div>
                </div>
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
  );
};

export default memo(TopTransactionDataTableDefaultDay);
