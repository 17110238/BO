import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LinkedBanksType } from 'models/linkedBanks';
import dayjs from 'dayjs';
import DataTableCustom from '../common/Datatable/DatatableCusTom';
import checkPermission from 'utils/helpers/checkPermission';
import { useSelector } from 'react-redux';

interface Props {
  handleGetLinkedBanks: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
  loading: boolean;
  data: LinkedBanksType[];
  onOpenModal: (item: any) => void;
}

interface scopeUserProps {
  scope: string[];
}

const LinkedBanksDatatable: FC<Props> = ({ handleGetLinkedBanks, data, loading, onOpenModal }) => {
  const { t } = useTranslation('common');
  const accountInfo = useSelector<any, scopeUserProps>((state) => state?.authReducers?.accountInfo);
  const checkUnlinkPermission = checkPermission(accountInfo?.scope, [
    'bo.ewalletAccount.unlinkBank',
  ]);

  const columns = useMemo(() => {
    const cl = [
      {
        name: 'ID',
        cell: (data: any) => {
          return <span>{data?.id}</span>;
        },
        sort: true,
        width: '120px',
      },
      {
        name: 'Mã tài khoản',
        sort: true,
        width: '130px',
        cell: (data: any) => {
          return <span>{data?.accountId}</span>;
        },
      },
      {
        name: 'Số điện thoại',
        sort: true,
        width: '130px',
        cell: (data: any) => {
          return <span>{data?.phone}</span>;
        },
      },
      {
        name: 'Tên ứng dụng',
        sort: true,
        width: '300px',
        cell: (data: any) => {
          return <span>{data?.appName}</span>;
        },
      },
      {
        name: 'Số thẻ',
        sort: true,
        width: '200px',
        cell: (data: any) => {
          return <span>{data?.cardInfo.cardNumber}</span>;
        },
      },
      {
        name: 'Tên chủ thẻ',
        sort: true,
        width: '130px',
        cell: (data: any) => {
          return <span>{data?.cardInfo.cardHolder}</span>;
        },
      },
      {
        name: 'Ngày phát hành',
        sort: true,
        width: '130px',
        cell: (data: any) => {
          return <span>{data?.cardInfo.issuedAt}</span>;
        },
      },
      {
        name: 'TG liên kết',
        sort: true,
        width: '130px',
        cell: (data: any) => {
          return <span>{dayjs(data?.linkedAt).format('HH:mm:ss DD-MM-YYYY')}</span>;
        },
      },
      {
        name: 'Mã ngân hàng',
        sort: true,
        width: '130px',
        cell: (data: any) => {
          return <span>{data?.cardInfo.bankCode}</span>;
        },
      },
      {
        name: 'Trạng thái',
        sort: true,
        width: '130px',
        cell: (data: any) => {
          return <span>{t(data?.state)}</span>;
        },
      },
      {
        name: 'Thao tác',
        sort: true,
        width: '150px',
        cell: (data: any) => {
          return (
            <>
              {data.state === 'LINKED' && checkUnlinkPermission && (
                <button onClick={() => onOpenModal(data)} className='btn btn-primary btn-search'>
                  <i className='fas fa-times'></i>
                  Hủy liên kết
                </button>
              )}
            </>
          );
        },
      },
    ];
    return cl;
  }, [t]);
  return (
    <DataTableCustom
      isLoading={loading}
      columns={columns}
      className='data-table-custom'
      dataList={data}
      isNotHaveTotalRows={true}
      getDataList={handleGetLinkedBanks}
      t={t}
    />
  );
};

export default LinkedBanksDatatable;
