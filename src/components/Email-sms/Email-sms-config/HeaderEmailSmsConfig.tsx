import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalCreateEmailSms from './ModalCreateEmailSms';

interface Props {}

const HeaderEmailSms: React.FC<Props> = ({}) => {
  const { t } = useTranslation('common');
  const [isShow, setIsShow] = useState<boolean>(false);
  const onHide = () => setIsShow(false);
  return (
    <>
      <div className='header-merchant-container'>
        <p className='header-merchant__title'>{t('Gói Email-sms')}</p>
        <div className='header-merchant__btn-group'>
          <button className='btn btn-secondary btn-search' onClick={() => setIsShow(true)}>
            <i className='fa fa-plus mr-0' style={{ fontSize: '1.5rem' }}></i>
          </button>
        </div>
      </div>
      <ModalCreateEmailSms show={isShow} onHide={onHide} />
    </>
  );
};

export default HeaderEmailSms;
