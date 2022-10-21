import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import useElementSize from 'hook/useElementSize';
import { GetAllTransactionsInput, TransactionResponse } from 'models';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getListTransaction, getpaymentMethodList } from 'redux/actions';
import { exportFileTransactionFailure } from 'redux/actions/transactionActions';
import BoxSearchMultiTransferCampaign, { SearchParams } from './BoxSearchMultitransferCampaign';
import DataTableMultiTransferCampaign from './DataTableMultitransferCampaign';
import HeaderMultiTransferCampaign from './HeaderMultitransferCampaign';
import ModalPayrollTransaction from './modal/ModalPayrollTransaction';
const ModalTransfer = dynamic(() => import('./modal/ModalTransfer'));

const MultitransferCampaignContainer: React.FC = (props: any) => {
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setShowFilter(!showFilter);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(true);
  const [totalRow, setTotalRow] = useState<number>(0);
  const [openModalTransfer, setOpenModalTransfer] = useState<boolean>(false);
  const [openModalPayroll, setOpenModalPayroll] = useState<boolean>(false);
  const transactionList = useSelector<any, TransactionResponse[]>(
    (state) => state?.transactions?.transactionInfoArray
  );
  const [paymentMethodList, setPaymentMethodList] = useState<any[]>([]);
  const [filter, setFilter] = useState({});

  const handleSubmitSearch = (data: SearchParams) => {
    setFilter({ ...data });
  };

  const handleGetListTransaction = (start?: number, limit?: number, sort?: {}) => {
    const payload: GetAllTransactionsInput = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function handleGetListTransaction(payload: GetAllTransactionsInput) {
      dispatch(
        getListTransaction(payload, (status, res) => {
          if (status) {
            setTotalRow(res.data.length);
          }
        })
      );
    }

    return {
      payload,
      getList: handleGetListTransaction,
      submitForm,
      setSubmitForm,
    };
  };

  return (
    <div className='box-content multitransfer-campaign-container'>
      <HeaderMultiTransferCampaign
        showFilter={showFilter}
        toggleFilter={toggleFilter}
        onOpenTransferModal={() => setOpenModalTransfer(true)}
      />
      {showFilter && (
        <BoxSearchMultiTransferCampaign
          showFilter={showFilter}
          submitForm={submitForm}
          handleSubmitSearch={handleSubmitSearch}
          paymentMethodList={paymentMethodList}
          setSubmitForm={setSubmitForm}
          filter={filter}
        />
      )}
      <DataTableMultiTransferCampaign
        t={t}
        data={transactionList}
        totalFilter={totalRow}
        getDataList={handleGetListTransaction}
        setSubmitForm={setSubmitForm}
        onOpenPayrollModal={() => setOpenModalPayroll(true)}
      />
      <ModalTransfer
        show={openModalTransfer}
        handleClose={() => setOpenModalTransfer(false)}
        handleRefreshTransferListHistory={() => setSubmitForm(true)}
      />
      <ModalPayrollTransaction
        show={openModalPayroll}
        handleClose={() => setOpenModalPayroll(false)}
        handleRefreshTransferListHistory={() => setSubmitForm(true)}
      />
      
    </div>
  );
};

export default MultitransferCampaignContainer;
