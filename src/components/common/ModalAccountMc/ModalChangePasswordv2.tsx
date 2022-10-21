import { SHA256 } from 'crypto-js';
import { ChangePassAccMcInput } from 'models';
import React, { useEffect, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { updatePassword } from 'redux/actions';
import alert from 'utils/helpers/alert';

interface Props {
  accountId?: any;
  show?: boolean;
  handleShow?: (() => void) | undefined;
  handleClose: (() => void) | undefined;
}

const ModalChangePasswordv2: React.FC<Props> = ({ show, handleShow, handleClose, accountId }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();

  const formRules = {
    password: { required: true, isVNumber: true, maxLength: 6, minLength: 6 },
  };

  const textInputRef = useRef<string>('');

  //   const schema = yup.object({
  //     password : yup.number().required(),
  //   }).required()

  const {
    register,
    reset,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ChangePassAccMcInput>({
    // shouldFocusError: false,
    mode: 'onChange',
    reValidateMode: 'onChange',
    //resolver: yupResolver<yup.AnyObjectSchema>(schema),
  });

  useEffect(() => {
    if (show) {
      setValue('password', '');
    }
  }, [show]);

  // const allowOnlyNumber = (value: string) => {
  //     return value.replace(/[^0-9]/g, '')
  // }

  const handleSubmitForm: SubmitHandler<ChangePassAccMcInput> = (data, e) => {
    e?.preventDefault();
    dispatch(
      updatePassword(
        {
          accountId: Number(accountId),
          password: SHA256(data.password).toString(),
        },
        (state, res) => {
          if (state) {
            alert('success', t(res.message), t);
            handleClose && handleClose();
            setValue('password', '');
          } else {
            alert('error', res.message, t);
          }
        }
      )
    );
  };
  return (
    <Modal
      backdrop='static'
      onHide={() => {
        handleClose && handleClose();
        reset();
        setValue('password', '');
      }}
      show={show}
      className='modal-change-password-merchant'>
      <Modal.Header closeButton>{t('Đổi mật khẩu')}</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(handleSubmitForm)} autoComplete='off'>
          <div className='inputs-group' style={{}}>
            {/* <Input
                    type='password'
                    formGroupClassName={`${errors?.password?.message ? 'input-custom-error' : ''}`}
                    label={t('Mật khẩu mới')}
                    register={register}
                    errors={errors?.password}
                    clearErrors={clearErrors}
                    placeholder={t('Mật khẩu')}
                    rules={formRules.password}
                    name='password'
                    autoComplete='off'
                /> */}
            <div className={`form-group ${errors?.password ? 'input-custom-error d-block' : ''}`}>
              <label>
                {t('Mật khẩu mới')}
                <span className='text-danger'> (*)</span>
              </label>
              <input
                style={{
                  width: '100%',
                }}
                type='password'
                autoComplete='off'
                maxLength={6}
                {...register('password', {
                  required: true,
                  maxLength: 6,
                  minLength: 6,
                  onChange: (e) => {
                    if (!/^[0-9]*$/.test(e.target.value)) {
                      e.target.value = textInputRef.current;
                    } else {
                      textInputRef.current = e.target.value;
                    }
                  },
                })}
                placeholder={t('Mật khẩu')}
              />
              {errors.password && errors.password.type === 'required' && (
                <span className='text-danger'>
                  {t('Mật khẩu mới') + ' ' + t('không được rỗng')}
                </span>
              )}
              {errors.password && errors.password.type === 'minLength' && (
                <span className='text-danger'>
                  {t('Mật khẩu mới') + ' ' + t('tối thiểu 6 kí tự')}
                </span>
              )}
            </div>
          </div>
          <button type='submit' className='btn btn-primary w-100 mt-4'>
            {t('Đổi mật khẩu')}
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalChangePasswordv2;
