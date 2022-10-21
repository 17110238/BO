import { PayloadSearchDeposit } from 'models';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getInformationEmailMerchant } from 'redux/actions';
import BoxSearchEmailMerchant from './BoxSearchEmailMerchant';
import DataTableEmailMerchant from './DataTableEmailMerchant';
import HeaderEmailMerchant from './HeaderEmailMerchant';
import { clearFalsyObject, handleReplaceUrl } from 'utils/helpers/replaceUrl';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
const EmailMerchantContainer = () => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const router = useRouter();
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setShowFilter(!showFilter);
  const [dataReportMerchant, setDataReportMerchant] = useState<any>();
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const loading = useSelector<any>((state) => state?.informationEmailMerchantReducer?.loading);
  const [filter, setFilter] = useState<any>({
    
  });
  const [refreshTable, setRefreshTable] = useState<boolean>(false);

  useEffect(() => {
    setSubmitForm(true);
  }, [])
 

  const handleSearchForm = (data: any | {}) => {
    if (!data?.merchantId) delete data?.merchantId;
    if (data?.merchantId)  data.merchantId = +data.merchantId;
    setFilter(data);
    setSubmitForm(true);
  };

  const handleGetListEmailMerchant = (start?: number, limit?: number, sort?: {}) => {
    const payload = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function handleGetListEmailMerchant(payload: PayloadSearchDeposit) {
      dispatch(
        getInformationEmailMerchant(payload, (state, res) => {
          setSubmitForm(false);
          setDataReportMerchant(res);
        })
      );
    }

    return {
      payload,
      getList: handleGetListEmailMerchant,
      submitForm,
    };
  };

  useEffect(() => {
    // let data: SearchParams = Router.query;
    const params = { ...router.query };
    if (Object.keys(router.query).length) {
      delete params.to;
      delete params.from;

      const payload = clearFalsyObject({
        ...params,
        merchantId: +router.query?.merchantId!,
        createdAt: {
          from: router.query?.from,
          to: router.query?.to,
        },
      });
      setFilter(payload);
      setSubmitForm(true);
    }
  }, []);

  return (
    <>
      <div className='email-merchant-container email-merchant'>
        <HeaderEmailMerchant showFilter={showFilter} toggleFilter={toggleFilter} />
        <BoxSearchEmailMerchant
          submitForm={submitForm}
          loading={loading}
          filter={filter}
          showFilter={showFilter}
          onSubmitForm={handleSearchForm}
        />

        <DataTableEmailMerchant
          loading={loading}
          t={t}
          data={dataReportMerchant}
          totalRow={dataReportMerchant?.length}
          getDataList={handleGetListEmailMerchant}
          {...{ refreshTable }}
        />
      </div>
    </>
  );
};

export default EmailMerchantContainer;
