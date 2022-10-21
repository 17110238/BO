import dayjs from 'dayjs';
import { FilterEwalletReportSocialPayment, PayloadSearchEwalletReportSocialPayment } from 'models';
import { ReportEWalletSocialPayment } from 'models/eWalletSocialPayment/reportSocial';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getListReportEWalletSocial } from 'redux/actions';
import { clearFalsyObject } from 'utils/helpers/replaceUrl';
import HeaderSocialBlock from '../HeaderSocialBlock';
import BoxAutoSearchSocialPay from './BoxSearchReportSocial';
import DataTableSocialPay from './DatatableReportSocial';

interface Props {
  isShowFilter: boolean;
}

const ReportSocialContainer: React.FC<Props> = ({ isShowFilter }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const dispatch = useDispatch();

  const initValueForm = useMemo(
    () => ({
      createdAt: {
        from: dayjs().subtract(30, 'day').startOf('date').toISOString(),
        to: dayjs().endOf('date').toISOString(),
      },
    }),
    []
  );

  const [filter, setFilter] = useState<FilterEwalletReportSocialPayment>(initValueForm);
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [dataList, setDataList] = useState<ReportEWalletSocialPayment[]>([]);
  const [totalList, setTotalList] = useState<ReportEWalletSocialPayment>({});

  const handleSubmitSearch = (data: FilterEwalletReportSocialPayment) => {
    setFilter(data);

    setSubmitForm(true);
  };

  const handleSearchSocialPay = (start?: number, limit?: number, sort?: {}) => {
    const payload: PayloadSearchEwalletReportSocialPayment = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function getList(searchFilter: PayloadSearchEwalletReportSocialPayment) {
      setLoadingTable(true);
      dispatch(
        getListReportEWalletSocial(searchFilter, (state, res) => {
          setDataList(res?.data);
          setTotalList(res?.sumData);
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
        ...router?.query,
        createdAt: {
          from: (router?.query?.from as string) ?? initValueForm.createdAt.from,
          to: (router?.query?.to as string) ?? initValueForm.createdAt.to,
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
      <div className='approval-merchant-container report-social-container'>
        {/* <HeaderSocialBlock
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
          {/* <ReportSummarySocial total={{}} /> */}
          <DataTableSocialPay
            data={dataList}
            total={totalList}
            getDataList={handleSearchSocialPay}
            {...{ isLoading: loadingTable }}
          />
        </div>
      </div>
    </>
  );
};

export default ReportSocialContainer;
