import { useRouter } from 'next/router';
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getReportTransactionSupplier } from 'redux/actions';

import BoxSearchReportTransactionSupplier from './BoxSearchReportTransactionSupplier';
import DatableReportTransactionSupplier from './DatableReportTransactionSupplier';
import HeaderReportTransactionSupplier from './HeaderReportTransactionSupplier';
import { clearFalsyObject, handleReplaceUrl } from 'utils/helpers/replaceUrl';
interface SearchSReportSupplierInput {
  apiType?: string | undefined;
  createdAt?:
    | {
        from?: any;
        to?: any;
      }
    | any;
}
enum ApiTypeEnum {
  VHT = 'VHT',
  SENBAC = 'SENBAC',
  MOBIFONE = 'MOBIFONE',
}

const dataApplication = [
  { label: 'VHT - Sms brandname', value: ApiTypeEnum.VHT },
  { label: 'SENBAC - Sms brandname', value: ApiTypeEnum.SENBAC },
  { label: 'Mobifone - Sms Brandname ', value: ApiTypeEnum.MOBIFONE },
];

const ReportSupplierContainer: React.FC = (props: any) => {
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setShowFilter(!showFilter);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(true);
  const [dataReportTransaction, setDataReportTranSaction] = useState<any>({});
  const boxSearchRef = useRef();
  const [filter, setFilter] = useState({});
  const [dayReport, setDayReport] = useState<any>([]);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleResetDataReport = () => {
    setDataReportTranSaction({});
  };

  const handleSubmitSearch = (data: SearchSReportSupplierInput) => {
    if (data?.apiType) {
      setLoading(true);
      setFilter({ ...data });
    }
  };

  useEffect(() => {
    Object.keys(filter).length > 0 &&
      dispatch(
        getReportTransactionSupplier({ filter }, (status, res) => {
          if (status) {
            setDataReportTranSaction(res);
            setLoading(false);
          }
        })
      );
  }, [filter]);

  useEffect(() => {
    // let data: SearchParams = Router.query;
    const params = { ...router.query };
    if (Object.keys(router.query).length) {
      delete params.to;
      delete params.from;

      const payload = clearFalsyObject({
        ...params,
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
    <div className='box-content report-transaction-supplier-container transaction-report-container'>
      <HeaderReportTransactionSupplier showFilter={showFilter} toggleFilter={toggleFilter} />
      {showFilter && (
        <BoxSearchReportTransactionSupplier
          loading={loading}
          optionsApplication={dataApplication}
          onReSet={handleResetDataReport}
          showFilter={showFilter}
          submitForm={submitForm}
          handleSubmitSearch={handleSubmitSearch}
          boxSearchRef={boxSearchRef}
          setSubmitForm={setSubmitForm}
        />
      )}
      <DatableReportTransactionSupplier
        t={t}
        data={dataReportTransaction}
        columnTitles={dayReport}
      />
    </div>
  );
};
export default ReportSupplierContainer;
