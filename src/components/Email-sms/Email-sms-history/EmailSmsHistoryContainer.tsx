import React, { useState, useEffect } from 'react';
import BoxSearchEmailSmsHistory from './BoxSearchEmailSmsHistory';
import DataTableEmailSmsHistory from './DataTableEmailSmsHistory';
import HeaderEmailSmsHistory from './HeaderEmailSmsHistory';
import { useDispatch, useSelector } from 'react-redux';
import { getEmailSmsHistory } from 'redux/actions/emailSmsAction';
import { FiterHistoryMerchant, GetHistoryMerchantInput, HistorySMSMerchantReposone } from 'models/emailSms/emailSms';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import useElementSize from 'hook/useElementSize';
import { useRouter } from 'next/router';

interface Props {
  isShowFilter?: boolean;
}

const EmailSmsHistoryContainer: React.FC<Props> = ({ isShowFilter }) => {
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const [start, setStart] = useState<number>(0)
  const [limit, setLimit] = useState<number>(20)
  
  const [filter, setFilter] = useState<any>({})
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [totalRow, setTotalRow] = useState<number>(0);
  const [squareRef, { width, height }] = useElementSize();
  const { query }: any = useRouter();

  const [ dataEmailSmsHistory , setDataEmailSmsHistory] = useState<HistorySMSMerchantReposone[]>([])
  const loading = useSelector<any, boolean>((state) => state?.EmailSmsReducer?.loading);


  const dispatch = useDispatch()
  
  useEffect(() => {
    setSubmitForm(true)
  },[])

  // useEffect(() => {
  //   const payload = {
  //     paging : {
  //       start, 
  //       limit
  //     },
  //     sort : {
  //       createdAt : 1
  //     }
  //   }
  //   dispatch(getEmailSmsHistory(payload, (status, res) => {
  //     if(status){
  //       setDataEmailSmsHistory(res?.data)
  //       // setTotalRow(res?.totalRow)
  //       setTotalRow(res?.data.length);
  //     }else{
  //       setDataEmailSmsHistory([])
  //     }
  //   }))
  // },[])

  useEffect(() => {
    if (Object.keys(query).length > 0) {
      let payload = {}
      if (query?.merchantId) {payload = {...payload, merchantId : +query?.merchantId}};
      if (query?.change){
        if(query?.change === '-'){
          payload = {...payload, change : query?.change};
        }else {
          payload = {...payload, change : '+'};
        }
      }
      if (query?.transactionId) payload = {...payload, transactionId : query?.transactionId};
      if (query?.from && query?.to)
        payload = {...payload , createdAt : { from: query.from?.toString(), to: query.to?.toString() }};
      if (query?.from && !query?.to) payload = {...payload, createdAt : { from: query.from?.toString() }};
      if (!query?.from && query?.to) payload = {...payload, createdAt : { to: query.from?.toString() }}
      setFilter({...filter, ...payload})
    }
  }, [query?.merchantId, query?.change, query?.transactionId, query?.from, query?.to]);

  // useEffect(() => {
  //   setFilter({
  //     ...filter,
  //     merchantId : 
  //   })
  // },[data])

  const formatDataSearch = (data: FiterHistoryMerchant) => {
    const dataCopy: any = { ...data };

    dataCopy.createdAt &&
      Object.keys(dataCopy?.createdAt).forEach(
        (key) => !dataCopy.createdAt[key] && delete dataCopy.createdAt[key]
      );

    Object.keys(dataCopy).forEach((key) => !dataCopy[key] && delete dataCopy[key]);

    return dataCopy;
  };

  const handleSubmitSearch = (data: FiterHistoryMerchant) => {
    const newData = formatDataSearch(data)
    setFilter(newData);
    setSubmitForm(true);
  };

  const getListEmailSmsHistory = (start?: number, limit?: number, sort?: {}) => {
    const payload: GetHistoryMerchantInput = {
      filter,
      paging: {
        start,
        limit,
      },
      sort: {
        createdAt: 1,
      },
    };

    function getListMerchant(payload: GetHistoryMerchantInput) {
      dispatch(
        getEmailSmsHistory(payload, (status, res) => {
          setSubmitForm(false);
          if (status) {
            setDataEmailSmsHistory(res?.data);
            setTotalRow(res?.data.length);
            setSubmitForm(false);
          } else {
            setDataEmailSmsHistory([]);
          }
        })
      );
    }

    return {
      payload,
      getList: getListMerchant,
      submitForm,
    };
  };


  const handleClearSearch = () => {

  };
  return (
    <div className='approval-merchant-container'>
      {isShowFilter && (
        <BoxSearchEmailSmsHistory
          handleSubmitSearch={handleSubmitSearch}
          handleClearSearch={handleClearSearch}
          showFilter={showFilter}
          submitForm={submitForm}
          loading={loading}
        />
      )}
      <DataTableEmailSmsHistory
        dataEmailSmsHistory={dataEmailSmsHistory}
        getDataList={getListEmailSmsHistory}
        totalFilter={totalRow}
        heightBoxSearch={height + 1}
      />
      {loading && <LoadingFullScreen />}
    </div>
  );
};

export default EmailSmsHistoryContainer;
