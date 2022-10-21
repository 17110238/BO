import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import 'react-tagsinput/react-tagsinput.css';
import DataTableLinkedBank from './DataTableLinkedBank';
import {
  BankLinkedInput,
  BankLinkedObject,
  FilterBankLinked,
  MerchantInfoState,
  SearchTypeBankLinkedEnum,
} from 'models/merchantInfo/merchantInfoState';
import { getMerchantLinkedBanks } from 'redux/actions/merchantInfoActions';

export interface SearchParams {
  search?: string;
  state?: string;
  createdAt?: {
    from?: string;
    to?: string;
  };
}

interface Props {
  parentSubmit: boolean;
}

function LinkedBankContainer({ parentSubmit }: Props) {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(true);
  
  const accountId = useSelector<any, string>((state) => state?.merchantInfoReducer.accountId);
  const [linkedBanks, setLinkedBanks] = useState<BankLinkedObject[]>([]);
  const isLoading = useSelector<any, boolean>(
    (state) => state?.merchantInfoReducer.loadingLinkedBank
    );
    
    const [filter, setFilter] = useState<FilterBankLinked>({
      searchType: SearchTypeBankLinkedEnum.ACCOUNT_ID,
      searchValue: accountId,
    });
  const handleGetMerchantLinkedBanks = (start?: number, limit?: number, sort?: {}) => {
    const payload: any = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };
    function handleGetMerchantLinkedBanks(payload: BankLinkedInput) {
      if (accountId && Object.keys(filter).length > 0) {
        dispatch(
          getMerchantLinkedBanks( payload  , (status, res) => {
            setLinkedBanks(res);
          })
        );
      } else {
        setLinkedBanks([]);
      }
    }

    return {
      payload,
      getList: handleGetMerchantLinkedBanks,
      submitForm,
      setSubmitForm,
    };
  };

  // useEffect(() => {

  //   setFilter({
  //     searchType: SearchTypeBankLinkedEnum.ACCOUNT_ID,
  //     searchValue: accountId,
  //   });
  //   setSubmitForm(true);
  // }, []);
  useEffect(() => {
    if (parentSubmit) {
      setSubmitForm(true);
    }
  }, [parentSubmit]);

  return (
    <div className='linked-bank-container'>
      <DataTableLinkedBank
        t={t}
        data={linkedBanks}
        getDataList={handleGetMerchantLinkedBanks}
        setSubmitForm={setSubmitForm}
      />
    </div>
  );
}

export default LinkedBankContainer;
