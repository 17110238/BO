import React, { useState, useEffect } from 'react';
import BoxSearchEmailSmsMC from './BoxSearchEmailSmsMC';
import DataTableEmailSmsMC from './DataTableEmailSmsMC';
import HeaderEmailSmsMC from './HeaderEmailSmsMC';
import { useDispatch, useSelector } from 'react-redux';
import { getEmailSmsMerchant } from 'redux/actions/emailSmsAction';
import {
  GetEmailSmsMerchantInput,
  MerChantResponse,
  SearchParamsEmailSms,
} from 'models/emailSms/emailSms';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';

interface Props {
  isShowFilter?: boolean;
  merchantId?: any;
}

const EmailSmsMCContainer: React.FC<Props> = ({ isShowFilter, merchantId }) => {
  // const [showFilter, setShowFilter] = useState<boolean>(true);
  const [start, setStart] = useState<number>(0);
  const [limit, setLimit] = useState<number>(20);
  const [filter, setFilter] = useState<any>({});
  const [totalRow, setTotalRow] = useState<number>(0);
  const [submitForm, setSubmitForm] = useState<boolean>(false);

  const [dataEmailSmsMerchant, setDataEmailSmsMerchant] = useState<MerChantResponse[]>([]);
  const loading = useSelector<any, boolean>((state) => state?.EmailSmsReducer?.loading);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   setSubmitForm(true);
  //   const payload = {
  //     paging: {
  //       start,
  //       limit,
  //     },
  //     sort: {
  //       createdAt: 1,
  //     },
  //   };
  //   dispatch(
  //     getEmailSmsMerchant(payload, (status, res) => {
  //       if (status) {
  //         setDataEmailSmsMerchant(res?.data);
  //         // setTotalRow(res?.totalRow)
  //         setDataEmailSmsMerchant(res?.data.length);
  //       } else {
  //         setDataEmailSmsMerchant([]);
  //       }
  //     })
  //   );
  // }, []);

  // useEffect(() => {
  //   setFilter({
  //     merchantId: +merchantId
  //   });
  // }, [merchantId])

  useEffect(() => {
    setSubmitForm(true)
  },[])

  const handleSubmitSearch = (data: SearchParamsEmailSms) => {
    setFilter(data);
    setSubmitForm(true);
  };

  const getListEmailSmsMerChant = (start?: number, limit?: number, sort?: {}) => {
    const payload: GetEmailSmsMerchantInput = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
      sort: {
        createdAt: 1,
      },
    };

    if (!payload.filter?.merchantId) {
      delete payload.filter
    }
    function getListMerchant(payload: GetEmailSmsMerchantInput) {
      dispatch(
        getEmailSmsMerchant(payload, (status, res) => {
          setSubmitForm(false);
          if (status) {
            setDataEmailSmsMerchant(res?.data);
            setTotalRow(res?.data.length);
          } else {
            setDataEmailSmsMerchant([]);
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

  const handleClearSearch = () => { };
  return (
    <div className='merchant-container'>
      {/* <HeaderEmailSmsMC
        totalEmail={dataEmailSmsMerchant.reduce((total, item, index) => {
          return total + item.mail!;
        }, 0)}
        totalSMS={dataEmailSmsMerchant.reduce((total, item, index) => {
          return total + item.sms!;
        }, 0)}
      /> */}
      <BoxSearchEmailSmsMC
        handleSubmitSearch={handleSubmitSearch}
        handleClearForm={handleClearSearch}
        showFilter={isShowFilter}
        submitForm={submitForm}
        dataEmailSmsMerchant={dataEmailSmsMerchant}
        loading={loading}
      />
      <DataTableEmailSmsMC
        dataEmailSmsMerchant={dataEmailSmsMerchant}
        getDataList={getListEmailSmsMerChant}
        totalFilter={totalRow}
      />
      {loading && <LoadingFullScreen />}
    </div>
  );
};

export default EmailSmsMCContainer;
