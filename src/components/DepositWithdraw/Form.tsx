import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from 'ui/Form';
import Select from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import { useDispatch } from 'react-redux';
import { depositWithdrawAction } from 'redux/actions/depositWithdrawAction';
import alert from 'utils/helpers/alert';
import { Form } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import numeral from 'numeral';

interface Props {
  customerPayload: Object;
  isGettingInfo: boolean;
  handleSearchUser: (e: any) => void;
  register: any;
  errors: any;
  clearErrors: any;
  handleSubmit: any;
  handleFetchUserInfo: () => void;
  control: any;
}

const initAction = {
  label: 'Cộng tiền',
  value: 'ADD',
};
const actionList = [
  {
    label: 'Cộng tiền',
    value: 'ADD',
  },
  {
    label: 'Trừ tiền',
    value: 'SUBTRACT',
  },
];

const initPurpose = {
  label: 'Ứng tiền',
  value: 'Ứng tiền',
};

const purposeList = [
  {
    label: 'Ứng tiền',
    value: 'Ứng tiền',
  },
  {
    label: 'Nạp tiền',
    value: 'Nạp tiền',
  },
  {
    label: 'Khóa tiền',
    value: 'Khóa tiền',
  },
  {
    label: 'Giải quyết bug',
    value: 'Giải quyết bug',
  },
];

const DepositWithdrawForm: FC<Props> = ({
  customerPayload,
  isGettingInfo,
  handleSearchUser,
  errors,
  register,
  control,
  handleSubmit,
  handleFetchUserInfo,
}) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [selectedAction, setSelectedAction] = useState<any>(initAction);
  const [selectedPurpose, setSelectedPurpose] = useState<any>(initPurpose);

  const onDepositWithdraw = (data: any) => {
    const payload = {
      ...data,
      action: selectedAction.value,
      reason: selectedPurpose.value,
      amount: parseInt(data.amount.replaceAll(',', '')),
    };
    dispatch(
      depositWithdrawAction(payload, (state, data) => {
        if (state) {
          alert('success', data.message, t);
          handleFetchUserInfo();
        } else {
          alert('error', data.message, t);
        }
      })
    );
  };

  const allowOnlyNumber = (value: string) => {
    return value.replace(/[^0-9]/g, '');
  };

  return (
    <form onSubmit={handleSubmit(onDepositWithdraw)} className='deposit-withdraw-form'>
      <div className='phone-input mb-3'>
        <label>{t('Số điện thoại')}</label>
        <div className='flex-grow-1'>
          <Controller
            control={control}
            name='phone'
            render={({ field: { onChange, value } }) => (
              <input
                {...register('phone')}
                className='mb-1 form-control base-input'
                maxLength={12}
                placeholder='Nhập số điện thoại khách hàng'
                onChange={(e) => {
                  onChange(allowOnlyNumber(e.target.value));
                  handleSearchUser(e);
                }}
                value={value}
              />
            )}
          />
          {errors?.phone?.message && <p className='text-danger mt-1'>{errors.phone.message}</p>}
        </div>
        {isGettingInfo && (
          <div className='dots'>
            <div className='dot-1'></div>
            <div className='dot-2'></div>
            <div className='dot-3'></div>
          </div>
        )}
      </div>
      <div className='form-input mb-3'>
        <label>{t('Thao tác')}</label>
        <Select
          value={selectedAction}
          options={actionList}
          classNamePrefix={!(Object.keys(customerPayload).length > 0) ? 'disabled-select ' : ''}
          isDisabled={!(Object.keys(customerPayload).length > 0)}
          styles={{
            ...customStyles,
            menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
            menu: (provided) => ({ ...provided, zIndex: 2 }),
          }}
          onChange={setSelectedAction}
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: '#EFF2F7',
              primary: '#00be00',
            },
          })}
        />
      </div>
      <div className='form-input mb-3'>
        <label>{t('Số tiền')}</label>
        <div className='flex-grow-1'>
          <Controller
            control={control}
            name='amount'
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Form.Control
                {...register('amount', { required: true })}
                disabled={!(Object.keys(customerPayload).length > 0)}
                className={`mb-1 form-control base-input ${errors.amount && 'input-error'}`}
                maxLength={15}
                placeholder={`${t('Enter')} ${t('Số tiền').toLowerCase()}`}
                onChange={(e) => {
                  onChange(+allowOnlyNumber(e.target.value));
                }}
                value={value ? numeral(value).format('0,0') : ''}
              />
            )}
          />
        </div>
      </div>
      <div className='form-input mb-3'>
        <label>{t('Mục đích')}</label>
        <Select
          value={selectedPurpose}
          options={purposeList}
          classNamePrefix={!(Object.keys(customerPayload).length > 0) ? 'disabled-select ' : ''}
          isDisabled={!(Object.keys(customerPayload).length > 0)}
          styles={{
            ...customStyles,
            menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
            menu: (provided) => ({ ...provided, zIndex: 2 }),
          }}
          onChange={setSelectedPurpose}
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: '#EFF2F7',
              primary: '#00be00',
            },
          })}
        />
      </div>
      <div className='form-input mb-3'>
        <label>{t('ID tham chiếu')}</label>
        <div className='flex-grow-1'>
          <Controller
            control={control}
            name='referId'
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Form.Control
                {...register('referId', { required: true })}
                disabled={!(Object.keys(customerPayload).length > 0)}
                className={`mb-1 form-control base-input ${errors.referId && 'input-error'}`}
                placeholder='Nhập ID tham chiếu'
              />
            )}
          />
        </div>
      </div>
      <div className='form-input'>
        <label>Diễn giải</label>
        <textarea
          className='input-textarea'
          disabled={!(Object.keys(customerPayload).length > 0)}
          placeholder={t('Nhập diễn giải')}
          style={{ width: '100%', maxHeight: '250px', minHeight: '100px' }}
          {...register('description')}
        />
      </div>
      <div className='d-flex align-items-center justify-content-center mt-3'>
        <button
          style={{ height: 'fit-content', fontSize: 'medium', lineHeight: '40px' }}
          disabled={!(Object.keys(customerPayload).length > 0)}
          type='submit'
          className='btn btn-success'>
          {t('Confirm')}
        </button>
      </div>
    </form>
  );
};

export default DepositWithdrawForm;
