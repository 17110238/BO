import React from 'react';
import { useTranslation } from 'react-i18next';

function ResetPasswordForm({ formValue, validation, onChange, onSubmit }) {
  const { t } = useTranslation('common');

  return (
    <div className='card-sign-in'>
      <h1 className='card-title'>{t('Reset your password')}</h1>
      <form className='form-login' onSubmit={onSubmit} noValidate>
        <div className='form-group'>
          <label className='float-left'>{t('New password')}</label>
          <input
            type='password'
            className={`form-control ${
              validation.currentPassword ||
              validation.currentPasswordLength ||
              validation.currentPasswordFormat ||
              validation.currentPasswordValid ||
              validation.currentPasswordText
                ? 'input-error'
                : ''
            }`}
            placeholder={t('At least 06 characters')}
            minLength='6'
            name='currentPassword'
            value={formValue.currentPassword || ''}
            onChange={onChange}
          />
          {validation.currentPassword && (
            <div className='text-danger mt-10 ml-10 mb-0 txt-valid'>
              <i className='i-valid' />
              {t('Vui lòng nhập mật khẩu')}
            </div>
          )}
          {validation.currentPasswordLength && (
            <div className='text-danger mt-10 ml-10 mb-0 txt-valid'>
              <i className='i-valid' />
              {t('Mật khẩu phải có 6 số')}
            </div>
          )}
          {validation.currentPasswordFormat && (
            <div className='text-danger mt-10 ml-10 mb-0 txt-valid'>
              <i className='i-valid' />
              {t('Mật khẩu phải là số')}
            </div>
          )}
          {validation.currentPasswordValid && (
            <div className='text-danger mt-10 ml-10 mb-0 txt-valid'>
              <i className='i-valid' />
              {t('Mật khẩu không cho phép nhiều số liền kề trùng nhau và lặp lại')}
            </div>
          )}
          {validation.currentPasswordText && (
            <div className='text-danger mt-10 ml-10 mb-0 txt-valid'>
              <i className='i-valid' />
              {t('Mật khẩu phải là số')}
            </div>
          )}
        </div>
        <div className='form-group mb-40'>
          <label className='float-left'>{t('Confirm your password')}</label>
          <input
            type='password'
            className={`form-control ${
              validation.password ||
              validation.passwordLength ||
              validation.confirmed ||
              validation.passwordFormat ||
              validation.passwordValid ||
              validation.passwordText
                ? 'input-error'
                : ''
            }`}
            placeholder={t('At least 06 characters')}
            minLength='6'
            name='password'
            value={formValue.password || ''}
            onChange={onChange}
          />
          {validation.password && (
            <div className='text-danger mt-10 ml-10 mb-0 txt-valid'>
              <i className='i-valid' />
              {t('Vui lòng nhập mật khẩu')}
            </div>
          )}
          {validation.passwordLength && (
            <div className='text-danger mt-10 ml-10 mb-0 txt-valid'>
              <i className='i-valid' />
              {t('Mật khẩu phải có 6 số')}
            </div>
          )}
          {validation.passwordFormat && (
            <div className='text-danger mt-10 ml-10 mb-0 txt-valid'>
              <i className='i-valid' />
              {t('Mật khẩu phải là số')}
            </div>
          )}
          {validation.passwordValid && (
            <div className='text-danger mt-10 ml-10 mb-0 txt-valid'>
              <i className='i-valid' />
              {t('Mật khẩu không cho phép nhiều số liền kề trùng nhau và lặp lại')}
            </div>
          )}
          {validation.confirmed && (
            <div className='text-danger mt-10 ml-10 mb-0 txt-valid'>
              <i className='i-valid' />
              {t('Mật khẩu nhập lại không khớp')}!
            </div>
          )}
          {validation.passwordText && (
            <div className='text-danger mt-10 ml-10 mb-0 txt-valid'>
              <i className='i-valid' />
              {t('Mật khẩu phải là số')}
            </div>
          )}
        </div>
        <div className='form-group mb-45'>
          <button type='submit' className='btn btn-success w-100'>
            {t('Continue')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ResetPasswordForm;
