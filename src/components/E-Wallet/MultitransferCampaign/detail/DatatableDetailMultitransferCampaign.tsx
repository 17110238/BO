/* eslint-disable react-hooks/exhaustive-deps */
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import DetailTransDrawer from 'components/common/DetailTransDrawer/DetailTransDrawer';
import renderState from 'constants/State';
import renderStatus from 'constants/Status';
import dayjs from 'dayjs';
import { TransactionResponse, TransactionState } from 'models';
import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import formatCurrency from 'utils/helpers/formatCurrency';

interface DataTableDetailMultitransferCampaignProps {
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
  setSubmitForm?: (a: boolean) => void;
  heightBoxSearch?: number;
  isNotHaveTotalRow?: boolean;
  changeHeight?: string;
  rest?: any;
}
interface TransactionInfo {
  transactionId?: string;
  partnerId?: string;
}

export default function DataTableDetailMultitransferCampaign({
  data,
  totalFilter,
  deleteDefault,
  getDataList,
  setSubmitForm,
  heightBoxSearch,
  isNotHaveTotalRow = false,
  changeHeight,
  ...rest
}: DataTableDetailMultitransferCampaignProps) {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isShowModalRefund, setShowModalRefund] = useState<boolean>(false);
  const [isShowModalCancel, setShowModalCancel] = useState<boolean>(false);
  const isLoading = useSelector<any, TransactionState>((state) => state?.transactions.loading);
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
        name: t('STT'),
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
        name: t('Tên người nhận'),
        minWidth: '125px',
        maxWidth: '140px',
        cell: (row) => <span>{row?.orderId ? row?.orderId : '-'}</span>,
      },
      {
        name: t('Số tài khoản'),
        cell: (row) => <span>{row?.partnerTransaction}</span>,
        minWidth: '115px',
        maxWidth: '130px',
      },
      {
        name: t('Công ty'),
        cell: (row) => <span>{row?.supplierId}</span>,
        minWidth: '115px',
        maxWidth: '130px',
      },
      {
        name: t('Số tiền'),
        right: true,
        cell: (row) => <span>{formatCurrency(row?.amount)} đ</span>,
        minWidth: '115px',
        maxWidth: '130px',
      },
      {
        name: t('Thời gian chuyển'),
        right: true,
        cell: (row) => (
          <span>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
        ),
      },
      {
        name: t('Nội dung'),
        right: true,
        cell: (row) => <span>{formatCurrency(row?.total)} đ</span>,
        minWidth: '115px',
        maxWidth: '130px',
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
                    <i className='fas fa-info-circle fa-lg mr-2' />
                    {t('Xem chi tiết')}
                  </Dropdown.Item>
                  {row?.state === 'SUCCEEDED' && (
                    <Dropdown.Item
                      className='refund'
                      onClick={() => {
                        setShowModalRefund(true);
                        setTransactionInfo({
                          ...transactionInfo,
                          transactionId: row.transactionId,
                          partnerId: row.partnerTransaction,
                        });
                      }}>
                      {/* <RefundIcon className="refund-icon mr-1" /> */}
                      <i className='fas fa-undo-alt fa-lg mr-2'></i>
                      {t('Refund')}
                    </Dropdown.Item>
                  )}
                  {row?.state === 'SUCCEEDED' && (
                    <Dropdown.Item
                      className='cancel'
                      onClick={() => {
                        setShowModalCancel(true);
                        setTransactionInfo({
                          ...transactionInfo,
                          transactionId: row.transactionId,
                          partnerId: row.partnerTransaction,
                        });
                      }}>
                      <i className='fas fa-window-close fa-lg mr-2'></i>
                      {t('Hủy')}
                    </Dropdown.Item>
                  )}
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
      <DetailTransDrawer
        type={detailType}
        idDetail={idDetail}
        closeDrawerDetail={() => {
          setDetailType('');
          setIdDetail(0);
        }}
        showOtherDetail={(type, itemId) => {
          setDetailType(type);
          setIdDetail(itemId);
        }}
        handleRecall={setSubmitForm}
        t={t}
      />
    </>
  );
}
