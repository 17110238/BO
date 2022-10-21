import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import ModalChangePassword from 'components/common/ModalAccountMc/ModalChangePasswordv2';
import FileSaver from 'file-saver';
import { SubscriptionClient } from 'graphql-subscriptions-client';
import _ from 'lodash';
import { FilterSearchParams, MerchantAccount, SearchByRoleInput, stateMcEnum } from 'models';
import { UserBo } from 'models/user/accountMerchant';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  exportFileMerchant,
  exportFileMerchantSocketFailure,
  exportFileMerchantSocketSuccess,
  getListAccountSale,
  getMccCodeListPartial,
  requestUpdateActiveMerchant,
  resendMailApproval,
  searchMerchant,
  updateContractMerchant,
} from 'redux/actions';
import { handleDowloadSaga } from 'redux/actions/handleDowloadActions';
import { swalCustom } from 'utils/helpers';
import alert from 'utils/helpers/alert';
import { ChangeOfHistoryModal } from '../approvalMerchant/modal/ChangeOfHistory';
// import HeaderPaymentLink from './HeaderPayMELink';
import { clearFalsyObject } from 'utils/helpers/replaceUrl';
import { ChangeOfFeeConfigurationModal } from '../approvalMerchant/modal/ChangeOfFeeConfiguration';
import { ModalContract } from '../approvalMerchant/modal/ModalContract';
import ModalCreateSettlement from '../approvalMerchant/modal/ModalCreatesettlement';
import ModalMailDisableSettlement from '../approvalMerchant/modal/ModalMailDisableSettlement';
import BoxSearchMerchant, { SearchParams } from './BoxSearchMerchant';
import DataTableMerchant from './DataTableMerchant';
import HeaderMerchantContainer from './HeaderMerchantContainer';
interface ModalStateType {
  modalChangePassword: boolean;
  modalContract: boolean;
  modalHistoryUpdate: boolean;
  modalConfigurationFee: boolean;
  modalCreateSettlement: boolean;
  modalDisableMailSettlement: boolean;
}

