import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import { delegateStore, StoreMerchant } from 'models';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getDelegateStore } from 'redux/actions';
import ModalMember from '../Modals/ModalMember';
import ModalTempPassword from '../Modals/ModalTempPassword';

interface MemberModal {
  isShow: boolean;
  isEdit: boolean;
}

export default function StoreMemberContainer({ ...rest }) {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const loading = useSelector<any, boolean>((state) => state?.merchantRD?.loading);
  const [dataStore, setDataStore] = useState<StoreMerchant>();
  const [dataDelegate, setDataDelegate] = useState<Array<delegateStore>>([]);
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [isShowModalMember, setShowModalMember] = useState<MemberModal>({
    isShow: false,
    isEdit: false,
  });
  const [isShowModalPassword, setShowModalPassword] = useState<boolean>(false);
  const router = useRouter();
  const columns: TableColumn<any>[] = useMemo(
    () => [
      {
        name: t('STT'),
        minWidth: '80px',
        maxWidth: '100px',
        cell: (row, index) => {
          return <>{index + 1}</>;
        },
      },
      {
        name: t('ID nhân viên'),
        minWidth: '150px',
        maxWidth: '150px',
        cell: (row) => {
          return <span>{row?.accountId}</span>;
        },
      },
      {
        name: t('Tên nhân viên'),
        minWidth: '150px',
        maxWidth: '200px',
        cell: (row) => {
          return <span>{row?.fullname}</span>;
        },
      },
      {
        name: t('Tên đăng nhập'),
        minWidth: '150px',
        maxWidth: '200px',
        cell: (row) => {
          return <span>{row?.username}</span>;
        },
      },
      {
        name: t('Số ĐT'),
        minWidth: '150px',
        maxWidth: '200px',
        cell: (row) => {
          return <span>{row?.phone}</span>;
        },
      },
      {
        name: t('Loại TK'),
        minWidth: '150px',
        maxWidth: '200px',
        cell: (row) => {
          return <span>{row?.role}</span>;
        },
      },
      {
        name: t('Điểm GD'),
        minWidth: '200px',
        maxWidth: '250px',
        cell: (row) => {
          return <span>{row?.storeName}</span>;
        },
      },
      {
        name: t('Tình trạng'),
        minWidth: '130px',
        maxWidth: '150px',
        cell: (row) => {
          return (
            <span className={row?.isActive ? 'state-success-modal' : 'state-cancel-modal'}>
              {row?.isActive ? t('Hoạt động') : t('Ngưng hoạt động')}
            </span>
          );
        },
      },
    ],
    [dataDelegate, dataStore]
  );
  const getDataList = (id: number): any => {
    if (router.query?.id) {
      const payload: any = {
        storeId: id,
      };
      dispatch(
        getDelegateStore(payload, (state, res) => {
          if (state) {
            setDataDelegate(res);
          }
        })
      );
    }
  };
  useEffect(() => {
    if (router.query?.id) {
      getDataList(parseInt(router.query?.id.toString()));
    }
  }, [router.query?.id]);
  useEffect(() => {
    setSubmitForm(true);
  }, []);
  return (
    <>
      <div className='storeDetail-container'>
        <div className='storeDetail-header'>
          <div className='btn-back'>
            <button onClick={() => router.push(`/cong-thanh-toan/quan-ly-cua-hang`)}>
              <i className='fas fa-arrow-left btn-back__icon'></i>
              Trở về
            </button>
          </div>
        </div>
        <div className='storeDetail-member__content'>
          <div className='storeDetail-member__header'>
            <div className='header-left'>
              <p>{t('Nhân Viên Điểm GD')}</p>
            </div>
            {/* <div className='header-right'>
              <button
                className='btn btn-secondary btn-search'
                onClick={() => setShowModalMember({ ...isShowModalMember, isShow: true })}>
                <i className='fa fa-plus mr-0'></i>
              </button>
            </div> */}
          </div>
          <div className='storeDetail-member__table'>
            <DataTableCustom
              dataList={dataDelegate}
              columns={columns}
              t={t}
              isLoading={loading}
              nameDataTable='colApprovalMerchant'
              className='approval-merchant-table'
              isSorting={true}
              fixedHeader={true}
              {...rest}
            />
          </div>
        </div>
      </div>
      {isShowModalMember.isShow && (
        <ModalMember
          isShow={isShowModalMember.isShow}
          isEdit={isShowModalMember.isEdit}
          onHide={() => setShowModalMember({ isShow: false, isEdit: false })}
        />
      )}
      {isShowModalPassword && (
        <ModalTempPassword
          isShow={isShowModalPassword}
          onHide={() => setShowModalPassword(false)}
        />
      )}
    </>
  );
}
