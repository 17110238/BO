import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';

function ResetYourPassword({ email, validation, onChangeEmail, onSubmitSendEmail }) {
  const { t } = useTranslation('common');
  return (
    <div className='card-sign-in card-reset-password card-verify-email'>
      <h1 className='card-title'>{t('Reset your password')}</h1>
      <p className='description'>
        {t(
          "Enter the email address associated with your account and we'll send you a link to reset your password"
        )}
      </p>
      <form className='form-login' onSubmit={onSubmitSendEmail} noValidate>
        <div className='form-group  mb-30'>
          <label>{t('Account ID')}</label>
          <input
            type='text'
            className={`form-control ${
              validation.email || validation.emailFormat ? 'input-error' : ''
            }`}
            placeholder={t('Email / Phone number / Username')}
            value={email || ''}
            onChange={onChangeEmail}
          />
          {validation.email && (
            <div className='text-danger mt-10 ml-10 mb-0 txt-valid'>
              <i className='i-valid' />
              {t('Vui lòng nhập email')}
            </div>
          )}
          {validation.emailFormat && (
            <p className='text-danger mt-10 ml-10 mb-0 txt-valid'>
              <i className='i-valid' />
              {t('Email không đúng định dạng')}
            </p>
          )}
        </div>

        <div className='form-group mb-20'>
          <button type='submit' className='btn btn-success w-100'>
            {t('Continue')}
          </button>
        </div>
        <div className='form-group mb-50 text-center'>
          <Link href='/'>
            <a style={{ fontWeight: 600 }}>{t('Return to sign in')}</a>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default ResetYourPassword;
