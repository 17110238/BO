import LoadingInline from 'components/common/Loading/LoadingInline';
import Nodata from 'components/common/NoData/Nodata';
import ToggleSearchButton from 'components/common/ToggleSearchButton';
import dayjs from 'dayjs';
import { DataReportPartner, ReportPartnerInput } from 'models';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getReportPartnerAction } from 'redux/actions';
import BoxSearchData from './BoxSearchData';

const ReportPartnerContainer = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [reportPartnerList, setReportPartnerList] = useState<DataReportPartner[]>([]);
  const [sumNewPartner, setSumNewPartner] = useState<number>(0);
  const [isShowFilter, setShowFilter] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<ReportPartnerInput>({
    filter: {
      createdAt: {
        from: dayjs().subtract(30, 'day').toISOString(),
        to: dayjs().endOf('date').toISOString(),
      },
    },
  });

  const handleSearch = (data: ReportPartnerInput) => {
    setSearchQuery(data);

    let params = data?.filter?.createdAt as Object;
    params = Object.keys(params)
      .map((key) => {
        return params[key as keyof {}] ? key + '=' + params[key as keyof {}] : '';
      })
      .join('&');

    router.replace({
      query: params as string,
    });
  };

  const handleGetReportPartnerAction = useCallback((searchQuery) => {
    setIsLoading(true);
    dispatch(
      getReportPartnerAction(searchQuery, (stt, res) => {
        setIsLoading(false);
        if (stt) {
          setReportPartnerList(res?.data);
          setSumNewPartner(res?.sumNewPartner);
        }
      })
    );
  }, []);

  useEffect(() => {
    if (Object.keys(router.query).length > 0) {
      setShowFilter(true);
      handleGetReportPartnerAction({
        ...searchQuery,
        filter: {
          ...searchQuery.filter,
          createdAt: {
            ...searchQuery.filter!.createdAt!,
            ...router.query,
          },
        },
      });
    }
  }, [router.query]);

  useEffect(() => {
    if (Object.keys(router.query).length === 0) {
      handleGetReportPartnerAction(searchQuery);
    }
  }, [searchQuery, router.query]);

  return (
    <div className='card report-partner-container' style={{ minHeight: '84vh' }}>
      <div className='card-header'>
        <h3>Báo cáo đối tác</h3>
        <ToggleSearchButton
          isShowSearch={isShowFilter}
          onToggleShowSearch={() => setShowFilter(!isShowFilter)}
        />
      </div>
      {isShowFilter && <BoxSearchData isLoading={isLoading} onSearch={handleSearch} />}
      <div className='p-3'>
        <div className='table-container' style={{ overflowX: 'auto', borderRadius: 8 }}>
          <LoadingInline loading={isLoading} />
          {reportPartnerList.length > 0 ? (
            <table className='table table-bordered mb-0 table-tripped' style={{ minWidth: 880 }}>
              <thead>
                <tr>
                  <th
                    style={{
                      width: '20%',
                      whiteSpace: 'nowrap',
                      background: '#f8f9fb',
                      borderBottom: 0,
                    }}></th>
                  {reportPartnerList.map((item) => (
                    <th
                      key={item.date}
                      style={{
                        whiteSpace: 'nowrap',
                        background: '#f8f9fb',
                        borderBottom: 0,
                        fontWeight: 600,
                      }}>
                      {item.date}
                    </th>
                  ))}
                  {sumNewPartner && (
                    <th
                      style={{
                        width: '20%',
                        whiteSpace: 'nowrap',
                        background: '#f8f9fb',
                        borderBottom: 0,
                      }}>
                      Tổng
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ whiteSpace: 'nowrap' }}>Số lượng đối tác mới</td>
                  {reportPartnerList.map((item) => (
                    <td key={item.date} align='right'>
                      {item.newPartner}
                    </td>
                  ))}
                  <td align='right'>{sumNewPartner}</td>
                </tr>
                <tr>
                  <td style={{ whiteSpace: 'nowrap' }}>Tổng số lượng đối tác</td>
                  {reportPartnerList.map((item) => (
                    <td key={item.date} align='right'>
                      {item.totalNewPartners}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          ) : (
            <Nodata />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportPartnerContainer;
