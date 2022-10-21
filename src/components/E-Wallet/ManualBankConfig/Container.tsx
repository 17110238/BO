import useElementSize from 'hook/useElementSize';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import BoxSearch, { SearchParams } from './BoxSearch';
import DataTable from './DataTable';
import Header from './Header';
import { DepositBankType, ListAccountBankSearch } from 'models';
import _ from 'lodash';
import { getListAccountBank, getListBank } from 'redux/actions/manualBankAction';

const Container: React.FC = () => {
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setShowFilter(!showFilter);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(true);
  const [manualBankDepositList, setManualBankConfigList] = useState<DepositBankType[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState({});
  const [squareRef, { width, height }] = useElementSize();
  const [listDepositBank, setListDepositBank] = useState<Array<DepositBankType>>([]);

  const handleSubmitSearch = (data: SearchParams) => {
    let newDataFilter: any = {
      isActive: data.state === 'Mở' ? true : data.state === 'Đóng' ? false : '',
      swiftCode: data.bank,
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

  const handleGetEWalletTransaction = (start?: number, limit?: number, sort?: {}) => {
    const payload: ListAccountBankSearch = {
      filter,
      paging: {
        start: 0,
        limit: 100,
      },
    };
    function handleGetEWalletTransaction(payload: ListAccountBankSearch) {
      setLoading(true);
      dispatch(
        getListAccountBank(payload, (status, res) => {
          setSubmitForm(false);
          if (res) {
            setManualBankConfigList(res);
          } else {
            setManualBankConfigList([]);
          }
          setLoading(false);
        })
      );
    }
    return {
      payload,
      getList: handleGetEWalletTransaction,
      submitForm,
    };
  };

  useEffect(() => {
    dispatch(
      getListBank((status, listBank) => {
        if (status) {
          setListDepositBank(listBank);
        }
      })
    );
  }, []);

  return (
    <div className='box-content manual-bank-config-container'>
      <Header
        showFilter={showFilter}
        toggleFilter={toggleFilter}
        t={t}
        setSubmitForm={setSubmitForm}
        listDepositBank={listDepositBank}
      />
      {showFilter && (
        <BoxSearch
          t={t}
          showFilter={showFilter}
          submitForm={submitForm}
          handleSubmitSearch={handleSubmitSearch}
          boxSearchRef={squareRef}
          listDepositBank={listDepositBank}
          filter={filter}
          isLoading={isLoading}
        />
      )}
      <DataTable
        t={t}
        data={manualBankDepositList}
        getDataList={handleGetEWalletTransaction}
        setSubmitForm={setSubmitForm}
        heightBoxSearch={height + 1}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Container;
