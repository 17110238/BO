import dayjs from 'dayjs';
import { PayloadSearchDeposit, PaymentMethod, RevenueReport } from 'models';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getpaymentMethodList, getRevenueStatistics } from 'redux/actions';
import alert from 'utils/helpers/alert';
import { clearFalsyObject } from 'utils/helpers/replaceUrl';
import BoxSearchRevenueStatistics, {
  PayloadRevenueMCFilterType,
} from './BoxSearchRevenueStatistics';
import DataTableRevenueStatistics from './DataTableRevenueStatistics';
import HeaderBlockRevenue from './HeaderBlockRevenue';

const RevenueStatisticsContainer = () => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const router = useRouter();
  const revenueReport = useSelector<any, RevenueReport[]>(
    (state) => state.reportMerchant.revenueReport
  );
  const paymentMethods = useSelector<any, PaymentMethod[]>(
    (state) => state?.utility.paymentMethods
  );

  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [isShowFilter, setIsShowFilter] = useState<boolean>(true);
  const [filter, setFilter] = useState<PayloadRevenueMCFilterType>({
    createdAt: {
      from: dayjs().subtract(30, 'day').startOf('date').toISOString(),
      to: dayjs().endOf('date').toISOString(),
    },
  });
  const [currentSelected, setCurrentSelected] = useState<number>(-1);
  const [refreshTable, setRefreshTable] = useState<boolean>(false);

  const handleSearchForm = (data: PayloadRevenueMCFilterType | {}) => {
    setFilter(data);

    setRefreshTable(true);
  };

  const handleRevenueStatistic = (start?: number, limit?: number, sort?: {}) => {
    const payload = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function getList(payload: PayloadSearchDeposit) {
      setLoadingTable(true);
      dispatch(
        getRevenueStatistics(JSON.parse(JSON.stringify(payload)), (state, res) => {
          setLoadingTable(false);
          setRefreshTable(false);
        })
      );
    }

    return {
      payload,
      getList,
      submitForm: refreshTable,
    };
  };

  const handleClickRow = (data: RevenueReport) => {
    const result: React.MouseEventHandler<HTMLDivElement> = (e) => {
      setCurrentSelected(Number(data?.merchantId));
    };

    return result;
  };

  useEffect(() => {
    const params = { ...router.query };

    delete params.to;
    delete params.from;
    delete params.merchantId;

    const payload = clearFalsyObject({
      ...params,
      merchantId: +(router?.query?.merchantId as string) || '',
      createdAt: {
        from: router.query?.from
          ? (router.query?.from as string)
          : dayjs().subtract(30, 'day').startOf('date').toISOString(),
        to: router.query?.to ? (router.query?.to as string) : dayjs().endOf('date').toISOString(),
      },
    });

    setFilter(payload);

    !paymentMethods.length && dispatch(getpaymentMethodList());

    setRefreshTable(true);
  }, []);

  useEffect(() => {
    if (currentSelected && currentSelected !== -1) {
      const currentFilter = filter && {
        ...filter,
        from: filter?.createdAt?.from,
        to: filter?.createdAt?.to,
      };
      delete currentFilter.createdAt;
      delete currentFilter.merchantId;
      const params = Object.keys(currentFilter)
        .map(function (key) {
          return key + '=' + currentFilter[key as keyof {}];
        })
        .join('&');
      router.push({
        pathname: `${router.pathname}/${currentSelected}`,
        query: params,
      });
    }
  }, [currentSelected]);

  return (
    <>
      <div className='approval-merchant-container revenue-statistics-container revenue-statistics'>
        <HeaderBlockRevenue
          isShowFilter={isShowFilter}
          onClickExport={() => {}}
          onClickFilter={() => {
            setIsShowFilter(!isShowFilter);
          }}
        />
        {isShowFilter && (
          <BoxSearchRevenueStatistics loading={loadingTable} onSubmitForm={handleSearchForm} />
        )}
        {/* <ReportSummaryRevenue /> */}

        <DataTableRevenueStatistics
          data={revenueReport}
          getDataList={handleRevenueStatistic}
          onClickRow={handleClickRow}
          finishedAt={filter?.createdAt}
          {...{ isLoading: loadingTable }}
        />
      </div>
    </>
  );
};

export default RevenueStatisticsContainer;
