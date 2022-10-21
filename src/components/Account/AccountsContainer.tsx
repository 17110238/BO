import React, { useState, useEffect, useRef, useMemo } from 'react';
import BoxSearchAccount, { SearchParams } from './BoxSearchAccount';
import DataTableAccount from './InfoAccountMc/DataTableAccount';
import HeaderAccount from './HeaderAccount';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { searchAccountMc } from 'redux/actions/accountMerchantActions';
import { AccountMerchant } from 'models/account/accountMerchant';
import * as types from 'redux/types/accountMcType';
import { DELETE_TRANSACTION } from 'redux/types';
import AccountMcDetailContainer from './AccountDetail/AccountMcDetailContainer';
import TabDataTableAccount from './TabDataTableAccount';
import ReportTransactionAccountMc from './ReportTransactionAccountMc/DataTableReportTransaction';
import HistoryChangeAccountMc from './HistoryChangeAccountMc/HistoryChangeAccountMc';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getListTransaction, getLogs } from 'redux/actions';
import {
  GetAccountMerchantLogInput,
  GetAllTransactionsInput,
  LogsType,
  TransactionResponse,
} from 'models';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import updateURLParameter from 'utils/helpers/changeUrl';
import Router from 'next/router';
import MainLayout from 'layouts/MainLayout';
dayjs.extend(utc);
interface AccountContainerProps {
  tabActive?: number;
  idMC?: any;
}

