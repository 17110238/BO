import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import dayjs from 'dayjs';
import _ from 'lodash';
import { EwalletTransactionBank, PayloadListEwalletBankTransaction } from 'models';
import dynamic from 'next/dynamic';
import numeral from 'numeral';
import React, { memo, useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
const ReactJson = dynamic(import('react-json-view'), { ssr: false });
interface Props {
  data: EwalletTransactionBank[];
  getDataList: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: PayloadListEwalletBankTransaction;
    getList: (payload: PayloadListEwalletBankTransaction) => void;
  };
}

const DatatableApprovalMerchant: React.FC<Props> = ({ data, getDataList, ...rest }) => {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const { t } = useTranslation('common');

  const generateStateMC = (state?: string) => {
    if (!state) return '';

    switch (state) {
      case 'FAIL':
        return 'state-cancel';
      case 'SUCCESS':
        return 'state-success';
      default:
        break;
    }
  };

  const columns: TableColumn<EwalletTransactionBank>[] = useMemo(
    () => [
      {
        name: t('Mã giao dịch'),
        minWidth: '180px',
        cell: (row) => {
          return <div>{row?.transactionId || '-'}</div>;
        },
      },
      {
        name: t('Mã yêu cầu'),
        minWidth: '150px',
        cell: (row) => {
          try {
            return <div>{_.get(JSON.parse(row?.supplierResponse!), 'order.id') || '-'}</div>;
          } catch (error) {
            return <div>{'-'}</div>;
          }
        },
      },
      {
        name: t('Số điện thoại'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{row?.phone || '-'}</div>;
        },
      },
      {
        name: t('Phí (VND)'),
        minWidth: '180px',
        right: true,
        cell: (row) => {
          return <div>{numeral(row?.feeAmount).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Số tiền (VND)'),
        minWidth: '180px',
        right: true,
        cell: (row) => {
          return <div>{numeral(row?.transactionAmount).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Loại giao dịch'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{row?.transactionType || '-'}</div>;
        },
      },
      {
        name: t('Trạng thái'),
        minWidth: '150px',
        cell: (row) => {
          return (
            <div className={generateStateMC(row?.status)}>
              {t(`TRANS_BANK_${row?.status}`) || '-'}
            </div>
          );
        },
      },
      {
        name: t('Nội dung'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{row?.content || '-'}</div>;
        },
      },
      {
        name: t('Mã GD nhà cung cấp'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{row?.supplierTransactionId || '-'}</div>;
        },
      },
      {
        name: t('Thời điểm GD'),
        minWidth: '120px',
        maxWidth: '130px',
        cell: (row) => {
          return (
            <div>
              {row?.transactionTime
                ? dayjs(row?.transactionTime).format('HH:mm:ss DD/MM/YYYY')
                : '-'}
            </div>
          );
        },
      },
      {
        name: t('Tên ngân hàng'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{row?.supplierName}</div>;
        },
      },
      {
        name: t('Tải khoản ngân hàng'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{row?.supplierAccountNumber || '-'}</div>;
        },
      },
      {
        name: t('Mô tả'),
        minWidth: '300px',
        cell: (row) => {
          return <div>{row?.description || '-'}</div>;
        },
      },

      {
        name: t('Phản hồi'),
        minWidth: '400px',
        cell: (row) => {
          try {
            return (
              <ReactJson
                collapsed
                displayDataTypes={false}
                name='value'
                src={JSON.parse(row?.supplierResponse || '{}')}></ReactJson>
            );
          } catch (error) {
            return <div>{row?.supplierResponse || '-'}</div>;
          }
        },
      },
    ],

    [lang]
  );

  return (
    <div className='mt-3'>
      <DataTableCustom
        dataList={data}
        columns={columns}
        t={t}
        nameDataTable='colApprovalMerchant'
        className='approval-merchant-table'
        getDataList={getDataList}
        isSorting={true}
        fixedHeader={true}
        {...rest}
      />
    </div>
  );
};

export default memo(DatatableApprovalMerchant);
