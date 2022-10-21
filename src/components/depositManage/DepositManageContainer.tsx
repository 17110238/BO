import { PayloadSearchDeposit, PayloadUpdateDeposit, SettingDeposit } from 'models';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { createSettingDeposit, getSettingDeposit, updateSettingDeposit } from 'redux/actions';
import alert from 'utils/helpers/alert';
import BoxSearchDepositManage, { PayloadDepositFilterType } from './BoxSearchDepositManage';
import DataTableDepositManage from './DataTableDepositManage';
import ModalAddUpdateDeposit from './modals/ModalAddUpdateDeposit';

interface ModalStateProps {
  modalCreate: boolean;
  modalUpdate: boolean;
}

const DepositManageContainer = () => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();

  const [filter, setFilter] = useState<PayloadDepositFilterType | {}>({});
  const [depositSeleted, setDepositSelected] = useState<SettingDeposit | {}>({});
  const [dataDeposit, setDataDeposit] = useState<SettingDeposit[] | []>([]);
  const [modalState, setModalState] = useState<ModalStateProps>({
    modalCreate: false,
    modalUpdate: false,
  });
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [loadingTable, setLoadingTable] = useState<boolean>(false);

  const handleSearchForm = (data: PayloadDepositFilterType | {}) => {
    setFilter(data);

    setSubmitForm(true);
  };

  const handleActiveModal = (type: string, value: boolean) => {
    switch (type) {
      case 'CREATE':
        setModalState({
          ...modalState,
          modalCreate: value,
        });
        break;
      case 'UPDATE':
        setModalState({
          ...modalState,
          modalUpdate: value,
        });
        break;
      default:
        break;
    }
  };

  const handleSearchDepositManage = (start?: number, limit?: number, sort?: {}) => {
    const payload = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
      sort: {
        id: -1,
      },
    };

    function getList(payload: PayloadSearchDeposit) {
      setLoadingTable(true);
      dispatch(
        getSettingDeposit(payload, (state, res) => {
          setDataDeposit(res?.data || []);
          setSubmitForm(false);
          setLoadingTable(false);
        })
      );
    }

    return {
      payload,
      getList,
      submitForm,
    };
  };

  const handleClickRow = (data: SettingDeposit) => {
    const result: React.MouseEventHandler<HTMLDivElement> = (e) => {
      handleActiveModal('UPDATE', true);
      setDepositSelected(data);
    };

    return result;
  };

  const handleAddDeposit = (data: SettingDeposit) => {
    dispatch(
      createSettingDeposit(data, (state, res) => {
        alert(state ? 'success' : 'error', res.message, t);
        setSubmitForm(state);
        state && handleActiveModal('CREATE', false);
      })
    );
  };

  const handleUpdateDeposit = (data: SettingDeposit) => {
    const newFormatData: PayloadUpdateDeposit = {
      id: +(data.id || 0),
      value: {
        sumBalanceDay: data.sumBalanceDay!,
        minBalanceRate: data.minBalanceRate!,
        minBalanceAmount: data.minBalanceAmount!,
      },
      description: data.description!,
    };

    dispatch(
      updateSettingDeposit(newFormatData, (state, res) => {
        alert(state ? 'success' : 'error', res.message, t);
        setSubmitForm(state);
        state && handleActiveModal('UPDATE', false);
      })
    );
  };

  return (
    <>
      <div className='deposit-manage-container deposit-manage'>
        <div className='deposit-manage__header-block'>
          <h4 className='header-block__title'>{t('Quản lý ký quỹ')}</h4>
          <div className='header-block__group-btn'>
            <button
              className='btn btn-secondary btn-add'
              onClick={() => {
                handleActiveModal('CREATE', true);
              }}>
              <i className='icon fa fa-plus mr-0 fa-2x'></i>
            </button>
          </div>
        </div>
        <BoxSearchDepositManage loading={loadingTable} onSubmitForm={handleSearchForm} />
        <DataTableDepositManage
          data={dataDeposit}
          getDataList={handleSearchDepositManage}
          onClickRow={handleClickRow}
          {...{ isLoading: loadingTable }}
        />
      </div>

      <ModalAddUpdateDeposit
        onSubmitForm={handleAddDeposit}
        show={modalState.modalCreate}
        onHide={(type?: string) => {
          handleActiveModal('CREATE', false);
        }}
        type='CREATE'
      />

      <ModalAddUpdateDeposit
        onSubmitForm={handleUpdateDeposit}
        show={modalState.modalUpdate}
        onHide={(type?: string) => {
          handleActiveModal('UPDATE', false);
        }}
        data={depositSeleted}
        type='UPDATE'
      />
    </>
  );
};

export default DepositManageContainer;
