import {
  SearchSupplierTransactionInput
} from 'models';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getListEWalletTransactionSupplier } from 'redux/actions';
import BoxSearchTransactionSupplier, { SearchParams } from './BoxSearchTransactionSupplier';
import HeaderTransactionSupplier from './HeaderTransactionSupplier';
import {
  BIDVBankTable,
  EstioTable,
  GateCardTable,
  GateTopupTable,
  NapasTable,
  OCBBankTable,
  OCBTable,
  PVCOMTable,
  SSCCTable,
} from './table';
import Nodata from 'components/common/NoData/Nodata';
import { useRouter } from 'next/router';

const TransactionSupplierContainer: React.FC = (props: any) => {
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setShowFilter(!showFilter);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(true);
  const [paymentMethodList, setPaymentMethodList] = useState<any[]>([]);
  const [filter, setFilter] = useState({});
  const [service, setService] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const query = useRouter().query;

  const handleSubmitSearch = (data: SearchParams) => {
    setFilter({ ...data });
    setService(data.service!);
    setSubmitForm(true);
  };

  const handleGetListTransactionSupplier = (start?: number, limit?: number, sort?: {}) => {
    const payload: SearchSupplierTransactionInput = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function handleGetListTransactionSupplier(payload: SearchSupplierTransactionInput) {
      setLoading(true);
      dispatch(
        getListEWalletTransactionSupplier(payload, (status, res) => {
          setSubmitForm(false);
          if (status) {
            setData(res);
          }
          setLoading(false);
        })
      );
    }

    return {
      payload,
      getList: handleGetListTransactionSupplier,
      submitForm,
    };
  };

  return (
    <div className='box-content multitransfer-campaign-container'>
      <HeaderTransactionSupplier showFilter={showFilter} toggleFilter={toggleFilter} />
      <BoxSearchTransactionSupplier
        showFilter={showFilter}
        submitForm={submitForm}
        handleSubmitSearch={handleSubmitSearch}
        paymentMethodList={paymentMethodList}
        setSubmitForm={setSubmitForm}
        filter={filter}
        isLoading={isLoading}
      />
      {/* {
        !Object.keys(query).length &&
        <Nodata imageDataEmpty={'/assets/img/no-data.png'} messageDataEmpty={'No data'} />
      } */}
      {service === 'GATE_CARD' && (
        <GateCardTable
          t={t}
          isLoading={isLoading}
          data={data}
          getDataList={handleGetListTransactionSupplier}
        />
      )}
      {service === 'GATE_TOPUP' && (
        <GateTopupTable
          t={t}
          isLoading={isLoading}
          data={data}
          getDataList={handleGetListTransactionSupplier}
        />
      )}
      {service === 'BILL_OCB' && (
        <OCBTable
          t={t}
          isLoading={isLoading}
          data={data}
          getDataList={handleGetListTransactionSupplier}
        />
      )}
      {service === 'BILL_SSCC' && (
        <SSCCTable
          t={t}
          isLoading={isLoading}
          data={data}
          getDataList={handleGetListTransactionSupplier}
        />
      )}
      {service === 'BILL_ESTIO' && (
        <EstioTable
          t={t}
          isLoading={isLoading}
          data={data}
          getDataList={handleGetListTransactionSupplier}
        />
      )}
      {service === 'NAPAS' && (
        <NapasTable
          t={t}
          isLoading={isLoading}
          data={data}
          getDataList={handleGetListTransactionSupplier}
        />
      )}
      {service === 'PVCOMBANK' && (
        <PVCOMTable
          t={t}
          isLoading={isLoading}
          data={data}
          getDataList={handleGetListTransactionSupplier}
        />
      )}
      {service === 'OCBBANK' && (
        <OCBBankTable
          t={t}
          isLoading={isLoading}
          data={data}
          getDataList={handleGetListTransactionSupplier}
        />
      )}
      {service === 'BIDVBANK' && (
        <BIDVBankTable
          t={t}
          isLoading={isLoading}
          data={data}
          getDataList={handleGetListTransactionSupplier}
        />
      )}
    </div>
  );
};

export default TransactionSupplierContainer;
