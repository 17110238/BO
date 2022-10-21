import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import useWindowDimensions from 'hook/useWindowDimension';
import React, { useEffect, useMemo, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';
import { useSelector } from 'react-redux';
import formatCurrency from 'utils/helpers/formatCurrency';
import _ from 'lodash';
import { DepositBankType } from 'models';
import UpdateBankModal from './Modal/UpdateBank';
import AccountOpenClose from './Modal/AccountOpenClose';

interface Props {
  t: (a: string) => string;
  data: DepositBankType[];
  onRowSelected?: any;
  deleteDefault?: boolean;
  getDataList?: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
  setSubmitForm: (a: boolean) => void;
  heightBoxSearch?: number;
  rest?: any;
  isLoading: boolean;
}

const DataTable: React.FC<Props> = ({
  t,
  data,
  deleteDefault,
  getDataList,
  setSubmitForm,
  heightBoxSearch,
  isLoading,
  ...rest
}) => {
  const lang: string = localStorage.getItem('NEXT_LOCALE') ?? 'vi';
  const [isShowUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [bankId, setBankId] = useState<number>(0);
  const [fullName, setFullName] = useState<string>('');
  const [number, setNumber] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [branch, setBranch] = useState<string>('');
  const [balance, setBlance] = useState<number>(0);
  const [bankName, setName] = useState<string>('');
  const [isActive, setIsActive] = useState<string>('');
  const isOpen = 'isOpen';
  const isClose = 'isClose';

  const { height: screenHeight } = useWindowDimensions();
  const totalFixedHeightDatatable = heightBoxSearch && screenHeight - heightBoxSearch - 243; // 243 is total header + footer
  const [isShowAccountOpenClose, setIsShowAccountOpenClose] = useState<boolean>(false);

  const handleOnClick = (bankId: number | undefined, isActive: boolean | undefined) => {
    setIsShowAccountOpenClose(true);
    bankId && setBankId(bankId);
    isActive ? setIsActive(isClose) : setIsActive(isOpen);
  };

  const handleShowUpdateModal = (
    id: number | undefined,
    fullName: string | undefined,
    number: string | undefined,
    city: string | undefined,
    branch: string | undefined,
    balance: number | undefined,
    bankName: string | undefined
  ) => {
    id && setBankId(id);
    fullName && setFullName(fullName);
    number && setNumber(number);
    city && setCity(city);
    branch && setBranch(branch);
    balance && setBlance(balance);
    bankName && setName(bankName);
    setShowUpdateModal(true);
  };

  const handleClose = () => {
    setShowUpdateModal(false);
  };

  const handleAccountClose = () => {
    setIsShowAccountOpenClose(false);
  };

  const defaultColumn = [
    t('ID'),
    t('Tên chủ TK'),
    t('Số tài khoản'),
    t('Tỉnh / Thành TK'),
    t('Chi nhánh'),
    t('Số dư'),
    t('Tổng nạp'),
    t('Trạng thái'),
    t('Thao tác'),
  ];

  const columns: TableColumn<DepositBankType>[] = useMemo(
    () => [
      {
        name: t('ID'),
        minWidth: '80px',
        maxWidth: '100px',
        cell: (row) => <span>{row?.id}</span>,
      },
      {
        name: t('Ngân hàng'),
        minWidth: '250px',
        maxWidth: '300px',
        cell: (row) => <span>{row?.bankName} </span>,
      },
      {
        name: t('Tên chủ TK'),
        minWidth: '200px',
        maxWidth: '300px',
        cell: (row) => <span>{row?.fullName} </span>,
      },
      {
        name: t('Số tài khoản'),
        minWidth: '130px',
        maxWidth: '200px',
        cell: (row) => <span>{row?.number} </span>,
      },
      {
        name: t('Tỉnh / Thành TK'),
        minWidth: '180px',
        maxWidth: '250px',
        cell: (row) => <span>{row?.city}</span>,
      },
      {
        name: t('Chi nhánh'),
        minWidth: '120px',
        maxWidth: '200px',
        cell: (row) => <span>{row?.branch}</span>,
      },
      {
        name: t('Số dư'),
        right: true,
        cell: (row) => <span>{formatCurrency(row?.balance)} đ</span>,
        minWidth: '100px',
        maxWidth: '120px',
      },
      {
        name: t('Tổng nạp'),
        cell: (row) => <span>{formatCurrency(row?.totalDeposit)} đ</span>,
        minWidth: '120px',
        maxWidth: '200px',
        right: true,
      },
      {
        name: t('Trạng thái'),
        cell: (row) => (
          <span className={`${row?.isActive ? 'state-success-modal' : 'state-refunded-modal'} `}>
            {t(`${row?.isActive}`)}
          </span>
        ),
        minWidth: '150px',
        maxWidth: '200px',
      },
      {
        name: t('Thao tác'),
        center: true,
        minWidth: '80px',
        cell: (row) => {
          return (
            <>
              <Dropdown className='transaction-table-dropdown'>
                <Dropdown.Toggle
                  className='p-0 w-100'
                  style={{
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderColor: 'rgba(0,0,0,0)',
                  }}
                  id='dropdown-button-drop-up'>
                  <div className='d-flex justify-content-center w-100'>
                    <i className='fas fa-ellipsis-h m-0 text-muted'></i>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ borderRadius: '12px' }}>
                  <Dropdown.Item
                    className={`${row?.isActive ? 'danger' : ''}`}
                    onClick={() => {
                      handleOnClick(row?.id, row?.isActive);
                    }}>
                    {row?.isActive ? (
                      <div>
                        <i className='fa fa-times mr-2' /> {t('Đóng tài khoản')}
                      </div>
                    ) : (
                      <div>
                        <i className='fa fa-check-circle mr-2' /> {t('Mở tài khoản')}
                      </div>
                    )}
                  </Dropdown.Item>

                  <Dropdown.Item
                    className='refund'
                    onClick={() => {
                      handleShowUpdateModal(
                        row?.id,
                        row?.fullName,
                        row?.number,
                        row?.city,
                        row?.branch,
                        row?.totalDeposit,
                        row?.bankName
                      );
                    }}>
                    <i className='fas fa-edit fa-lg mr-2'></i>
                    {t('Cập nhật')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          );
        },
      },
    ],
    [lang]
  );

  return (
    <>
      <DataTableCustom
        isLoading={isLoading}
        t={t}
        fixedHeader={true}
        fixedHeaderScrollHeight={`${totalFixedHeightDatatable}px`}
        columns={columns}
        dataList={data}
        className='data-table-custom cash-withdraw-table'
        nameDataTable='colTransaction'
        getDataList={getDataList}
        defaultColumn={defaultColumn}
        {...rest}
      />

      <UpdateBankModal
        t={t}
        show={isShowUpdateModal}
        handleClose={handleClose}
        handleRecall={setSubmitForm}
        fullName={fullName}
        number={number}
        city={city}
        branch={branch}
        balance={balance}
        bankId={bankId}
        bankName={bankName}
      />
      <AccountOpenClose
        t={t}
        bankId={bankId}
        show={isShowAccountOpenClose}
        isActive={isActive}
        handleClose={handleAccountClose}
        handleRecall={setSubmitForm}
      />
    </>
  );
};

export default DataTable;
