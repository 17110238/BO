import React from 'react';
import { useTranslation } from 'react-i18next';
import formatCurrency from 'utils/helpers/formatCurrency';

interface Props {
  totalEmail? : number | boolean,
  totalSMS? : number | boolean
}

const HeaderEmailSmsMC: React.FC<Props> = ({
  totalEmail,
  totalSMS
}) => {
  const { t } = useTranslation('common');
  return (
    <div className='header-merchant-container' style={{padding: '15px 20px 15px', borderBottom: 'none', paddingBottom: '15px', alignItems : 'end'}}>
      {/* <p className='header-merchant__title'>{t('Email-sms Merchant')}</p> */}
      <div className='header-merchant__btn-group'>
        {/* <button className='btn btn-secondary btn-search'>
          <i className='fa fa-plus mr-0' style={{ fontSize: '1.5rem' }}></i>
        </button> */}
        <div className='btn box-btn-payment__btn-count'>
          <p className='btn-count__title'>{`${t('Tổng')}:`}</p>
          <div className='btn-count-detail'>
            <div className='btn-count-detail__info'>
              <img className='btn-count-detail__info-img' src='/assets/icon/sms-icon.svg' alt='sms' />
              <p className='btn-count-detail__info-number sms'>
                {formatCurrency(totalEmail)}
              </p>
            </div>
            <div className='btn-count-detail__info'>
              <img className='btn-count-detail__info-img' src='/assets/icon/mail-icon.svg' alt='email' />
              <p className='btn-count-detail__info-number email'>
                {formatCurrency(totalSMS)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderEmailSmsMC;
