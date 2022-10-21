// import DataTableCustom from 'components/common/Datatable/DatatableCusTomv2';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import dayjs from 'dayjs';
import { EWalletManager, IsecEnum, PayloadSearchIsecManage } from 'models';
import numeral from 'numeral';
import React, { memo, useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';
import {
  PaginationChangePage,
  PaginationChangeRowsPerPage,
} from 'react-data-table-component/dist/src/DataTable/types';
import { useTranslation } from 'react-i18next';
interface Props {
  data: EWalletManager[];
  getDataList: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: PayloadSearchIsecManage;
    getList: (payload: PayloadSearchIsecManage) => void;
  };
}

const DatatableIsecManager: React.FC<Props> = ({ data, getDataList, ...rest }) => {
  const { t } = useTranslation('common');
  const lang = localStorage.getItem('NEXT_LOCALE');

  const generateStateMC = (state?: IsecEnum) => {
    if (!state) return '';

    switch (state) {
      case IsecEnum.CANCELED:
      case IsecEnum.EXPIRED:
      case IsecEnum.LOCKED:
        return 'state-cancel';
      case IsecEnum.USED:
      case IsecEnum.DONATE:
      case IsecEnum.DEPOSIT:
        return 'state-success';
      case IsecEnum.REQUESTING:
      case IsecEnum.PENDING:
        return 'state-refunded';
      default:
        break;
    }
  };

  const columns: TableColumn<EWalletManager>[] = useMemo(
    () => [
      {
        name: t('ID'),
        minWidth: '130px',
        cell: (row) => {
          return <div className='highlight-text'>{row?.id || '-'}</div>;
        },
      },
      {
        name: t('Code Prefix'),
        minWidth: '110px',
        cell: (row) => {
          return <div>{row?.isecCode || '-'}</div>;
        },
      },
      {
        name: t('Mệnh giá (VND)'),
        minWidth: '160px',
        right: true,
        cell: (row) => {
          return <div>{numeral(row.amount).format('0,0') || '-'}</div>;
        },
      },

      {
        name: t('Trạng thái'),
        minWidth: '130px',
        maxWidth: '180px',
        cell: (row) => {
          return <div className={generateStateMC(row?.state)}>{t(`${row?.state}`) || '-'}</div>;
        },
      },
      {
        name: t('TG tạo'),
        minWidth: '100px',
        maxWidth: '100px',
        cell: (row) => {
          return (
            <div>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</div>
          );
        },
      },
      {
        name: t('TG Sử dụng'),
        minWidth: '100px',
        maxWidth: '100px',
        cell: (row) => {
          return (
            <div>
              {row?.scratchedAt ? dayjs(row?.scratchedAt).format('HH:mm:ss DD/MM/YYYY') : '-'}
            </div>
          );
        },
      },
      {
        name: t('Tài khoản tạo'),
        minWidth: '150px',
        cell: (row) => {
          return <div>{row?.accountId || '-'}</div>;
        },
      },
      {
        name: t('Tài khoản sử dụng'),
        minWidth: '150px',
        cell: (row) => {
          return <div>{row?.donatedAccountId || '-'}</div>;
        },
      },
    ],

    [lang]
  );

  return (
    <div>
      <DataTableCustom
        dataList={data}
        columns={columns}
        t={t}
        getDataList={getDataList}
        isSorting={true}
        fixedHeader={true}
        {...rest}
      />
    </div>
  );
};

export default memo(DatatableIsecManager);
