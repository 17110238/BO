import { WalletKYC } from 'models';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from 'ui/Form';

interface Props {
  form: UseFormReturn<WalletKYC>;
}

const InfoBussinessKYCPayme: React.FC<Props> = ({ form }) => {
  const { t } = useTranslation('common');

  const {
    register,
    clearErrors,
    formState: { errors },
  } = form;

  return (
    <div className='inputs-group px-0'>
      {/* <p className='inputs-group__title'>{t('Thông tin doanh nghiệp')}</p> */}

      <Input
        formGroupClassName={`${errors?.merchant?.name?.message ? 'input-custom-error' : ''}`}
        type='text'
        label={t('Tên doanh nghiệp')}
        register={register}
        errors={errors?.fullname}
        clearErrors={clearErrors}
        placeholder={t('Tên doanh nghiệp')}
        rules={{}}
        name='merchant.name'
      />
      <Input
        formGroupClassName={`${errors?.merchant?.taxCode?.message ? 'input-custom-error' : ''}`}
        type='text'
        label={t('Mã số thuế')}
        register={register}
        errors={errors?.fullname}
        clearErrors={clearErrors}
        placeholder={t('Mã số')}
        rules={{}}
        name='merchant.taxCode'
      />
      <Input
        formGroupClassName={`${
          errors?.merchant?.representative?.message ? 'input-custom-error' : ''
        }`}
        type='text'
        label={t('Người đại diện')}
        register={register}
        errors={errors?.fullname}
        clearErrors={clearErrors}
        placeholder={t('Họ tên')}
        rules={{}}
        name='merchant.representative'
      />
      <Input
        formGroupClassName={`${errors?.merchant?.phone?.message ? 'input-custom-error' : ''}`}
        type='text'
        label={t('Số điện thoại')}
        register={register}
        errors={errors?.fullname}
        clearErrors={clearErrors}
        placeholder={t('SDT')}
        rules={{}}
        name='merchant.phone'
      />
      <Input
        formGroupClassName={`${errors?.merchant?.address?.message ? 'input-custom-error' : ''}`}
        type='text'
        label={t('Địa chỉ đặt trụ sở chính')}
        register={register}
        errors={errors?.fullname}
        clearErrors={clearErrors}
        placeholder={t('Địa chỉ')}
        rules={{}}
        name='merchant.address'
      />
      <Input
        formGroupClassName={`${errors?.merchant?.shopAddress?.message ? 'input-custom-error' : ''}`}
        type='text'
        label={t('Địa chỉ giao dịch')}
        register={register}
        errors={errors?.fullname}
        clearErrors={clearErrors}
        placeholder={t('Địa chỉ')}
        rules={{}}
        name='merchant.shopAddress'
      />
    </div>
  );
};

export default InfoBussinessKYCPayme;
