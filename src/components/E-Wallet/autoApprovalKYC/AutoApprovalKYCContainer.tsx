import { PayloadRequestEKYC, WalletKYC } from 'models';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getEKYCList, requestApprovalAutoEKYC } from 'redux/actions';
import { swalCustom } from 'utils/helpers';
import alert from 'utils/helpers/alert';
import ModalHistoryKYCPayme from '../approvalKYC/modals/ModalHistoryKYCPayme';
import ModalRejectKYCIC from '../approvalKYC/modals/ModalRejectKYCIC';
import { StateModalUpdate } from '../approvalKYC/modals/ModalUpdateInfoKYCPayme';
import BoxAutoSearchApprovalMerchant from './commons/BoxSearchAutoApprovalMerchant';
import DataTableAutoApprovalMerchant from './commons/DatatableAutoApprovalMerchant';
import HeaderAutoApprovalMerchantContainer from './commons/HeaderAutoApprovalKYCContainer';
import _ from 'lodash';
import { clearFalsyObject } from 'utils/helpers/replaceUrl';
const ModalUpdateInfoKYCPayme = dynamic(
  () => import('../approvalKYC/modals/ModalUpdateInfoKYCPayme'),
  {
    ssr: false,
  }
);

const ModalRejectKYCPayme = dynamic(() => import('../approvalKYC/modals/ModalRejectKYCPayme'), {
  ssr: false,
});
interface ModalStateType {
  modalUpdate: boolean;
  modalReject: boolean;
  modalHistory: boolean;
  modalRejectIC: boolean;
}

