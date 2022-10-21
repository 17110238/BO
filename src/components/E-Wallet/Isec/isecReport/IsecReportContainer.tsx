import dayjs from 'dayjs';
import { EWalletIsecReport, FilterSearchIsecManage } from 'models';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getListReportIsec } from 'redux/actions';
import HeaderIsecBlock from '../HeaderIsecBlock';
import BoxAutoSearchSocialPay from './BoxSearchIsecReport';
import DataTableSocialPay from './DatatableIsecReport';

interface Props {
  isShowFilter: boolean;
}

const IsecReportContainer: React.FC<Props> = ({ isShowFilter }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const dispatch = useDispatch();

  const [filter, setFilter] = useState<any>({
    from: dayjs().subtract(30, 'day').startOf('date').toISOString(),
    to: dayjs().endOf('date').toISOString(),
  });
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [dataList, setDataList] = useState<EWalletIsecReport[]>([]);

  const handleSubmitSearch = (data: FilterSearchIsecManage) => {
    setFilter(data.createdAt);

    setSubmitForm(true);
  };

  const handleSearchSocialPay = (start?: number, limit?: number, sort?: {}) => {
    const payload: FilterSearchIsecManage = {
      createdAt: filter,
    };

    function getList(searchFilter: FilterSearchIsecManage) {
      setLoadingTable(true);
      dispatch(
        getListReportIsec(searchFilter, (state, res) => {
          setDataList(res);
          setLoadingTable(false);
          setSubmitForm(false);
        })
      );
    }

    return {
      payload,
      getList,
      submitForm: submitForm,
    };
  };

  useEffect(() => {
    if (Object.keys(router?.query).length) {
      const query: any = {
        createdAt: {
          from:
            (router?.query?.from as string) ||
            dayjs().subtract(30, 'day').startOf('date').toISOString(),
          to: (router?.query?.to as string) || dayjs().endOf('date').toISOString(),
        },
      };

      delete query.to;
      delete query.from;

      setFilter(query.createdAt);
    }
    setSubmitForm(true);
  }, []);

  return (
    <>
      <div className='approval-merchant-container'>
        {/* <HeaderIsecBlock
          isShowFilter={isShowFilter}
          onClickExport={() => {}}
          onClickFilter={() => {
            setIsShowFilter(!isShowFilter);
          }}
        /> */}
        <div className='box-payment'>
          {isShowFilter && (
            <BoxAutoSearchSocialPay
              loading={loadingTable}
              handleSubmitSearch={handleSubmitSearch}
            />
          )}
          <DataTableSocialPay
            data={dataList}
            getDataList={handleSearchSocialPay}
            {...{ isLoading: loadingTable }}
          />
        </div>
      </div>
    </>
  );
};

export default IsecReportContainer;
