import ToggleSearchButton from 'components/common/ToggleSearchButton';
import dayjs from 'dayjs';
import { SearchRevenuePayload, RevenueStatisticDataType, RevenueStatisticSumType } from 'models';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getRevenueStatisticsSDK } from 'redux/actions';
import BoxSearchData, { RevenueMCFilterType } from './BoxSearchData';
import RevenueStatisticsSDKTable from './RevenueStatisticsSDKTable';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const RevenueStatisticsSDKContainer = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showSearch, setShowSearch] = useState<boolean>(true);
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [filter, setFilter] = useState<RevenueMCFilterType>({
    createdAt: {
      from: dayjs().subtract(30, 'day').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    },
  });
  const [statistics, setStatistics] = useState<RevenueStatisticDataType[] | []>([]);
  const [sumStatistic, setSumStatistic] = useState<RevenueStatisticSumType>();

  const handleToggleShowSearch = () => {
    setShowSearch(!showSearch);
  };

  const handleRevenueStatistic = (start?: number, limit?: number, sort?: {}) => {
    const payload = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function getList(payload: SearchRevenuePayload) {
      setLoadingTable(true);
      dispatch(
        getRevenueStatisticsSDK(payload, (stt, res) => {
          setLoadingTable(false);
          setSubmitForm(false);
          setStatistics(res?.list);
          setSumStatistic(res?.sum);
        })
      );
    }

    return {
      payload,
      getList,
      submitForm,
    };
  };

  const handleSearch = (data: RevenueMCFilterType) => {
    setFilter(data);
    setSubmitForm(true);

    let params: any = {};

    if (data.createdAt?.from) params.from = data.createdAt?.from;
    if (data.createdAt?.to) params.to = data.createdAt?.to;
    if (data.merchantId) params.merchantId = data.merchantId;

    params = Object.keys(params)
      .map((key) => {
        return params[key as keyof {}] ? key + '=' + params[key as keyof {}] : '';
      })
      .join('&');

    router.replace({
      query: params,
    });
  };

  useEffect(() => {
    if (Object.keys(router.query).length > 0) {
      setFilter({
        ...filter,
        merchantId: Number(router.query.merchantId),
        createdAt: {
          from: (router.query?.from as string) ?? dayjs().subtract(30, 'day').toISOString(),
          to: (router.query?.to as string) ?? dayjs().endOf('date').toISOString(),
        },
      });
    }
    setSubmitForm(true);
  }, []);

  return (
    <div className='card'>
      <div className='card-header p-3'>
        <h2>Thống kê doanh thu SDK</h2>
        <ToggleSearchButton isShowSearch={showSearch} onToggleShowSearch={handleToggleShowSearch} />
      </div>
      <div className='card-body p-0'>
        {showSearch && <BoxSearchData isDisableBtn={loadingTable} onSubmitForm={handleSearch} />}
        <RevenueStatisticsSDKTable
          data={statistics}
          sumData={sumStatistic}
          getDataList={handleRevenueStatistic}
          {...{ isLoading: loadingTable }}
        />
      </div>
    </div>
  );
};

export default RevenueStatisticsSDKContainer;
