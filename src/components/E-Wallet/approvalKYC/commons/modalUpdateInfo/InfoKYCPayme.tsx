import LocationComponent from 'components/common/Location/LocationComponent';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { LocationType, WalletKYC } from 'models';
import React, { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { Controller, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import MaskedInput from 'react-maskedinput';
import ReactSelect from 'react-select';
import { Input } from 'ui/Form';
import { genders, kycType } from '../../constants/optionsSelect';
import { StateModalUpdate } from '../../modals/ModalUpdateInfoKYCPayme';
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
  form: UseFormReturn<WalletKYC>;
  type: StateModalUpdate;
}

const InfoKYCPayme: React.FC<Props> = ({ className, form, type }) => {
  const { t } = useTranslation('common');

  const {
    watch,
    formState: { errors },
    register,
    clearErrors,
    control,
  } = form;

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

  const genderOptions = genders.map((type) => ({
    label: t(`GENDER_${type}`),
    value: type,
  }));

  const typeOptions = kycType.map((type) => ({
    label: t(type),
    value: type,
  }));

  return (
    <div className={`inputs-group px-0 ${className}`}>
      <p className='inputs-group__title'>{t('Thông tin tài khoản')}</p>
      {type === StateModalUpdate.UPDATE_ACCOUNT && (
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
      )}

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

      {type === StateModalUpdate.UPDATE_ACCOUNT ? (
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
      ) : (
        <Input
          formGroupClassName={`${errors?.nationality?.message ? 'input-custom-error' : ''}`}
          type='text'
          label={t('Quốc tịch')}
          register={register}
          errors={errors?.nationality}
          clearErrors={clearErrors}
          placeholder={t('Quốc tịch')}
          rules={{}}
          name='nationality'
        />
      )}

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

      {type !== StateModalUpdate.UPDATE_ACCOUNT && (
        <div className='form-group'>
          <label>{t('Loại')}</label>
          <Controller
            control={control}
            name='type'
            defaultValue={'CMND'}
            render={({ field }) => (
              <ReactSelect
                className='select-input-form'
                classNamePrefix='input-select'
                placeholder={t('Lĩnh vực')}
                value={typeOptions.find((ele) => ele.value === field.value)}
                onChange={(newValue) => field.onChange(newValue?.value)}
                options={typeOptions}
              />
            )}
          />
        </div>
      )}

      <div className={`form-group ${errors?.identifyNumber?.type ? 'input-custom-error' : ''}`}>
        <label>
          Số định danh/Hộ chiếu
          <span className='text-danger'> (*)</span>
        </label>
        <input
          className={`form-control `}
          placeholder={'Định danh'}
          {...register('identifyNumber', {
            required: {
              value: true,
              message: 'Số định danh/Hộ chiếu không được trống',
            },
            onChange: (e) => {
              clearErrors('identifyNumber');
            },
            // pattern: {
            //   value: (() => {
            //     switch (watch('type')) {
            //       case 'PASSPORT':
            //         return /^(\w|\d)+$/;
            //       case 'CCCD':
            //       case 'CCCDIC':
            //         return /^(\d{12})$/g;
            //       default:
            //         return /^(\d{9})$/g;
            //     }
            //   })(),
            //   message: (() => {
            //     switch (watch('type')) {
            //       case 'PASSPORT':
            //         return 'Số hộ chiếu không đúng định dạng';
            //       case 'CCCD':
            //       case 'CCCDIC':
            //         return 'Số CCCD không đúng định dạng';
            //       default:
            //         return 'Số định danh không đúng định dạng';
            //     }
            //   })(),
            // },
          })}
        />
        {errors?.identifyNumber?.type && (
          <p className='mt-10 mb-0 txt-valid'>
            <i className='i-valid' />
            {errors?.identifyNumber?.message}
          </p>
        )}
      </div>

      <div className='form-group'>
        <label>{t('Ngày cấp')}</label>
        <div className='input-calendar'>
          <Controller
            control={control}
            name='issuedAt'
            render={({ field }) => (
              <ReactDatePicker
                placeholderText='DD/MM/YYYY'
                locale={'en'}
                onChange={(e: Date) => {
                  field.onChange(e && dayjs.utc(e).endOf('date').format());
                }}
                selected={field.value ? convertField(field.value).toDate() : null}
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
        formGroupClassName={`${errors?.placeOfIssue?.message ? 'input-custom-error' : ''}`}
        type='text'
        label={t('Nơi cấp')}
        register={register}
        errors={errors?.placeOfIssue}
        clearErrors={clearErrors}
        placeholder={t('Nơi cấp')}
        rules={{}}
        name='placeOfIssue'
      />

      <div className='form-group form-input-location'>
        <div className='input-label'>
          <label>{t('Địa chỉ1')}</label>
        </div>
        <LocationComponent
          isClear={0}
          setValue={form.setValue}
          indentifyWards={form.watch('address.ward.identifyCode')}
          className='custom-input-location'
        />

        <input placeholder={t('Địa chỉ')} {...register('address.street')} />
      </div>
      




      <div className={'form-group'}>  
        <label>
        Nghề nghiệp/ Kinh doanh
        </label>
        <input
          className={`form-control base-input`}
          type={type}
          placeholder="Nhập nghề nghiệp/ Kinh doanh"
        />
      </div>
      <div className={'form-group'}>  
        <label>
        Chức vụ
        </label>
        <input
          className={`form-control base-input`}
          type={type}
          placeholder="Nhập chức vụ"
        />
      </div>


     
      {watch('state') !== 'APPROVED' && (
        <div className='form-group form-input-checkbox'>
          <label>{t('Gửi thông báo cho người dùng')}</label>
          <label className='switch'>
            <input type='checkbox' defaultChecked={false} {...register('isPushNotification')} />
            <span className='slider around' />
          </label>
        </div>
      )}
    </div>
  );
};

export default InfoKYCPayme;
