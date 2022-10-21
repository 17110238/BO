import { ConnectedUserType, GetAllTransactionsInput, GetAppInfoData, SearchConnectedUserInput, TransactionResponse } from 'models';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getAppInfo, getListConnectedUser } from 'redux/actions';
import BoxSearchConnectedWallet, { SearchParams } from './BoxSearchConnectedWallet';
import DataTableConnectedWallet from './DataTableConnectedWallet';
import HeaderConnectedWallet from './HeaderConnectedWallet';
const ModalDelete = dynamic(() => import('./modal/ModalDelete'));

const ConnectedWalletContainer: React.FC = () => {
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setShowFilter(!showFilter);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [totalRow, setTotalRow] = useState<number>(0);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [filter, setFilter] = useState({});
  const [data, setData] = useState<ConnectedUserType[]>([]);
  const [idDetail, setIdDetail] = useState<string>('');
  const appInfoList = useSelector<any, GetAppInfoData[]>(
    (state) => state?.utility?.GetAppInfoData
  )
  const [isLoading, setLoading] = useState<boolean>(false);

  const handleSubmitSearch = (data: SearchParams) => {
    setFilter({ ...data });
    setSubmitForm(true);
  };

  const handleGetListConnectedUser = (start?: number, limit?: number) => {
    const payload: SearchConnectedUserInput = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function handleGetListConnectedUser(payload: SearchConnectedUserInput) {
      setLoading(true);
      dispatch(
        getListConnectedUser(payload, (status, res) => {
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
      getList: handleGetListConnectedUser,
      submitForm,
    };
  };

  useEffect(() => {
    dispatch(getAppInfo());
  }, [dispatch]);

  return (
    <div className='box-content multitransfer-campaign-container'>
      <HeaderConnectedWallet
        showFilter={showFilter}
        toggleFilter={toggleFilter}
        onOpenTransferModal={() => setOpenModalDelete(true)}
      />
      <BoxSearchConnectedWallet
        isShowFilter={showFilter}
        submitForm={submitForm}
        handleSubmitSearch={handleSubmitSearch}
        appInfoList={appInfoList}
        setSubmitForm={setSubmitForm}
        filter={filter}
        isLoading={isLoading}
      />
      <DataTableConnectedWallet
        t={t}
        data={data}
        setIdDetail={setIdDetail}
        isLoading={isLoading}
        totalFilter={totalRow}
        getDataList={handleGetListConnectedUser}
        setSubmitForm={setSubmitForm}
        onOpenDeleteModal={() => setOpenModalDelete(true)}
      />
      <ModalDelete
        show={openModalDelete}
        handleClose={() => setOpenModalDelete(false)}
        handleRefresh={() => setSubmitForm(true)}
        idDetail={idDetail}
      />
    </div>
  );
};

export default ConnectedWalletContainer;
