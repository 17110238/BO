import {
  FilterSearchIsecReportTrans,
  ISecReportTransaction,
  PayloadSearchIsecReportTrans,
} from 'models';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getListIsecReportTransaction } from 'redux/actions';
import { clearFalsyObject } from 'utils/helpers/replaceUrl';
import HeaderIsecBlock from '../HeaderIsecBlock';
import BoxAutoSearchSocialPay from './BoxSearchIsecReportTransaction';
import DataTableSocialPay from './DatatableIsecReportTransaction';

interface Props {
  isShowFilter: boolean;
}

const IsecReportTransactionContainer: React.FC<Props> = ({ isShowFilter }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const dispatch = useDispatch();

  const [filter, setFilter] = useState<FilterSearchIsecReportTrans>({});
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [dataList, setDataList] = useState<ISecReportTransaction[]>([]);

  const handleSubmitSearch = (data: any) => {
    setFilter(data);

    setSubmitForm(true);
  };

  const handleSearchSocialPay = (start?: number, limit?: number, sort?: {}) => {
    const payload: PayloadSearchIsecReportTrans = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function getList(searchFilter: PayloadSearchIsecReportTrans) {
      setLoadingTable(true);
      dispatch(
        getListIsecReportTransaction(searchFilter, (state, res) => {
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
      const query: any = clearFalsyObject({
        ...router.query,
        createdAt: {
          from: router?.query?.from as string,
          to: router?.query?.to as string,
        },
      });
      delete query.to;
      delete query.from;

      setFilter(query);
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

export default IsecReportTransactionContainer;
