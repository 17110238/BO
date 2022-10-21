import React, { useEffect, useState } from 'react';
import BoxSearchProcessingFlow, { SearchParams } from './BoxSearchProcessingFlowManage';
import { useTranslation } from 'react-i18next';
import HeaderProcesingFlowManage from './HeaderProcessingFlowManage';
import DataTableProcessingFlow from './DataTableProcessingFlowManage';
import { GetProcessingFlowsInput, ProcessingFlowResponse } from 'models';
import { useDispatch, useSelector } from 'react-redux';
import { getListProcessingFlow, getListRole, getListStore, searchUser } from 'redux/actions';
import ModalAdd from './add/ModalAdd';
import { FilterSearchAccountMc } from 'models/account/accountMerchant';

const PendingListMerchantContainer: React.FC = () => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [isShowFilter, setIsShowFilter] = useState<boolean>(true);
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [totalRow, setTotalRow] = useState<number>(0);
  const [filter, setFilter] = useState<any>({});
  // const pendingList = useSelector<any, ProcessingFlowResponse[]>(
  //   (state) => state?.processingFlowReducer?.processingFlowArray
  // );
  const [data, setData] = useState<ProcessingFlowResponse[]>([]);
  const [isShowModalAddProcessingFlow, setShowModalAddProcessingFlow] = useState<boolean>(false);

  const handleSubmitSearch = (data: SearchParams) => {
    setFilter({
      ...data,
    });
    setSubmitForm(true);
  };

  const handleGetListProcessingFlow = (start?: number, limit?: number) => {
    const payload: GetProcessingFlowsInput = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function getListProcessingFLow(payload: GetProcessingFlowsInput) {
      dispatch(
        getListProcessingFlow(payload, (status, res) => {
          setSubmitForm(false);
          if (status) {
            setData(res?.data);
            setTotalRow(res?.data.length);
          }
        })
      );
    }

    return {
      payload,
      getList: getListProcessingFLow,
      submitForm,
    };
  };

  useEffect(() => {
    dispatch(
      getListRole((status, response) => {
        if (status) {
        } else {
        }
      })
    );
    dispatch(
      searchUser(
        {
          paging: {
            start: 0,
            limit: 300,
          },
        },
        (status: any, response: any) => {
          if (status) {
          } else {
          }
        }
      )
    );
  }, []);

  return (
    <div className='pending-list-merchant-container'>
      <HeaderProcesingFlowManage
        isShowFilter={isShowFilter}
        onClickExport={() => { }}
        onClickFilter={() => {
          setIsShowFilter(!isShowFilter);
        }}
        onClickOpenAddModal={setShowModalAddProcessingFlow}
      />
      <div className='box-payment'>
        <BoxSearchProcessingFlow
          submitForm={submitForm}
          handleSubmitSearch={handleSubmitSearch}
          setSubmitForm={setSubmitForm}
          isShowFilter={isShowFilter}
        />
        <DataTableProcessingFlow
          t={t}
          totalFilter={totalRow}
          data={data}
          getDataList={handleGetListProcessingFlow}
          submitForm={submitForm}
          handleRecallProcessingList={setSubmitForm}
        />
      </div>
      <ModalAdd
        t={t}
        show={isShowModalAddProcessingFlow}
        handleClose={() => setShowModalAddProcessingFlow(false)}
        submitForm={submitForm}
        handleRecallProcessingList={setSubmitForm}
      />
    </div>
  );
};

export default PendingListMerchantContainer;