const ManagerMerchant: React.FC = () => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const router = useRouter();

  const merchantList = useSelector<any, MerchantAccount[]>(
    (state) => state?.merchantRD?.merchantInfoArray
  );
  const loading = useSelector<any, boolean>((state) => state?.merchantRD?.loading);
  const accountIdLogin = useSelector<any>(
    (state) => state?.authReducers?.accountInfo?.profile.accountId
  );

  const [modalState, setModalState] = useState<ModalStateType>({
    modalChangePassword: false,
    modalContract: false,
    modalHistoryUpdate: false,
    modalCreateSettlement: false,
    modalDisableMailSettlement: false,
    modalConfigurationFee: false,
  });
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [dataContract, setDataContract] = useState<string>('');
  const [isShowFilter, setIsShowFilter] = useState<boolean>(true);
  const [filter, setFilter] = useState<any>({});
  const [merchantId, setMerchantId] = useState<string>('');
  const [merchantName, setMerchantName] = useState<string>('');
  const [saleMembers, setSaleMembers] = useState<UserBo[]>([]);
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [socket, setSocket] = useState('');

  const client = new SubscriptionClient(socket, {
    reconnect: true,
    lazy: true, // only connect when there is a query
    connectionCallback: (error) => {
      error && console.error(error);
    },
  });

  const handleOnClickChangeOfHistoryMerchant = (
    merchantId: string | undefined,
    merchantName: string | undefined
  ) => {
    setModalState({ ...modalState, modalHistoryUpdate: true });
    merchantId && setMerchantId(merchantId);
    merchantName && setMerchantName(merchantName);
  };

  const handleChangeOfFeeConfigurationChangeHistory = (
    merchantId: string | undefined,
    merchantName: string | undefined
  ) => {
    setModalState({ ...modalState, modalConfigurationFee: true });
    merchantName && setMerchantName(merchantName);
    merchantId && setMerchantId(merchantId);
  };

  const formatDataSearch = (data: SearchParams) => {
    const dataCopy: any = { ...data };

    dataCopy.type = dataCopy?.type !== 'ALL' ? dataCopy?.type : undefined;

    !Object.keys(dataCopy?.createdAt || {}).length && delete dataCopy?.createdAt;

    return _.pickBy(dataCopy);
  };

  const handleSubmitSearch = (data: SearchParams) => {
    const newData = formatDataSearch(data);

    setFilter({
      ...newData,
      state: stateMcEnum.APPROVED,
    });

    // payload trùng vẫn có thể search được
    setSubmitForm(true);
  };

  const handleSearchMerchant = (start?: number, limit?: number, sort?: {}) => {
    const payload: FilterSearchParams = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
      // sort,
    };

    function getListMerchant(payload: FilterSearchParams) {
      setLoadingTable(true);
      dispatch(
        searchMerchant(payload, (status, res) => {
          setSubmitForm(false);
          setLoadingTable(false);
        })
      );
    }

    return {
      payload,
      getList: getListMerchant,
      submitForm,
    };
  };

  const handleCloseMerchant: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const target = e.target as HTMLInputElement;
    const merchantId = +(target.getAttribute('data-index') || 0);
    const merchantName = target.getAttribute('data-name');

    const popup = await swalCustom.fire({
      icon: 'info',
      title: `Tạo yêu cầu ${!target.checked ? 'đóng' : 'mở'} tài khoản`,
      html: `MC: <strong>${merchantName}</strong> - ID: <strong>${merchantId}</strong>`,
    });

    popup.isConfirmed &&
      dispatch(
        requestUpdateActiveMerchant({ id: merchantId, isActive: !target.checked }, (state, res) => {
          alert(state ? 'success' : 'error', res.message, t);
          setSubmitForm(state);
        })
      );
  };

  const handleSubmitContract = (data: any) => {
    setDataContract(data);
    setModalState({ ...modalState, modalContract: true });
  };

  const handleChangePasswordMerchant = (id?: string) => {
    setMerchantId(id!);
    setModalState({ ...modalState, modalChangePassword: true });
  };

  const handleCreateSettlement = (id?: string) => {
    setMerchantId(id!);
    setModalState({ ...modalState, modalCreateSettlement: true });
  };

  const handleDisableMailSettlement = (id?: string) => {
    setMerchantId(id!);
    setModalState({ ...modalState, modalDisableMailSettlement: true });
  };

  const handleSendApprovalMail = async (data?: MerchantAccount) => {
    const popup = await swalCustom.fire({
      icon: 'info',
      title: 'Xác nhận gửi lại mail duyệt',
      html: `MC: <strong>${data?.businessOverview?.abbreviationName}</strong> - ID: <strong>${data?.merchantId}</strong>`,
    });

    if (popup.isConfirmed) {
      //call API
      dispatch(
        resendMailApproval({ merchantId: +data?.merchantId! }, (state, res) => {
          alert(state ? 'success' : 'error', res?.message, t);
        })
      );
    }
  };

  const handleUpdateContract = async (data?: MerchantAccount) => {
    const popup = await swalCustom.fire({
      icon: 'info',
      title: 'Xác nhận cập nhật hợp đồng',
      html: `MC: <strong>${data?.businessOverview?.abbreviationName}</strong> - ID: <strong>${data?.merchantId}</strong>`,
    });

    if (popup.isConfirmed) {
      //call API
      dispatch(
        updateContractMerchant({ merchantId: +data?.merchantId! }, (state, res) => {
          alert(state ? 'success' : 'error', res?.message, t);
        })
      );
    }
  };

  const handleExportMerchantView = async (type: string) => {
    dispatch(exportFileMerchant({ ...filter }, (state, res) => {}));
    client?.unsubscribeAll();
    client?.request({ query }).subscribe({
      next({ data }: any) {
        let dataForm = data?.SubExport?.SubExportExcel;
        let urlData = data?.SubExport?.SubExportExcel?.data;
        client?.unsubscribeAll();
        dispatch(
          handleDowloadSaga({ data: `${urlData}` }, async (state, res) => {
            if (state && dataForm.accountId === accountIdLogin) {
              await FileSaver.saveAs(res, `${new Date().getTime()}.xlsx`);

              dispatch(exportFileMerchantSocketSuccess());
              client?.unsubscribeAll();
              alert('success', 'Xuất file thành công', t);
            } else {
              dispatch(exportFileMerchantSocketFailure());
              client?.unsubscribeAll();
              alert('error', 'Xuất file thất bại', t);
            }
          })
        );
      },
    });
  };

  useEffect(() => {
    const payload: SearchByRoleInput = {
      filter: {
        role: 'ins.sale',
      },
      paging: {
        start: 0,
        limit: 100,
      },
    };
    dispatch(
      getListAccountSale(payload, (status, res) => {
        setSaleMembers(res);
      })
    );
  }, []);

  useEffect(() => {
    // let data: SearchParams = Router.query;
    const params = { ...router.query };
    if (Object.keys(router.query).length) {
      delete params.to;
      delete params.from;

      const payload = clearFalsyObject({
        state: 'APPROVED',
        ...params,
        operatorAccountId: +(router?.query?.operatorAccountId as string) || undefined,
        type: router.query?.type !== 'ALL' ? router.query?.type : undefined,
        createdAt: {
          from: router.query?.from,
          to: router.query?.to,
        },
      });

      setFilter(payload);
      setSubmitForm(true);
    } else {
      dispatch({
        type: 'SEARCH_MERCHANT_FAILURE',
      });
    }

    dispatch(getMccCodeListPartial());
  }, []);

  useEffect(() => {
    return () => {
      dispatch(exportFileMerchantSocketFailure());
      client.unsubscribeAll();
    };
  }, [router]);

  useEffect(() => {
    return () => {
      dispatch(exportFileMerchantSocketFailure());
    };
  }, []);

  useEffect(() => {
    let socket = new WebSocket(`${process.env.NEXT_PUBLIC_GAPI_GRAPHQL_URL_WS}/graphql`);
    setSocket(socket.url);
  }, []);

  return (
    <>
      <div className='merchant-container'>
        <HeaderMerchantContainer
          isShowFilter={isShowFilter}
          onClickExport={handleExportMerchantView}
          onClickFilter={() => {
            setIsShowFilter(!isShowFilter);
          }}
        />
        <div className='box-payment'>
          {isShowFilter && (
            <BoxSearchMerchant
              loading={loadingTable}
              saleMembers={saleMembers}
              onSubmitSearch={handleSubmitSearch}
              onExportFile={handleExportMerchantView}
            />
          )}
          <DataTableMerchant
            data={merchantList}
            onClickChangePassword={handleChangePasswordMerchant}
            onSubmitContract={handleSubmitContract}
            onCloseMerchant={handleCloseMerchant}
            onClickChangeOfHistoryMerchant={handleOnClickChangeOfHistoryMerchant}
            onClickChangeOfFeeConfigurationChangeHistory={
              handleChangeOfFeeConfigurationChangeHistory
            }
            onClickCreateSettlement={handleCreateSettlement}
            onClickDisableMailSettlement={handleDisableMailSettlement}
            onClickSendAppovalMail={handleSendApprovalMail}
            onClickUpdateContract={handleUpdateContract}
            getDataList={handleSearchMerchant}
            {...{ refreshTable: submitForm, isLoading: loadingTable }}
          />
        </div>
      </div>

      <ModalContract
        showModal={modalState.modalContract}
        dataContract={dataContract}
        onHide={() => {
          setModalState({ ...modalState, modalContract: false });
        }}
      />

      <ModalChangePassword
        accountId={merchantId}
        show={modalState.modalChangePassword}
        handleClose={() => {
          setModalState({ ...modalState, modalChangePassword: false });
        }}
      />

      <ChangeOfHistoryModal
        show={modalState.modalHistoryUpdate}
        onHide={() => {
          setModalState({ ...modalState, modalHistoryUpdate: false });
        }}
        merchantId={merchantId}
        merchantName={merchantName}
      />

      <ChangeOfFeeConfigurationModal
        show={modalState.modalConfigurationFee}
        onHide={() => {
          setModalState({ ...modalState, modalConfigurationFee: false });
        }}
        merchantId={merchantId}
      />

      <ModalCreateSettlement
        show={modalState.modalCreateSettlement}
        merchantId={merchantId}
        onHide={() => {
          setModalState({ ...modalState, modalCreateSettlement: false });
        }}
      />

      <ModalMailDisableSettlement
        show={modalState.modalDisableMailSettlement}
        merchantId={merchantId}
        onHide={() => {
          setModalState({ ...modalState, modalDisableMailSettlement: false });
        }}
      />

      {loading && <LoadingFullScreen />}
    </>
  );
};

const query = `subscription subExportMc {
  SubExport{
      SubExportExcel{
          message
          succeeded
          type
          accountId
          url
          data
      }
  }
  }`;

export default ManagerMerchant;
