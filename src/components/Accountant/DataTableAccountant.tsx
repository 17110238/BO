/* eslint-disable react-hooks/exhaustive-deps */

import renderState from 'constants/State';
import renderMethod from 'constants/Paymentmethod';
import { renderStatusAccountant } from 'constants/Status';
import dayjs from 'dayjs';
import useWindowDimensions from 'hook/useWindowDimension';
import { AccountantCrossCheck } from 'models';
import Link from 'next/link';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import formatCurrency from 'utils/helpers/formatCurrency';
import ConfirmPageContainer from './confirm/ConfirmPageContainer';
import ModalDeposit from './Modal/ModalDeposit';
import numeral from 'numeral';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import ModalUpdatePayment from './Modal/ModalUpdatePayment';
import Swal from 'sweetalert2';
import {
  boCancelCrossCheck,
  boContinueCrossCheck,
  boPauseCrossCheck,
  boTransferCrossCheck,
} from 'redux/actions/accountantAction';
import alert from 'utils/helpers/alert';
import Router from 'next/router';

interface DataTableTransactionProps {
  t: (a: string) => string;
  data: AccountantCrossCheck[];
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
  checkEmtryModal?: (data: []) => void | [];
  heightBoxSearch?: number;
  handleChangedSelect?: any;
  show?: boolean;
  showCrlt?: boolean;
  onHide: () => void;
  isLoading: boolean;
  handleSubmitSearch: (value: any) => void;
  rest?: any;
}
interface TransactionInfo {
  transactionId?: string;
  partnerId?: string;
}
export interface TypehandleEditAmount {
  event: any;
  amount: any;
}

