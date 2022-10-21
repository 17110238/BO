// import DataTableCustom from 'components/common/Datatable/DatatableCusTomv2';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import { BankListType, BankUpdateType } from 'models';
import React, { useMemo, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';

interface Props {
  data: BankListType[];
  onChangeBankStatus: (bankCodeId: number, isActive: boolean) => void;
  getDataList?: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
  onShowModalUpdateBankRow: (bank: BankListType) => void;
}

const DataTableBankList: React.FC<Props> = ({
  data,
  onChangeBankStatus,
  getDataList,
  onShowModalUpdateBankRow,
  ...rest
}) => {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const { t } = useTranslation('common');

  const handleChangeStatus = (e: React.ChangeEvent<HTMLInputElement>, bankCodeId: number) => {
    const { checked } = e.target;
    onChangeBankStatus(bankCodeId, checked);
  };

  const handleShowModalUpdateBankRow = (bank: BankListType) => {
    onShowModalUpdateBankRow(bank);
  };

  const columns: TableColumn<BankListType>[] = useMemo(
    () => [
      {
        name: t('ID'),
        width: '80px',
        cell: (row) => <div>{row.id}</div>,
      },
      {
        name: t('Swift code'),
        cell: (row) => <div>{row.swiftCode}</div>,
      },
      {
        name: t('Name'),
        cell: (row) => <div>{row.shortName}</div>,
      },
      {
        name: t('Status'),
        cell: (row, index) => (
          <div className='bank-status'>
            <label className='switch'>
              <input
                id={`bank-status-${index}`}
                type='checkbox'
                checked={row.isActive}
                onChange={(e) => handleChangeStatus(e, row.bankCodeId)}
              />
              <span className='slider around'></span>
            </label>
          </div>
        ),
      },
      {
        name: t('Cổng'),
        cell: (row) => (
          <div className='bank-gateway'>
            <p className='mb-0'>{row?.link?.gateway}</p>
          </div>
        ),
      },
      {
        name: t('Ngày yêu cầu'),
        cell: (row) => (
          <div className='bank-required-date'>
            <p className='mb-0'>{row.requiredDate}</p>
          </div>
        ),
      },
      {
        name: '',
        width: '50px',
        cell: (row) => (
          <div className='bank-required-date'>
            <button
              className='btn btn-update-gateway'
              onClick={() => handleShowModalUpdateBankRow(row)}>
              <i className='fas fa-edit'></i>
            </button>
          </div>
        ),
      },
    ],
    [lang]
  );

  return (
    <div>
      <DataTableCustom
        t={t}
        columns={columns}
        dataList={data}
        className='data-table-custom table-bank-list'
        nameDataTable='colMerchant'
        isSorting
        getDataList={getDataList}
        {...{
          fixedHeader: true,
          fixedHeaderScrollHeight: '70vh',
          disableFixHeight: true,
        }}
        {...rest}
      />
    </div>
  );
};

export default DataTableBankList;
