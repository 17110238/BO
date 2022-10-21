import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import dayjs from 'dayjs';
import { EwalletReportLinkedBankType, GetReportLinkedBankPayLoad } from 'models';
import { useRouter } from 'next/router';
import numeral from 'numeral';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getWalletLinkedBankReport } from 'redux/actions';
import BoxSearchReportBank from './BoxSearchReportBank';

interface SumTotalType {
  sumQuantityLinkedCard: number;
  sumQuantityNewLinkedCard: number;
  sumQuantityUnlinkedCard: number;
  sumQuantityDepositTransaction: number;
  sumTotalDepositTransaction: number;
  sumQuantityWithdrawTransaction: number;
  sumTotalWithdrawTransaction: number;
}

const BankConnectContainer: React.FC = () => {
  const { t } = useTranslation('common');
  const [linkedBankList, setLinkedBankList] = useState<EwalletReportLinkedBankType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sumTotal, setSumTotal] = useState<SumTotalType>();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState<GetReportLinkedBankPayLoad>({});
  const router = useRouter();

  const handleSearch = (data: GetReportLinkedBankPayLoad) => {
    setSearchQuery(data);

    let params: any = {};

    if (data.filter?.dateFilter?.from) params.from = data.filter?.dateFilter?.from;
    if (data.filter?.dateFilter?.to) params.to = data.filter?.dateFilter?.to;
    if (data.filter?.swiftCode) params.swiftCode = data.filter?.swiftCode;

    params = Object.keys(params)
      .map((key) => {
        return params[key as keyof {}] ? key + '=' + params[key as keyof {}] : '';
      })
      .join('&');

    router.replace({
      query: params,
    });
  };

  const columns: TableColumn<EwalletReportLinkedBankType>[] = useMemo(
    () => [
      {
        name: t('Ngày'),
        cell: (row) => {
          return <div>{dayjs(row.date).format('HH:mm:ss DD/MM/YYYY')}</div>;
        },
        footer: <div className='font-weight-bold'>{t('Tổng cộng:')}</div>,
      },
      {
        name: t('SL liên kết'),
        right: true,
        cell: (row) => {
          return (
            <div className='text-info font-weight-bold'>{row?.quantityNewLinkedCard || '-'}</div>
          );
        },
        footer: <div>{sumTotal?.sumQuantityNewLinkedCard}</div>,
        footerName: t('Tổng SL liên kết'),
      },
      {
        name: t('SL liên kết mới'),
        right: true,
        cell: (row) => {
          return <div className='text-right w-100'>{row?.quantityLinkedCard ?? '-'}</div>;
        },
        footer: <div>{sumTotal?.sumQuantityLinkedCard}</div>,
        footerName: t('Tổng SL liên kết mới'),
      },
      {
        name: t('SL hủy liên kết'),
        right: true,
        cell: (row) => <div className='text-right w-100'>{row?.quantityUnlinkedCard ?? '-'}</div>,
        footer: <div>{sumTotal?.sumQuantityUnlinkedCard}</div>,
        footerName: t('Tổng SL hủy liên kết'),
      },
      {
        name: t('SL GD nạp'),
        right: true,
        cell: (row) => {
          return <div className='text-right w-100'>{row?.quantityDepositTransaction ?? '-'}</div>;
        },
        footer: <div>{sumTotal?.sumQuantityDepositTransaction}</div>,
        footerName: t('Tổng SL GD nạp'),
      },
      {
        name: t('Giá trị nạp (VND)'),
        right: true,
        cell: (row) => (
          <div className='text-right w-100'>
            {numeral(row?.totalDepositTransaction).format('0,0')}
          </div>
        ),
        footer: <div>{numeral(sumTotal?.sumTotalDepositTransaction).format('0,0')}</div>,
        footerName: t('Tổng giá trị nạp (VND)'),
      },
      {
        name: t('SL GD rút'),
        right: true,
        cell: (row) => <div className='text-right w-100'>{row?.quantityWithdrawTransaction}</div>,
        footer: <div>{sumTotal?.sumQuantityWithdrawTransaction}</div>,
        footerName: t('Tổng SL GD rút'),
      },
      {
        name: t('Giá trị rút (VND)'),
        right: true,
        cell: (row) => (
          <div className='text-right w-100'>
            {numeral(row?.totalWithdrawTransaction).format('0,0')}
          </div>
        ),
        footer: <div>{numeral(sumTotal?.sumTotalWithdrawTransaction).format('0,0')}</div>,
        footerName: t('Tổng giá trị rút (VND)'),
      },
    ],
    [sumTotal]
  );

  const handleGetWalletLinkedBankReport = useCallback((query) => {
    setLoading(true);
    dispatch(
      getWalletLinkedBankReport(query, (stt, res) => {
        setLoading(false);
        if (stt) {
          setLinkedBankList(res);
        }
      })
    );
  }, []);

  useEffect(() => {
    if (Object.keys(router.query).length === 0) {
      handleGetWalletLinkedBankReport(searchQuery);
    }
  }, [router.query]);

  useEffect(() => {
    if (Object.keys(router.query).length > 0) {
      const swiftCode = router.query.swiftCode;
      router.query.swiftCode = undefined;
      handleGetWalletLinkedBankReport({
        ...searchQuery,
        filter: {
          ...searchQuery.filter,
          dateFilter: {
            ...searchQuery.filter?.dateFilter,
            ...router.query,
          },
          swiftCode,
        },
      });
    }
  }, [router.query]);

  useEffect(() => {
    const newSumTotal = {
      sumQuantityLinkedCard: 0,
      sumQuantityNewLinkedCard: 0,
      sumQuantityUnlinkedCard: 0,
      sumQuantityDepositTransaction: 0,
      sumTotalDepositTransaction: 0,
      sumQuantityWithdrawTransaction: 0,
      sumTotalWithdrawTransaction: 0,
    };
    linkedBankList.length > 0 &&
      linkedBankList?.forEach((elm: EwalletReportLinkedBankType) => {
        newSumTotal.sumQuantityLinkedCard += elm.quantityLinkedCard;
        newSumTotal.sumQuantityNewLinkedCard += elm.quantityNewLinkedCard;
        newSumTotal.sumQuantityUnlinkedCard += elm.quantityUnlinkedCard;
        newSumTotal.sumQuantityDepositTransaction += elm.quantityDepositTransaction;
        newSumTotal.sumTotalDepositTransaction += elm.totalDepositTransaction;
        newSumTotal.sumQuantityWithdrawTransaction += elm.quantityWithdrawTransaction;
        newSumTotal.sumTotalWithdrawTransaction += elm.totalWithdrawTransaction;
      });
    setSumTotal(newSumTotal);
  }, [linkedBankList]);

  return (
    <div className='card wallet-link-bank-container'>
      <div className='card-header'>
        <h3>Thống kê liên kết ngân hàng</h3>
      </div>
      <div className='card-body p-0'>
        <BoxSearchReportBank onSearch={handleSearch} />
        <DataTableCustom
          hasFooter
          t={t}
          columns={columns}
          dataList={linkedBankList}
          nameDataTable='colMerchant'
          className='data-table-custom'
          isSorting={true}
          isLoading={loading}
          hidePagination
        />
      </div>
    </div>
  );
};

export default BankConnectContainer;
