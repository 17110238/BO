import React, { useMemo, useState } from 'react';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import { TableColumn } from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { Dropdown } from 'react-bootstrap';
import Link from 'next/link';
import ModalStoreHistory from './Modals/ModalStoreHistory';
import Swal from 'sweetalert2';
import {
  PaginationChangePage,
  PaginationChangeRowsPerPage,
} from 'react-data-table-component/dist/src/DataTable/types';
import { useRouter } from 'next/router';
import { updateStore } from 'redux/actions';
import { FormUpdateStore, SearchStoreInput } from 'models';
import alert from 'utils/helpers/alert';

interface PropsComponent {
  t: (a: string) => string;
  data: any;
  totalRow: number;
  getDataList: any;
  onAfter: () => void;
  setSubmitForm: (isBool: boolean) => void;
}

interface InfoMerchant {
  storeId?: number;
  merchantName?: string;
}

export default function DatatableStore({
  t,
  data,
  totalRow,
  getDataList,
  onAfter,
  setSubmitForm,
  ...rest
}: PropsComponent): JSX.Element {
  const dispatch = useDispatch();
  const loading = useSelector<any, boolean>((state) => state?.storeReducer?.loading);
  const [isShowModalStoreHistory, setShowModalStoreHistory] = useState(false);
  const [infoMerchant, setInfoMerchant] = useState<InfoMerchant>();
  const router = useRouter();
  const columns: TableColumn<any>[] = useMemo(
    () => [
      {
        name: t('ID CH'),
        minWidth: '80px',
        maxWidth: '100px',
        cell: (row) => {
          return (
            <>
              <span>{row.storeId}</span>
            </>
          );
        },
      },
      {
        name: t('Tên cửa hàng'),
        minWidth: '200px',
        maxWidth: '300px',
        cell: (row) => {
          return (
            <>
              <Link href={`/cong-thanh-toan/quan-ly-cua-hang/${row.storeId}`}>
                <a href=''>{row.storeName}</a>
              </Link>
            </>
          );
        },
      },
      {
        name: t('Tên MC'),
        minWidth: '150px',
        maxWidth: '250px',
        cell: (row) => {
          return (
            <>
              <span>{row.merchantName}</span>
            </>
          );
        },
      },
      {
        name: t('Tên đăng nhập'),
        minWidth: '150px',
        maxWidth: '250px',
        cell: (row) => {
          return (
            <>
              <span>{row.username}</span>
            </>
          );
        },
      },
      {
        name: t('Địa chỉ CH'),
        minWidth: '300px',
        maxWidth: '400px',
        cell: (row) => {
          return (
            <>
              <span>{row.address}</span>
            </>
          );
        },
      },
      {
        name: t('TG Tạo'),
        minWidth: '100px',
        maxWidth: '150px',
        cell: (row) => {
          return (
            <>
              <span>{dayjs(row.createdAt).format('HH:mm:ss DD-MM-YYYY')}</span>
            </>
          );
        },
      },
      {
        name: t('Tình trạng'),
        minWidth: '80px',
        maxWidth: '100px',
        cell: (row) => {
          return (
            <>
              <span>{row.isActive ? t('Hoạt động') : t('Ngừng hoạt động')}</span>
            </>
          );
        },
      },
      {
        name: t('Người duyệt'),
        minWidth: '80px',
        maxWidth: '100px',
        cell: (row) => {
          return (
            <>
              <span>{}</span>
            </>
          );
        },
      },
      {
        name: t('Thao tác'),
        minWidth: '50px',
        maxWidth: '80px',
        cell: (row) => {
          return (
            <>
              <Dropdown className='merchant-manage-table-dropdown'>
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
                  <Link
                    href={`/cong-thanh-toan/quan-ly-cua-hang/thanh-vien/${row.storeId}`}
                    passHref>
                    <Dropdown.Item>
                      <i className='fa fa-users mr-2'></i>
                      {t('Xem nhân viên store')}
                    </Dropdown.Item>
                  </Link>
                  <Link href={`/cong-thanh-toan/quan-ly-cua-hang/${row.storeId}`} passHref>
                    <Dropdown.Item>
                      <i className='fa fa-eye mr-2'></i>
                      {t('Xem chi tiết')}
                    </Dropdown.Item>
                  </Link>
                  <Dropdown.Item
                    onClick={() => {
                      router.push(`/cong-thanh-toan/quan-ly-cua-hang/cap-nhat/${row.storeId}`);
                    }}>
                    <i className='fas fa-edit fa-lg mr-2' />
                    {t('Cập nhật')}
                  </Dropdown.Item>
                  {row.isActive ? (
                    <Dropdown.Item
                      onClick={() => handleCloseStore(parseInt(row.storeId), !row.isActive)}>
                      <i className='fa fa-lock mr-2'></i>
                      {t('Đóng Điểm GD')}
                    </Dropdown.Item>
                  ) : (
                    <Dropdown.Item
                      onClick={() => handleCloseStore(parseInt(row.storeId), !row.isActive)}>
                      <i className='fa fa-unlock mr-2'></i>
                      {t('Mở Điểm GD')}
                    </Dropdown.Item>
                  )}
                  <Dropdown.Item
                    onClick={() => {
                      setShowModalStoreHistory(true);
                      setInfoMerchant({
                        storeId: row.storeId,
                        merchantName: row.merchantName,
                      });
                    }}>
                    <i className='fa fa-history mr-2'></i>
                    {t('Lịch sử thay đổi')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          );
        },
      },
    ],
    [data]
  );
  const handleCloseStore = (storeId: number, isActive: boolean) => {
    let payload: FormUpdateStore = {
      storeId,
      isActive,
    };
    Swal.fire({
      title: t(isActive ? 'Bạn có đồng ý mở điểm GD' : 'Bạn có đồng ý đóng điểm GD'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: t('Đồng ý!'),
      cancelButtonText: t('Hủy'),
    }).then((result) => {
      if (result?.isConfirmed) {
        dispatch(
          updateStore(payload, (status, res) => {
            if (status) {
              setSubmitForm(true);
              alert(
                'success',
                isActive ? 'Mở điểm giao dịch thành công' : 'Đóng điểm giao dịch thành công',
                t
              );
            }
          })
        );
      }
    });
  };
  return (
    <>
      <DataTableCustom
        dataList={data}
        paginationTotalRows={totalRow}
        columns={columns}
        t={t}
        isLoading={loading}
        nameDataTable='colApprovalMerchant'
        className='approval-merchant-table'
        getDataList={getDataList}
        isSorting={true}
        fixedHeader={true}
        {...rest}
      />
      {isShowModalStoreHistory && (
        <ModalStoreHistory
          isShow={isShowModalStoreHistory}
          onHide={() => setShowModalStoreHistory(false)}
          storeId={infoMerchant?.storeId}
          merchantName={infoMerchant?.merchantName}
        />
      )}
    </>
  );
}
