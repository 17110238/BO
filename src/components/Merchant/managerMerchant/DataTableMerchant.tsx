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
  onCloseMerchant: React.ChangeEventHandler<HTMLInputElement>;
  onSubmitContract: (data: any) => void;
  onClickChangePassword: (id?: string) => void;
  onClickCreateSettlement: (id?: string) => void;
  onClickDisableMailSettlement: (id?: string) => void;
  onClickUpdateContract: (data?: MerchantAccount) => void;
  onClickSendAppovalMail: (data?: MerchantAccount) => void;
  onClickChangeOfHistoryMerchant: (idMC: string | undefined, nameMC: string | undefined) => void;
  onClickChangeOfFeeConfigurationChangeHistory: (
    idMC: string | undefined,
    nameMC: string | undefined
  ) => void;
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
  onCloseMerchant,
  onSubmitContract,
  onClickChangePassword,
  onClickCreateSettlement,
  onClickDisableMailSettlement,
  onClickSendAppovalMail,
  onClickUpdateContract,
  onClickChangeOfHistoryMerchant,
  onClickChangeOfFeeConfigurationChangeHistory,
  getDataList,
  ...rest
}: DataTableMerchantProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation('common');

  const mccCodes = useSelector<any, MccCodeListType[]>((state) => state?.utility?.mccCodes);

  const lang = localStorage.getItem('NEXT_LOCALE');
  const accountInfo = useSelector<any, scopeUserProps>((state) => state?.authReducers?.accountInfo);
  const createdAt = useMemo(
    () => ({
      from: dayjs().subtract(30, 'day').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    }),
    []
  );

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
                ? `/cong-thanh-toan/quan-ly-mc/${row?.merchantId}`
                : `/cong-thanh-toan/quan-ly-mc/thong-tin-mc/${row?.merchantId}`
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
                ? `/cong-thanh-toan/tai-khoan?search=${row.accountInfo?.id}`
                : `/cong-thanh-toan/tai-khoan/thong-tin-mc?search=${row.accountInfo?.id}`
            }
            passHref>
            {row.accountInfo?.id}
          </Link>
        ),
      },
      {
        name: t('T??n Merchant'),
        minWidth: '150px',
        cell: (row) => {
          return <div>{row?.businessOverview?.abbreviationName}</div>;
        },
      },
      {
        name: t('T??n ????ng nh???p'),
        minWidth: '150px',
        cell: (row) => {
          return <div>{row?.accountInfo?.username}</div>;
        },
      },
      {
        name: t('T??n hi???n th??? khi GD'),
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
        name: t('L??nh v???c KD'),
        minWidth: '250px',
        cell: (row) => {
          return (
            <div>
              {mccCodes.find((mcc) => row?.businessOverview?.category === mcc.code)?.content || '-'}
            </div>
          );
        },
      },
      {
        name: t('Ng?????i ?????i di???n'),
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
        name: t('Lo???i MC'),
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
        name: t('TG t???o'),
        minWidth: '150px',
        selector: (row) => row['createdAt']!,
        sortable: true!,
        sortField: 'createdAt',
        cell: (row) => {
          return <div>{dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY')}</div>;
        },
      },
      {
        name: t('TG Duy???t'),
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
        name: t('TG c???p nh???t'),
        minWidth: '150px',
        cell: (row) => {
          return <div>{dayjs(row?.updatedAt)?.format('HH:mm:ss DD/MM/YYYY')}</div>;
        },
      },
      {
        name: t('Ng??y h???t h???n h???p ?????ng'),
        minWidth: '180px',
        center: true,
        cell: (row) => {
          return <div>{row?.contractDateEnd ? dayjs(row?.contractDateEnd)?.format('HH:mm:ss DD/MM/YYYY') : '-'}</div>;
        },
      },
      {
        name: t('T??nh tr???ng h???p ?????ng'),
        minWidth: '170px',
        center: true,
        cell: (row) => {
          return (
            <span
              className={row?.contractState === "VALID" ? 'state---active' : 'state---inactive'}>
              {row?.contractState  === "VALID" ? 'Ho???t ?????ng' : 'Ng???ng ho???t ?????ng'}
            </span>
          );
        },
      },
      {
        name: t('T??nh tr???ng'),
        minWidth: '100px',
        maxWidth: '100px',
        cell: (row) => {
          return (
            <label className='switch'>
              <input
                type='checkbox'
                checked={row?.isActive}
                data-index={row.merchantId}
                data-name={row.businessOverview?.abbreviationName}
                onChange={onCloseMerchant}
              />
              <span className='slider around' />
            </label>
          );
        },
      },
      {
        name: t('Thao t??c'),
        minWidth: '100px',
        maxWidth: '100px',
        center: true,
        cell: (row) => {
          // return <Link className="idPayment" href='/insight/manager-merchant/detail-merchant'>Chi ti???t</Link>;
          return (
            <>
              <>
                <Dropdown className='merchant-manage-table-dropdown'>
                  <Dropdown.Toggle
                    className='p-0 w-100'
                    style={{
                      backgroundColor: 'rgba(0,0,0,0)',
                      borderColor: 'rgba(0,0,0,0)',
                    }}
                    id='dropdown-menu-align-end'>
                    <div className='d-flex justify-content-center w-100'>
                      <i className='fas fa-ellipsis-h m-0 text-muted'></i>
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ borderRadius: '12px' }}>
                    {accountInfo.scope.includes('bo.merchant.update') && (
                      <>
                        <Link href={`/cong-thanh-toan/quan-ly-mc/${row.merchantId}`} passHref>
                          <Dropdown.Item>
                            <i className='fas fa-edit fa-lg mr-2' />
                            {t('C???p nh???t')}
                          </Dropdown.Item>
                        </Link>
                      </>
                    )}
                    <Dropdown.Item onClick={() => onClickUpdateContract(row)}>
                      <i className='fas fa-file-invoice-dollar mr-2'></i>
                      {t('C???p nh???t h???p ?????ng')}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        router.push(
                          `/cong-thanh-toan/thong-ke-doanh-thu/${row?.merchantId}?from=${createdAt.from}&to=${createdAt.to}`
                        )
                      }>
                      <i className='fas fa-clipboard-list mr-2'></i>
                      {t('Chi ti???t b??o c??o')}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        router.push(
                          `/cong-thanh-toan/quan-ly-giao-dich?searchType=MERCHANT_ID&search=${row?.merchantId}`
                        )
                      }>
                      <i className='fas fa-clipboard-list mr-2'></i>
                      {t('Chi ti???t giao d???ch')}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        router.push(
                          `/cong-thanh-toan/quan-ly-cua-hang?merchantId=${row?.merchantId}`
                        )
                      }>
                      <i className='fas fa-store mr-2'></i>
                      {t('Danh s??ch c???a h??ng')}
                    </Dropdown.Item>
                    {/*code c?? */}
                    {/* <Dropdown.Item onClick={() => onClickChangePassword(row?.merchantId)}></Dropdown.Item> */}
                    <Dropdown.Item onClick={() => onClickChangePassword(row?.accountInfo?.id)}>
                      <i className='fas fa-key mr-2'></i>
                      {t('?????i m???t kh???u')}
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => onClickCreateSettlement(row?.merchantId)}>
                      <i className='fas fa-hand-holding-usd mr-2'></i>
                      {t('?????i so??t th??? c??ng')}
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => onSubmitContract(row.merchantId)}>
                      <i className='fas fa-file-contract mr-2'></i>
                      {t('G???i h???p ?????ng ??i???n t???')}
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => onClickSendAppovalMail(row)}>
                      <i className='fas fa-envelope mr-2'></i>
                      {t('G???i l???i mail duy???t')}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        onClickChangeOfHistoryMerchant(
                          row.merchantId,
                          row?.businessOverview?.abbreviationName
                        )
                      }>
                      <i className='fa fa-history fa-lg mr-2'></i>
                      {t('HistoryOfChange')}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        onClickChangeOfFeeConfigurationChangeHistory(
                          row.merchantId,
                          row?.businessOverview?.abbreviationName
                        )
                      }>
                      <i className='fa fa-sticky-note mr-2'></i>
                      {t('L???ch s??? thay ?????i c???u h??nh ph??')}
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => onClickDisableMailSettlement(row?.merchantId)}>
                      <i className='fas fa-envelope mr-2'></i>
                      {t('Mail ng???ng ?????i so??t')}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            </>
          );
        },
      },
    ];
    const length = arrTable.length;
    !accountInfo.scope.includes('bo.merchant.update') && arrTable.splice(length - 2);
    return arrTable;
  }, [lang]);

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
