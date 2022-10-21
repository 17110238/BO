import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';

function ResetPasswordSuccess({ isPhoneNum, phone }) {
  const { t } = useTranslation('common');
  return (
    <div className='form-login'>
      <h1 className='card-title'>{t("You've successfully changed your password")}</h1>
      {isPhoneNum && (
        <p className='description'>
          {t('descriptionNewPasswordSuccess', {
            phone: phone?.substr(phone.length - 4),
          })}
        </p>
      )}
      <div className='form-group mb-50'>
        <Link href='/'>
          <a className='btn btn-success w-100 d-flex align-items-center justify-content-center'>
            {t('Continue to Login')}
          </a>
        </Link>
      </div>
    </div>
  );
}

export default ResetPasswordSuccess;
