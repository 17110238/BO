import { EwalletPaymeTransferHistoryInput, EwalletPaymeTransferHistoryResponseData, GetAllTransactionsInput, TransactionResponse } from 'models';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getListPaymeTransferHistory, getListTransaction, getpaymentMethodList } from 'redux/actions';
import { exportFileTransactionFailure } from 'redux/actions/transactionActions';
import BoxSearchTransfer, { SearchParams } from './BoxSearchTransfer';
import DataTableTransfer from './DataTableTransfer';
import HeaderTransfer from './HeaderTransfer';
import ModalDetailTransfer from './modal/ModalDetailTransfer';
const ModalTransfer = dynamic(() => import('./modal/ModalTransfer'));

const TransferContainer: React.FC = (props: any) => {
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setShowFilter(!showFilter);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [openModalTransfer, setOpenModalTransfer] = useState<boolean>(false);
  const [openModalConfirm, setOpenModalConfirm] = useState<boolean>(false);
  // const transferHistoryList = useSelector<any, EwalletPaymeTransferHistoryResponseData[]>(
  //   (state) => state?.walletPaymeTransfer?.eWalletTransferHistory
  // );
  const [data, setData] = useState<EwalletPaymeTransferHistoryResponseData[]>([]);
  const [filter, setFilter] = useState({});
  const [idConfirm, setIdConfirm] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);

  const handleSubmitSearch = (data: SearchParams) => {
    setFilter({ ...data });
    setSubmitForm(true);
  };

  const handleGetListPaymeTransferHistory = (start?: number, limit?: number, sort?: {}) => {
    const payload: EwalletPaymeTransferHistoryInput = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function handleGetListPaymeTransferHistory(payload: EwalletPaymeTransferHistoryInput) {
      setLoading(true);
      dispatch(getListPaymeTransferHistory(payload, (status, res) => {
        setSubmitForm(false)
        if (status) {
          setData(res?.data);
        }
        setLoading(false)
      }));
    }

    return {
      payload,
      getList: handleGetListPaymeTransferHistory,
      submitForm,
    };
  };

  return (
    <div className='box-content multitransfer-campaign-container'>
      <HeaderTransfer
        showFilter={showFilter}
        toggleFilter={toggleFilter}
        onOpenTransferModal={() => setOpenModalTransfer(true)}
      />
      <BoxSearchTransfer
        showFilter={showFilter}
        handleSubmitSearch={handleSubmitSearch}
        submitForm={submitForm}
        setSubmitForm={setSubmitForm}
        filter={filter}
        isLoading={isLoading}
      />
      <DataTableTransfer
        t={t}
        isLoading={isLoading}
        data={data}
        getDataList={handleGetListPaymeTransferHistory}
        setIdDetail={setIdConfirm}
        onOpenModalConfirm={() => setOpenModalConfirm(true)}
      />
      <ModalTransfer
        show={openModalTransfer}
        handleClose={() => setOpenModalTransfer(false)}
        handleRefreshTransferListHistory={() => setSubmitForm(true)}
      />
      <ModalDetailTransfer
        idDetail={idConfirm}
        show={openModalConfirm}
        handleClose={() => setOpenModalConfirm(false)}
        handleRefresh={() => setSubmitForm(true)}
      />
    </div>
  );
};

export default TransferContainer;
