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
import NumberFormat from 'react-number-format';

const DataTableDesposit = ({ data, handleDelete, handleEditAmount, handleEditNote }: any) => {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const { t } = useTranslation('common');
  const columns: TableColumn<AccountantCrossCheck>[] = useMemo(
    () => [
      {
        name: t('Mã giao dịch'),
        minWidth: '150px',
        maxWidth: '150px',
        cell: (row) => <span className='text-link'>{row?.transaction}</span>,
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
        minWidth: '115px',
        maxWidth: '130px',
      },
      {
        name: t('Số tạm tính'),
        cell: (row) => <span style={{ fontWeight: 700 }}>{formatCurrency(row?.amount)} đ</span>,
        minWidth: '250px',
        maxWidth: '270px',
      },
      {
        name: t('Số đối soát'),
        minWidth: '250px',
        maxWidth: '270px',
        cell: (row) => {
          return (
            <span style={{ fontWeight: 700 }}>
              {
                <NumberFormat
                  thousandsGroupStyle='thousand'
                  value={row?.amountEdit}
                  maxLength={15}
                  decimalSeparator='.'
                  className={`form-control`}
                  displayType='input'
                  type='text'
                  onValueChange={(value) => handleEditAmount(value, row)}
                  //  onValueChange={(value) => { console.log('row', row); console.log('row', value.floatValue) }}
                  thousandSeparator={true}
                  allowNegative={true}
                />
              }
            </span>
          );
        },
      },
      {
        name: t('Ghi chú'),
        cell: (row) => (
          <span>
            {
              <textarea
                className={`form-control `}
                style={{ fontSize: '12px', minHeight: '90px' }}
                value={row?.note}
                placeholder='Nhập lý do thay đổi'
                onChange={() => handleEditNote(event, row)}
              />
            }
          </span>
        ),
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
        minWidth: '200px',
        maxWidth: '220px',
      },
      {
        name: t('Mã giao dịch ngân hàng/Ví'),
        cell: (row) => <span>{row?.isTransferWeekend}</span>,
        minWidth: '125px',
        maxWidth: '140px',
      },
      {
        name: t('TG tạo'),
        minWidth: '170px',
        maxWidth: '200px',
        cell: (row) => {
          return (
            <span>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : ''}</span>
          );
        },
      },
      {
        name: t('TG chuyển tiền'),
        minWidth: '170px',
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
          return (
            <>
              <button
                className='btn  btn-danger'
                style={{ minWidth: '70px', margin: '0px' }}
                onClick={() => handleDelete(row?.transaction)}>
                <i className='fa fa-trash'></i>
                {t('Xóa')}
              </button>
            </>
          );
        },
      },
    ],
    [lang]
  );
  const crossCheckList = useSelector<any, AccountantCrossCheck[]>(
    (state) => state?.crossCheckReducer?.dataCrossCheck
  );
  const dataFormat = crossCheckList?.map((iteam) => ({
    ...iteam,
    isOutOfStock: iteam?.state === 'PENDING' ? false : true,
  }));
  return (
    <div className='border table-payment cls-datatable2 ' >
      <DataTable
        columns={columns}
        data={data}
        fixedHeader={true}
        noDataComponent={
          <div
            style={{
              textAlign: 'center',
              alignItems: 'center',
              display: 'flex',
              minHeight: '65vh',
              height: 'auto',
              justifyContent: 'center',
            }}>
            <h5>{t('Vui lòng chọn ít nhất 1 giao dịch đang trong trạng thái chờ thanh toán !')}</h5>
          </div>
        }
        fixedHeaderScrollHeight='635px'
      />
    </div>
  );
};

export default DataTableDesposit;
