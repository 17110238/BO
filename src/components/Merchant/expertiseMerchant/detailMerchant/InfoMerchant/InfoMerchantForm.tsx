import AsyncSelectMCCategory from 'components/common/AsyncSelect/AsyncSelect';
import LocationComponent from 'components/common/Location/LocationComponent';
import { MccCodeListType, MerchantAccount } from 'models';
import numeral from 'numeral';
import React, { useMemo } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import { Input } from 'ui/Form';
import { optionRangeBussiness } from '../utils/constantSelectOptions';

interface Props {
  form: UseFormReturn<MerchantAccount>;
  merchantType?: string;
}

interface CodeProps extends MccCodeListType {
  value?: string;
  label?: string;
}

const InfoMerchantForm: React.FC<Props> = ({ merchantType, form }) => {
  const {
    register,
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = form;
  const profile = useSelector<any, MerchantAccount>((state) => state.merchantRD.merchantProfile);

  const { t } = useTranslation('common');
  const mccCodes = useSelector<any, MccCodeListType[]>((state) => state?.utility?.mccCodes);

  const cateCodes = useMemo<CodeProps[]>(() => {
    return mccCodes.map((ele) => ({
      ...ele,
      value: ele.code,
      label: ele.content,
    }));
  }, [mccCodes.length]);

  return (
    <div className='inputs-group-v2'>
      <p className='inputs-group-v2__title'>
        {merchantType === 'ENTERPRISE' ? t('Thông tin doanh nghiệp') : t('Thông tin Merchant')}
      </p>

      {merchantType === 'ENTERPRISE' && (
        <Input
          formGroupClassName={`flex-full ${
            errors?.businessOverview?.abbreviationName?.message ? 'input-custom-error' : ''
          }`}
          type='text'
          label={t('Tên doanh nghiệp')}
          register={register}
          errors={errors?.businessOverview?.abbreviationName}
          clearErrors={clearErrors}
          placeholder={t('Tên doanh nghiệp')}
          // rules={formRules.abbreviationName}
          rules={{}}
          name='businessOverview.abbreviationName'
        />
      )}

      {merchantType === 'ENTERPRISE' && (
        <div className='form-group form-input-location flex-full'>
          <label>{t('Địa chỉ')}</label>
          <input
            className='form-control base-input'
            placeholder={t('Địa chỉ')}
            {...register('businessOverview.address')}
          />

          <LocationComponent
            setValue={setValue}
            isClear={0}
            indentifyWards={profile?.businessOverview?.locationIdentifyCode}
            className='custom-input-location form-control base-input'
          />
        </div>
      )}

      <div className='form-group'>
        <label>{t('Lĩnh vực KD')}</label>
        <Controller
          control={control}
          name='businessOverview.category'
          render={({ field }) => (
            <ReactSelect
              className='select-input-form'
              classNamePrefix='input-select'
              placeholder={t('--- Vui lòng chọn ---')}
              value={cateCodes.find((ele) => ele.value === field.value) || null}
              onChange={(newValue) => field.onChange(newValue?.value)}
              options={cateCodes}
            />
          )}
        />
      </div>

      <Input
        formGroupClassName={`${
          errors?.businessOverview?.categoryName?.message ? 'input-custom-error' : ''
        }`}
        type='text'
        label={t('Ngành nghề kinh doanh')}
        register={register}
        errors={errors?.businessOverview?.categoryName}
        clearErrors={clearErrors}
        placeholder={t('Ngành nghề')}
        // rules={formRules.industry}
        rules={{}}
        name='businessOverview.categoryName'
      />
      <Input
        formGroupClassName={`${
          errors?.businessOverview?.brandName?.message ? 'input-custom-error' : ''
        } input-uppercase`}
        type='text'
        label={t('Brand name')}
        register={register}
        errors={errors?.businessOverview?.brandName}
        clearErrors={clearErrors}
        placeholder={t('Nhập tên nhãn hiệu')}
        // rules={formRules.brandName}
        rules={{}}
        name='businessOverview.brandName'
      />
      <div
        className={
          'form-group ' + `${errors?.businessOverview?.taxCode?.type ? 'input-custom-error' : ''}`
        }>
        <label>
          {t('MST')}
          {/* {merchantType === 'ENTERPRISE' && <span> (*)</span>} */}
        </label>
        <input
          type='text'
          className={`form-control ${
            errors?.businessOverview?.taxCode?.message ? 'input-error' : ''
          } base-input`}
          placeholder={t('Mã số thuế')}
          {...register('businessOverview.taxCode', {
            // required: {
            //   value: merchantType === 'ENTERPRISE',
            //   message: t('MST không được để trống'),
            // },
            onChange: (e) => {
              clearErrors('businessOverview.taxCode');
            },
          })}
        />
        {errors?.businessOverview?.taxCode?.message && (
          <p className='mt-10 mb-0 txt-valid'>
            <i className='i-valid' />
            {errors?.businessOverview?.taxCode?.message}
          </p>
        )}
      </div>

      <div className='form-group'>
        <label>{t('Doanh thu trung bình/ tháng')}</label>
        <Controller
          control={control}
          name='businessOverview.maxRange'
          render={({ field }) => (
            <ReactSelect
              className='select-input-form'
              classNamePrefix='input-select'
              placeholder={t('--- Vui lòng chọn ---')}
              onChange={(e: any) => {
                field.onChange(e.value);
              }}
              value={optionRangeBussiness.find((value) => value.value === field.value) || null}
              options={optionRangeBussiness}
            />
          )}
        />
      </div>
      <Input
        formGroupClassName={`${
          errors?.businessOverview?.homeUrl?.message ? 'input-custom-error' : ''
        }`}
        type='text'
        label={t('Website')}
        register={register}
        errors={errors?.businessOverview?.homeUrl}
        clearErrors={clearErrors}
        placeholder={t('Trang Website')}
        // rules={formRules.website}
        rules={{}}
        name='businessOverview.homeUrl'
      />

      <div
        className={`form-group ${
          errors?.businessOverview?.maxAmountTransaction?.message ? 'input-custom-error' : ''
        }`}>
        <label>{t('Doanh số tối đa của 1 giao dịch (VND)')}</label>
        <Controller
          control={control}
          name='businessOverview.maxAmountTransaction'
          render={({ field }) => (
            <input
              className='form-control'
              {...field}
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                field.onChange(numeral(target.value).value());
                clearErrors('businessOverview.maxAmountTransaction');
              }}
              placeholder={'0 VND'}
              maxLength={14}
              value={field?.value ? numeral(+field?.value).format('0,0') : ''}
            />
          )}
        />
        {errors?.businessOverview?.maxAmountTransaction && (
          <p className='mt-10 mb-0 txt-valid'>
            <i className='i-valid' />
            {'Doanh số tối đa của 1 giao dịch không được rỗng'}
          </p>
        )}
      </div>

      <div className={`form-group ${errors?.minBalance?.type ? 'input-custom-error' : ''}`}>
        <label>
          {t('Số dư tối thiểu rút/chuyển (VND)')}
          {/* <span className='text-danger'> (*)</span> */}
        </label>
        <Controller
          control={control}
          name='minBalance'
          rules={
            {
              // required: true,
            }
          }
          render={({ field }) => (
            <input
              className={`form-control base-input ${errors?.minBalance?.type ? 'input-error' : ''}`}
              {...field}
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                field.onChange(numeral(target.value).value());
                clearErrors('minBalance');
              }}
              placeholder={'0 VND'}
              maxLength={14}
              value={field?.value && numeral(+field?.value!).format('0,0')}
            />
          )}
        />
        {errors?.minBalance?.type && (
          <p className='mt-10 mb-0 txt-valid'>
            <i className='i-valid' />
            {'Số dư tối thiểu rút/chuyển không được rỗng'}
          </p>
        )}
      </div>
    </div>
  );
};

// const formRules = {
//   industry: {},
//   abbreviationName: {
//     required: true,
//   },
//   brandName: {},
//   taxCode: {
//     maxLength: 15,
//   },
//   website: {},
//   maxIncome: {
//     maxLength: 12,
//   },
//   minBalance: {
//     required: true,
//   },
// };

export default InfoMerchantForm;
