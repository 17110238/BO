import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import BoxSearch, { SearchParams } from './BoxSearch';
import DataTable from './DataTable';
import Header from './Header';
import { EwalletPaymentType, GetEwalletPaymentsInput, ListAccountBankSearch } from 'models';
import _ from 'lodash';
import { getListAccountBank, getListManualBankDeposit } from 'redux/actions/manualBankAction';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const Container: React.FC = () => {
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setShowFilter(!showFilter);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(true);
  const [filter, setFilter] = useState<any>({
    createdAt: {
      from: dayjs().subtract(30, 'day').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    },
  });
  const [isLoading, setLoading] = useState<boolean>(false);
  const [addBankTransaction, setAddBankTransaction] = useState<boolean>(true);
  const [listAccountBank, setListAccountBank] = useState<any>([]);
  const [manualBankDepositList, setManualBankDepositList] = useState<EwalletPaymentType[]>([]);

  const handleSubmitSearch = (data: SearchParams) => {
    let newDataFilter: any = {
      bankTransaction: data.bankTransaction,
      state: data.state,
      bankId: data.bankId,
      createdAt: data.createdAt,
    };

    for (let key in newDataFilter) {
      if (newDataFilter.hasOwnProperty(key)) {
        if (newDataFilter[key] === '' || newDataFilter[key] === undefined) {
          delete newDataFilter[key];
        }
      }
    }
    setFilter({ ...newDataFilter });
    setSubmitForm(true);
  };

  const handleGetManualBankDeposit = (start?: number, limit?: number, sort?: {}) => {
    const payload: GetEwalletPaymentsInput = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };
    function handleGetManualBankDeposit(payload: GetEwalletPaymentsInput) {
      setLoading(true);
      dispatch(
        getListManualBankDeposit(payload, (status, res) => {
          setSubmitForm(false);
          if (res) {
            setManualBankDepositList(res);
          } else {
            setManualBankDepositList([]);
          }
          setLoading(false);
        })
      );
    }

    return {
      payload,
      getList: handleGetManualBankDeposit,
      submitForm,
    };
  };

  const showBankTransactionModal = () => {
    setAddBankTransaction(!addBankTransaction);
  };

  useEffect(() => {
    const payload: ListAccountBankSearch = {
      filter: {
        isActive: true,
      },
      paging: {
        start: 0,
        limit: 100,
      },
    };
    addBankTransaction && delete payload.filter.isActive;
    dispatch(
      getListAccountBank(payload, (status, res) => {
        if (res) {
          let bankDepositArray: any = [];
          res.map((bank: any) => {
            let bankObj: any = {};
            bankObj.value = bank.id;
            bankObj.label = bank.fullName + ' - ' + bank.number;
            bankDepositArray.push(bankObj);
          });
          setListAccountBank(bankDepositArray);
        }
      })
    );
  }, [addBankTransaction]);

  return (
    <div className='box-content manual-bank-deposit-container'>
      <Header
        showFilter={showFilter}
        toggleFilter={toggleFilter}
        t={t}
        setSubmitForm={setSubmitForm}
        bankActive={showBankTransactionModal}
        listAccountBank={listAccountBank}
      />
      {showFilter && (
        <BoxSearch
          t={t}
          showFilter={showFilter}
          submitForm={submitForm}
          handleSubmitSearch={handleSubmitSearch}
          listAccountBank={listAccountBank}
          isLoading={isLoading}
        />
      )}
      <DataTable
        t={t}
        data={manualBankDepositList}
        getDataList={handleGetManualBankDeposit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Container;
