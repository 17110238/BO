import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
// import DataTableCustom from 'components/common/Datatable/DatatableCusTomFooter';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import { LinkedBanksType } from 'models/linkedBanks';
import { useSelector } from 'react-redux';
import formatCurrency from 'utils/helpers/formatCurrency';
import Link from 'next/link';

interface Props {
  handleGetEwalletServiceReport?: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
  loading: boolean;
  data: any;
  sumData: any;
}

const ReportWalletServiceDatatable: FC<Props> = ({
  handleGetEwalletServiceReport,
  data,
  loading,
  sumData,
}) => {
  const { t } = useTranslation('common');

  const columns = useMemo(() => {
    const cl = [
      {
        name: 'Tên dịch vụ',
        sort: true,
        footer: 'Tổng',
        left: true,
        cell: (data: any) => {
          return <span>{data?.serviceName}</span>;
        },
      },
      {
        name: 'Số lượng User',
        sort: true,
        right: true,
        footer: formatCurrency(sumData.totalRequest),
        cell: (data: any) => {
          return <span>{formatCurrency(data?.totalRequestUser)}</span>;
        },
      },
      {
        name: 'App ID',
        right: true,
        footer: formatCurrency(sumData.totalApp),
        cell: (data: any) => {
          return (
            <Link
              href={`/vi-dien-tu/thong-ke-vi/dich-vu-vi/${data.appId}?name=${data.serviceName}`}>
              <a>{data?.appName}</a>
            </Link>
          );
        },
      },
      {
        name: 'Giá trị giao dịch',
        sort: true,
        right: true,
        footer: formatCurrency(sumData.totalTransactionValue),
        cell: (data: any) => {
          return <span>{formatCurrency(data?.transactionValue)}</span>;
        },
      },
      {
        name: 'Tổng thanh toán',
        sort: true,
        right: true,
        footer: formatCurrency(sumData.totalPayment),
        cell: (data: any) => {
          return <span>{formatCurrency(data?.totalPayment)}</span>;
        },
      },
      {
        name: 'Tổng phí',
        right: true,
        sort: true,
        footer: formatCurrency(sumData.totalFee),
        cell: (data: any) => {
          return <span>{formatCurrency(data?.totalFee)}</span>;
        },
      },
    ];
    return cl;
  }, [t, sumData]);
  return (
    <DataTableCustom
      hasFooter
      isLoading={loading}
      columns={columns}
      className='data-table-custom'
      dataList={data}
      getDataList={handleGetEwalletServiceReport}
      t={t}
    />
  );
};

export default ReportWalletServiceDatatable;
