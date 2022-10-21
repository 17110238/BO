import { MccCodeListType } from 'models';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BUTTON_CONFIG_ENUM, items } from './constants/configItems';

const ModalUpdateConfigVersion = dynamic(() => import('./modals/ModalUpdateConfigVersion'), {
  ssr: false,
});

const ModalConfigTransactionValue = dynamic(() => import('./modals/ModalConfigTransactionValue'), {
  ssr: false,
});

const ModalUpdateTransactionValue = dynamic(() => import('./modals/ModalUpdateTransactionValue'), {
  ssr: false,
});

const ModalConfigDefaultFee = dynamic(() => import('./modals/ModalConfigDefaultFee'), {
  ssr: false,
});

interface ModalStateType {
  modalConfigVersion: boolean;
  modalConfigTransactionValue: boolean;
  modalUpdateTransactionValue: boolean;
  modalConfigDefaultFee: boolean;
}

const SystemConfigContainer = () => {
  const { t } = useTranslation('common');

  const [modalState, setModalState] = useState<ModalStateType>({
    modalConfigVersion: false,
    modalConfigTransactionValue: false,
    modalUpdateTransactionValue: false,
    modalConfigDefaultFee: false,
  });
  const [refreshMccList, setRefreshMccList] = useState<boolean>(false);
  const [mCCodeSelected, setMCCodeSelected] = useState<MccCodeListType>();

  const handleOpenModal = (type: string) => {
    const result: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      switch (type) {
        case BUTTON_CONFIG_ENUM.CONFIG_VERSION:
          setModalState({
            ...modalState,
            modalConfigVersion: true,
          });
          break;

        case BUTTON_CONFIG_ENUM.CONFIG_TRANSACTION_VALUE:
          setModalState({
            ...modalState,
            modalConfigTransactionValue: true,
          });
          break;

        case BUTTON_CONFIG_ENUM.CONFIG_DEFAULT_FEE:
          setModalState({
            ...modalState,
            modalConfigDefaultFee: true,
          });
          break;

        case BUTTON_CONFIG_ENUM.UPDATE_TRANSACTION_VALUE:
          setModalState({
            ...modalState,
            modalUpdateTransactionValue: true,
          });
          break;

        default:
          break;
      }
    };
    return result;
  };

  const handleCloseModal = (type: string) => {
    const result = () => {
      switch (type) {
        case BUTTON_CONFIG_ENUM.CONFIG_VERSION:
          setModalState({
            ...modalState,
            modalConfigVersion: false,
          });
          break;

        case BUTTON_CONFIG_ENUM.CONFIG_TRANSACTION_VALUE:
          setModalState({
            ...modalState,
            modalConfigTransactionValue: false,
          });
          break;

        case BUTTON_CONFIG_ENUM.CONFIG_DEFAULT_FEE:
          setModalState({
            ...modalState,
            modalConfigDefaultFee: false,
          });
          break;

        case BUTTON_CONFIG_ENUM.UPDATE_TRANSACTION_VALUE:
          setModalState({
            ...modalState,
            modalUpdateTransactionValue: false,
          });
          break;

        default:
          break;
      }
    };

    return result;
  };

  const handleShowUpdateConfigTransValue = (data: MccCodeListType) => {
    const result: React.MouseEventHandler<HTMLDivElement> = (e) => {
      setMCCodeSelected(data);
      handleOpenModal(BUTTON_CONFIG_ENUM.UPDATE_TRANSACTION_VALUE)(e as any);
    };

    return result;
  };

  return (
    <>
      <div className='system-config-container config-layout'>
        <div className='config-header'>
          <Link href='/cong-thanh-toan/he-thong/nang-cao' passHref>
            <button className='btn btn-primary btn-advanced-config'>
              <i className='fas fa-user-cog'></i>
              {t('Cấu hình nâng cao')}
            </button>
          </Link>
        </div>
        <div className='config-content'>
          {items.map((group, index) => {
            return (
              <div className='config-content__config-item' key={index}>
                <h4 className='config-item__title'>{t(group.title)}</h4>
                <ul className='config-item__btn-group'>
                  {group.childrens.map((item, itemIndex) => {
                    return (
                      <li className='btn-config' key={itemIndex}>
                        <button onClick={handleOpenModal(item.constant)}>
                          <img src={item.srcImg} alt='icon-config' />
                          <p>{t(item.title)}</p>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <ModalUpdateConfigVersion
        show={modalState.modalConfigVersion}
        onHide={handleCloseModal(BUTTON_CONFIG_ENUM.CONFIG_VERSION)}
      />

      <ModalConfigTransactionValue
        show={modalState.modalConfigTransactionValue}
        onHide={handleCloseModal(BUTTON_CONFIG_ENUM.CONFIG_TRANSACTION_VALUE)}
        onClickRow={handleShowUpdateConfigTransValue}
        refreshData={refreshMccList}
      />

      <ModalConfigDefaultFee
        show={modalState.modalConfigDefaultFee}
        onHide={handleCloseModal(BUTTON_CONFIG_ENUM.CONFIG_DEFAULT_FEE)}
      />

      <ModalUpdateTransactionValue
        show={modalState.modalUpdateTransactionValue}
        onHide={(type?: string) => {
          handleCloseModal(BUTTON_CONFIG_ENUM.UPDATE_TRANSACTION_VALUE)();
          type === 'RESET_LIST' && setRefreshMccList(!refreshMccList);
        }}
        data={mCCodeSelected}
      />
    </>
  );
};

export default SystemConfigContainer;
