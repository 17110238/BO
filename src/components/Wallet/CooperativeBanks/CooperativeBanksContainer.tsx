// import DataTableCustom from 'components/common/Datatable/DatatableCusTomFooter';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import dayjs from 'dayjs';
import { AddBankEwalletInput, BanksEwalletType, EditBankEwalletInput } from 'models';
import numeral from 'numeral';
import React, { useEffect, useMemo, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { NumberFormatValues } from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { createCoopBankAction, getCoopBankListAction, updateCoopBankAction } from 'redux/actions';
import alert from 'utils/helpers/alert';
import ModalAddAndUpdateBank from './ModalAddAndUpdateBank';

const CooperativeBanksContainer: React.FC = (props) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();

  const [showAddAndUpdate, setShowAddAndUpdate] = useState<boolean>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);

  const [bankList, setBankList] = useState<BanksEwalletType[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>();
  const [bankData, setBankData] = useState<BanksEwalletType>();
  const [balance, setBalance] = useState<string>();

  const scopes = useSelector<any, any>((state) => state.authReducers?.accountInfo?.scope || []);

  const columns: TableColumn<BanksEwalletType>[] = useMemo(() => {
    const cols = [
      {
        name: t('Ngân hàng'),
        cell: (row: any) => <div>{row.bankName}</div>,
        footer: <div className='font-weight-bold'>{t('Tổng cộng:')}</div>,
      },
      {
        name: t('Dịch vụ'),
        cell: (row: any) => <div className='font-weight-bold'>{row.serviceName}</div>,
        footer: <div>-</div>,
      },
      {
        name: t('Số tài khoản'),
        cell: (row: any) => <div>{row.bankNumber}</div>,
        footer: <div>-</div>,
      },
      {
        name: t('Ngày hoạt động'),
        cell: (row: any) => (
          <div className='text-right w-100'>
            {dayjs(row.activeDate).format('HH:mm:ss DD/MM/YYYY')}
          </div>
        ),
        footer: <div>-</div>,
      },
      {
        name: t('Số dư (VNĐ)'),
        right: true,
        cell: (row: any) => (
          <div className='text-right  w-100'>
            <span className='font-weight-bold'>{numeral(row.balance).format('0,0')}</span>
          </div>
        ),
        footer: <b className='text-info'>{numeral(totalBalance).format('0,0')}</b>,
      },
      {
        name: '',
        width: '50px',
        cell: (row: any) => (
          <button
            disabled={!scopes?.includes('bo.isEdit.bankAmount')}
            className='btn btn-update-gateway'
            onClick={() => handleShowUpdateCoopBank(row)}>
            <i className='fas fa-edit' />
          </button>
        ),
        footer: <div />,
      },
    ];

    if (!scopes?.includes('bo.isEdit.bankAmount')) {
      cols.pop();
    }

    return cols;
  }, [totalBalance]);

  const handleShowAddAndUpdateCoopBank = () => {
    setShowAddAndUpdate(true);
  };

  const handleCreateCoopBank = (data: AddBankEwalletInput) => {
    dispatch(
      createCoopBankAction(data, (stt, res) => {
        if (stt) {
          setShowAddAndUpdate(false);
          setIsRefresh(true);
        }
        alert(stt ? 'success' : 'error', res.message, t);
      })
    );
  };

  const handleShowUpdateCoopBank = (data: BanksEwalletType) => {
    setBankData(data);
    setShowAddAndUpdate(true);
    setBalance(undefined);
  };

  const handleUpdateCoopBank = (data: EditBankEwalletInput) => {
    dispatch(
      updateCoopBankAction({ ...data, balance: Number(data.balance) }, (stt, res) => {
        if (stt) {
          setShowAddAndUpdate(false);
          setBankData(undefined);
          setIsRefresh(true);
        }
        alert(stt ? 'success' : 'error', res.message, t);
      })
    );
  };

  const handleChangeBalance = (values: NumberFormatValues) => {
    setBalance(values.formattedValue);
  };

  const handleGetCoopBankList = () => {
    function getList() {
      setIsLoading(true);
      dispatch(
        getCoopBankListAction((stt, res) => {
          setIsLoading(false);
          setIsRefresh(false);
          if (stt) {
            setBankList(res?.data || []);
            setTotalBalance(res?.data.reduce((accum: any, item: any) => accum + item.balance, 0));
          }
        })
      );
    }

    return {
      payload: {},
      getList,
      submitForm: isRefresh,
    };
  };

  useEffect(() => setIsRefresh(true), []);

  return (
    <div className='coop-banks-container card'>
      <div className='card-header'>
        <h3>Danh sách ngân hàng</h3>
        {scopes?.includes('bo.isEdit.bankAmount') && (
          <button
            className='btn btn-primary reset-height py-2'
            onClick={handleShowAddAndUpdateCoopBank}>
            <i className='fas fa-plus' />
            Thêm ngân hàng
          </button>
        )}
      </div>
      <div className='card-body p-0'>
        <DataTableCustom
          t={t}
          hasFooter
          columns={columns}
          dataList={bankList}
          getDataList={handleGetCoopBankList}
          nameDataTable='colMerchant'
          className='data-table-custom'
          isSorting={true}
          isLoading={isLoading}
        />
      </div>
      {showAddAndUpdate && (
        <ModalAddAndUpdateBank
          bankData={bankData}
          balance={balance}
          show={showAddAndUpdate}
          onHide={() => {
            setShowAddAndUpdate(false);
            setBankData(undefined);
          }}
          onUpdateCoopBank={handleUpdateCoopBank}
          onCreateCoopBank={handleCreateCoopBank}
          onChangeBalance={handleChangeBalance}
        />
      )}
    </div>
  );
};

export default CooperativeBanksContainer;
