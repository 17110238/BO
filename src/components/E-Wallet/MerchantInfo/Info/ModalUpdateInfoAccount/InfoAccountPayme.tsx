import LocationComponent from 'components/common/Location/LocationComponent';
import { genders } from 'components/E-Wallet/approvalKYC/constants/optionsSelect';
import dayjs from 'dayjs';
import { LocationType } from 'models';
import { EwalletAccount } from 'models/merchantInfo/merchantInfoState';
import React, { useMemo, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { Controller, useFieldArray, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import MaskedInput from 'react-maskedinput';
import ReactSelect from 'react-select';
import { Input } from 'ui/Form';
import utc from 'dayjs/plugin/utc';
import InputNumberFormat from 'react-number-format';

dayjs.extend(utc);
interface CalendarStateType {
  calenderBirthday: boolean;
  calenderIssue: boolean;
}

export interface SelectProp extends LocationType {
  value?: string;
  label?: string;
}

interface Props {
  className?: string;
  form: UseFormReturn<EwalletAccount>;
}

const InfoKYCPayme: React.FC<Props> = ({ className, form }) => {
  const { t } = useTranslation('common');

  const {
    watch,
    formState: { errors },
    register,
    clearErrors,
    control,
  } = form;

  const shareHoldersErrors = useMemo(() => {
    if (Array.isArray(errors.shareHolders)) return errors.shareHolders;
    return [];
  }, [errors.shareHolders]);

  const { fields } = useFieldArray({
    control,
    name: 'shareHolders',
  });



  const [calenderState, setCalenderState] = useState<CalendarStateType>({
    calenderBirthday: false,
    calenderIssue: false,
  });

  const handleCloseCalender = (type: string) => {
    switch (type) {
      case 'BIRTHDAY':
        setCalenderState({
          ...calenderState,
          calenderBirthday: false,
        });
        break;

      case 'ISSUE':
        setCalenderState({
          ...calenderState,
          calenderIssue: false,
        });
        break;

      default:
        break;
    }
  };

  const handleOpenCalender = (type: string) => {
    switch (type) {
      case 'BIRTHDAY':
        setCalenderState({
          ...calenderState,
          calenderBirthday: !calenderState.calenderBirthday,
        });
        break;

      case 'ISSUE':
        setCalenderState({
          ...calenderState,
          calenderIssue: !calenderState.calenderIssue,
        });
        break;

      default:
        break;
    }
  };

  const convertField = (data: string) => {
    return dayjs(data.split('/').reverse().join('-'));
  };

  const genderOptions = genders.map((value) => ({
    label: t(`GENDER_${value}`),
    value: value,
  }));

  return (
    <div className={`inputs-group px-0 ${className}`}>
      <p className='inputs-group__title'>{t('Thông tin tài khoản')}</p>
      <Input
        formGroupClassName={`${errors?.alias?.message ? 'input-custom-error' : ''}`}
        type='text'
        label={t('Alias')}
        register={register}
        errors={errors?.alias}
        clearErrors={clearErrors}
        placeholder={t('Alias')}
        rules={{}}
        name='alias'
      />

      <Input
        formGroupClassName={`${errors?.fullname?.message ? 'input-custom-error' : ''}`}
        type='text'
        label={t('Họ tên')}
        register={register}
        errors={errors?.fullname}
        clearErrors={clearErrors}
        placeholder={t('Họ tên')}
        rules={{}}
        name='fullname'
      />

      <div className='form-group'>
        <label>{t('Giới tính')}</label>
        <Controller
          control={control}
          name='gender'
          defaultValue={'MALE'}
          render={({ field }) => (
            <ReactSelect
              className='select-input-form'
              classNamePrefix='input-select'
              placeholder={t('Giới tính')}
              value={genderOptions.find((ele) => ele.value === field.value)}
              onChange={(newValue) => field.onChange(newValue?.value)}
              options={genderOptions}
            />
          )}
        />
      </div>

      <div className={'form-group ' + `${errors?.email?.message ? 'input-custom-error' : ''}`}>
        <label>{t('Email')}</label>
        <input
          type='text'
          placeholder={t('Email')}
          autoComplete='off'
          {...register('email', {
            pattern: {
              value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
              message: t('Email không đúng định dạng'),
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

      <div className='form-group'>
        <label>{t('Ngày sinh')}</label>
        <div className='input-calendar'>
          <Controller
            control={control}
            name='birthday'
            render={({ field }) => (
              <ReactDatePicker
                placeholderText='DD/MM/YYYY'
                locale={'en'}
                onChange={(e: Date) => {
                  field.onChange(e && dayjs.utc(e).endOf('date').format());
                }}
                selected={
                  field?.value?.toString() ? convertField(field.value.toString()).toDate() : null
                }
                dateFormat='dd/MM/yyyy'
                customInput={<MaskedInput mask='11/11/1111' placeholder='dd/MM/yyyy' />}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                open={calenderState.calenderBirthday}
                onSelect={() => handleCloseCalender('BIRTHDAY')}
                onClickOutside={() => handleCloseCalender('BIRTHDAY')}
                dropdownMode='select'
              />
            )}
          />
          <i
            className='far fa-calendar'
            style={{ cursor: 'pointer' }}
            onClick={() => handleOpenCalender('BIRTHDAY')}></i>
        </div>
      </div>

      <Input
        formGroupClassName={`${errors?.kyc?.identifyNumber?.type ? 'input-custom-error' : ''}`}
        type='text'
        label={t('Số định danh')}
        register={register}
        errors={errors?.kyc?.identifyNumber}
        clearErrors={clearErrors}
        placeholder={t('Định danh')}
        rules={{ required: true, minLength: 9 }}
        name='kyc.identifyNumber'
      />

      <div className='form-group'>
        <label>{t('Ngày cấp')}</label>
        <div className='input-calendar'>
          <Controller
            control={control}
            name='kyc.issuedAt'
            render={({ field }) => (
              <ReactDatePicker
                placeholderText='DD/MM/YYYY'
                locale={'en'}
                onChange={(e: Date) => {
                  field.onChange(e && dayjs.utc(e).endOf('date').format());
                }}
                selected={
                  field?.value?.toString() ? convertField(field?.value?.toString()).toDate() : null
                }
                dateFormat='dd/MM/yyyy'
                customInput={<MaskedInput mask='11/11/1111' placeholder='dd/MM/yyyy' />}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                open={calenderState.calenderIssue}
                onSelect={() => handleCloseCalender('ISSUE')}
                onClickOutside={() => handleCloseCalender('ISSUE')}
                dropdownMode='select'
              />
            )}
          />
          <i
            className='far fa-calendar'
            style={{ cursor: 'pointer' }}
            onClick={() => handleOpenCalender('ISSUE')}></i>
        </div>
      </div>

      <Input
        formGroupClassName={`${errors?.kyc?.placeOfIssue?.message ? 'input-custom-error' : ''}`}
        type='text'
        label={t('Nơi cấp')}
        register={register}
        errors={errors?.kyc?.placeOfIssue}
        clearErrors={clearErrors}
        placeholder={t('Nơi cấp')}
        rules={{}}
        name='kyc.placeOfIssue'
      />
      <Input
        formGroupClassName={`${errors?.career?.message ? 'input-custom-error' : ''}`}
        type='text'
        label={t('Nghề nghiệp')}
        register={register}
        errors={errors?.kyc?.placeOfIssue}
        clearErrors={clearErrors}
        placeholder={t('Nghề nghiệp')}
        rules={{}}
        name='career'
      />
      <Input
        formGroupClassName={`${errors?.position?.message ? 'input-custom-error' : ''}`}
        type='text'
        label={t('Chức vụ')}
        register={register}
        errors={errors?.kyc?.placeOfIssue}
        clearErrors={clearErrors}
        placeholder={t('Chức vụ')}
        rules={{}}
        name='position'
      />
      <div className='form-group form-input-location'>
        <div className='input-label'>
          <label>{t('Địa chỉ thường trú')}</label>
        </div>
        <LocationComponent
          isClear={0}
          setValue={form.setValue}
          indentifyWards={form.watch('address.ward.identifyCode')}
          className='custom-input-location'
        />
        <input placeholder={t('Địa chỉ thường trú ')} {...register('address.street')} />
      </div>
      <div className='form-group form-input-location'>
        <div className='input-label'>
          <label>{t('Địa chỉ tạm trú')}</label>
        </div>
        <LocationComponent
          isClear={0}
          setValue={form.setValue}
          indentifyWards={form.watch('temporaryAddress.ward.identifyCode')}
          className='custom-input-location'
          name='location'
        />
        <input placeholder={t('Địa chỉ tạm trú')} {...register('temporaryAddress.street')} />
      </div>
      <p className='inputs-group__title'>{t('Thông tin chủ sỡ hữu hưởng lợi')}</p>
      {fields.map((item, idx) => (
        <React.Fragment key={item.id}>
          <div className='form-group'>
            <label>Họ tên</label>
            <input
              className='form-control base-input'
              type='text'
              placeholder='Nhập họ tên'
              {...register(`shareHolders.${idx}.fullname`)}
            />
          </div>
          <div className='form-group'>
            <label>CMND/CCCD</label>
            <input
              className='form-control base-input'
              type='number'
              placeholder='Nhập CMND/CCCD'
              {...register(`shareHolders.${idx}.identifyNumber`, {
                validate: (value) => value?.length === 9 || value?.length === 12,
                onChange: () => clearErrors(`shareHolders.${idx}.identifyNumber`),
              })}
            />
            {shareHoldersErrors?.length > 0 && shareHoldersErrors[idx]?.identifyNumber && (
              <span className='text-danger fs-12'>CMND/CCCD phải có 9 hoặc 12 kí tự</span>
            )}
          </div>
          <div className='form-group'>
            <label>Chức vụ</label>
            <input
              className='form-control base-input'
              type='text'
              placeholder='Họ tên'
              {...register(`shareHolders.${idx}.title`)}
            />
          </div>
          <div className='form-group'>
            <label>Tỷ lệ góp vốn</label>
            <Controller
              control={control}
              name={`shareHolders.${idx}.capitalRatio`}
              rules={{
                validate: (value: any) => {
                  return +value.split('%')[0] <= 100;
                },
              }}
              render={({ field }) => (
                <InputNumberFormat
                  {...field}
                  value={field.value}
                  onValueChange={(values) => {
                    field.onChange(values);
                    clearErrors(`shareHolders.${idx}.capitalRatio`);
                  }}
                  placeholder='Nhập tỷ lệ góp vốn'
                  suffix='%'
                />
              )}
            />
            {shareHoldersErrors?.length > 0 && shareHoldersErrors[idx]?.capitalRatio && (
              <span className='text-danger fs-12'>Tỷ lệ góp vốn không vượt quá 100%</span>
            )}
          </div>
          <hr />
        </React.Fragment>
      ))}
    </div>
  );
};

export default InfoKYCPayme;
