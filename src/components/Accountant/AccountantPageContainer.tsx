import LoadingInline from 'components/common/Loading/LoadingInline';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { AccountantCrossCheck, getListCrossCheck } from 'models';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { deleteListAccountantCrossCheck, getListAccountantCrossCheck } from 'redux/actions/accountantAction';
import BoxSearchAccountant, { SearchParams } from './BoxSearchAccountant';
import DataTableAccount from './DataTableAccountant';
import HeaderAccountant from './HeaderAccountant';
import ModalControl from './Modal/ModalControl';
dayjs.extend(utc);
const Payint = dynamic(() => import('components/common/ModalPayint/ModalPayint'));
interface Payload {
  filter: {
    method?: string | null;
    state?: string | null;
  };
  paging: {
    start: number;
    limit: number;
  };
  sort: {
    createdAt: number;
  };
}


const AccountantPageContainer: React.FC = (props: any) => {
  const defaultValues = {
    createdAt: {
      from: dayjs().subtract(5, 'day').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    },
    typeSearch: "tranId"

  }
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const [showModalControl, setShowModalControl] = useState<boolean>(false);
  const [showDeposit, setshowDeposit] = useState<boolean>(false);
  const toggleFilter = () => setShowFilter(!showFilter);
  const dispatch = useDispatch();
  const router = useRouter()
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [totalRow, setTotalRow] = useState<number>(0);
  const [modalPayint, setModalPayint] = useState<boolean>(false);
  const crossCheckList = useSelector<any, AccountantCrossCheck[]>((state) => state?.crossCheckReducer?.dataCrossCheck);
  const isLoading = useSelector<any, boolean>((state) => state?.crossCheckReducer?.loading);
  const isLoadingExport = useSelector<any, boolean>((state) => state?.crossCheckReducer.loadingExport);
  const accountIdLogin = useSelector<any>((state) => state?.authReducers?.accountInfo?.profile.accountId);
  const dataFormat = crossCheckList?.map((iteam) => ({ ...iteam, isOutOfStock: iteam?.state === 'PENDING' ? false : true }))
  const [paymentMethodList, setPaymentMethodList] = useState<any[]>([]);
  const [checkEmtry, setcheckEmtry] = useState<any[]>([]);
  const [filter, setFilter] = useState(defaultValues);
  const [selectedData, setSelectedData] = React.useState([]);
  const handleChangedSelect = (state: any) => {
    setSelectedData(state);
  };

  const handleSubmitSearch = (data: any) => {
    let bufferData: any = {}
    Object.entries(data).forEach(([key, value]) => {
      if (value) { bufferData[key] = value; }
    })
    setFilter({ ...bufferData });
    setSubmitForm(true);
  };
  const showModalControl1 = () => setShowModalControl(true)
  const showModalDeposit = () => setshowDeposit(true)
  const checkEmtryModal = (data: []) => setcheckEmtry(data)

  const handleGetListAccountantCrossCheck = (start?: number, limit?: number, sort?: {}) => {
    const payload: getListCrossCheck = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
      sort: {
        createdAt: -1
      }
    };
    function handleGetListAccountantCrossCheck(payload: SearchParams) {
      dispatch(
        getListAccountantCrossCheck(payload, (status, res) => {
          setSubmitForm(false);
          if (status) {
            setTotalRow(res.totalRow);
          }
        })
      );
    }

    return {
      payload,
      getList: handleGetListAccountantCrossCheck,
      submitForm,
      setSubmitForm,
    };
  }


  return (
    <>
      {isLoadingExport && <LoadingInline loading={isLoadingExport} />}
      <div className='box-content accountant-container'>
        <HeaderAccountant
          showFilter={showFilter}
          toggleFilter={toggleFilter}
          showModalPayint={showModalControl1}
          showModalDeposit={showModalDeposit}
          //onClickExport={handleExportMerchantView}
          filter={filter}

          t={t}
        />
        <BoxSearchAccountant
          showFilter={showFilter}
          submitForm={submitForm}
          handleSubmitSearch={handleSubmitSearch}
          paymentMethodList={paymentMethodList}
          setSubmitForm={setSubmitForm}
          isLoading={isLoading}

        />
        <DataTableAccount
          t={t}
          data={dataFormat}
          totalFilter={totalRow}
          getDataList={handleGetListAccountantCrossCheck}
          setSubmitForm={setSubmitForm}
          handleChangedSelect={handleChangedSelect}
          show={showDeposit}
          showCrlt={showModalControl}
          onHide={() => { setshowDeposit(false); }}
          handleSubmitSearch={handleSubmitSearch}
          checkEmtryModal={checkEmtryModal}
          isLoading={isLoading}
        />
        {showModalControl && <ModalControl show={showModalControl} onHide={() => { setShowModalControl(false); }} handleSubmitSearch={handleSubmitSearch} />}
      </div>
    </>

  );
};

export default AccountantPageContainer;
