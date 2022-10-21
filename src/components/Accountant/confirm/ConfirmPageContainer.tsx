import useElementSize from 'hook/useElementSize';
import { GetAllTransactionsInput, TransactionResponse } from 'models';
import dynamic from 'next/dynamic';
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getListTransaction, getpaymentMethodList } from 'redux/actions';
import BoxSearchTransaction, { SearchParams } from './BoxSearchConfirm';
import DataTableTransaction from './DataTableConfirm';
import HeaderTransaction from './HeaderConfirm';
const Payint = dynamic(() => import('components/common/ModalPayint/ModalPayint'));

interface ConfirmPageContainerType {
  data?: []
}
interface Payload {
  filter: {
    method?: string | null;
    state?: string | null;
  };
  paging: {
    start: number;
    limit: number;
  };
  sort: {
    createdAt: number;
  };
}

const ConfirmPageContainer = ({ data }: ConfirmPageContainerType) => {
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const [showModalControl, setShowModalControl] = useState<boolean>(false);
  const toggleFilter = () => setShowFilter(!showFilter);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(true);
  const [totalRow, setTotalRow] = useState<number>(0);
  const [modalPayint, setModalPayint] = useState<boolean>(false);
  const transactionList = useSelector<any, TransactionResponse[]>(
    (state) => state?.transactions?.transactionInfoArray
  );
  const [paymentMethodList, setPaymentMethodList] = useState<any[]>([]);
  const [filter, setFilter] = useState({});
  const [squareRef, { width, height }] = useElementSize();

  const handleSubmitSearch = (data: SearchParams) => {
    const { method, state } = data;

    if (method === '') {
      delete data.method;
    }
    if (state === '') {
      delete data.state;
    }
    setFilter({ ...data });
  };
  const showModalControl1 = () => setShowModalControl(true)
  const showModalPayint = () => setModalPayint(true);

  const hideModalPayint = () => setModalPayint(false);

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
            setTotalRow(res.totalRow);
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

  useEffect(() => {
    dispatch(
      getpaymentMethodList((status, response) => {
        if (status) {
          setPaymentMethodList(response);
        }
      })
    );
  }, [dispatch]);

  return (
    <div className='box-content transaction-container'>
      {modalPayint && (
        <Payint
          refreshTransactionList={() => setSubmitForm(true)}
          showModal={modalPayint}
          closeModal={hideModalPayint}
        />
      )}
      <HeaderTransaction
        showFilter={showFilter}
        toggleFilter={toggleFilter}
        showModalPayint={showModalControl1}
        onClickExport={() => { }}
        t={t}
      />
      {showFilter && (
        <BoxSearchTransaction
          showFilter={showFilter}
          submitForm={submitForm}
          handleSubmitSearch={handleSubmitSearch}
          paymentMethodList={paymentMethodList}
          setSubmitForm={setSubmitForm}
          boxSearchRef={squareRef}
        />
      )}
      <DataTableTransaction
        t={t}
        data={data}
        totalFilter={totalRow}
        getDataList={handleGetListTransaction}
        setSubmitForm={setSubmitForm}
        heightBoxSearch={height + 1}
      />
      {/* <ModalControl show={showModalControl} onHide={() => { setShowModalControl(false); }} /> */}
      {/* <ModalUpdatePayment show={showModalControl} onHide={() => { setShowModalControl(false); }} /> */}
    </div>
  );
};

export default ConfirmPageContainer;
