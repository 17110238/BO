import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import { SubscriptionClient } from 'graphql-subscriptions-client';
import { GetAllTransactionsInput, SearchByRoleInput, TransactionResponse } from 'models';
import { UserBo } from 'models/user/accountMerchant';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  getListAccountSale,
  getListTransaction,
  getPaymentMethodFullType,
  getpaymentMethodList,
} from 'redux/actions';
import {
  exportFileTransaction,
  exportFileTransactionFailure,
  exportFileTransactionSucess,
} from 'redux/actions/transactionActions';
import { handleDowloadSaga, exportFileFailure } from 'redux/actions/handleDowloadActions';
import FileSaver, { saveAs } from 'file-saver';
import alert from 'utils/helpers/alert';
import BoxSearchTransaction, { SearchParams } from './BoxSearchTransaction';
import DataTableTransaction from './DataTableTransaction';
import HeaderTransaction from './HeaderTransaction';
const Payint = dynamic(() => import('components/common/ModalPayint/ModalPayint'));

const query1 = `subscription subExportMc {
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

const TransactionPageContainer: React.FC = (props: any) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setShowFilter(!showFilter);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [totalRow, setTotalRow] = useState<number>(0);
  const [modalPayint, setModalPayint] = useState<boolean>(false);
  const transactionList = useSelector<any, TransactionResponse[]>(
    (state) => state?.transactions?.transactionInfoArray
  );
  const [paymentMethodList, setPaymentMethodList] = useState<any[]>([]);
  const [filter, setFilter] = useState({});
  const [saleMembers, setSaleMembers] = useState<UserBo[]>([]);

  // export file
  const accountIdLogin = useSelector<any>(
    (state) => state?.authReducers?.accountInfo?.profile.accountId
  );
  const loadingExportTransac = useSelector<any>((state) => state?.transactions?.loadingExport);
  const [socket, setSocket] = useState('');
  const client = new SubscriptionClient(socket, {
    reconnect: true,
    lazy: true, // only connect when there is a query
    connectionCallback: (error) => {
      error && console.error(error);
    },
  });

  const handleSubmitSearch = (data: SearchParams) => {
    setFilter({ ...data });
    setSubmitForm(true);
  };

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
            setSubmitForm(false);
            setTotalRow(res.data.length);
          }
        })
      );
    }

    return {
      payload,
      getList: handleGetListTransaction,
      submitForm,
    };
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
    dispatch(
      getPaymentMethodFullType((status, response) => {
        if (status) {
          setPaymentMethodList(response);
        }
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (loadingExportTransac) {
      dispatch(exportFileTransactionFailure());
    }
  }, []);

  // --------------------- export file -----------------
  useEffect(() => {
    let socket = new WebSocket(`${process.env.NEXT_PUBLIC_GAPI_GRAPHQL_URL_WS}/graphql`);
    setSocket(socket.url);
  }, []);

  const sub: any = client.request({ query: query1 });

  const handleExportMerchantView = async (type: string) => {
    dispatch(exportFileTransaction({ ...filter }, (state, res) => { }));
    client?.unsubscribeAll();
    sub.subscribe({
      next({ data }: any) {
        client?.unsubscribeAll();
        let dataForm = data?.SubExport?.SubExportExcel;
        let urlData = data?.SubExport?.SubExportExcel?.data;
        dispatch(
          handleDowloadSaga({ data: `${urlData}` }, async (state, res) => {
            if (state && dataForm.accountId === accountIdLogin) {
              await FileSaver.saveAs(res, `${new Date().getTime()}.xlsx`);
              dispatch(exportFileTransactionSucess());
              alert('success', 'Xuất file thành công', t);
              client?.unsubscribeAll();
            } else {
              dispatch(exportFileTransactionFailure());
              alert('error', 'Xuất file thất bại', t);
              client?.unsubscribeAll();
            }
          })
        );
      },
    });
  };

  useEffect(() => {
    return () => {
      dispatch(exportFileTransactionFailure());
    };
  }, [router]);
  // -------------------------------------------------

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
        showModalPayint={showModalPayint}
        onClickExport={() => { }}
        handleExportMerchantView={handleExportMerchantView}
        t={t}
      />
      <BoxSearchTransaction
        loading={loadingExportTransac}
        showFilter={showFilter}
        submitForm={submitForm}
        handleSubmitSearch={handleSubmitSearch}
        paymentMethodList={paymentMethodList}
        setSubmitForm={setSubmitForm}
        filter={filter}
        saleMembers={saleMembers}
      />
      <DataTableTransaction
        t={t}
        data={transactionList}
        totalFilter={totalRow}
        getDataList={handleGetListTransaction}
        setSubmitForm={setSubmitForm}
        isNotHaveTotalRow={true}
      />
      {loadingExportTransac && <LoadingFullScreen />}
    </div>
  );
};

export default TransactionPageContainer;
