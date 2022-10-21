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

const InfoAccountForm: React.FC<Props> = ({ form, merchantType }) => {
  const { t } = useTranslation('common');
  const username = useSelector<any, string>(
    (state) => state?.merchantRD?.merchantProfile?.accountInfo?.username
  );
  const contactInfo = useSelector<any, ContactInfoType>(
    (state) => state?.merchantRD?.merchantProfile?.contactInfo
  );
  const profile = useSelector<any, MerchantAccount>((state) => state.merchantRD.merchantProfile);
  const dataNational = useSelector<any, []>((state) => state.utility.GetNationality) || [];
  const dataNationalFormat = useMemo(() => {
    return dataNational.map((item: any) => ({ label: item.value, value: item.name }));
  }, [dataNational]);
  const {
    setValue,
    control,
    getValues,
    clearErrors,
    watch,
    register,
    formState: { errors },
  } = form;

  const [calenderState, setCalenderState] = useState<CalendarStateType>({
    calenderBirthday: false,
    calenderIssue: false,
  });

  const [listEmailBcc, setListEmailBcc] = useState<Array<string>>([]);

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

  return (
    <div className='inputs-group-v2 '>
      <p className='inputs-group-v2__title'>{t('Thông tin người đại diện')}</p>
      <div
        className={
          'form-group ' + `${errors?.contactInfo?.name?.message ? 'input-custom-error' : ''}`
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
          {...register('contactInfo.name', {
            required: false,
            onChange: (e) => {
              clearErrors(e.target.name);
            },
          })}
        />
        {errors?.contactInfo?.name?.message && (
          <p className='mt-10 mb-0 txt-valid'>
            <i className='i-valid' />
            {errors?.contactInfo?.name?.message}
          </p>
        )}
      </div>

      <div
        className={`form-group ${errors?.contactInfo?.birthday?.type ? 'input-custom-error' : ''}`}>
        <label>
          {t('Ngày sinh')}
          <span className='text-danger'> (*)</span>
        </label>
        <div className='input-calendar'>
          <Controller
            control={control}
            name='contactInfo.birthday'
            rules={{ required: true }}
            render={({ field }) => (
              <ReactDatePicker
                placeholderText='DD/MM/YYYY'
                locale={'en'}
                onChange={(e: Date) => {
                  clearErrors('contactInfo.birthday');
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
          errors?.contactInfo?.identifyNumber?.message ? 'input-custom-error' : ''
        }`}>
        <label>
          Số CMND/Hộ chiếu
          <span className='text-danger'> (*)</span>
        </label>
        <input
          className={`form-control base-input ${
            errors?.contactInfo?.identifyNumber?.message ? 'input-error' : ''
          }`}
          placeholder={'CMND/Hộ chiếu'}
          {...register('contactInfo.identifyNumber', {
            required: {
              value: true,
              message: 'Số CMND/Hộ chiếu không được trống',
            },
            onChange: (e) => {
              clearErrors('contactInfo.identifyNumber');
            },
          })}
        />
        {errors.contactInfo?.identifyNumber?.type && (
          <p className='mt-10 mb-0 txt-valid'>
            <i className='i-valid' />
            {errors.contactInfo?.identifyNumber?.message}
          </p>
        )}
      </div>

      <div
        className={`form-group ${
          errors?.contactInfo?.issueDate?.type ? 'input-custom-error' : ''
        }`}>
        <label>
          {t('Ngày cấp')}
          <span className='text-danger'> (*)</span>
        </label>
        <div className='input-calendar'>
          <Controller
            control={control}
            name='contactInfo.issueDate'
            rules={{ required: true }}
            render={({ field }) => (
              <ReactDatePicker
                placeholderText='DD/MM/YYYY'
                locale={'en'}
                onChange={(e: Date) => {
                  clearErrors('contactInfo.issueDate');
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
          'form-group ' + `${errors?.contactInfo?.issuePlace?.message ? 'input-custom-error' : ''}`
        }>
        <label>
          {t('Nơi cấp')}
          <span className='text-danger'> (*)</span>
        </label>
        <input
          type='text'
          className='form-control base-input'
          placeholder={t('Nơi cấp')}
          {...register('contactInfo.issuePlace', {
            required: false,
          })}
        />
        {errors?.contactInfo?.issuePlace?.message && (
          <p className='mt-10 mb-0 txt-valid'>
            <i className='i-valid' />
            {errors?.contactInfo?.issuePlace?.message}
          </p>
        )}
      </div>
      <div
        className={
          'form-group ' + `${errors?.contactInfo?.name?.message ? 'input-custom-error' : ''}`
        }>
        <label>{t('Quốc tịch')}</label>
        <Controller
          control={control}
          name={'contactInfo.nationality'}
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
        {/* <label>
          {t('Quốc tịch')}
          <span className='text-danger'> (*)</span>
        </label>
        <input
          type='text'
          className='form-control base-input'
          placeholder={t('Quốc tịch')}
          minLength={4}
          maxLength={50}
          {...register('contactInfo.nationality', {
            required: false,
            onChange: (e) => {
              clearErrors(e.target.name);
            },
          })}
        /> */}
        {errors?.contactInfo?.name?.message && (
          <p className='mt-10 mb-0 txt-valid'>
            <i className='i-valid' />
            {errors?.contactInfo?.name?.message}
          </p>
        )}
      </div>
      {!isEnterpriseMerchant && (
        <>
          <div
            className={`form-group ${
              errors?.businessOverview?.averageIncome?.message ? 'input-custom-error' : ''
            }`}>
            <label>Thu nhập trung bình/tháng (3 tháng gần nhất)</label>
            <Controller
              control={control}
              name='businessOverview.averageIncome'
              render={({ field }) => (
                <input
                  className={`form-control base-input `}
                  {...field}
                  disabled
                  onChange={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.value = target.value.replace(/\D/g, '');
                    field.onChange(target.value);
                    clearErrors('businessOverview.averageIncome');
                  }}
                  placeholder={'0 VND'}
                  maxLength={14}
                  value={
                    field?.value ? numeral(+field?.value!.replace(/\D/g, '')).format('0,0') : ''
                  }
                />
              )}
            />
          </div>

          <hr className='w-100 my-2' />

          <div className={`form-group m-0`}>
            <label style={{ fontWeight: 'bold', fontSize: '16px' }}>Nơi làm việc</label>
          </div>

          <div
            className={`form-group flex-full ${
              errors?.businessOverview?.companyAddress?.name?.message ? 'input-custom-error' : ''
            }`}>
            <label>Tên công ty</label>
            <input
              className={`form-control base-input ${
                errors?.businessOverview?.companyAddress?.name?.message ? 'input-error' : ''
              }`}
              placeholder={'Nhập tên công ty'}
              {...register('businessOverview.companyAddress.name', {
                onChange: (e) => {
                  clearErrors('businessOverview.companyAddress.name');
                },
              })}
            />
          </div>

          <div
            className={`form-group flex-full ${
              errors?.businessOverview?.companyAddress?.address?.message ? 'input-custom-error' : ''
            }`}>
            <label>Địa chỉ</label>
            <input
              className={`form-control base-input ${
                errors?.businessOverview?.companyAddress?.address?.message ? 'input-error' : ''
              }`}
              placeholder={'Địa chỉ'}
              {...register('businessOverview.companyAddress.address', {
                onChange: (e) => {
                  clearErrors('businessOverview.companyAddress.address');
                },
              })}
            />
          </div>

          <div
            className={`form-group flex-full ${
              errors?.businessOverview?.companyAddress?.phoneNumber?.message
                ? 'input-custom-error'
                : ''
            }`}>
            <label>Số điện thoại</label>
            <input
              className={`form-control base-input ${
                errors?.businessOverview?.companyAddress?.phoneNumber?.message ? 'input-error' : ''
              }`}
              placeholder={'Số điện thoại'}
              {...register('businessOverview.companyAddress.phoneNumber', {
                onChange: (e) => {
                  clearErrors('businessOverview.companyAddress.phoneNumber');
                },
              })}
            />
          </div>

          <hr className='w-100 my-2' />
        </>
      )}

      {['ENTERPRISE', 'FOREIGN_ENTERPRISE'].includes(merchantType || '') && (
        <Input
          formGroupClassName={`${
            errors?.contactInfo?.position?.message ? 'input-custom-error' : ''
          }`}
          type='text'
          label={t('Chức vụ')}
          register={register}
          errors={errors?.contactInfo?.position}
          clearErrors={clearErrors}
          placeholder={t('Chức vụ')}
          rules={formRules.position}
          name='contactInfo.position'
        />
      )}

      {/* <div
        className={
          'form-group flex-full' +
          `${errors?.contactInfo?.email?.message ? 'input-custom-error' : ''}`
        }>
        <label>{t('Email BCC')}</label>
        <div className='form-tags'>
          <Controller
            control={control}
            name='emailBcc'
            render={({ field }) => {
              return (
                <TagsInput
                  value={watch('emailBcc') || []}
                  onChange={(tags) => field.onChange(tags)}
                  validationRegex={
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                  }
                  inputProps={{
                    placeholder: t('Danh sách email cách nhau dấu ,'),
                    style: { minWidth: '250px' },
                  }}
                  addOnBlur={true}
                />
              );
            }}
          />
        </div>
        {errors?.contactInfo?.email?.message && (
          <p className='mt-10 mb-0 txt-valid'>
            <i className='i-valid' />
            {errors?.contactInfo?.email?.message}
          </p>
        )}
      </div>

      {!isEnterpriseMerchant && (
        <div className='form-group form-input-location flex-full'>
          <label>{t('Địa chỉ')}</label>
          <input
            className='form-control base-input'
            placeholder={t('Địa chỉ')}
            {...register('businessOverview.address')}
          />

          <LocationComponent
            isClear={0}
            indentifyWards={profile?.businessOverview?.locationIdentifyCode}
            setValue={setValue}
            className='custom-input-location form-control base-input'
          />
        </div>
      )} */}
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

export default InfoAccountForm;
