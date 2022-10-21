import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { scopeUserProps } from 'layouts/Header';
import {
  FilterSearchParams,
  MccCodeListType,
  MerchantAccount,
  PayloadFilterMccCodeType,
} from 'models';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getMccCodeList } from 'redux/actions';
import { formatPhone } from 'utils/helpers';
dayjs.extend(utc);

interface DataTableMerchantProps {
  data: MerchantAccount[];
  getDataList: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: FilterSearchParams;
    getList: (payload: FilterSearchParams) => void;
  };
}

function DataTableMerchant({
  data,

  getDataList,
  ...rest
}: DataTableMerchantProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation('common');
  const lang = localStorage.getItem('NEXT_LOCALE');
  const accountInfo = useSelector<any, scopeUserProps>((state) => state?.authReducers?.accountInfo);
  const mccCodes = useSelector<any, MccCodeListType[]>((state) => state?.utility?.mccCodes);

  const createdAt = {
    from: dayjs().subtract(30, 'day').startOf('day').utc().format(),
    to: dayjs().endOf('date').utc().format(),
  };
  const columns: TableColumn<MerchantAccount>[] = useMemo(() => {
    const arrTable: TableColumn<MerchantAccount>[] = [
      {
        name: t('MC ID'),
        minWidth: '100px',
        maxWidth: '120px',
        cell: (row, index) => (
          <Link
            href={
              accountInfo.scope.includes('bo.merchant.update')
                ? `/cong-thanh-toan/tham-dinh/${row?.merchantId}`
                : `/cong-thanh-toan/tham-dinh/thong-tin-mc/${row?.merchantId}`
            }
            passHref>
            {row?.merchantId}
          </Link>
        ),
      },
      {
        name: t('Account ID'),
        minWidth: '120px',
        maxWidth: '140px',
        cell: (row, index) => (
          <Link
            href={
              accountInfo.scope.includes('bo.merchant.update')
                ? `/cong-thanh-toan/tai-khoan?id=${row.accountInfo?.id}`
                : `/cong-thanh-toan/tai-khoan/thong-tin-mc?id=${row.accountInfo?.id}`
            }
            passHref>
            {row.accountInfo?.id}
          </Link>
        ),
      },
      {
        name: t('Tên Merchant'),
        minWidth: '150px',
        cell: (row) => {
          return <div>{row?.businessOverview?.abbreviationName}</div>;
        },
      },
      {
        name: t('Tên đăng nhập'),
        minWidth: '150px',
        cell: (row) => {
          return <div>{row?.accountInfo?.username}</div>;
        },
      },
      {
        name: t('Tên hiển thị khi GD'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{row?.businessOverview?.brandName}</div>;
        },
      },
      {
        name: t('Website'),
        minWidth: '150px',
        cell: (row) => {
          return <div>{row?.businessOverview?.homeUrl}</div>;
        },
      },
      {
        name: t('Lĩnh vực KD'),
        minWidth: '250px',
        cell: (row) => {
          return (
            <div>
              {' '}
              {mccCodes.find((mcc) => row?.businessOverview?.category === mcc.code)?.content || '-'}
            </div>
          );
        },
      },
      {
        name: t('Người đại diện'),
        minWidth: '150px',
        cell: (row) => {
          return <div>{row?.contactInfo?.name}</div>;
        },
      },
      {
        name: t('Phone'),
        minWidth: '120px',
        cell: (row) => {
          return <div>{formatPhone(row?.contactInfo?.phone ?? '', '0')}</div>;
        },
      },
      {
        name: t('Loại MC'),
        minWidth: '130px',
        cell: (row) => {
          return (
            <div style={{ textTransform: 'uppercase' }}>{t(row?.businessOverview?.type || '')}</div>
          );
        },
      },
      {
        name: t('Email'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{row?.contactInfo?.email}</div>;
        },
      },
      {
        name: t('TG tạo'),
        minWidth: '150px',
        selector: (row) => row['createdAt']!,
        sortable: true!,
        sortField: 'createdAt',
        cell: (row) => {
          return <div>{dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY')}</div>;
        },
      },
      {
        name: t('TG Duyệt'),
        minWidth: '150px',
        selector: (row) => row['approvedAt']!,
        sortable: true!,
        sortField: 'approvedAt',
        cell: (row) => {
          return (
            <div>{row?.approvedAt && dayjs(row?.approvedAt)?.format('HH:mm:ss DD/MM/YYYY')}</div>
          );
        },
      },
      {
        name: t('TG cập nhật'),
        minWidth: '150px',
        cell: (row) => {
          return <div>{dayjs(row?.updatedAt)?.format('HH:mm:ss DD/MM/YYYY')}</div>;
        },
      },
    ];
    const length = arrTable.length;
    !accountInfo.scope.includes('bo.merchant.update') && arrTable.splice(length - 2);
    return arrTable;
  }, [lang, data]);

  return (
    <div>
      <DataTableCustom
        className='data-table-custom'
        columns={columns}
        dataList={data}
        t={t}
        nameDataTable='colMerchant'
        getDataList={getDataList}
        isSorting={true}
        {...rest}
      />
    </div>
  );
}

export default DataTableMerchant;
