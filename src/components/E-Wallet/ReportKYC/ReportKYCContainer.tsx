import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getAppInfo, getListReportKYC } from 'redux/actions';
import { clearFalsyObject } from 'utils/helpers/replaceUrl';
import BoxSearchReportKYC from './BoxSearchReportKYC';
import DataTableReportKYC from './DataTableReportKYC';
import HeaderKYC from './HeaderKYC';
interface SearchSReportKYCInput {
  dateType?: string | undefined;
  appId?: number | any;
  createdAt?:
    | {
        from?: any;
        to?: any;
      }
    | any;
}

const ReportKYCContainer: React.FC = (props: any) => {
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setShowFilter(!showFilter);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(true);
  const [dataReportKYC, setDataReportKYC] = useState<any>([]);
  const [dataApplication, setDataApplication] = useState<any>([]);
  const boxSearchRef = useRef();
  const [filter, setFilter] = useState({});
  const [dayReport, setDayReport] = useState<any>([]);
  const [walletKYC, setWalletKYC] = useState<any | []>([]);
  const [sumWalletKYC, setSumWalletKYC] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleResetAllKYC = () => {
    setDataReportKYC([]);
  };

  const handleSubmitSearch = (data: SearchSReportKYCInput) => {
    if (data?.appId && data?.dateType && data?.createdAt) {
      setLoading(true);
      setFilter({ ...data });
    }
  };

  useEffect(() => {
    if (Object.keys(filter)?.length === 3) {
      dispatch(
        getListReportKYC({ filter }, (status, res) => {
          if (status) {
            setDataReportKYC(res?.data);
            setDayReport([...res?.data?.map((el: any) => el.date)]);
            setWalletKYC([...res?.data?.map((el: any) => el.walletKyc)]);
            setSumWalletKYC([...res?.data?.map((el: any) => el.sumWalletKyc)]);
            setLoading(false);
          }
        })
      );
    }
  }, [filter]);

  useEffect(() => {
    dispatch(
      getAppInfo((status, response) => {
        if (status) {
          const { store } = response[0];
          let optionDataApplication = [
            ...store?.map((el: any) => ({ value: el.id, label: <span>{el['name']} <b>{el['merchantId'] ? "#" + el['merchantId'] : ''}</b></span> })),
          ];
          setDataApplication(optionDataApplication);
        }
      })
    );
  }, []);

  useEffect(() => {
    // let data: SearchParams = Router.query;
    const params = { ...router.query };
    if (router.query?.appId && Object.keys(router.query).length) {
      delete params.to;
      delete params.from;

      const payload = clearFalsyObject({
        ...params,
        appId: +router.query?.appId!,
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
    <div className='box-content report-kyc-container transaction-report-container'>
      <HeaderKYC showFilter={showFilter} toggleFilter={toggleFilter} />
      {showFilter && (
        <BoxSearchReportKYC
          loading={loading}
          optionsApplication={dataApplication}
          showFilter={showFilter}
          submitForm={submitForm}
          handleSubmitSearch={handleSubmitSearch}
          boxSearchRef={boxSearchRef}
          setSubmitForm={setSubmitForm}
          onReSetKYC={handleResetAllKYC}
        />
      )}
      <DataTableReportKYC
        t={t}
        data={dataReportKYC}
        columnTitles={dayReport}
        walletKYC={walletKYC}
        sumWalletKYC={sumWalletKYC}
      />
    </div>
  );
};
export default ReportKYCContainer;
