import LocationComponent from 'components/common/Location/LocationComponent';
import dayjs from 'dayjs';
import { ContactInfoType, MerchantAccount } from 'models';
import numeral from 'numeral';
import React, { useMemo, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import MaskedInput from 'react-maskedinput';
import { useSelector } from 'react-redux';
import ReactSelect, { SingleValue } from 'react-select';
import TagsInput from 'react-tagsinput';
import { Input } from 'ui/Form';
interface Props {
  form: UseFormReturn<MerchantAccount>;
  merchantType?: string;
}

interface CalendarStateType {
  calenderBirthday: boolean;
  calenderIssue: boolean;
}

const InfoOwnerForm: React.FC<Props> = ({ form, merchantType }) => {
  const {
    setValue,
    control,
    getValues,
    clearErrors,
    watch,
    register,
    formState: { errors },
  } = form;
  const { t } = useTranslation('common');
  const profile = useSelector<any, MerchantAccount>((state) => state.merchantRD.merchantProfile);
  const dataNational = useSelector<any, []>((state) => state.utility.GetNationality) || [];
  const dataNationalFormat = useMemo(() => {
    return dataNational.map((item: any) => ({ label: item.value, value: item.name }));
  }, [dataNational]);

  const [calenderState, setCalenderState] = useState<CalendarStateType>({
    calenderBirthday: false,
    calenderIssue: false,
  });

  const isEnterpriseMerchant = ['ENTERPRISE', 'FOREIGN_ENTERPRISE'].includes(merchantType || '');

  const convertField = (data: string) => {
    return dayjs(data.split('/').reverse().join('-'));
  };

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

  if (!isEnterpriseMerchant) {
    return <></>;
  }

  return (
    <div className='inputs-group-v2 '>
      <p className='inputs-group-v2__title'>{t('Thông tin chủ sở hữu')}</p>

      <div
        className={
          'form-group ' +
          `${errors?.businessOverview?.benefitOwner?.fullname?.message ? 'input-custom-error' : ''}`
        }>
        <label>
          {t('Họ tên')}
          <span className='text-danger'> (*)</span>
        </label>
        <input
          type='text'
          className='form-control base-input'
          placeholder={t('Họ tên')}
          minLength={4}
          maxLength={50}
          {...register('businessOverview.benefitOwner.fullname', {
            required: false,
            onChange: (e) => {
              clearErrors(e.target.fullname);
            },
          })}
        />
        {errors?.businessOverview?.benefitOwner?.fullname?.message && (
          <p className='mt-10 mb-0 txt-valid'>
            <i className='i-valid' />
            {errors?.businessOverview?.benefitOwner?.fullname?.message}
          </p>
        )}
      </div>

      <div
        className={`form-group ${
          errors?.businessOverview?.benefitOwner?.birthday?.type ? 'input-custom-error' : ''
        }`}>
        <label>
          {t('Ngày sinh')}
          <span className='text-danger'> (*)</span>
        </label>
        <div className='input-calendar'>
          <Controller
            control={control}
            name='businessOverview.benefitOwner.birthday'
            rules={{ required: true }}
            render={({ field }) => (
              <ReactDatePicker
                placeholderText='DD/MM/YYYY'
                locale={'en'}
                onChange={(e: Date) => {
                  clearErrors('businessOverview.benefitOwner.birthday');
                  field.onChange(e && dayjs(e).format('DD/MM/YYYY'));
                }}
                selected={field.value ? convertField(field.value).toDate() : null}
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

      <div
        className={`form-group ${
          errors?.businessOverview?.benefitOwner?.identifyNumber?.message
            ? 'input-custom-error'
            : ''
        }`}>
        <label>
          Số CMND/Hộ chiếu
          <span className='text-danger'> (*)</span>
        </label>
        <input
          className={`form-control base-input ${
            errors?.businessOverview?.benefitOwner?.identifyNumber?.message ? 'input-error' : ''
          }`}
          placeholder={'CMND/Hộ chiếu'}
          {...register('businessOverview.benefitOwner.identifyNumber', {
            required: {
              value: true,
              message: 'Số CMND/Hộ chiếu không được trống',
            },
            onChange: (e) => {
              clearErrors('businessOverview.benefitOwner.identifyNumber');
            },
          })}
        />
        {errors.businessOverview?.benefitOwner?.identifyNumber?.type && (
          <p className='mt-10 mb-0 txt-valid'>
            <i className='i-valid' />
            {errors.businessOverview?.benefitOwner?.identifyNumber?.message}
          </p>
        )}
      </div>

      <div
        className={`form-group ${
          errors?.businessOverview?.benefitOwner?.issueDate?.type ? 'input-custom-error' : ''
        }`}>
        <label>
          {t('Ngày cấp')}
          <span className='text-danger'> (*)</span>
        </label>
        <div className='input-calendar'>
          <Controller
            control={control}
            name='businessOverview.benefitOwner.issueDate'
            rules={{ required: true }}
            render={({ field }) => (
              <ReactDatePicker
                placeholderText='DD/MM/YYYY'
                locale={'en'}
                onChange={(e: Date) => {
                  clearErrors('businessOverview.benefitOwner.issueDate');
                  field.onChange(e && dayjs(e).format('DD/MM/YYYY'));
                }}
                selected={field.value ? convertField(field.value).toDate() : null}
                dateFormat='dd/MM/yyyy'
                peekNextMonth
                customInput={<MaskedInput mask='11/11/1111' placeholder='dd/MM/yyyy' />}
                showMonthDropdown
                showYearDropdown
                dropdownMode='select'
                open={calenderState.calenderIssue}
                onSelect={() => handleCloseCalender('ISSUE')}
                onClickOutside={() => handleCloseCalender('ISSUE')}
              />
            )}
          />

          <i
            className='far fa-calendar'
            style={{ cursor: 'pointer' }}
            onClick={() => handleOpenCalender('ISSUE')}></i>
        </div>
      </div>

      <div
        className={
          'form-group ' +
          `${
            errors?.businessOverview?.benefitOwner?.issuePlace?.message ? 'input-custom-error' : ''
          }`
        }>
        <label>
          {t('Nơi cấp')}
          <span className='text-danger'> (*)</span>
        </label>
        <input
          type='text'
          className='form-control base-input'
          placeholder={t('Nơi cấp')}
          {...register('businessOverview.benefitOwner.issuePlace', {
            required: false,
          })}
        />
        {errors?.businessOverview?.benefitOwner?.issuePlace?.message && (
          <p className='mt-10 mb-0 txt-valid'>
            <i className='i-valid' />
            {errors?.businessOverview?.benefitOwner?.issuePlace?.message}
          </p>
        )}
      </div>
      <div
        className={
          'form-group ' +
          `${
            errors?.businessOverview?.benefitOwner?.nationality?.message ? 'input-custom-error' : ''
          }`
        }>
        <label>{t('Quốc tịch')}</label>
        <Controller
          control={control}
          name={'businessOverview.benefitOwner.nationality'}
          render={({ field }) => (
            <ReactSelect
              className='select-input-form'
              classNamePrefix='input-select'
              placeholder={t('Quốc tịch')}
              value={dataNationalFormat.find((ele) => ele.value === field.value) || ''}
              onChange={(newValue: SingleValue<any>) => {
                field.onChange(newValue?.value);
              }}
              options={dataNationalFormat}
            />
          )}
        />
        {errors?.businessOverview?.benefitOwner?.nationality?.message && (
          <p className='mt-10 mb-0 txt-valid'>
            <i className='i-valid' />
            {errors?.businessOverview?.benefitOwner?.nationality?.message}
          </p>
        )}
      </div>

      <div
        className={
          'form-group ' +
          `${errors?.businessOverview?.benefitOwner?.email?.message ? 'input-custom-error' : ''}`
        }>
        <label>{t('Email')}</label>
        <input
          type='text'
          className='form-control base-input'
          placeholder={t('Nhập email')}
          {...register('businessOverview.benefitOwner.email', {
            required: false,
          })}
        />
        {errors?.businessOverview?.benefitOwner?.email?.message && (
          <p className='mt-10 mb-0 txt-valid'>
            <i className='i-valid' />
            {errors?.businessOverview?.benefitOwner?.email?.message}
          </p>
        )}
      </div>
    </div>
  );
};

const formRules = {
  fullName: {
    required: true,
    minLength: 4,
    maxLength: 50,
  },
  idNumber: {
    required: true,
    minLength: 9,
    maxLength: 12,
  },
  idNumberDate: {
    required: true,
  },

  position: {
    required: true,
  },
};

export default InfoOwnerForm;
