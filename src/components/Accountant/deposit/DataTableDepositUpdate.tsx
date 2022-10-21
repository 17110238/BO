import React, { useMemo } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useSelector } from 'react-redux';
import { AccountantCrossCheck } from 'models';
import { renderStatusAccountant } from 'constants/Status';
import renderState from 'constants/State';
import renderMethod from 'constants/Paymentmethod';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import formatCurrency from 'utils/helpers/formatCurrency';
import numeral from 'numeral';

const DataTableDespositUpdate = ({ data }: any) => {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const { t } = useTranslation('common');
  const columns: TableColumn<AccountantCrossCheck>[] = useMemo(
    () => [
      {
        name: t('Mã giao dịch'),
        minWidth: '150px',
        maxWidth: '150px',
        cell: (row) => <span>{row?.transaction}</span>,
      },
      {
        name: t('Tài khoản MC'),
        minWidth: '110px',
        maxWidth: '130px',
        cell: (row) => <span>{row?.username}</span>,
      },
      {
        name: t('Tên MC'),
        cell: (row) => <span>{row?.merchantName}</span>,
      },
      {
        name: t('TK NHận TT'),
        cell: (row) => <span>{row?.receiveAccount?.accountName}</span>,
      },
      {
        name: t('Số GD'),
        cell: (row) => <span className='color-payme'>{row?.totalTransaction}</span>,
        minWidth: '50px',
        maxWidth: '90px',
      },
      {
        name: t('Số tạm tính'),
        cell: (row) => <span>{formatCurrency(row?.amount)} đ</span>,
        minWidth: '115px',
        maxWidth: '130px',
      },
      {
        name: t('Số đối soát'),
        cell: (row) => <span>{formatCurrency(row?.amountCrossCheck)} đ</span>,
        minWidth: '115px',
        maxWidth: '130px',
      },
      {
        name: t('Ghi chú'),
        cell: (row) => <span>{row?.note}</span>,
        minWidth: '150px',
        maxWidth: '160px',
      },
      {
        name: t('Trạng Thái'),
        cell: (row) => (
          <>
            <span className={`${renderStatusAccountant(row?.state)}`}>
              {t(renderState(row?.state))}
            </span>
          </>
        ),
        minWidth: '150px',
        maxWidth: '160px',
      },
      {
        name: t('Hình thức đối sót'),
        cell: (row) => <span>{row?.type}</span>,
        minWidth: '70px',
        maxWidth: '90px',
      },
      {
        name: t('Hạn mục đối soát'),
        cell: (row) => (
          <span>
            {
              row?.crossCheckMethod
              // row?.crossCheckMethod?.map((item, id) => { return renderMethod(item) })?.join('; ')
            }
          </span>
        ),
        minWidth: '130px',
        maxWidth: '150px',
      },
      {
        name: t('Mã giao dịch ngân hàng/Ví'),
        cell: (row) => <span>{row?.isTransferWeekend}</span>,
        minWidth: '125px',
        maxWidth: '140px',
      },

      {
        name: t('TG tạo'),
        minWidth: '140px',
        maxWidth: '200px',
        cell: (row) => {
          return (
            <span>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : ''}</span>
          );
        },
      },
      {
        name: t('TG hoàn thành'),
        minWidth: '140px',
        maxWidth: '200px',
        cell: (row) => {
          return (
            <span>
              {row?.finishedAt ? dayjs(row?.finishedAt).format('HH:mm:ss DD/MM/YYYY') : ''}
            </span>
          );
        },
      },

      {
        name: t('Thao tác'),
        center: true,
        minWidth: '80px',
        maxWidth: '80px',
        cell: (row) => {
          return <></>;
        },
      },
    ],
    [lang]
  );
  // const crossCheckList = useSelector<any, AccountantCrossCheck[]>(
  //     (state) => state?.crossCheckReducer?.dataCrossCheck
  // );
  // const dataFormat = crossCheckList?.map((iteam) => ({ ...iteam, isOutOfStock: iteam?.state === 'PENDING' ? false : true }))
  return (
    <div className='border table-payment cls-datatable3'>
      <DataTable
        columns={columns}
        data={data}
        defaultSortFieldId={1}
        fixedHeader={true}
        fixedHeaderScrollHeight='635px'
      />
    </div>
  );
};

export default DataTableDespositUpdate;
