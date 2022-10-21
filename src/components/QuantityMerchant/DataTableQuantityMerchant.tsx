
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import ReportSystemContainer from './ReportSystemContainer';
interface Props {
  t?: any;
  data?: [] | undefined | any;
  totalFilter?: number;
  onRowSelected?: any;
  getDataList?: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
  setSubmitForm?: (a: boolean) => void;
  heightBoxSearch?: number;
  rest?: any;
  loading?: any;
}
interface MerchantType {
  id: number;
  title: String;
  operator: String;
  phone: String;
  merchantType: String;
  category: String;
  approvedAt: any;
  createdAt: any;
  updatedAt: any;
  state: String;
}
const DataTableQuantityMerchant: React.FC<Props> = ({
  t,
  getDataList,
  data,
  totalFilter,
  loading,
  ...rest
}) => {
  const [isShowFilter, setIsShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setIsShowFilter(!isShowFilter);
  const columns: TableColumn<MerchantType>[] = [
    {
      name: t('MerchantId'),
      minWidth: '105px',
      maxWidth: '130px',
      cell: (row) => <span onClick={() => { }}>{row?.id}</span>,
    },

    {
      name: t('Tên merchant'),
      minWidth: '140px',
      maxWidth: '140px',
      cell: (row) => <span>{row?.title ? row?.title : '-'}</span>,
    },
    {
      name: t('Nhân viên Sale'),
      minWidth: '105px',
      maxWidth: '150px',
      cell: (row) => <span onClick={() => { }}>{row?.operator}</span>,
    },
    {
      name: t('Số điện thoại'),
      cell: (row) => <span>{row?.phone}</span>,
      minWidth: '115px',
      maxWidth: '130px',
    },
    {
      name: t('Loại Merchant'),
      cell: (row) => <span>{row?.merchantType}</span>,
      minWidth: '115px',
      maxWidth: '130px',
    },
    {
      name: t('Lĩnh vực Kinh Doanh'),
      cell: (row) => <span className='color-payme'>{row?.category ? row?.category : '-'}</span>,
      minWidth: '205px',
      maxWidth: '230px',
    },

    {
      name: t('Thời gian tạo'),
      cell: (row) => (
        <span>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
      ),
      minWidth: '155px',
      maxWidth: '155px',
    },
    {
      name: t('Thời gian duyệt'),
      cell: (row) => (
        <span>{row?.approvedAt ? dayjs(row?.approvedAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
      ),
      minWidth: '155px',
      maxWidth: '155px',
    },
    {
      name: t('Thời gian cập nhật'),
      cell: (row) => (
        <span>{row?.updatedAt ? dayjs(row?.updatedAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
      ),
      minWidth: '155px',
      maxWidth: '155px',
    },
    {
      name: t('Trạng thái'),
      center: true,
      cell: (row) => {
        return (
          row?.state && (
            <div className='col-right text-right'>
              <span
                className={`${row?.state === 'APPROVING'
                  ? 'state-refunded-modal'
                  : row?.state === 'APPROVED' ||
                    row?.state === 'RECEIVED' ||
                    row?.state === 'USED' ||
                    row?.state === 'CLAIMED' ||
                    row?.state === 'AUTHORIZED' ||
                    row?.state === 'CONTRACT_SIGNED' ||
                    row?.state === 'CONTRACT'
                    ? 'state-success-modal'
                    : row?.state === 'PENDING' || row?.state === 'CONTRACT_APPROVING'
                      ? 'state-pending-modal'
                      : row?.state === 'CANCELED_SUCCEEDED'
                        ? 'state-cancel-modal'
                        : 'state-cancel-modal'
                  } `}>
                {row?.state && row?.state === 'APPROVING'
                  ? t('Chờ duyệt')
                  : row?.state === 'CONTRACT'
                    ? t('Ký kết hợp đồng')
                    : row?.state === 'CONTRACT_SIGNED'
                      ? t('Hợp đồng đã ký')
                      : row?.state === 'CONTRACT_APPROVING'
                        ? t('Phê duyệt hợp đồng')
                        : row?.state === 'PENDING'
                          ? t('Chờ duyệt')
                          : t(row?.state)}
              </span>
            </div>
          )
        );
      },
      minWidth: '155px',
      maxWidth: '160px',
    },
  ];
  return (
    <div className='data-table-quantity-merchant-container' >
      <div className='header-container'>
        <div className='header__title'>{t('Báo cáo hệ thống')}</div>
        <div className='header-hidel'>
          <button
            className={`filter-btn btn ${isShowFilter ? 'btn-active' : ''}`}
            onClick={toggleFilter}>
            <svg
              width='14'
              height='12'
              xmlns='http://www.w3.org/2000/svg'
              style={{ transition: 'all 0.3s' }}>
              <path
                d='M6.99.005c1.977 0 3.954.001 5.93-.001.409 0 .73.151.938.507.237.405.177.817-.179 1.231-1.49 1.737-2.982 3.475-4.48 5.205a.762.762 0 0 0-.206.558c.014.614-.003 1.229.01 1.843.006.288-.094.49-.339.65-.93.61-1.854 1.23-2.779 1.85-.19.127-.381.215-.61.096-.237-.125-.279-.336-.278-.58.004-1.28-.004-2.56.005-3.841a.816.816 0 0 0-.212-.587C3.305 5.222 1.833 3.496.348 1.78.034 1.417-.114 1.037.103.583.318.13.706-.002 1.183 0 3.12.008 5.054.003 6.99.003v.002z'
                fill={isShowFilter ? '#00BE00' : '#647081'}
                fillRule='evenodd'></path>
            </svg>
            {(['Lọc', 'Ẩn lọc'][+(isShowFilter || 0)])}
          </button>
        </div>
      </div>
      <ReportSystemContainer isShowFilter={isShowFilter} />
    </div>
  );
};

export default DataTableQuantityMerchant;
