import { MerchantAccount } from 'models';
import React from 'react';
import { Control, Controller, UseFormClearErrors, UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactSelect from 'react-select';
import { Input } from 'ui/Form';
import { authOptions, crossOptions, currencyOptions } from '../utils/constantSelectOptions';

interface Props {
  errors: any;
  clearErrors: UseFormClearErrors<MerchantAccount>;
  control: Control<MerchantAccount>;
  register: UseFormRegister<MerchantAccount>;
}

const SubInfoMerchantForm: React.FC<Props> = ({ register, control, errors, clearErrors }) => {
  const { t } = useTranslation('common');

  return (
    <>
      <div className='inputs-group-v2'>
        <div className='form-group'>
          <label>
            {t('Xác thực chi hộ')}
            {/* <span className='text-danger'> (*)</span> */}
          </label>
          <Controller
            control={control}
            name='authType'
            render={({ field }) => (
              <ReactSelect
                className='select-input-form'
                classNamePrefix='input-select'
                options={authOptions}
                onChange={(newValue) => field.onChange(newValue?.value)}
                value={authOptions.find((ele) => ele.value === field.value)}
              />
            )}
          />
        </div>
        <div className='form-group'>
          <label>{t('Xác thực rút tiền')}</label>
          <Controller
            control={control}
            name='withdrawVerifyType'
            render={({ field }) => (
              <ReactSelect
                className='select-input-form'
                classNamePrefix='input-select'
                options={authOptions}
                onChange={(newValue) => field.onChange(newValue?.value)}
                value={authOptions.find((ele) => ele.value === field.value)}
              />
            )}
          />
        </div>
        <div className='form-group'>
          <label>{t('Hình thức đối soát')}</label>
          <Controller
            control={control}
            name='crossCheckInfo.type'
            render={({ field }) => (
              <ReactSelect
                className='select-input-form'
                classNamePrefix='input-select'
                value={crossOptions.find((ele) => ele.value === field.value)}
                onChange={(newValue) => field.onChange(newValue?.value)}
                options={crossOptions}
              />
            )}
          />
        </div>
        <Input
          type='number'
          label={t('Thời gian đối soát')}
          register={register}
          errors={errors}
          clearErrors={clearErrors}
          placeholder={t('T +')}
          // rules={formRules.crossCheckTime}
          rules={{}}
          name='crossCheckInfo.crossCheckNum'
        />
        <Input
          type='text'
          label={t('Telegram chi hộ')}
          register={register}
          errors={errors}
          clearErrors={clearErrors}
          placeholder={t('Chi hộ')}
          // rules={formRules.notifyPayout}
          rules={{}}
          name='notifyTelegram.payout'
        />
        <Input
          type='text'
          label={t('Telegram thanh toán')}
          register={register}
          errors={errors}
          clearErrors={clearErrors}
          placeholder={t('Thanh toán')}
          // rules={formRules.notifyPayment}
          rules={{}}
          name='notifyTelegram.payment'
        />
        <div className='form-group'>
          <label>
            {t('Loại tiền tệ')}
            {/* <span> (*)</span> */}
          </label>
          <Controller
            control={control}
            name='currency'
            defaultValue='VND'
            render={({ field }) => (
              <ReactSelect
                defaultValue={currencyOptions[0]}
                className='select-input-form'
                classNamePrefix='input-select'
                options={currencyOptions}
                onChange={(newValue) => field.onChange(newValue?.value)}
                value={currencyOptions.find((ele) => ele.value === field.value)}
              />
            )}
          />
        </div>
      </div>
      <div className='inputs-group-v2'>
        <div className='form-group form-input-checkbox d-flex flex-column'>
          <label>{t('Xác thực chuyển tiền')}</label>
          <label className='switch'>
            <input type='checkbox' {...register('isSecurityPayout')} />
            <span className='slider around' />
          </label>
        </div>

        <div
          className={`form-group form-group-multi-radio ${
            errors?.businessOverview?.connectionType ? 'form-group-multi-radio--errors' : ''
          }`}>
          <label>
            {t('Loại hình kinh doanh')}
            {/* <span className='text-danger ml-1'>(*)</span> */}
          </label>
          <div className='radio-group'>
            <label className='custom-radio'>
              <input
                type='radio'
                value='ONLINE'
                {...register('businessOverview.connectionType', {
                  // required: true,
                  onChange: (e) => clearErrors('businessOverview.connectionType'),
                })}
              />
              <span className='custom-radio__checkmark'>Trực tuyến</span>
            </label>
            <label className='custom-radio'>
              <input
                type='radio'
                value='OFFLINE'
                {...register('businessOverview.connectionType', {
                  // required: true,
                  // onChange: (e) => clearErrors('businessOverview.connectionType'),
                })}
              />
              <span className='custom-radio__checkmark'>Trực tiếp</span>
            </label>
          </div>
        </div>
        {/* <div className='form-group form-group-multi'></div> */}
        <div className='form-group form-group-multi-checkbox'>
          <label>{t('Hình thức tích hợp')}</label>
          <div className='checkbox-group'>
            <label className='custom-checkbox'>
              <input type='checkbox' value='API' {...register('connectionTypeList')} />
              <span className='custom-checkbox__checkmark'>API PayME Link</span>
            </label>
            <label className='custom-checkbox'>
              <input type='checkbox' value='SDK' {...register('connectionTypeList')} />
              <span className='custom-checkbox__checkmark'>SDK PayMENet</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

// const formRules = {
//   crossCheckTime: {
//     required: true,
//   },
//   notifyPayout: {},
//   notifyPayment: {},
// };

export default SubInfoMerchantForm;
