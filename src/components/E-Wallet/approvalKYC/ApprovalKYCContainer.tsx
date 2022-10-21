import { FilterSearchKYC, PayloadRequestEKYC, PayloadSearchKYC, WalletKYC } from 'models';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getEKYCList, updateEKYC, requestEKYC } from 'redux/actions';
import alert from 'utils/helpers/alert';
import BoxSearchApprovalMerchant from './commons/BoxSearchApprovalMerchant';
import DataTableApprovalMerchant from './commons/DatatableApprovalMerchant';
import HeaderApprovalMerchantContainer from './commons/HeaderApprovalMerchantContainer';
import ModalHistoryKYCPayme from './modals/ModalHistoryKYCPayme';
import ModalRejectKYCIC from './modals/ModalRejectKYCIC';
import { StateModalUpdate } from './modals/ModalUpdateInfoKYCPayme';
import _ from 'lodash';
import { clearFalsyObject } from 'utils/helpers/replaceUrl';
const ModalUpdateInfoKYCPayme = dynamic(() => import('./modals/ModalUpdateInfoKYCPayme'), {
  ssr: false,
});

const ModalRejectKYCPayme = dynamic(() => import('./modals/ModalRejectKYCPayme'), {
  ssr: false,
});
interface ModalStateType {
  modalUpdate: boolean;
  modalReject: boolean;
  modalRejectIC: boolean;
  modalHistory: boolean;
}

const ApprovalMerchantContainer = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const dispatch = useDispatch();

  const [isShowFilter, setIsShowFilter] = useState<boolean>(true);
  const [totalKyc, settotalKyc] = useState<number>(0);
  const [kycList, setKycList] = useState<WalletKYC[]>([]);
  const [filter, setFilter] = useState<FilterSearchKYC>({
    state: 'PENDING',
  });
  const [kycSelected, setKYCSelected] = useState<WalletKYC>();
  const [modalState, setModalState] = useState<ModalStateType>({
    modalUpdate: false,
    modalReject: false,
    modalRejectIC: false,
    modalHistory: false,
  });
  const [refreshTable, setRefreshTable] = useState<boolean>(false);
  const [loadingTable, setLoadingTable] = useState<boolean>(false);

  const handleSubmitSearch = (data: FilterSearchKYC) => {
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

    function getList(payload: PayloadSearchKYC) {
      setLoadingTable(true);
      dispatch(
        getEKYCList(payload, (state, res) => {
          setKycList(res?.data);
          settotalKyc(res?.totalRow || 0);
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

  const handleShowModal = (data: WalletKYC, type?: string) => {
    const result: React.MouseEventHandler<HTMLDivElement> = (e) => {
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
      setKYCSelected(data);
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
      const payload = clearFalsyObject({
        ...params,
        createdAt: {
          from: router.query?.from ? (router.query?.from as string) : undefined,
          to: router.query?.to ? (router.query?.to as string) : undefined,
        },
      });

      setFilter({ ...payload });
    }
    setRefreshTable(true);
  }, []);

  return (
    <>
      <div className='approval-merchant-container approval-wallet-kyc-container'>
        <HeaderApprovalMerchantContainer
          isShowFilter={isShowFilter}
          total={totalKyc}
          onClickExport={() => {}}
          onClickFilter={() => {
            setIsShowFilter(!isShowFilter);
          }}
        />
        <div className='box-payment'>
          {isShowFilter && (
            <BoxSearchApprovalMerchant
              loading={loadingTable}
              handleSubmitSearch={handleSubmitSearch}
            />
          )}
          <DataTableApprovalMerchant
            data={kycList}
            getDataList={handleSearchApprovalMerchant}
            onClickUpdate={handleShowModal}
            onClickReject={handleShowModal}
            onClickShowHistory={handleShowModal}
            {...{ isLoading: loadingTable }}
          />
        </div>
      </div>
      <ModalUpdateInfoKYCPayme
        show={modalState.modalUpdate}
        onHide={() => {
          setModalState({ ...modalState, modalUpdate: false });
        }}
        type={StateModalUpdate.UPDATE_KYC}
        onUpdateInfoClick={handleCloseModal('MODAL_UPDATE')}
        onRequestUpdateClick={handleCloseModal('MODAL_UPDATE')}
        onRejectKYCClick={handleCloseModal('MODAL_REJECT')}
        onRejectKYCICClick={handleCloseModal('MODAL_REJECT_IC')}
        kycId={kycSelected?.id}
      />

      <ModalRejectKYCPayme
        show={modalState.modalReject}
        onHide={(type?: string) => {
          type === 'RESET_LIST' && setRefreshTable(true);
          setModalState({ ...modalState, modalReject: false });
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
        onHide={(type?: string) => {
          setModalState({ ...modalState, modalHistory: false });
        }}
        kycId={kycSelected?.id}
      />
    </>
  );
};

export default ApprovalMerchantContainer;
