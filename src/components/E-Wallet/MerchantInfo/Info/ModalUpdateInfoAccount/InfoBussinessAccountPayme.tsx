import { EwalletAccount } from 'models/merchantInfo/merchantInfoState';
import { NationalityType } from 'models/utitlity/utilityState';
import React from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from 'ui/Form';
import ReactSelect, { SingleValue } from 'react-select';

interface Props {
  form: UseFormReturn<EwalletAccount>;
  dataNational: NationalityType[];
}

const InfoBussinessKYCPayme: React.FC<Props> = ({ form, dataNational }) => {
  const { t } = useTranslation('common');

  const {
    register,
    clearErrors,
    control,
    formState: { errors },
  } = form;

  return (
    <div className='inputs-group px-0'>
      {/* <p className='inputs-group__title'>{t('Thông tin doanh nghiệp')}</p> */}

      <Input
        formGroupClassName={`${
          errors?.kyc?.kycMerchant?.name?.message ? 'input-custom-error' : ''
        }`}
        type='text'
        label={t('Tên doanh nghiệp')}
        register={register}
        errors={errors?.fullname}
        clearErrors={clearErrors}
        placeholder={t('Tên doanh nghiệp')}
        rules={{}}
        name='kyc.kycMerchant.name'
      />
      <Input
        formGroupClassName={`${
          errors?.kyc?.kycMerchant?.taxCode?.message ? 'input-custom-error' : ''
        }`}
        type='text'
        label={t('Mã số thuế')}
        register={register}
        errors={errors?.fullname}
        clearErrors={clearErrors}
        placeholder={t('Mã số')}
        rules={{}}
        name='kyc.kycMerchant.taxCode'
      />

      <Input
        formGroupClassName={`${
          errors?.kyc?.kycMerchant?.representative?.message ? 'input-custom-error' : ''
        }`}
        type='text'
        label={t('Người đại diện')}
        register={register}
        errors={errors?.fullname}
        clearErrors={clearErrors}
        placeholder={t('Họ tên')}
        rules={{}}
        name='kyc.kycMerchant.representative'
      />

      <div className='form-group'>
        <label>{t('Quốc tịch')}</label>
        <Controller
          control={control}
          name={`shareHolders.${0}.nationality`}
          render={({ field }) => (
            <ReactSelect
              className='select-input-form'
              classNamePrefix='input-select'
              placeholder={t('Quốc tịch')}
              value={dataNational.find((ele) => ele.value === field.value) || ''}
              onChange={(newValue: SingleValue<any>) => {
                field.onChange(newValue?.value);
              }}
              options={dataNational}
            />
          )}
        />
      </div>

      <Input
        formGroupClassName={`${
          errors?.kyc?.kycMerchant?.phone?.message ? 'input-custom-error' : ''
        }`}
        type='text'
        label={t('Số điện thoại')}
        register={register}
        errors={errors?.fullname}
        clearErrors={clearErrors}
        placeholder={t('SDT')}
        rules={{}}
        name='kyc.kycMerchant.phone'
      />
      <Input
        formGroupClassName={`${
          errors?.kyc?.kycMerchant?.address?.message ? 'input-custom-error' : ''
        }`}
        type='text'
        label={t('Địa chỉ đặt trụ sở chính')}
        register={register}
        errors={errors?.fullname}
        clearErrors={clearErrors}
        placeholder={t('Địa chỉ')}
        rules={{}}
        name='kyc.kycMerchant.address'
      />
      <Input
        formGroupClassName={`${
          errors?.kyc?.kycMerchant?.shopAddress?.message ? 'input-custom-error' : ''
        }`}
        type='text'
        label={t('Địa chỉ giao dịch')}
        register={register}
        errors={errors?.fullname}
        clearErrors={clearErrors}
        placeholder={t('Địa chỉ')}
        rules={{}}
        name='kyc.kycMerchant.shopAddress'
      />
    </div>
  );
};

export default InfoBussinessKYCPayme;
