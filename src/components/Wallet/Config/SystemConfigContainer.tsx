import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BUTTON_CONFIG_ENUM, items } from './constants/configItems';

const ModalUpdateConfigVersion = dynamic(() => import('./modals/ModalUpdateConfigVersion'), {
  ssr: false,
});

const ModalConfigBankList = dynamic(() => import('./modals/ModalConfigBankList'), {
  ssr: false,
});

const ModalConfigIssuerList = dynamic(() => import('./modals/ModalConfigIssuerList'), {
  ssr: false,
});

const ModalConfigSupplierList = dynamic(() => import('./modals/ModalConfigSupplierList'), {
  ssr: false,
});

interface ModalStateType {
  modalConfigVersionApp: boolean;
  modalConfigVersionSDK: boolean;
  modalConfigBankList: boolean;
  modalConfigSupplierList: boolean;
  modalConfigIssuerList: boolean;
}

const SystemConfigContainer = () => {
  const { t } = useTranslation('common');

  const defaultModalState: ModalStateType = {
    modalConfigVersionApp: false,
    modalConfigVersionSDK: false,
    modalConfigBankList: false,
    modalConfigSupplierList: false,
    modalConfigIssuerList: false,
  };
  const [modalState, setModalState] = useState<ModalStateType>(defaultModalState);

  const handleOpenModal = (type: string) => {
    const result: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      switch (type) {
        case BUTTON_CONFIG_ENUM.CONFIG_VERSION_APP:
          setModalState({ ...modalState, modalConfigVersionApp: true });
          return;
        case BUTTON_CONFIG_ENUM.CONFIG_VERSION_SDK:
          setModalState({ ...modalState, modalConfigVersionSDK: true });
          return;
        case BUTTON_CONFIG_ENUM.CONFIG_TRANSACTION_LIST:
          setModalState({ ...modalState, modalConfigBankList: true });
          return;
        case BUTTON_CONFIG_ENUM.CONFIG_SUPPLIER_LIST:
          setModalState({ ...modalState, modalConfigSupplierList: true });
          return;
        case BUTTON_CONFIG_ENUM.CONFIG_ISSUER_LIST:
          setModalState({ ...modalState, modalConfigIssuerList: true });
          return;

        default:
          return;
      }
    };
    return result;
  };

  const handleCloseModal = (type: string) => {
    const result = () => {
      switch (type) {
        case BUTTON_CONFIG_ENUM.CONFIG_VERSION_APP:
          setModalState({ ...modalState, modalConfigVersionApp: false });
          return;
        case BUTTON_CONFIG_ENUM.CONFIG_VERSION_SDK:
          setModalState({ ...modalState, modalConfigVersionSDK: false });
          return;
        case BUTTON_CONFIG_ENUM.CONFIG_TRANSACTION_LIST:
          setModalState({ ...modalState, modalConfigBankList: false });
          return;
        case BUTTON_CONFIG_ENUM.CONFIG_SUPPLIER_LIST:
          setModalState({ ...modalState, modalConfigSupplierList: false });
          return;
        case BUTTON_CONFIG_ENUM.CONFIG_ISSUER_LIST:
          setModalState({ ...modalState, modalConfigIssuerList: false });
          return;

        default:
          return;
      }
    };

    return result;
  };

  return (
    <>
      <div className='system-config-container config-layout'>
        <div className='config-header'>
          <Link href='/vi-dien-tu/van-hanh/he-thong/nang-cao'>
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
                          <p
                            dangerouslySetInnerHTML={{
                              __html: t(item.title),
                            }}
                          />
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
        show={modalState.modalConfigVersionApp}
        onHide={handleCloseModal(BUTTON_CONFIG_ENUM.CONFIG_VERSION_APP)}
      />

      <ModalUpdateConfigVersion
        isSDK
        show={modalState.modalConfigVersionSDK}
        onHide={handleCloseModal(BUTTON_CONFIG_ENUM.CONFIG_VERSION_SDK)}
      />

      <ModalConfigBankList
        show={modalState.modalConfigBankList}
        onHide={handleCloseModal(BUTTON_CONFIG_ENUM.CONFIG_TRANSACTION_LIST)}
      />

      <ModalConfigSupplierList
        show={modalState.modalConfigSupplierList}
        onHide={handleCloseModal(BUTTON_CONFIG_ENUM.CONFIG_SUPPLIER_LIST)}
      />

      <ModalConfigIssuerList
        show={modalState.modalConfigIssuerList}
        onHide={handleCloseModal(BUTTON_CONFIG_ENUM.CONFIG_ISSUER_LIST)}
      />
    </>
  );
};

export default SystemConfigContainer;
