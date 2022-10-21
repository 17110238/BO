import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import dayjs from 'dayjs';
import { BalanceReportWallet, EWalletBankReport, PayloadBankReportForm } from 'models';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  getBankReportFormEwalletBillTT23,
  getBankReportFormEwalletDetailTT23,
  getBankReportFormEwalletTT23,
  getBankReportFormMerchantTT23,
} from 'redux/actions';
import { getBalance } from 'redux/actions/getBalanceReportWallet';
import { clearFalsyObject } from 'utils/helpers/replaceUrl';
import BoxSearchBankReportForm from './BoxSearchBankReportForm';
import DataTableReportForm from './DataTableReportForm';
import HeaderBankReportForm from './HeaderBankReportForm';
import ReportSummaryBank from './ReportSummaryBank';
import React from 'react';

export interface PayloadDate {
  createdAt: {
    from: string;
    to: string;
  };
}

interface ReactHTMLTableToExcelProps {
  id?: string;
  className?: string;
  table: string;
  filename: string;
  sheet: string;
  buttonText: string;
}
export interface ReportEwalletDetail {
  reportPersonal?: EWalletBankReport;
  reportBusiness?: EWalletBankReport;
}

const BankReportFormContainer = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const dispatch = useDispatch();
  const initData = useMemo(
    () => ({
      createdAt: {
        from: dayjs().startOf('quarter').utc().format(),
        to: dayjs().endOf('quarter').utc().format(),
      },
    }),
    []
  );

  const [isShowFilter, setIsShowFilter] = useState<boolean>(true);
  const [filter, setFilter] = useState<PayloadBankReportForm>({
    beginTime: initData.createdAt.from,
    endTime: initData.createdAt.to,
  });
  const [reportDataMerchant, setReportDataMerchant] = useState<EWalletBankReport>({});
  const [reportDataEWallet, setReportDataEWallet] = useState<EWalletBankReport>({});
  const [reportDataEWalletBill, setReportDataEWalletBill] = useState<EWalletBankReport>({});
  const [reportDataEWalletDetail, setReportDataEWalletDetail] = useState<ReportEwalletDetail>({});
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [balance, setBalance] = useState<BalanceReportWallet>({});

  const handleSubmitSearch = (data: PayloadDate) => {
    const formatData = {
      beginTime: data.createdAt.from,
      endTime: data.createdAt.to,
    };
    setFilter(formatData);
    setSubmitForm(true);
  };

  useEffect(() => {
    if (!submitForm) return;

    (async () => {
      setLoadingTable(true);
      await Promise.all([
        new Promise((resolve, reject) => {
          dispatch(
            getBankReportFormMerchantTT23(filter, (state, res) => {
              setReportDataMerchant(res ?? {});
              resolve(null);
            })
          );
        }),
        new Promise((resolve, reject) => {
          dispatch(
            getBankReportFormEwalletTT23(filter, (state, res) => {
              setReportDataEWallet(res ?? {});
              resolve(null);
            })
          );
        }),
        new Promise((resolve, reject) => {
          dispatch(
            getBankReportFormEwalletDetailTT23(filter, (state, res) => {
              setReportDataEWalletDetail({
                reportBusiness: res.ReportBusinessDetail ?? {},
                reportPersonal: res.ReportPersonalDetail ?? {},
              });
              resolve(null);
            })
          );
        }),
        new Promise((resolve, reject) => {
          dispatch(
            getBankReportFormEwalletBillTT23(filter, (state, res) => {
              setReportDataEWalletBill(res ?? {});
              resolve(null);
            })
          );
        }),
        new Promise((resolve, reject) => {
          dispatch(
            getBalance((state, res) => {
              setBalance(res ?? {});
              resolve(null);
            })
          );
        }),
      ]);
      setTimeout(() => {
        setLoadingTable(false);
      }, 1000);
      setSubmitForm(false);
    })();
  }, [submitForm]);

  useEffect(() => {
    const params = { ...router.query };

    if (Object.keys(router.query).length > 0) {
      delete params.to;
      delete params.from;
      const payload = clearFalsyObject({
        beginTime: router.query?.from ? (router.query?.from as string) : initData.createdAt.from,
        endTime: router.query?.to ? (router.query?.to as string) : initData.createdAt.to,
      });

      setFilter(payload as PayloadBankReportForm);
      setSubmitForm(true);
    }
  }, []);

  return (
    <>
      {loadingTable && <LoadingFullScreen />}
      <div className='approval-merchant-container ewallet-bank-report'>
        <HeaderBankReportForm
          loading={loadingTable}
          isShowFilter={isShowFilter}
          onClickExport={() => {}}
          onClickFilter={() => {
            setIsShowFilter(!isShowFilter);
          }}
        />
        <div className='box-payment'>
          {isShowFilter && (
            <BoxSearchBankReportForm
              loading={loadingTable}
              handleSubmitSearch={handleSubmitSearch}
            />
          )}

          <ReportSummaryBank total={balance} />
          <DataTableReportForm
            merchantReport={reportDataMerchant}
            ewalletReport={reportDataEWallet}
            detailReport={reportDataEWalletDetail}
            billReport={reportDataEWalletBill}
          />
        </div>
      </div>
    </>
  );
};

export default BankReportFormContainer;
