import { EwalletPaymeTransferHistoryResponseData, EwalletPaymeTransferLogInput, GetAllTransactionsInput, TransactionResponse } from 'models';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getDetailPaymeTransfer } from 'redux/actions';
import ModalDetailTransfer from '../modal/ModalDetailTransfer';
import DataTableDetailTransfer from './DataTableDetailTransfer';
import HeaderDetailTransfer from './HeaderDetailTransfer';

const MultitransferCampaignContainer: React.FC = (props: any) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setShowFilter(!showFilter);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(true);
  const [openModalTransfer, setOpenModalTransfer] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [totalInfo, setTotalInfo] = useState<any>({
    totalAmount: 0,
    totalValidAmount: 0,
  });
  const detailId = router.query.id;

  const handleGetDetailPaymeTransfer = (start?: number, limit?: number, sort?: {}) => {
    const payload: EwalletPaymeTransferLogInput = {
      filter: {
        campaignId: detailId
      },
      paging: {
        start: start!,
        limit: limit!,
      },
      sort: {
        createdAt: -1
      }
    };

    function handleGetDetailPaymeTransfer(payload: EwalletPaymeTransferLogInput) {
      setLoading(true);
      dispatch(
        getDetailPaymeTransfer(payload, (status, res) => {
          setSubmitForm(false)
          if (status) {
            setData(res.data);
            setTotalInfo({
              totalAmount: res.totalAmount,
              totalValidAmount: res.totalValidAmount,
            })
          }
          setLoading(false);
        })
      );
    }

    return {
      payload,
      getList: handleGetDetailPaymeTransfer,
      submitForm,
    };
  };

  return (
    <div className='box-content multitransfer-campaign-container'>
      <HeaderDetailTransfer
        detailId={detailId}
        totalInfo={totalInfo}
        showFilter={showFilter}
        toggleFilter={toggleFilter}
        onOpenTransferModal={() => setOpenModalTransfer(true)}
      />
      <DataTableDetailTransfer
        t={t}
        isLoading={isLoading}
        data={data}
        getDataList={handleGetDetailPaymeTransfer}
        setSubmitForm={setSubmitForm}
        detailId={detailId}
      />
      <ModalDetailTransfer
        idDetail={detailId}
        show={openModalTransfer}
        handleClose={() => setOpenModalTransfer(false)}
        handleRefresh={() => setSubmitForm(true)}
      />
    </div>
  );
};

export default MultitransferCampaignContainer;
