import { DelegatesType, role } from 'models';
import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import { addDelegateMerchant, getListRoleAccountMc } from 'redux/actions';
import { Input } from 'ui/Form';
import alert from 'utils/helpers/alert';

interface Props {
  show: boolean;
  onHide: (type?: string) => void;
  merchantId: number;
}

const ModalCreateDelegateAccount: React.FC<Props> = ({ show, onHide, merchantId, ...rest }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();

  const roles = useSelector<any, role[]>((state) => state?.AccountMerchant?.roles);

  const formRules = {
    username: { required: true, maxLength: 30, isUserNameDelegate: true },
    email: { isEmail: true },
    password: { required: true, isVNumber: true, maxLength: 6, minLength: 6 },
    phone: { maxLength: 11, minLength: 10 },
    fullname: { required: true, minLength: 4, maxLength: 50 },
  };
  const {
    handleSubmit,
    register,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
    control,
  } = useForm<DelegatesType>({
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
    defaultValues: {
      role: 'mc.cashier',
    },
  });

  const optionAccountType = roles.map((role) => {
    return {
      ...role,
      value: role.key,
      label: t(role.name).toUpperCase(),
    };
  });

  const handleSubmitForm: SubmitHandler<any> = (data, e) => {
    e?.preventDefault();

    dispatch(
      addDelegateMerchant(
        {
          merchantId,
          delegate: {
            ...data,
            password: data.password,
          },
        },
        (state, res) => {
          alert(state ? 'success' : 'error', res?.message || res?.data?.message, t);

          state && reset();
          state && onHide && onHide();
        }
      )
    );
  };

  const handleRandomPassword = () => {
    const randNumber = Math.floor(100000 + Math.random() * 900000);

    setValue('password', randNumber.toString());
    clearErrors('password');
  };

  useEffect(() => {
    if (show && !roles.length) {
      dispatch(getListRoleAccountMc());
    }
  }, [show]);

  return (
    <Modal
      backdrop='static'
      onHide={() => {
        reset();
        onHide && onHide();
      }}
      show={show}
      className='modal-create-delegate'
      centered>
      <Modal.Header closeButton>{t('Th??m nh??n vi??n')}</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(handleSubmitForm)} autoComplete='off'>
          <div className='inputs-group-v2'>
            <Input
              type='text'
              formGroupClassName={`${errors?.username?.message ? 'input-custom-error' : ''}`}
              label={t('T??n ????ng nh???p')}
              register={register}
              errors={errors?.username}
              clearErrors={clearErrors}
              placeholder={t('Nh???p ch??? kh??ng d???u ho???c s???')}
              rules={formRules.username}
              name='username'
            />

            <Input
              type='text'
              formGroupClassName={`position-relative ${
                errors?.password?.message ? 'input-custom-error' : ''
              }`}
              label={t('M???t kh???u')}
              register={register}
              errors={errors?.password}
              clearErrors={clearErrors}
              placeholder={t('M???t kh???u')}
              rules={formRules.password}
              name='password'
            />
          </div>

          <div className='inputs-group-v2'>
            <Input
              type='text'
              formGroupClassName={`${errors?.fullname?.message ? 'input-custom-error' : ''}`}
              label={t('T??n t??i kho???n')}
              register={register}
              errors={errors?.fullname}
              clearErrors={clearErrors}
              placeholder={t('T??n t??i kho???n')}
              rules={formRules.fullname}
              name='fullname'
            />

            <div
              className={'form-group ' + `${errors?.email?.message ? 'input-custom-error' : ''}`}>
              <label>{t('Email')}</label>
              <input
                className='form-control'
                type='text'
                placeholder='Email'
                {...register('email', {
                  pattern: {
                    value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                    message: t('Email kh??ng ????ng ?????nh d???ng'),
                  },
                  required: false,
                })}
              />
              {errors?.email?.message && (
                <p className='mt-10 mb-0 txt-valid'>
                  <i className='i-valid' />
                  {errors?.email?.message}
                </p>
              )}
            </div>

            <Input
              type='phone'
              formGroupClassName={`${errors?.phone?.message ? 'input-custom-error' : ''}`}
              label={t('S??? ??i???n tho???i')}
              register={register}
              errors={errors?.phone}
              clearErrors={clearErrors}
              placeholder={t('S??? ??i???n tho???i')}
              rules={formRules.phone}
              name='phone'
            />
          </div>

          <div className='inputs-group-v2'>
            <div className='form-group'>
              <label>{t('Lo???i t??i kho???n')}</label>
              <Controller
                control={control}
                name='role'
                render={({ field }) => (
                  <ReactSelect
                    className='select-input-form w-100'
                    classNamePrefix='input-select'
                    isSearchable={false}
                    onChange={(newValue) => field.onChange(newValue?.value)}
                    placeholder={t('Ch???n v??i tr??')}
                    options={optionAccountType}
                    value={optionAccountType.find((val) => val.value === field.value)}
                  />
                )}
              />
            </div>
          </div>

          <div className='inputs-group-v2'>
            <div className='form-group form-input-checkbox'>
              <label>{t('Tr???ng th??i')}</label>
              <label className='switch'>
                <input type='checkbox' {...register('isActive')} defaultChecked={true} />
                <span className='slider around' />
              </label>
            </div>
          </div>
          <button type='submit' className='btn btn-primary w-25 mt-4'>
            {t('T???o t??i kho???n')}
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalCreateDelegateAccount;