const AccountProfileContainer: React.FC<AccountContainerProps> = ({ idMC, tabActive }) => {
  const { t } = useTranslation('common');
  const router :any = useRouter();
  const dispatch = useDispatch();
  const [start, setStart] = useState<number>(0);
  const [limit, setLimit] = useState<number>(20);
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false);
  const [isTabList, setIsTabList] = useState<boolean>(false);
  const [totalRow, setTotalRow] = useState<number>(0);
  const [totalRowLogs, setTotalRowLogs] = useState<number>(0);
  const [dataSearch, setDataSearch] = useState<any>();
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [submitFormTran, setSubmitFormTran] = useState<boolean>(false);
  const [filter, setFilter] = useState({});
  const accountMerchantList = useSelector<any, AccountMerchant[]>(
    (state) => state?.AccountMerchant?.accountMerchantInfoArray
  );
  

  const [infoAccount, setInfoAccount] = useState<AccountMerchant[]>([]);
  const [transactionList, setTransactionList] = useState<TransactionResponse[]>([]);
  const [dataLogs, setDataLogs] = useState<LogsType[]>([]);
  //const [isUnlock, setIsUnlock] = useState<boolean>(infoAccount?.lockAccount)

  const [tab, setTab] = useState<number>(0);
  // const transactionList = useSelector<any, TransactionResponse[]>(
  //   (state) => state?.transactions?.transactionInfoArray
  // );

  // const  isTabList = useSelector<any, boolean>(
  //   (state) => state?.AccountMerchant?.isTabList
  // );
 

  window.addEventListener('load', () => {
    if (!idMC) {
      dispatch({
        type: types.DELETE_ACCOUNT_MC,
      });
    }
    // router.push('/accounts')
    // setTransactionList([])
  });

  const [showFilter, setShowFilter] = useState<boolean>(true);

  useEffect(() => {
    let data: any = Router.query;

    if (idMC) {
      getAccountMc({
        id: idMC,
      });
    }

    return () => {
      dispatch({
        type: types.DELETE_ACCOUNT_MC,
      });
      setInfoAccount([]);
      setTransactionList([]);
      setDataLogs([]);
      setFilter({});
      setDataSearch('');
    };
  }, [idMC]);

  useEffect(() => {
    let data: any = router.query;
    handleChangeSearch({ ...data, id: +data?.id });
  }, []);

  const formatDataSearch = (data: SearchParams) => {
    const dataCopy: any = { ...data };

    dataCopy.createdAt &&
      Object.keys(dataCopy?.createdAt).forEach(
        (key) => !dataCopy.createdAt[key] && delete dataCopy.createdAt[key]
      );

    Object.keys(dataCopy).forEach((key) => !dataCopy[key] && delete dataCopy[key]);

    return dataCopy;
  };

  let getHistoryChange;
  if (dataSearch && infoAccount[0]?.accountId) {
    getHistoryChange = () => {
      const payload: GetAccountMerchantLogInput = {
        search: infoAccount[0]?.accountId || dataSearch || idMC,
        paging: {
          start: start,
          limit: limit,
        },
      };
      const handleGetListLogs = (payload: GetAccountMerchantLogInput) => {
        dispatch(
          getLogs(payload, (status, res) => {
            if (status) {
              setDataLogs(res.data);
              // setTotalRowLogs(res.totalRow);
              setTotalRowLogs(res.data.length);
              setSubmitForm(false);
            } else {
              setDataLogs([]);
            }
          })
        );
      };
      return {
        payload,
        getList: handleGetListLogs,
        submitForm,
        setSubmitForm,
      };
    };
  }
  let handleGetListTransaction;
  if (Object.keys(filter).length > 0 && infoAccount[0]?.accountId) {
    handleGetListTransaction = (start?: number, limit?: number) => {
      const payload: GetAllTransactionsInput = {
        filter: {
          accountId: Number(infoAccount[0]?.accountId),
        },
        paging: {
          start: start!,
          limit: limit!,
        },
      };
      function handleGetListTransaction(payload: GetAllTransactionsInput) {
        dispatch(
          getListTransaction(payload, (status, res) => {
            setSubmitFormTran(false);
            if (status) {
              setTransactionList(res.data);
              // setTotalRow(res.totalRow);
              setTotalRow(res.data.length);
            } else {
              setTransactionList([]);
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
  }
  const getAccountMc = (data: SearchParams) => {
    if (!data?.search) {
      dispatch({
        type: types.DELETE_ACCOUNT_MC,
      });
      setInfoAccount([]);
      setTransactionList([]);
      setDataLogs([]);
      setFilter({});
      setDataSearch('');
      router.replace('/cong-thanh-toan/tai-khoan', undefined, { shallow: true });
      return;
    }
    const payload = {
      filter: data,
      paging: {
        start,
        limit,
      },
      sort: {
        createdAt: 1,
      },
    };
    setDataSearch(data?.search);
    dispatch(
      searchAccountMc(payload, (status, res) => {
        if (status) {
          setInfoAccount(res?.data);
          setIsTabList(true);
        } else {
          setInfoAccount([]);
        }
      })
    );
  };

  const handleChangeSearch = (data: SearchParams) => {
    // if(Boolean(data.search) == false ){
    //   // window.location.href = '/accounts'
    //   setTransactionList([])
    // }else{
    //   let dataUrl: any = data;
    //   let newURL = updateURLParameter(window.location.href, 'locId', 'newLoc');
    //   newURL = updateURLParameter(newURL, 'resId', 'newResId');
    //   window.history.replaceState(
    //     '',
    //     '',
    //     updateURLParameter(window.location.href, "search", encodeURIComponent(dataUrl?.search))
    //   );
    // }
    if (Boolean(data.search) === false) {
      setTransactionList([]);
      setDataLogs([]);
      setFilter({});
      setDataSearch('');
      setInfoAccount([]);
      router.replace('/cong-thanh-toan/tai-khoan', undefined, { shallow: true });
    } else {
      let dataUrl: any = data;
      let newURL = updateURLParameter(window.location.href, 'locId', 'newLoc');
      newURL = updateURLParameter(newURL, 'resId', 'newResId');
      window.history.replaceState(
        '',
        '',
        updateURLParameter(window.location.href, 'search', encodeURIComponent(dataUrl?.search))
      );
      setFilter({ ...data });
      getAccountMc(data);

      setSubmitFormTran(true);
    }
  };

  const handleClearSearch = () => {
    dispatch({
      type: types.DELETE_ACCOUNT_MC,
    });
    // dispatch({
    //   type : DELETE_TRANSACTION
    // })
    setInfoAccount([]);
    setTransactionList([]);
    setDataLogs([]);
    router.replace('/cong-thanh-toan/tai-khoan', undefined, { shallow: true });
  };

  // const handleChangeRowsPerPage = async (newRowsPerPage: number, page: number) => {
  //   setLimit(newRowsPerPage);
  //   setStart(0);
  //   // setSubmitForm(true);
  // };

  const handleChangePage = (page: number) => {
    setStart((page - 1) * limit);
    // setSubmitForm(true);
  };

  // useEffect(() => {
  //     const payload = {
  //     filter : {
  //       id : +Router.query?.id!
  //     },
  //     paging: {
  //       start,
  //       limit,
  //     },
  //     sort: {
  //       createdAt: 1,
  //     },
  //   };

  //   console.log('=======payload', payload);
  //   dispatch(
  //     searchAccountMc(payload, (status, res) => {
  //       if (status) {
  //         console.log('============res', res?.data);
  //         setInfoAccountv2(res?.data)
  //       } else {
  //         setInfoAccountv2([])
  //       }
  //     })
  //   );
  // })

  return (
    <MainLayout isFixedDatatable={tab !== 0}>
      <div className='box-payment'>
        <HeaderAccount
          showFilter={showFilter}
          // toggleFilter={() => {
          //   setShowFilter(!showFilter);
          // }}
        />
        <BoxSearchAccount
          submitForm={submitForm}
          submitFormTran={submitFormTran}
          // dataSearch={idMC || ''}
          dataSearch={router.query?.search?.toString() || ''}
          showFilter={showFilter}
          handleSubmitSearch={handleChangeSearch}
          handleClearSearch={handleClearSearch}
        />

        <TabDataTableAccount
          setSubmitForm={setSubmitForm}
          setTabActive={setTab}
          dataAccountList={infoAccount.length ? [infoAccount[0]] : []}
          transactionList={transactionList}
          dataLoglist={dataLogs}
          handleToggleModalDetail={() => {
            setShowModalDetail(!showModalDetail);
          }}
          getListLogs={getHistoryChange}
          getListTran={handleGetListTransaction}
          dataSearch={dataSearch}
          handleChangeSearch={handleChangeSearch}
          // getAccountMc={getAccountMc}
          totalRow={totalRow}
          totalRowLogs={totalRowLogs}
          t={t}
        />
        <AccountMcDetailContainer
          show={showModalDetail}
          handleToggleModalDetail={() => {
            setShowModalDetail(!showModalDetail);
          }}
        />
        
      </div>
    </MainLayout>
  );
};

export default AccountProfileContainer;
