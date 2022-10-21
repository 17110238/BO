import { DetailRevenue, PayloadDetailMerchantRevenue } from 'models';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getDetailRevenueStatistics, searchMerchant } from 'redux/actions';
import ReportDetailSummaryRevenue from './ReportDetailSummaryRevenue';
import DataTableDetailRevenue from './DataTableDetailRevenue';
import dayjs from 'dayjs';
import { clearFalsyObject } from 'utils/helpers/replaceUrl';

interface Props {
  merchantId: string | string[] | undefined;
}

const DetailRevenueMerchantContainer: React.FC<Props> = ({ merchantId }) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [detailRevenue, setDetailRevenue] = useState<DetailRevenue[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<DetailRevenue>({});
  const [loadingTable, setLoadingTable] = useState<boolean>(true);
  const [merchantName, setMerchantName] = useState<string>('');

  const handleDetailRevenue = (start?: number, limit?: number, sort?: {}) => {
    const payload = {};

    function getList(searchPayload: any) {}

    return {
      payload,
      getList,
    };
  };
  useEffect(() => {
    if (router?.query) {
      const query: PayloadDetailMerchantRevenue = clearFalsyObject({
        ...router?.query,
        createdAt: {
          from: router?.query?.from as string,
          to: router?.query?.to as string,
        },
        merchantId: +(merchantId || 0),
      });

      delete query.to;
      delete query.from;
      delete query.id;

      dispatch(
        getDetailRevenueStatistics(query, (state, res) => {
          setDetailRevenue(res?.data);
          setTotalRevenue(res?.total);
          setLoadingTable(false);
        })
      );

      dispatch(
        searchMerchant({ filter: { merchantId: +merchantId! } }, (state, res) => {
          if (state && res?.data?.length) {
            setMerchantName(res?.data[0]?.businessOverview?.abbreviationName);
          }
        })
      );
    }
  }, []);
  return (
    <>
      {/* <button className='btn btn-back-detail-revenue' onClick={() => router.back()}>
        <i className='fas fa-arrow-left btn-back__icon'></i>
        {t('Back')}
      </button> */}
      <div className='detail-revenue-container detail-revenue revenue-statistics'>
        <div className='revenue-statistics__header-block'>
          <h4 className='header-block__title'>
            <i
              className='fas fa-chevron-left mr-2'
              style={{ color: '#00be00', cursor: 'pointer' }}
              onClick={() => router.back()}></i>
            <p className='m-0 font-weight-bold pt-1'>
              {`Báo cáo doanh thu chi tiết của `}
              <span style={{ fontWeight: 'bold', color: '#00be00' }}>{merchantName || '-'}</span>
            </p>
          </h4>
          <div className='header-block__report'>
            {/* <button className='btn btn-secondary btn-add'>
        <i className='icon fa fa-plus mr-0 fa-2x'></i>
      </button> */}
          </div>
        </div>
        {/* <ReportDetailSummaryRevenue total={totalRevenue} /> */}

        <DataTableDetailRevenue
          data={detailRevenue}
          total={totalRevenue}
          getDataList={handleDetailRevenue}
          {...{ isLoading: loadingTable }}
        />
      </div>
    </>
  );
};

export default DetailRevenueMerchantContainer;