const DataTableAccountant = ({
  t,
  data,
  totalFilter,
  deleteDefault,
  getDataList,
  setSubmitForm,
  heightBoxSearch,
  handleChangedSelect,
  show,
  showCrlt,
  onHide,
  handleSubmitSearch,
  checkEmtryModal,
  isLoading,
  ...rest
}: DataTableTransactionProps) => {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const checkPaymentMe: [] = useSelector<any, []>((state) => state?.utility?.paymentMethods);
  const approveAccountID = useSelector<any>(
    (state) => state.authReducers.accountInfo?.profile.accountId
  );
  const dispatch = useDispatch();
  const paymentMethods = checkPaymentMe
    .filter((item: any, index) => {
      if (item?.name && item?.payCode) {
        return item;
      }
    })
    .map((item: any, index) => {
      return { label: item.name, value: item.payCode };
    });
  const columns: TableColumn<AccountantCrossCheck>[] = useMemo(
    () => [
      {
        name: t('Mã đối soát'),
        minWidth: '50px',
        maxWidth: '100px',
        cell: (row) => (
          <Link
            href={`/cong-thanh-toan/quan-ly-giao-dich?search=${row?.crossCheckId}&searchType=CROSSCHECK_ID&state=SUCCEEDED%2CREFUNDED`}
            passHref>
            <span className='text-link'>{row?.crossCheckId}</span>
          </Link>
        ),
      },
      {
        name: t('Mã giao dịch'),
        minWidth: '150px',
        maxWidth: '150px',
        cell: (row) => (
          <span >{row?.transaction}</span>
        ),
      },
      {
        name: t('Tài khoản MC'),
        minWidth: '110px',
        maxWidth: '130px',
        cell: (row) => <span>{row?.username}</span>,
      },
      {
        name: t('Tên MC'),
        minWidth: '110px',
        maxWidth: '130px',
        cell: (row) => <span>{row?.merchantName}</span>,
      },

      {
        name: t('TK nhận TT'),
        minWidth: '110px',
        maxWidth: '130px',
        cell: (row) => <span>{row?.receiveAccount?.accountName}</span>,
      },

      {
        name: t('Số GD'),
        minWidth: '110px',
        maxWidth: '130px',
        right: true,
        cell: (row) => <span className='color-payme'>{row?.totalTransaction}</span>,
      },

      {
        name: t('Số tiền'),
        right: true,
        minWidth: '110px',
        maxWidth: '130px',
        cell: (row) => <span>{formatCurrency(row?.amount)} đ</span>,
      },
      {
        name: t('Trạng thái'),
        minWidth: '170px',
        maxWidth: '200px',
        cell: (row) => (
          <>
            <span className={`${renderStatusAccountant(row?.state)}`}>
              {t(renderState(row?.state))}
            </span>
          </>
        ),
      },
      {
        name: t('Lệnh đối soát'),
        minWidth: '130px',
        maxWidth: '150px',
        cell: (row) => (
          <span>
            {row?.type === 'AUTO' ? 'Tự động' : row?.type === 'OFF' ? 'Tắt' : 'Thông thường'}
          </span>
        ),
      },
      {
        name: t('Chuyển tiền'),
        right: true,
        minWidth: '50px',
        maxWidth: '70px',
        cell: (row) => <span>{row?.crossCheckNum}</span>,
      },
      {
        name: t('Chuyển cuối tuần'),
        minWidth: '90px',
        maxWidth: '110px',
        cell: (row) => <span>{row?.isTransferWeekend ? 'Có' : 'Không'}</span>,
      },
      {
        name: t('Hạn mục ĐS'),
        minWidth: '180px',
        maxWidth: '200px',
        cell: (row) => (
          <>
            <span>
              {
                row?.crossCheckMethod
                // row?.crossCheckMethod?.map((item, id) => { return renderMethod(item) })?.join('; ')
              }
            </span>
          </>
        ),
      },
      {
        name: t('Campaign ID'),
        minWidth: '130px',
        maxWidth: '200px',
        cell: (row) => {
          return (
            <p className='text-link' onClick={() => handleChangeRouter(row?.extraData?.campaignId)}>
              {
                row?.extraData?.campaignId
              }
            </p>
          )
        }
      },
      {
        name: t('TG tạo'),
        minWidth: '170px',
        maxWidth: '200px',
        cell: (row) => (
          <span>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : ''}</span>
        ),
      },
      {
        name: t('TG chuyển tiền'),
        minWidth: '170px',
        maxWidth: '200px',
        cell: (row) => {
          return (
            <span>
              {row?.finishedAt ? dayjs(row?.finishedAt).format('HH:mm:ss DD/MM/YYYY') : ''}
            </span>
          );
        },
      },
      {
        name: t('Thao tác'),
        minWidth: '80px',
        maxWidth: '80px',
        center: true,
        cell: (row) => {
          return (
            <>
              <Dropdown className='merchant-approval-manage-table-dropdown action'>
                <Dropdown.Toggle
                  className='p-0 w-100'
                  style={{
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderColor: 'rgba(0,0,0,0)',
                  }}
                  id='dropdown-menu-align-end'>
                  <div className='d-flex justify-content-center w-100'>
                    <i className='fas fa-th-large m-0 text-muted'></i>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ borderRadius: '12px' }}>
                  {(row?.state === 'PENDING' ||
                    row?.state === 'PAUSED' ||
                    row?.state === 'CONFIRMED' ||
                    row?.state === 'CANCELED') && (
                      <Dropdown.Item onClick={() => handleShowModalUpdate(row?.crossCheckId)}>
                        <i className='fas fa-edit fa-lg mr-2' />
                        {t('Cập nhật đã thanh toán')}
                      </Dropdown.Item>
                    )}
                  {row?.state === 'PAUSED' && (
                    <Dropdown.Item onClick={() => handleContinuePauseDeposit(row?.crossCheckId)}>
                      <i className='fas fa-check mr-2' />
                      {t('Tiếp tục đối soát')}
                    </Dropdown.Item>
                  )}
                  {(row?.state === 'DEPOSITED' || row?.state === 'APPROVED') && (
                    <Dropdown.Item onClick={() => handleShowModalTransfer(row?.crossCheckId)}>
                      <i className="fad fa-check-double mr-2"></i>
                      {t('Duyệt đối soát')}
                    </Dropdown.Item>
                  )}
                  {row?.state === 'PENDING' && (
                    <Dropdown.Item onClick={() => handlePauseDeposit(row?.crossCheckId)}>
                      <i className='fas fa-pause mr-2' />
                      {t('Ngừng đối soát')}
                    </Dropdown.Item>
                  )}
                  {row?.state === 'PENDING' && (
                    <Dropdown.Item onClick={() => handleCancelDeposit(row?.crossCheckId)}>
                      <i className='fas fa-ban mr-2'></i>
                      {t('Hủy đối soát')}
                    </Dropdown.Item>
                  )}
                  <Link
                    href={`/cong-thanh-toan/quan-ly-giao-dich?search=${row?.crossCheckId}&searchType=CROSSCHECK_ID&state=SUCCEEDED%2CREFUNDED`}
                    passHref>
                    <Dropdown.Item>
                      <i className='fas fa-info-circle mr-2' />
                      {t('Chi tiết giao dịch')}
                    </Dropdown.Item>
                  </Link>
                </Dropdown.Menu>
              </Dropdown>
            </>
          );
        },
      },
    ],
    [lang]
  );

  const [selectedData, setSelectedData] = useState<any>([]);
  const [showModalUpdate, setShowModalUpdate] = useState<boolean>(false);

  const [id, setId] = useState<number>();
  const handleChange = (state: any) => {
    setSelectedData(
      state.selectedRows.map((item: AccountantCrossCheck) => {
        return { ...item, amountEdit: item.amount, note: '' };
      })
    );
  };
  const handleDelete = (id: string) => {
    setSelectedData((state: AccountantCrossCheck[]) => {
      let data = state.filter(
        (item: AccountantCrossCheck) => {
          if (item?.transaction != id) {
            return item;
          }
        }
      );
      return data;
    });
  };

  const handleEditAmount = (event: any, amount: any) => {
    setSelectedData((state: any) => {
      let data = state.map((item: AccountantCrossCheck) => {
        if (item?.transaction === amount.transaction) {
          return { ...item, amountEdit: event?.floatValue };
        } else return item;
      });
      return data;
    });
  };
  const handleChangeRouter = (data: any) => {
    if (!data) return
    return Router.push(`/cong-thanh-toan/doi-soat-doanh-nghiep/chuyen-tien/${data}`)
  }
  const handleDeleteData = () => setSelectedData([]);
  const handleEditNote = (event: any, note: any) => {
    setSelectedData((state: any) => {
      let data = state.map((item: AccountantCrossCheck) => {
        if (item?.transaction === note.transaction) {
          return { ...item, note: event.target.value };
        } else return item;
      });
      return data;
    });
  };

  const handleShowModalUpdate = (item: number | undefined) => {
    handleDeleteData();
    setShowModalUpdate(true);
    setId(item);
  };
  const handleShowModalTransfer = (data: number | undefined) => {
    Swal.fire({
      title: t('Bạn có đồng ý chuyển không?'),
      icon: 'warning',
      position: 'center',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: t('Đồng ý!'),
      cancelButtonText: t('Hủy'),
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          boTransferCrossCheck(
            {
              crossCheckId: Number(data),
            },
            (status, res) => {
              if (status) {
                alert('success', res.message, t);
                handleDeleteData();
                const defaultValues = {
                  createdAt: {
                    from: dayjs().subtract(5, 'day').toISOString(),
                    to: dayjs().endOf('date').toISOString(),
                  },
                  typeSearch: 'tranId',
                };

                return handleSubmitSearch && handleSubmitSearch(defaultValues);
              } else {
                alert('error', res.message, t);
              }
            }
          )
        );
      }
    });
  };
  const handleCancelDeposit = (data: number | undefined) => {
    Swal.fire({
      title: t('Bạn có đồng ý hủy lệnh đối soát này không?'),
      icon: 'warning',
      position: 'center',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: t('Đồng ý!'),
      cancelButtonText: t('Hủy'),
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          boCancelCrossCheck(
            {
              crossCheckId: Number(data),
              approvedAccountId: approveAccountID,
            },
            (status, res) => {
              if (status) {
                alert('success', res.message, t);
                handleDeleteData();
                const defaultValues = {
                  createdAt: {
                    from: dayjs().subtract(5, 'day').toISOString(),
                    to: dayjs().endOf('date').toISOString(),
                  },
                  typeSearch: 'tranId',
                };

                return handleSubmitSearch && handleSubmitSearch(defaultValues);
              } else {
                alert('error', res.message, t);
              }
            }
          )
        );
      }
    });
  };

  const handlePauseDeposit = (data: number | undefined) => {
    Swal.fire({
      title: t('Bạn có đồng ý ngừng lệnh đối soát này không?'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: t('Đồng ý!'),
      cancelButtonText: t('Hủy'),
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          boPauseCrossCheck(
            {
              crossCheckId: Number(data),
              approvedAccountId: approveAccountID,
            },
            (status, res) => {
              if (status) {
                alert('success', res.message, t);
                handleDeleteData();
                const defaultValues = {
                  createdAt: {
                    from: dayjs().subtract(5, 'day').toISOString(),
                    to: dayjs().endOf('date').toISOString(),
                  },
                  typeSearch: 'tranId',
                };
                return handleSubmitSearch && handleSubmitSearch(defaultValues);
              } else {
                alert('error', res.message, t);
              }
            }
          )
        );
      }
    });
  };

  const handleContinuePauseDeposit = (data: number | undefined) => {
    Swal.fire({
      title: t('Bạn có đồng ý tiếp tục lệnh đối soát này không?'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: t('Đồng ý!'),
      cancelButtonText: t('Hủy'),
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          boContinueCrossCheck(
            {
              crossCheckId: Number(data),
              approvedAccountId: approveAccountID,
            },
            (status, res) => {
              if (status) {
                alert('success', res.message, t);
                handleDeleteData();
                const defaultValues = {
                  createdAt: {
                    from: dayjs().subtract(5, 'day').toISOString(),
                    to: dayjs().endOf('date').toISOString(),
                  },
                  typeSearch: 'tranId',
                };
                return handleSubmitSearch && handleSubmitSearch(defaultValues);
              } else {
                alert('error', res.message, t);
              }
            }
          )
        );
      }
    });
  };

  // useEffect(() => {
  // }, [selectedData, show, showCrlt,]);

  const rowDisabledCriteria = (row: any) => row?.isOutOfStock;
  return (
    <>
      <div className='div__table'>
        <DataTableCustom
          t={t}
          fixedHeader={true}
          clearSelectedRows={show || showCrlt}
          selectableRows
          selectableRowsVisibleOnly
          columns={columns}
          dataList={data}
          onSelectedRowsChange={handleChange}
          selectableRowDisabled={rowDisabledCriteria}
          className='data-table-custom transaction-table'
          paginationTotalRows={totalFilter}
          nameDataTable='colTransaction'
          getDataList={getDataList}
          isNotHaveTotalRows
          isLoading={isLoading}
          // defaultColumn={defaultColumn}
          {...rest}
        />
      </div>
      {showModalUpdate && (
        <ModalUpdatePayment
          show={showModalUpdate}
          onHide={() => setShowModalUpdate(false)}
          id={id}
          handleSubmitSearch={handleSubmitSearch}
        />
      )}
      {show && (
        <ModalDeposit
          data={selectedData}
          show={show}
          handleDeleteData={handleDeleteData}
          onHide={onHide}
          handleDelete={handleDelete}
          handleSubmitSearch={handleSubmitSearch}
          handleEditAmount={handleEditAmount}
          handleEditNote={handleEditNote}
        />
      )}
    </>
  );
};
export default DataTableAccountant;
