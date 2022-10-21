import {
  EWalletISecReportAccount,
  FilterSearchEWalletIsecReportAccount,
  PayloadSearchEWalletIsecReportAccount,
} from 'models';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getListIsecReportByAccount } from 'redux/actions';
import { clearFalsyObject } from 'utils/helpers/replaceUrl';
import BoxSearchIsecReport from './BoxSearchIsecReport';
import DataTableIsecReport from './DataTableIsecReport';
import DataTableIsecReportTotal from './DataTableIsecReportTotal';
import HeaderIsecReport from './HeaderIsecReport';
const IsecReportContainer = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const dispatch = useDispatch();

  const [isShowFilter, setIsShowFilter] = useState<boolean>(true);
  const [filter, setFilter] = useState<FilterSearchEWalletIsecReportAccount>({});
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [refreshTable, setRefreshTable] = useState<boolean>(false);
  const [dataList, setDataList] = useState<EWalletISecReportAccount[]>([]);
  const [totalList, setTotalList] = useState<EWalletISecReportAccount>({});

  const handleSubmitSearch = (data: any) => {
    setFilter(data);

    setRefreshTable(true);
  };

  const handleSearchSocialPay = (start?: number, limit?: number, sort?: {}) => {
    const payload: PayloadSearchEWalletIsecReportAccount = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function getList(searchFilter: PayloadSearchEWalletIsecReportAccount) {
      setLoadingTable(true);
      dispatch(
        getListIsecReportByAccount(searchFilter, (state, res) => {
          setDataList(res?.data || res);
          searchFilter.filter?.txtSearch && setTotalList(res?.total || {});
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

  useEffect(() => {
    if (Object.keys(router?.query).length) {
      const query: any = clearFalsyObject({
        ...router.query,
        createdAt: {
          from: router?.query?.from as string,
          to: router?.query?.to as string,
        },
      });
      delete query.to;
      delete query.from;

      !Object.keys(query?.createdAt || {}).length && delete query.createdAt;

      setFilter(query);
    }
    setRefreshTable(true);
  }, []);

  return (
    <>
      <div className='approval-merchant-container isec-report-container'>
        <HeaderIsecReport
          isShowFilter={isShowFilter}
          onClickExport={() => {}}
          onClickFilter={() => {
            setIsShowFilter(!isShowFilter);
          }}
        />
        <div className='box-payment'>
          {isShowFilter && (
            <BoxSearchIsecReport loading={loadingTable} handleSubmitSearch={handleSubmitSearch} />
          )}
          {filter?.txtSearch ? (
            <DataTableIsecReportTotal
              total={totalList}
              data={dataList}
              getDataList={handleSearchSocialPay}
              {...{ isLoading: loadingTable }}
            />
          ) : (
            <DataTableIsecReport
              data={dataList}
              getDataList={handleSearchSocialPay}
              {...{ isLoading: loadingTable }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default IsecReportContainer;
