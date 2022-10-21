import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import useElementSize from 'hook/useElementSize';
import { GetAllTransactionsInput, TransactionResponse } from 'models';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getListTransaction, getpaymentMethodList } from 'redux/actions';
import { exportFileTransactionFailure } from 'redux/actions/transactionActions';
import ModalAddStaff from '../modal/ModalAddStaff';
import ModalDeleteStaff from '../modal/ModalDeleteStaff';
import ModalUpdateStaff from '../modal/ModalUpdateStaff';
import BoxSearchTransaction, { SearchParams } from './BoxSearchStaffManage';
import DataTableStaffManage from './DataTableStaffManage';
import HeaderTransaction from './HeaderStaffManage';

const StaffManageContainer: React.FC = (props: any) => {
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setShowFilter(!showFilter);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(true);
  const [totalRow, setTotalRow] = useState<number>(0);
  const transactionList = useSelector<any, TransactionResponse[]>(
    (state) => state?.transactions?.transactionInfoArray
  );
  const [paymentMethodList, setPaymentMethodList] = useState<any[]>([]);
  const [filter, setFilter] = useState({});
  const [isOpenModalAdd, setOpenModalAdd] = useState<boolean>(false);
  const [isOpenModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [isOpenModalDelete, setOpenModalDelete] = useState<boolean>(false);

  const handleSubmitSearch = (data: SearchParams) => {
    setFilter({ ...data });
  };

  const handleGetListTransaction = (start?: number, limit?: number, sort?: {}) => {
    const payload: GetAllTransactionsInput = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function handleGetListTransaction(payload: GetAllTransactionsInput) {
      dispatch(
        getListTransaction(payload, (status, res) => {
          if (status) {
            setTotalRow(res.data.length);
          }
        })
      );
    }

    return {
      payload,
      getList: handleGetListTransaction,
      submitForm,
      setSubmitForm,
    };
  };

  return (
    <div className='box-content multitransfer-campaign-container'>
      <HeaderTransaction
        showFilter={showFilter}
        toggleFilter={toggleFilter}
        onOpenAddStaff={() => setOpenModalAdd(true)}
      />
      {showFilter && (
        <BoxSearchTransaction
          showFilter={showFilter}
          submitForm={submitForm}
          handleSubmitSearch={handleSubmitSearch}
          paymentMethodList={paymentMethodList}
          setSubmitForm={setSubmitForm}
          filter={filter}
        />
      )}
      <DataTableStaffManage
        t={t}
        data={transactionList}
        totalFilter={totalRow}
        getDataList={handleGetListTransaction}
        setSubmitForm={setSubmitForm}
        isNotHaveTotalRow={true}
        onOpenModalUpdate={setOpenModalUpdate}
        onOpenModalDelete={setOpenModalDelete}
      />
      <ModalAddStaff 
        show={isOpenModalAdd}
        handleClose={() => setOpenModalAdd(false)}
        handleRefreshStaffList={() => setSubmitForm(true)}
      />
      <ModalUpdateStaff 
        show={isOpenModalUpdate}
        handleClose={() => setOpenModalUpdate(false)}
        handleRefreshStaffList={() => setSubmitForm(true)}
      />
      <ModalDeleteStaff 
        show={isOpenModalDelete}
        handleClose={() => setOpenModalDelete(false)}
        handleRefreshStaffList={() => setSubmitForm(true)}
      />
    </div>
  );
};

export default StaffManageContainer;
