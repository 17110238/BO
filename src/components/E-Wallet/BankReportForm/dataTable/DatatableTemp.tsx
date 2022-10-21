import DatatableHook from 'components/common/Datatable/DatatableHook';
import { MerchantAccount, stateWalletKYCEnum, WalletKYC } from 'models';
import React, { memo, useMemo } from 'react';
import {
  PaginationChangePage,
  PaginationChangeRowsPerPage,
} from 'react-data-table-component/dist/src/DataTable/types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Column } from 'react-table';
interface Props {
  data: WalletKYC[];
  onChangeRowsPerPage?: PaginationChangeRowsPerPage;
  onChangePage?: PaginationChangePage;
  getDataList: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
  onClickUpdate?: (id: WalletKYC) => React.MouseEventHandler<HTMLDivElement>;
  onClickReject?: (id: WalletKYC) => React.MouseEventHandler<HTMLDivElement>;
  onClickAcceptApproved?: (id: WalletKYC) => React.MouseEventHandler<HTMLDivElement>;
}

const objectTemp = [
  'Số lượng giao dịch xử lý thành công',
  'Giá trị giao dịch xử lý thành công',
  'Số lượng giao dịch xử lý không thành công',
  'Giá trị giao dịch xử lý không thành công',
];

const DatatableIsecManager: React.FC<Props> = ({
  data,
  getDataList,
  onClickUpdate,
  onClickReject,
  onClickAcceptApproved,
  ...rest
}) => {
  const { t } = useTranslation('common');
  const lang = localStorage.getItem('NEXT_LOCALE');
  const loading = useSelector<any, boolean>((state) => state?.merchantRD?.loading);

  const generateStateMC = (state?: stateWalletKYCEnum) => {
    if (!state) return '';

    switch (state) {
      case stateWalletKYCEnum.AUTO_APPROVED:
        return 'state-cancel';
      case stateWalletKYCEnum.MANUAL_APPROVED:
        return 'state-success';
      default:
        break;
    }
  };

  const handleErrorImage: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const target = e.target as HTMLImageElement;

    target.src = '/assets/images/img-na.png';
    target.onerror = null;
  };

  const columns: Column<MerchantAccount>[] = useMemo(
    () => [
      {
        id: '123',
        minWidth: 200,
        maxWidth: 200,
        accessor: (row: MerchantAccount, index: number) => {
          return <div>{objectTemp[index] || '-'}</div>;
        },
      },
      {
        id: '123456',
        Header: 'hehe',
        accessor: (row: MerchantAccount, index: number) => {
          return <div></div>;
        },
      },
      {
        id: '1234567',
        Header: 'hehe',
        accessor: (row: MerchantAccount, index: number) => {
          return <div></div>;
        },
      },
      {
        id: '1234568',
        Header: 'hehe',
        accessor: (row: MerchantAccount, index: number) => {
          return <div></div>;
        },
      },
      {
        id: '1234569',
        Header: 'hehe',
        accessor: (row: MerchantAccount, index: number) => {
          return <div></div>;
        },
      },
    ],

    [lang]
  );

  return (
    <div className='w-100 '>
      <DatatableHook columns={columns} data={[{}, {}, {}, {}]}></DatatableHook>
    </div>
  );
};

export default memo(DatatableIsecManager);
