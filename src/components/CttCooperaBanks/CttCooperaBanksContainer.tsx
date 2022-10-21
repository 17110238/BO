// import DataTableCustom from 'components/common/Datatable/DatatableCusTomFooter';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import dayjs from 'dayjs';
import { BanksCooperaType, AddBankCooperaInput, EditBankCooperaInput } from 'models';
import React, { useEffect, useMemo, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  createCttCoopBankAction,
  getCttCoopBankListAction,
  updateCttCoopBankAction,
} from 'redux/actions';
import alert from 'utils/helpers/alert';
import ModalAddAndUpdateBank from './ModalAddAndUpdateBank';

const CttCooperaBanksContainer: React.FC = (props) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();

  const [showAddAndUpdate, setShowAddAndUpdate] = useState<boolean>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);

  const [bankList, setBankList] = useState<BanksCooperaType[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [bankData, setBankData] = useState<BanksCooperaType>();

  const scopes = useSelector<any, any>((state) => state.authReducers?.accountInfo?.scope || []);

  console.log(
    "scopes?.includes('bo.isEdit.bankAmount') ",
    scopes?.includes('bo.isEdit.bankAmount')
  );

  const columns: TableColumn<BanksCooperaType>[] = useMemo(() => {
    const cols = [
      {
        name: t('Ngân hàng'),
        cell: (row: any) => <div>{row.bankName}</div>,
      },
      {
        name: t('Dịch vụ'),
        cell: (row: any) => <div className='font-weight-bold'>{row.serviceName}</div>,
      },
      {
        name: t('Số tài khoản'),
        cell: (row: any) => <div>{row.bankNumber}</div>,
      },
      {
        name: t('Ngày hoạt động'),
        cell: (row: any) => (
          <div className='text-right w-100'>
            {dayjs(row.activeDate).format('HH:mm:ss DD/MM/YYYY')}
          </div>
        ),
      },
      {
        name: t('Loại tiền'),
        right: true,
        cell: (row: any) => <div className='text-right  w-100'>{row?.currency}</div>,
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

  const handleCreateCoopBank = (data: AddBankCooperaInput) => {
    dispatch(
      createCttCoopBankAction(data, (stt, res) => {
        if (stt) {
          setShowAddAndUpdate(false);
          setIsRefresh(true);
        }
        alert(stt ? 'success' : 'error', res.message, t);
      })
    );
  };

  const handleShowUpdateCoopBank = (data: BanksCooperaType) => {
    setBankData(data);
    setShowAddAndUpdate(true);
  };

  const handleUpdateCoopBank = (data: EditBankCooperaInput) => {
    dispatch(
      updateCttCoopBankAction({ ...data }, (stt, res) => {
        if (stt) {
          setShowAddAndUpdate(false);
          setBankData(undefined);
          setIsRefresh(true);
        }
        alert(stt ? 'success' : 'error', res.message, t);
      })
    );
  };

  const handleGetCoopBankList = () => {
    function getList() {
      setIsLoading(true);
      dispatch(
        getCttCoopBankListAction((stt, res) => {
          setIsLoading(false);
          setIsRefresh(false);
          if (stt) {
            setBankList(res?.data || []);
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
          <button className='btn btn-primary' onClick={handleShowAddAndUpdateCoopBank}>
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
          show={showAddAndUpdate}
          onHide={() => {
            setShowAddAndUpdate(false);
            setBankData(undefined);
          }}
          onUpdateCoopBank={handleUpdateCoopBank}
          onCreateCoopBank={handleCreateCoopBank}
        />
      )}
    </div>
  );
};

export default CttCooperaBanksContainer;
