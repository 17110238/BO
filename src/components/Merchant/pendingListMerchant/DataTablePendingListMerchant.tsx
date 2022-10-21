import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import DetailTransDrawer from 'components/common/DetailTransDrawer/DetailTransDrawer';
import dayjs from 'dayjs';
import {
  GetRequestChangeResponsed,
  MerchantState,
  ProcessListType,
  stateMcEnum,
  UserApproveType,
} from 'models';
import React, { useMemo, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { approvePendingMerchant, getTotalPendingMerchant } from 'redux/actions';
import alert from 'utils/helpers/alert';
import ModalReject from './ModalReject';
import renderState from 'constants/State';
import { Router, useRouter } from 'next/router';
interface DataTableMerchantProps {
  t: (a: string) => string;
  data: GetRequestChangeResponsed[];
  totalFilter?: number;
  getDataList?: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
  setSubmitForm: (a?: any) => void;
  submitForm?: boolean;
  isLoading: boolean;
  rest?: any;
}

function DataTableMerchant({
  t,
  data,
  totalFilter,
  getDataList,
  setSubmitForm,
  submitForm,
  isLoading,
  ...rest
}: DataTableMerchantProps) {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const router = useRouter();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [detailType, setDetailType] = useState<string | undefined>('');
  const [idDetail, setIdDetail] = useState<number>(0);
  const [info, setInfo] = useState<any>({
    targetCode: null,
    requestId: null,
    isTurn: false,
    state: null,
    methodName: null,
  });
  const openDrawerDetail = (info: any | undefined, type: any) => {
    setInfo(info);
    setDetailType(type);
  };

  const renderStatus = (state?: stateMcEnum) => {
    if (!state) return '';

    switch (state) {
      case stateMcEnum.APPROVED:
        return 'state-success';
      case stateMcEnum.PENDING:
      case stateMcEnum.APPROVING:
        return 'state-refunded';
      case stateMcEnum.REJECTED:
        return 'state-cancel';
      default:
        break;
    }
  };

  const getTypeDetailTransDrawer = (type: string) => {
    if (!type) return;

    switch (type) {
      case 'REQUEST_MERCHANT_APPROVE':
      case 'REQUEST_MERCHANT_DASHBOARD_APPROVE':
        return 'APPROVE_MERCHANT';

      case 'REQUEST_STORE_APPROVE':
        return 'APPROVE_STORE';

      case 'REQUEST_MERCHANT_CHANGE':
        return 'CHANGE_MERCHANT';

      case 'REQUEST_MERCHANT_CONFIG':
      case 'REQUEST_MERCHANT_CONFIG_POBO':
        return 'CHANGE_FEE';
      case 'SEND_MESSAGE_MERCHANT':
      case 'SEND_MESSAGE_PARTNER':
      case 'SEND_MESSAGE_USER':
        return 'APPROVE_MESSAGE';
      case 'REQUEST_MERCHANT_ACTIVE':
        return 'APPROVE_ACTIVE_MERCHANT';
      case 'REQUEST_MERCHANT_ACCOUNT_ACTIVE':
        return 'APPROVE_ACTIVE_ACCOUNT';
      case 'REQUEST_ACCOUNT_WALLET_CHANGE':
        return 'CHANGE_WALLET_ACCOUNT';
      case 'REQUEST_UPDATE_STATE_COBO_POBO':
        return 'CHANGE_STATE_COBO_POBO';

      default:
        return '';
    }
  };

  const handleAprroveMerchant = (id: number) => {
    const payload = {
      requestId: id,
    };

    dispatch(
      approvePendingMerchant(payload, (status, response) => {
        if (status) {
          alert('success', response.message, t);
          setSubmitForm(true);
          dispatch(
            getTotalPendingMerchant(
              {
                filter: {
                  state: 'PENDING',
                },
              },
              (status) => {
                if (status) {
                }
              }
            )
          );
        } else {
          alert('error', response.message, t);
        }
      })
    );
  };

  const getWidthDetailTransdrawer = (type: string) => {
    switch (type) {
      case '':
      case 'APPROVE_STORE':
      case 'APPROVE_ACTIVE_MERCHANT':
      case 'APPROVE_ACTIVE_ACCOUNT':
      case 'CHANGE_STATE_COBO_POBO':
        return '500';

      default:
        return '1000';
    }
  };

  const handleProcessingFlow = (row: any) => {
    const result = (
      <ul className='processing-list-flow-container'>
        <li className={`${(row?.history.length && row?.history[0]?.state !== 'REJECTED') && 'pending'}`}>
          {row?.processList?.map((process: ProcessListType) => {
            if (process?.order === 1) {
              return process?.user?.map((user: UserApproveType, index: number) => {
                return <p key={index}>{user?.username}</p>;
              });
            }
          })}
        </li>
        {row?.processList?.length > 1 &&
          row?.processList?.map((process: ProcessListType, index: number) => {
            if (index >= 1) {
              return (
                <li key={index} className={`${((row?.history.length === index + 1 && row?.history?.[index]?.state === 'APPROVED') || row?.state === 'APPROVED') && 'pending'}`}>
                  {process?.order === index + 1 &&
                    process?.user?.map((user: UserApproveType, index: number) => {
                      return <p key={index}>{user?.username}</p>;
                    })}
                </li>
              );
            }
          })}
      </ul>
    )

    return result;
  }

  const columns: TableColumn<any>[] = useMemo(
    () => [
      {
        name: t('requestId'),
        minWidth: '100px',
        maxWidth: '110px',
        left: true,
        cell: (row) => {
          return (
            <div
              className='text-link'
              onClick={() => {
                setInfo({
                  ...info,
                  requestId: row?.id,
                  isTurn: row?.isTurn,
                  state: row?.state,
                  methodName: row?.methodName,
                });
                openDrawerDetail(
                  {
                    targetCode: Number(row?.target?.[0]?.code),
                    requestId: row?.id,
                    isTurn: row?.isTurn,
                    state: row?.state,
                    methodName: row?.methodName,
                  },
                  getTypeDetailTransDrawer(row?.tag?.code)
                );
              }}>
              {row?.id}
            </div>
          );
        },
      },
      {
        name: t('MC ID'),
        minWidth: '80px',
        maxWidth: '100px',
        left: true,
        cell: (row, index) => {
          return <span>{row?.target?.[0]?.code}</span>;
        },
      },
      {
        name: t('Thời gian'),
        minWidth: '120px',
        maxWidth: '130px',
        center: true,
        cell: (row) => {
          return (
            <div className='text-center'>
              {dayjs(row?.createdAt).format('HH:mm:ss')}
              <br />
              {dayjs(row?.createdAt).format('DD/MM/YYYY')}
            </div>
          );
        },
      },
      {
        name: t('Người yêu cầu'),
        minWidth: '120px',
        maxWidth: '130px',
        cell: (row) => {
          return <div>{row?.src?.title}</div>;
        },
      },
      {
        name: t('Loại đối tượng'),
        minWidth: '120px',
        maxWidth: '130px',
        cell: (row) => {
          return <div>{row?.tag?.groupId}</div>;
        },
      },
      {
        name: t('Đối tượng'),
        minWidth: '120px',
        maxWidth: '140px',
        cell: (row) => {
          return <div>{row?.target?.[0]?.title}</div>;
        },
      },
      {
        name: t('Nội dung yêu cầu'),
        minWidth: '145px',
        maxWidth: '150px',
        cell: (row) => {
          return <div>{row?.tag?.title}</div>;
        },
      },
      {
        name: t('Status'),
        minWidth: '145px',
        maxWidth: '160px',
        cell: (row) => {
          return <div className={renderStatus(row?.state)}>{t(row?.state + '_PENDING_LIST')}</div>;
        },
      },
      {
        name: t('Quy trình duyệt'),
        minWidth: '300px',
        cell: (row) => handleProcessingFlow(row),
      },
      {
        name: t('Dự án'),
        minWidth: '130px',
        maxWidth: '150px',
        cell: (row) => {
          return <div>{row?.projectName}</div>;
        },
      },
      {
        name: t('Thao tác'),
        center: true,
        minWidth: '80px',
        maxWidth: '100px',
        cell: (row) => {
          return (
            <>
              <Dropdown className='pending-list-merchant-table-dropdown'>
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
                      setInfo({
                        ...info,
                        requestId: row?.id,
                        isTurn: row?.isTurn,
                        state: row?.state,
                        methodName: row?.methodName,
                      });
                      openDrawerDetail(
                        {
                          targetCode: Number(row?.target?.[0]?.code),
                          requestId: row?.id,
                          isTurn: row?.isTurn,
                          state: row?.state,
                          methodName: row?.methodName,
                        },
                        getTypeDetailTransDrawer(row?.tag?.code)
                      );
                    }}>
                    <i className='fas fa-info-circle fa-lg mr-2' />
                    {t('Xem chi tiết')}
                  </Dropdown.Item>
                  {row?.state === 'PENDING' && row?.isTurn && (
                    <Dropdown.Item
                      className='success'
                      onClick={() => handleAprroveMerchant(row?.id)}>
                      <i className='fas fa-check fa-lg mr-2'></i>
                      {t('Duyệt')}
                    </Dropdown.Item>
                  )}
                  {row?.state === 'PENDING' && row?.isTurn && (
                    <Dropdown.Item
                      className='cancel'
                      onClick={() => {
                        setShow(true);
                        setInfo({
                          ...info,
                          requestId: row?.id,
                        });
                      }}>
                      <i className='fas fa-window-close fa-lg mr-2'></i>
                      {t('Từ chối')}
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
    <div>
      <DataTableCustom
        isLoading={isLoading}
        className='data-table-custom pending-list-merchant-table'
        columns={columns}
        dataList={data}
        paginationTotalRows={totalFilter}
        getDataList={getDataList}
        t={t}
        nameDataTable='colPendingList'
        {...rest}
      />
      <DetailTransDrawer
        width={getWidthDetailTransdrawer(detailType!)}
        info={info}
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
        submitForm={submitForm}
        handleRecall={setSubmitForm}
        t={t}
      />
      <ModalReject
        t={t}
        show={show}
        handleClose={() => setShow(false)}
        requestId={info?.requestId}
        submitForm={submitForm}
        handleRecall={setSubmitForm}
      />
    </div>
  );
}

export default DataTableMerchant;
