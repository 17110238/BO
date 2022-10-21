import useElementSize from 'hook/useElementSize';
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import BoxSearchPOBOTransaction, { SearchParams } from './BoxSearchPOBOTransaction';
import DataTablePOBOTransaction from './DataTablePOBOTransaction';
import { getListPOBO } from 'redux/actions';
import { GetPoboOrderInput, PoboOrderList } from 'models/pobo/poboState';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const POBOTransactionPageContainer: React.FC = () => {
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(true);
  const [listPOBO, setListPOPO] = useState<PoboOrderList[]>([]);
  const [filter, setFilter] = useState<any>({
    createdAt: {
      from: dayjs().subtract(30, 'day').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    },
  });
  const [isLoading, setLoading] = useState<boolean>(false);
  const [squareRef, { width, height }] = useElementSize();
  const handleSubmitSearch = (data: SearchParams) => {
    delete data.typeId;
    delete data.search;
    setFilter({ ...data });
    setSubmitForm(true);
  };

  const handleGetListPOBO = (start?: number, limit?: number, sort?: {}) => {
    const payload: GetPoboOrderInput = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };
    function handleGetListPOBO(payload: GetPoboOrderInput) {
      setLoading(true);
      dispatch(
        getListPOBO(payload, (status, res) => {
          setSubmitForm(false);
          setListPOPO(res);
          setLoading(false);
        })
      );
    }
    return {
      payload,
      getList: handleGetListPOBO,
      submitForm,
    };
  };

  return (
    <div className='box-content withdrawal-container'>
      {showFilter && (
        <BoxSearchPOBOTransaction
          showFilter={showFilter}
          submitForm={submitForm}
          handleSubmitSearch={handleSubmitSearch}
          setSubmitForm={setSubmitForm}
          boxSearchRef={squareRef}
          filter={filter}
          isLoading={isLoading}
        />
      )}
      <DataTablePOBOTransaction
        t={t}
        data={listPOBO}
        getDataList={handleGetListPOBO}
        setSubmitForm={setSubmitForm}
        heightBoxSearch={height + 1}
        isLoading={isLoading}
      />
    </div>
  );
};

export default POBOTransactionPageContainer;
