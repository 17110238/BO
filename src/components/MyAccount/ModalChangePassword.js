import { SHA256 } from 'crypto-js';
import React, { memo, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { changePassAuth, closeModalChangePassword } from 'redux/actions';
import { Input } from 'ui/Form';
import { checkValidatePass } from 'utils/helpers';
import alert from 'utils/helpers/alert';

const ModalChangePassword = () => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();

  const show = useSelector((state) => state.authReducers?.show) || false;
  const accountId = useSelector((state) => state.authReducers?.accountInfo.profile.accountId) || '';
  // //useSelector((state) => state.mainReducer?.showChangePassword);
  const {
    register,
    formState: { errors },
    handleSubmit,
    clearErrors,
    setError,
    setValue,
    getValues,
    reset,
    control,
  } = useForm({ mode: 'onSubmit', reValidateMode: 'onSubmit' });

  const handleClose = () => dispatch(closeModalChangePassword());

  useEffect(() => {
    if (!show) {
      reset();
    }
  }, [show]);

  const handleSubmitChangePassword = (data) => {
    if (data.newPassword != data.rePassword) {
      setError('rePassword', {
        type: 'manual',
        message: t('Mật khẩu không đúng'),
      });
      return;
    }
    dispatch(
      changePassAuth(
        {
          accountId,
          password: SHA256(data.password).toString(),
          newPassword: SHA256(data.newPassword).toString(),
          rePassword: SHA256(data.newPassword).toString(),
        },
        (status, data) => {
          alert(status ? 'success' : 'error', data?.ChangePass.message, t);
          if (status) {
            handleClose();
          }
        }
      )
    );
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} dialogClassName='modal-account-default'>
        <Modal.Header>
          <p>{t('Change password')}</p>
          <img
            onClick={handleClose}
            className='close-modal'
            src='/assets/img/close-modal.svg'
            alt=''
          />
        </Modal.Header>
        <Modal.Body>
          <form
            className='form-change-password'
            onSubmit={handleSubmit(handleSubmitChangePassword)}>
            <div className='form-group'>
              <Input
                type='password'
                label={t('Mật khẩu hiện tại')}
                register={register}
                name='password'
                errors={errors.password}
                clearErrors={clearErrors}
                rules={{ minLength: 6, maxLength: 25, required: true }}
                placeholder={t('Nhập mật khẩu hiện tại')}
                autoComplete='new-password'
              />

              <Input
                type='password'
                label={t('Mật khẩu mới')}
                register={register}
                name='newPassword'
                errors={errors.password}
                clearErrors={clearErrors}
                rules={{ minLength: 6, maxLength: 25, required: true }}
                placeholder={t('Nhập mật khẩu mới')}
                autoComplete='new-password'
              />

              <Input
                type='password'
                label={t('Nhập lại mật khẩu mới')}
                register={register}
                name='rePassword'
                errors={errors.rePassword}
                clearErrors={clearErrors}
                rules={{ minLength: 6, maxLength: 25, required: true }}
                placeholder={t('Nhập lại mật khẩu mới')}
                autoComplete='off'
              />
            </div>
            <div className='form-group'>
              <button
                className='btn btn-primary btn-submit-change btn-hover__push'
                onClick={() => handleSubmitChangePassword}>
                {t('Change password')}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default memo(ModalChangePassword);
