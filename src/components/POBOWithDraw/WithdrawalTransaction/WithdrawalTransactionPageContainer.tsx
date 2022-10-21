import useElementSize from 'hook/useElementSize';
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import BoxSearchWithdrawalTransaction, { SearchParams } from './BoxSearchWithdrawalTransaction';
import DataTableWithdrawalTransaction from './DataTableWithdrawalTransaction';
import { GetWithdrawInput, WithdrawList } from 'models/withdrawal/withdrawalState';
import { getListWithdraw } from 'redux/actions';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const WithdrawalTransactionPageContainer: React.FC = () => {
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(true);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [listWithdraw, setListWithdraw] = useState<WithdrawList[]>([]);
  const [filter, setFilter] = useState<any>({
    createdAt: {
      from: dayjs().subtract(30, 'day').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    },
  });
  const [squareRef, { width, height }] = useElementSize();
  const handleSubmitSearch = (data: SearchParams) => {
    let { method, state, createdAt, destination } = data;

    if (state === '') {
      delete data.state;
    }

    if (createdAt === '') {
      delete data.createdAt;
    }

    if (method === '') {
      delete data.method;
    }
    if (destination === '') {
      delete data.destination;
    }
    delete data.typeId;
    delete data.search;
    setFilter({ ...data });
    setSubmitForm(true);
  };
  const handleGetListWithdraw = (start?: number, limit?: number, sort?: {}) => {
    const payload: GetWithdrawInput = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };
    function handleGetListWithdraw(payload: GetWithdrawInput) {
      setLoading(true);
      dispatch(
        getListWithdraw(payload, (status, res) => {
          setSubmitForm(false);
          setListWithdraw(res);
          setLoading(false);
        })
      );
    }
    return {
      payload,
      getList: handleGetListWithdraw,
      submitForm,
    };
  };

  return (
    <div className='box-content withdrawal-container'>
      {showFilter && (
        <BoxSearchWithdrawalTransaction
          showFilter={showFilter}
          submitForm={submitForm}
          handleSubmitSearch={handleSubmitSearch}
          setSubmitForm={setSubmitForm}
          boxSearchRef={squareRef}
          filter={filter}
          isLoading={isLoading}
        />
      )}
      <DataTableWithdrawalTransaction
        t={t}
        data={listWithdraw}
        getDataList={handleGetListWithdraw}
        setSubmitForm={setSubmitForm}
        heightBoxSearch={height + 1}
        isLoading={isLoading}
      />
    </div>
  );
};

export default WithdrawalTransactionPageContainer;
