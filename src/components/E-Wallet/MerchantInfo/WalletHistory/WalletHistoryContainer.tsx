import React, { useEffect, useState, useRef } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import 'react-tagsinput/react-tagsinput.css';
import DataTableWalletHistory from './DataTableWalletHistory';
import BoxSearchWalletHistory from './BoxSearchWalletHistory';
import { appHistoryData, appHistoryInput } from 'models/walletHistory/walletHistoryState';
import { getWalletHistory } from 'redux/actions/walletHistoryActions';
import numeral from 'numeral';

interface Props {
  isShowFilter?: boolean;
  parentSubmit: boolean;
}

export interface SearchParams {
  createdAt?: {
    from?: string;
    to?: string;
  };
}

const WalletHistoryContainer: React.FC<Props> = ({ isShowFilter, parentSubmit }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [filter, setFilter] = useState({});
  const [walletHistory, setWalletHistory] = useState<appHistoryData[]>([]);
  const [totalCredit, setTotalCredit] = useState<number>(0);
  const [totalDebit, setTotalDebit] = useState<number>(0);
  const isLoading = useSelector<any, boolean>(
    (state) => state?.merchantInfoReducer?.loadingWalletHistory
  );
  const accountId = useSelector<any, string>((state) => state?.merchantInfoReducer.accountId);

  const handleGetMerchantWalletHistory = (start?: number, limit?: number, sort?: {}) => {
    const payload: appHistoryInput | any = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function handleGetMerchantWalletHistory(payload: appHistoryInput) {
      if (payload.filter.txtSearch) {
        dispatch(
          getWalletHistory(payload, (status, res) => {
            setSubmitForm(false);
            setWalletHistory(res.data);
            setTotalCredit(res.totalCredit);
            setTotalDebit(res.totalDebit);
          })
        );
      } else {
        setSubmitForm(false);
        setWalletHistory([]);
        setTotalCredit(0);
        setTotalDebit(0);
      }
    }

    return {
      payload,
      getList: handleGetMerchantWalletHistory,
      submitForm,
    };
  };

  const handleSubmitSearch: SubmitHandler<SearchParams> = (data) => {
    const payload: any = { ...data };
    payload.createdAt &&
      Object.keys(payload?.createdAt).forEach(
        (key) => !payload.createdAt[key] && delete payload.createdAt[key]
      );

    Object.keys(payload).forEach((key) => !payload[key] && delete payload[key]);

    if (payload.createdAt && Object.keys(payload.createdAt).length === 0) delete payload.createdAt;

    payload.typeSearch = 'userId';
    payload.txtSearch = accountId;

    setFilter({ ...payload });
    setSubmitForm(true);
  };

  // useEffect(() => {
  //   setSubmitForm(true);
  // }, [accountId]);

  useEffect(() => {
    if (parentSubmit) {
      setSubmitForm(true);
    }
  }, [parentSubmit]);

  return (
    <div className='wallet-history-container'>
      <BoxSearchWalletHistory
        showFilter={isShowFilter}
        submitForm={submitForm}
        handleSubmitSearch={handleSubmitSearch}
        setSubmitForm={setSubmitForm}
        parentSubmit={parentSubmit}
      />

      <div className='wallet-total-box'>
        <div className='total-box'>
          Tổng tiền nạp vào
          <p> {totalCredit !== -1 ? numeral(totalCredit).format('0,0') : '******'}</p>
        </div>
        <div className='total-box'>
          Tổng tiền giao dịch
          <p> {totalDebit !== -1 ? numeral(totalDebit).format('0,0') : '******'}</p>
        </div>
      </div>

      <DataTableWalletHistory
        t={t}
        data={walletHistory}
        getDataList={handleGetMerchantWalletHistory}
        setSubmitForm={setSubmitForm}
      />
    </div>
  );
};

export default WalletHistoryContainer;
