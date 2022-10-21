import { SHA256 } from 'crypto-js';
import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { changePasswordMerchant } from 'redux/actions';
import { Input } from 'ui/Form';
import alert from 'utils/helpers/alert';

interface Props {
  show: boolean;
  onHide: (type?: string) => void;
  accountId: number;
}

interface PayloadChangePassword {
  password: string;
  newPassword: string;
  rePassword: string;
}

const ModalChangePassword: React.FC<Props> = ({ show = false, onHide, accountId }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const formRules = {
    password: { required: true, isVNumber: true, maxLength: 6, minLength: 6 },
    newPassword: { required: true, isVNumber: true, maxLength: 6, minLength: 6 },
    rePassword: { required: true, isVNumber: true, maxLength: 6, minLength: 6 },
  };

  const {
    register,
    clearErrors,
    setError,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<PayloadChangePassword>({
    shouldFocusError: false,
  });
  const handleSubmitForm: SubmitHandler<PayloadChangePassword> = (data, e) => {
    e?.preventDefault();

    if (data.rePassword !== data.newPassword) {
      setError('rePassword', {
        type: 'invalidSamePassword',
        message: t('Nhập lại mật khẩu chưa đúng.'),
      });
      return;
    }

    dispatch(
      changePasswordMerchant(
        {
          accountId,
          password: SHA256(data.password).toString(),
          newPassword: SHA256(data.newPassword).toString(),
          rePassword: SHA256(data.rePassword).toString(),
        },
        (state, res) => {
          alert(state ? 'success' : 'error', res.message, t);
          state && onHide('RESET_FORM');
        }
      )
    );
  };

  useEffect(() => {
    if (show) {
      setValue('password', '');
      setValue('newPassword', '');
      setValue('rePassword', '');
    }
  }, [show]);

  return (
    <Modal backdrop='static' onHide={onHide} show={show} className='modal-change-password-merchant'>
      <Modal.Header closeButton>{t('Đổi mật khẩu')}</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(handleSubmitForm)} autoComplete='off'>
          <div className='inputs-group'>
            <Input
              type='password'
              formGroupClassName={`${errors?.password?.message ? 'input-custom-error' : ''}`}
              label={t('Mật khẩu cũ')}
              register={register}
              errors={errors?.password}
              clearErrors={clearErrors}
              placeholder={t('Mật khẩu')}
              rules={formRules.password}
              name='password'
            />

            <Input
              type='password'
              formGroupClassName={`${errors?.newPassword?.message ? 'input-custom-error' : ''}`}
              label={t('Mật khẩu mới')}
              register={register}
              errors={errors?.newPassword}
              clearErrors={clearErrors}
              placeholder={t('Mật khẩu')}
              rules={formRules.newPassword}
              name='newPassword'
              autoComplete='off'
            />

            <Input
              type='password'
              formGroupClassName={`${errors?.rePassword?.message ? 'input-custom-error' : ''}`}
              label={t('Nhập lại mật khẩu')}
              register={register}
              errors={errors?.rePassword}
              clearErrors={clearErrors}
              placeholder={t('Mật khẩu')}
              rules={formRules.rePassword}
              name='rePassword'
              autoComplete='off'
            />
          </div>
          <button className='btn btn-primary w-100 mt-4'>{t('Đổi mật khẩu')}</button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalChangePassword;
