import { GetRequestChangeInput, GetRequestChangeResponsed, ProcessingFlowResponse } from 'models';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getListProcessingFlow, getPendingList } from 'redux/actions';
import BoxSearchMerchant, { SearchParams } from './BoxSearchPendingListMerchant';
import DataTableMerchant from './DataTablePendingListMerchant';
import HeaderPendingList from './HeaderPendingListMerchant';

const PendingListMerchantContainer: React.FC = () => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [isShowFilter, setIsShowFilter] = useState<boolean>(true);
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>();
  const [data, setData] = useState<GetRequestChangeResponsed[]>([]);
  const pendingList = useSelector<any, ProcessingFlowResponse[]>(
    (state) => state?.processingFlowReducer?.processingFlowArray
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalRow, setTotalRow] = useState(0);

  const handleSubmitSearch = (data: SearchParams) => {
    setFilter({
      ...data,
    });
    setSubmitForm(true);
  };

  const handleGetListPendingList = (start?: number, limit?: number, sort?: {}) => {
    const payload: GetRequestChangeInput = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function handleGetListPendingList(payload: GetRequestChangeInput) {
      setIsLoading(true);
      dispatch(
        getPendingList(payload, (status, res) => {
          setSubmitForm(false);
          if (status) {
            setData(res?.data);
            setTotalRow(res?.data.length);
          }
          setIsLoading(false);
        })
      );
    }

    return {
      payload,
      getList: handleGetListPendingList,
      submitForm,
    };
  };

  useEffect(() => {
    dispatch(
      getListProcessingFlow({}, (status, response) => { })
    );
  }, []);

  return (
    <div className='pending-list-merchant-container'>
      <HeaderPendingList
        isShowFilter={isShowFilter}
        onClickExport={() => { }}
        onClickFilter={() => {
          setIsShowFilter(!isShowFilter);
        }}
      />
      <div className='box-payment'>
        <BoxSearchMerchant
          isLoading={isLoading}
          submitForm={submitForm}
          handleSubmitSearch={handleSubmitSearch}
          pendingList={pendingList}
          setSubmitForm={setSubmitForm}
          isShowFilter={isShowFilter}
        />
        <DataTableMerchant
          t={t}
          isLoading={isLoading}
          data={data}
          submitForm={submitForm}
          totalFilter={totalRow}
          getDataList={handleGetListPendingList}
          setSubmitForm={setSubmitForm}
        />
      </div>
    </div>
  );
};

export default PendingListMerchantContainer;
