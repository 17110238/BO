/* eslint-disable react-hooks/exhaustive-deps */
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import DetailTransDrawer from 'components/common/DetailTransDrawer/DetailTransDrawer';
import renderState from 'constants/State';
import renderStatus from 'constants/Status';
import dayjs from 'dayjs';
import useWindowDimensions from 'hook/useWindowDimension';
import { TransactionResponse, TransactionState } from 'models';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';
import { useSelector } from 'react-redux';
import formatCurrency from 'utils/helpers/formatCurrency';

interface DataTableMultitransferCampaignProps {
  t: (a: string) => string;
  data: TransactionResponse[] | undefined;
  totalFilter?: number;
  onRowSelected?: any;
  deleteDefault?: boolean;
  getDataList?: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
  onOpenPayrollModal: () => void;
  setSubmitForm?: (a: boolean) => void;
  rest?: any;
}
interface TransactionInfo {
  transactionId?: string;
  partnerId?: string;
}

export default function DataTableMultitransferCampaign({
  t,
  data,
  totalFilter,
  deleteDefault,
  getDataList,
  setSubmitForm,
  onOpenPayrollModal,
  ...rest
}: DataTableMultitransferCampaignProps) {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const router = useRouter();
  const [isShowModalRefund, setShowModalRefund] = useState<boolean>(false);
  const [isShowModalCancel, setShowModalCancel] = useState<boolean>(false);
  const isLoading = useSelector<any, TransactionState>((state) => state?.transactions.loading);
  const changeWidthColumn = lang === 'vi' ? '130px' : '200px';
  const [detailType, setDetailType] = useState<string | undefined>('');
  const [idDetail, setIdDetail] = useState<number>(0);
  const [transactionInfo, setTransactionInfo] = useState<TransactionInfo>({
    transactionId: '',
    partnerId: '',
  });

  const openDrawerDetail = (itemId: number | undefined, type: string | undefined) => {
    setDetailType(type);
    itemId && setIdDetail(itemId);
  };

  const columns: TableColumn<TransactionResponse>[] = useMemo(
    () => [
      {
        name: t('Mã đợt chuyển'),
        minWidth: '135px',
        maxWidth: '145px',
        cell: (row) => (
          <span
            className='text-link'
            onClick={() => {
              router.push(`/payme/multitransfer-campaign/${row?.transactionId}`);
            }}>
            {row?.transactionId}
          </span>
        ),
      },
      {
        name: t('Công ty'),
        minWidth: '125px',
        maxWidth: '140px',
        cell: (row) => <span>{row?.orderId ? row?.orderId : '-'}</span>,
      },
      {
        name: t('Số lệnh'),
        cell: (row) => <span>{row?.partnerTransaction}</span>,
        minWidth: changeWidthColumn,
        maxWidth: changeWidthColumn,
      },
      {
        name: t('Tổng tiền'),
        right: true,
        cell: (row) => <span>{formatCurrency(row?.amount)} đ</span>,
        minWidth: '115px',
        maxWidth: '130px',
      },
      {
        name: t('TG lập'),
        cell: (row) => (
          <span>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
        ),
        minWidth: '140px',
        maxWidth: '200px',
      },
      {
        name: t('TG duyệt'),
        cell: (row) => (
          <span>
            {row?.finishedAt ? dayjs(row?.finishedAt).format('HH:mm:ss DD/MM/YYYY') : '-'}
          </span>
        ),
        minWidth: '140px',
        maxWidth: '200px',
      },
      {
        name: t('Trạng thái chuyển'),
        cell: (row) => (
          <span className={`${renderStatus(row?.state)}`}>{t(renderState(row?.state))}</span>
        ),
        center: true,
        minWidth: '160px',
        maxWidth: '180px',
      },
      {
        name: t('Trạng thái'),
        cell: (row) => (
          <span className={`${renderStatus(row?.state)}`}>{t(renderState(row?.state))}</span>
        ),
        center: true,
        minWidth: '160px',
        maxWidth: '180px',
      },
      {
        name: t('Nội dung'),
        cell: (row) => <span>{row?.clientIp ? row.clientIp : '-'}</span>,
        minWidth: '132px',
        maxWidth: '140px',
      },
      {
        name: t('Thao tác'),
        center: true,
        minWidth: '80px',
        maxWidth: '80px',
        cell: (row) => {
          return (
            <>
              <Dropdown className='multitransfer-campaign-table-dropdown'>
                <Dropdown.Toggle
                  className='p-0 w-100'
                  style={{
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderColor: 'rgba(0,0,0,0)',
                  }}
                  id='dropdown-button-drop-up'>
                  <div className='d-flex justify-content-center w-100'>
                    <i className='fas fa-th-large m-0 text-muted'></i>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ borderRadius: '12px' }}>
                  <Dropdown.Item
                    className='detail'
                    onClick={() => {
                      openDrawerDetail(row.id, 'TRANSACTION');
                    }}>
                    <i className='fas fa-eye mr-2'></i>
                    {t('Xem chi tiết')}
                  </Dropdown.Item>
                  <Dropdown.Item className='success' onClick={() => onOpenPayrollModal()}>
                    <i className='fas fa-money-check-edit-alt mr-2'></i>
                    {t('Xác nhận đã chuyển tiền')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          );
        },
      },
    ],
    [lang]
  );

  return (
    <>
      <DataTableCustom
        isLoading={isLoading}
        t={t}
        columns={columns}
        dataList={data}
        className='data-table-custom multitransfer-campaign-table'
        paginationTotalRows={totalFilter}
        nameDataTable='colTransaction'
        getDataList={getDataList}
        {...rest}
      />
    </>
  );
}
