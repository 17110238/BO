/* eslint-disable react-hooks/exhaustive-deps */
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import DetailTransDrawer from 'components/common/DetailTransDrawer/DetailTransDrawer';
import renderState from 'constants/State';
import renderStatus from 'constants/Status';
import dayjs from 'dayjs';
import useWindowDimensions from 'hook/useWindowDimension';
import { TransactionResponse, TransactionState } from 'models';
import React, { useEffect, useMemo, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';
import { useSelector } from 'react-redux';
import formatCurrency from 'utils/helpers/formatCurrency';

interface DataTableTransactionProps {
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
  setSubmitForm?: (a: boolean) => void;
  heightBoxSearch?: number;
  rest?: any;
}
interface TransactionInfo {
  transactionId?: string;
  partnerId?: string;
}

export default function DataTableTransaction({
  t,
  data,
  totalFilter,
  deleteDefault,
  getDataList,
  setSubmitForm,
  heightBoxSearch,
  ...rest
}: DataTableTransactionProps) {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const [isShowModalRefund, setShowModalRefund] = useState<boolean>(false);
  const [isShowModalCancel, setShowModalCancel] = useState<boolean>(false);
  const isLoading = useSelector<any, TransactionState>((state) => state?.transactions.loading);
  const changeWidthColumn = lang === 'vi' ? '130px' : '200px';

  const { height: screenHeight } = useWindowDimensions();
  const totalFixedHeightDatatable = heightBoxSearch && screenHeight - heightBoxSearch - 243; // 243 is total header + footer

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
        name: t('M?? giao d???ch'),
        minWidth: '120px',
        maxWidth: '130px',
        cell: (row) => <span>{row?.transactionId}</span>,
      },
      {
        name: t('T??i kho???n MC'),
        minWidth: '110px',
        maxWidth: '130px',
        cell: (row) => <span>{row?.transactionId}</span>,
      },
      {
        name: t('T??n MC'),
        cell: (row) => <span>{row?.partnerTransaction}</span>,
        minWidth: changeWidthColumn,
        maxWidth: changeWidthColumn,
      },
      {
        name: t('TK NH???n TT'),
        cell: (row) => <span>{row?.supplierId}</span>,
        minWidth: changeWidthColumn,
        maxWidth: changeWidthColumn,
      },
      {
        name: t('S??? GD'),
        cell: (row) => <span className='color-payme'>{row?.paymentId}</span>,
        minWidth: '115px',
        maxWidth: '130px',
      },
      {
        name: t('S??? ti???n'),
        cell: (row) => <span>{formatCurrency(row?.amount)} ??</span>,
        minWidth: '115px',
        maxWidth: '130px',
      },
      {
        name: t('Tr???ng Th??i'),
        cell: (row) => <span>{formatCurrency(row?.fee)} ??</span>,
        minWidth: changeWidthColumn,
        maxWidth: changeWidthColumn,
      },
      {
        name: t('L???nh ?????i So??t'),
        cell: (row) => <span>{formatCurrency(row?.total)} ??</span>,
        minWidth: '115px',
        maxWidth: '130px',
      },
      {
        name: t('Chuy???n Ti???n'),
        cell: (row) => <span>{row?.method}</span>,
        minWidth: '130px',
        maxWidth: '150px',
      },
      {
        name: t('Chuy???n Cu???i Tu???n'),
        cell: (row) => <span>{row?.merchantName}</span>,
        minWidth: '125px',
        maxWidth: '140px',
      },
      {
        name: t('H???n M???c ??S'),
        cell: (row) => <span>{row?.supplierName}</span>,
        minWidth: '160px',
        maxWidth: '180px',
      },
      {
        name: t('Campaign ID'),
        cell: (row) => <span>{row?.issuerName}</span>,
        minWidth: '130px',
        maxWidth: '200px',
      },
      // {
      //   name: t('Lo???i GD'),
      //   cell: (row) => (
      //     <span>
      //       {t(`${row?.paymentMainType}`)}
      //     </span>
      //   ),
      //   minWidth: '95px',
      //   maxWidth: '140px',
      // },
      {
        name: t('TG t???o'),
        cell: (row) => (
          <span>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : ''}</span>
        ),
        minWidth: '140px',
        maxWidth: '200px',
      },
      {
        name: t('TG chuy???n ti???n'),
        cell: (row) => (
          <span>{row?.finishedAt ? dayjs(row?.finishedAt).format('HH:mm:ss DD/MM/YYYY') : ''}</span>
        ),
        minWidth: '140px',
        maxWidth: '200px',
      },
      {
        name: t('Thao t??c'),
        center: true,
        minWidth: '80px',
        maxWidth: '80px',
        cell: (row) => {
          return (
            <>
              <Dropdown className='transaction-table-dropdown'>
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
                    {t('Xem chi ti???t')}
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
                      {t('H???y')}
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
  const [selectedData, setSelectedData] = React.useState();
  const handleChange = (state: any) => {
    setSelectedData(state.selectedRows);
  };
  useEffect(() => {
    //do something here
  }, [selectedData]);
  return (
    <>
      <DataTableCustom
        isLoading={isLoading}
        t={t}
        fixedHeader={true}
        selectableRows
        fixedHeaderScrollHeight={`${totalFixedHeightDatatable}px`}
        columns={columns}
        dataList={data}
        onSelectedRowsChange={handleChange}
        className='data-table-custom transaction-table'
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
