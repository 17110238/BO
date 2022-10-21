import { DetailRevenue, PayloadDetailMerchantRevenue } from 'models';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getDetailRevenueStatistics } from 'redux/actions';
import ReportDetailSummaryMerchant from './ReportDetailSummaryMerchant';
import DataTableDetailMerchant from './DataTableReportDetailMerchant';
import dayjs from 'dayjs';

interface Props {
  merchantId: string | string[] | undefined;
}

const DetailReportMerchant: React.FC<Props> = ({ merchantId }) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [detailMerchantReport, setDetailReportMerchant] = useState<DetailRevenue[]>([]);
  const [totalMerchantReport, setTotalMerchantReport] = useState<DetailRevenue>({});
  const [loadingTable, setLoadingTable] = useState<boolean>(true);

  const handleDetailReportMerchant = (start?: number, limit?: number, sort?: {}) => {
    const payload = {};

    function getList(payload: any) {}

    return {
      payload,
      getList,
    };
  };
  useEffect(() => {
    if (router?.query) {
      const query: PayloadDetailMerchantRevenue = {
        ...router?.query,
        createdAt: {
          from: router?.query?.from as string,
          to: router?.query?.to as string,
        },
        merchantId: +(merchantId || 0),
      };

      delete query.to;
      delete query.from;
      delete query.id;
      dispatch(
        getDetailRevenueStatistics(query, (state, res) => {
          state && setDetailReportMerchant(res?.data);
          state && setTotalMerchantReport(res?.total);
          setLoadingTable(false);
        })
      );
    }
  }, [router]);
  
  return (
    <>
      <button
        className='btn btn-back-detail-revenue'
        onClick={() => router.push('/ctt/report-merchant')}>
        <i className='fas fa-arrow-left btn-back__icon'></i>
        {t('Back')}
      </button>
      <div className='detail-revenue-container detail-revenue revenue-statistics'>
        <div className='revenue-statistics__header-block'>
          <h4 className='header-block__title'>{'Thống kê doanh thu chi tiết'}</h4>
          <div className='header-block__report'>
      
          </div>
        </div>
        <ReportDetailSummaryMerchant total={totalMerchantReport} />

        <DataTableDetailMerchant
          t={t}
          data={detailMerchantReport}
          getDataList={handleDetailReportMerchant}
          {...{ isLoading: loadingTable }}
        />
      </div>
    </>
  );
};

export default DetailReportMerchant;