const AutoApprovalKYCContainer = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const dispatch = useDispatch();

  const [isShowFilter, setIsShowFilter] = useState<boolean>(true);
  const [totalKyc, setTotalKyc] = useState<number>(0);
  const [kycList, setKycList] = useState<WalletKYC[]>([]);
  const [filter, setFilter] = useState<any>({
    state: 'APPROVED',
    kycAutoState: 'AUTO_APPROVED',
  });
  const [kycSelected, setKYCSelected] = useState<WalletKYC>();
  const [refreshTable, setRefreshTable] = useState<boolean>(false);
  const [modalState, setModalState] = useState<ModalStateType>({
    modalUpdate: false,
    modalReject: false,
    modalHistory: false,
    modalRejectIC: false,
  });
  const [loadingTable, setLoadingTable] = useState<boolean>(false);

  const handleSubmitSearch = (data: any) => {
    setFilter(data);

    setRefreshTable(true);
  };

  const handleSearchApprovalMerchant = (start?: number, limit?: number, sort?: {}) => {
    const payload = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function getList(payloadSearch: any) {
      setLoadingTable(true);
      dispatch(
        getEKYCList(payloadSearch, (state, res) => {
          setKycList(res?.data);
          setTotalKyc(res?.totalRow || 0);
          setRefreshTable(false);
          setLoadingTable(false);
        })
      );
    }

    return {
      payload,
      getList,
      submitForm: refreshTable,
    };
  };

  const handleRequestApprovalAuto = (data: WalletKYC) => {
    const result: React.MouseEventHandler<HTMLDivElement> = async (e) => {
      const swal = await swalCustom.fire({
        icon: 'info',
        title: 'Xác nhận duyệt KYC',
        html: `SĐT: <strong>${data?.phone}</strong> - Họ Tên: <strong>${data?.fullname}</strong>`,
      });
      if (swal.isConfirmed) {
        const submitData: PayloadRequestEKYC = {
          id: data?.id!,
        };
        dispatch(
          requestApprovalAutoEKYC(submitData, (state, res) => {
            if (!state) {
              setKYCSelected(data);
              setModalState({ ...modalState, modalUpdate: true });
              alert('error', 'Vui lòng cập nhật thông tin đinh đanh', t);
              return;
            }
            alert('success', res?.message, t);
            setRefreshTable(true);
          })
        );
      }
    };

    return result;
  };

  const handleShowModal = (data: WalletKYC, type?: string) => {
    const result: React.MouseEventHandler<HTMLDivElement> = (e) => {
      setKYCSelected(data);

      switch (type) {
        case 'MODAL_UPDATE':
          setModalState({ ...modalState, modalUpdate: true });
          break;

        case 'MODAL_REJECT':
          setModalState({ ...modalState, modalReject: true });
          break;

        case 'MODAL_HISTORY':
          setModalState({ ...modalState, modalHistory: true });
          break;
        case 'MODAL_REJECT_IC':
          setModalState({ ...modalState, modalRejectIC: true });
          break;
        default:
          break;
      }
    };

    return result;
  };

  const handleCloseModal = (type?: string) => {
    const result = (state?: boolean) => {
      switch (type) {
        case 'MODAL_UPDATE':
          state && (setRefreshTable(true), setModalState({ ...modalState, modalUpdate: false }));
          break;
        case 'MODAL_REJECT':
          setModalState({ ...modalState, modalUpdate: false, modalReject: true });
          break;
        case 'MODAL_REJECT_IC':
          setModalState({ ...modalState, modalUpdate: false, modalRejectIC: true });
          break;
        default:
          break;
      }
    };

    return result;
  };

  useEffect(() => {
    const params = { ...router.query };
    if (Object.keys(router.query).length) {
      delete params.to;
      delete params.from;
      if (params?.state === 'ALL') params.state = '';
      if (params?.kycAutoState === 'ALL') params.kycAutoState = '';
      const payload = clearFalsyObject({
        ...params,
        ...(router?.query?.merchantId
          ? { merchantId: +(router?.query?.merchantId as string) }
          : {}),
        createdAt: {
          from: router.query?.from as string,
          to: router.query?.to as string,
        },
      });

      setFilter({ ...payload });
    }
    setRefreshTable(true);
  }, []);

  return (
    <>
      <div className='approval-merchant-container approval-auto-wallet-kyc-container'>
        <HeaderAutoApprovalMerchantContainer
          isShowFilter={isShowFilter}
          total={totalKyc}
          onClickExport={() => {}}
          onClickFilter={() => {
            setIsShowFilter(!isShowFilter);
          }}
        />
        <div className='box-payment'>
          {isShowFilter && (
            <BoxAutoSearchApprovalMerchant
              loading={loadingTable}
              handleSubmitSearch={handleSubmitSearch}
            />
          )}
          <DataTableAutoApprovalMerchant
            data={kycList}
            getDataList={handleSearchApprovalMerchant}
            onClickUpdate={handleShowModal}
            onClickReject={handleShowModal}
            onClickHistoryKYC={handleShowModal}
            onClickAcceptApproved={handleRequestApprovalAuto}
            {...{ isLoading: loadingTable }}
          />
        </div>
      </div>
      <ModalUpdateInfoKYCPayme
        show={modalState.modalUpdate}
        onHide={() => {
          setModalState({ ...modalState, modalUpdate: false });
        }}
        type={StateModalUpdate.UPDATE_AUTO_KYC}
        onUpdateInfoClick={handleCloseModal('MODAL_UPDATE')}
        onRequestUpdateClick={handleCloseModal('MODAL_UPDATE')}
        onRejectKYCClick={handleCloseModal('MODAL_REJECT')}
        onRejectKYCICClick={handleCloseModal('MODAL_REJECT_IC')}
        kycId={kycSelected?.id}
      />

      <ModalRejectKYCPayme
        show={modalState.modalReject}
        onHide={(type?: string) => {
          setModalState({ ...modalState, modalReject: false });
          type === 'RESET_LIST' && setRefreshTable(true);
        }}
        kycId={kycSelected?.id}
      />

      <ModalRejectKYCIC
        show={modalState.modalRejectIC}
        onHide={(type?: string) => {
          setModalState({ ...modalState, modalRejectIC: false });
          type === 'RESET_LIST' && setRefreshTable(true);
        }}
        kycId={kycSelected?.id}
      />

      <ModalHistoryKYCPayme
        show={modalState.modalHistory}
        onHide={() => {
          setModalState({ ...modalState, modalHistory: false });
        }}
        kycId={kycSelected?.id}
      />
    </>
  );
};

export default AutoApprovalKYCContainer;
