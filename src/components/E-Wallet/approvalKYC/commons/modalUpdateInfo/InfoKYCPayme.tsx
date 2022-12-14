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
      <p className='inputs-group__title'>{t('Th??ng tin t??i kho???n')}</p>
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
        label={t('H??? t??n')}
        register={register}
        errors={errors?.fullname}
        clearErrors={clearErrors}
        placeholder={t('H??? t??n')}
        rules={{}}
        name='fullname'
      />

      <div className='form-group'>
        <label>{t('Gi???i t??nh')}</label>
        <Controller
          control={control}
          name='gender'
          defaultValue={'MALE'}
          render={({ field }) => (
            <ReactSelect
              className='select-input-form'
              classNamePrefix='input-select'
              placeholder={t('Gi???i t??nh')}
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
      ) : (
        <Input
          formGroupClassName={`${errors?.nationality?.message ? 'input-custom-error' : ''}`}
          type='text'
          label={t('Qu???c t???ch')}
          register={register}
          errors={errors?.nationality}
          clearErrors={clearErrors}
          placeholder={t('Qu???c t???ch')}
          rules={{}}
          name='nationality'
        />
      )}

      <div className='form-group'>
        <label>{t('Ng??y sinh')}</label>
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
          <label>{t('Lo???i')}</label>
          <Controller
            control={control}
            name='type'
            defaultValue={'CMND'}
            render={({ field }) => (
              <ReactSelect
                className='select-input-form'
                classNamePrefix='input-select'
                placeholder={t('L??nh v???c')}
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
          S??? ?????nh danh/H??? chi???u
          <span className='text-danger'> (*)</span>
        </label>
        <input
          className={`form-control `}
          placeholder={'?????nh danh'}
          {...register('identifyNumber', {
            required: {
              value: true,
              message: 'S??? ?????nh danh/H??? chi???u kh??ng ???????c tr???ng',
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
            //         return 'S??? h??? chi???u kh??ng ????ng ?????nh d???ng';
            //       case 'CCCD':
            //       case 'CCCDIC':
            //         return 'S??? CCCD kh??ng ????ng ?????nh d???ng';
            //       default:
            //         return 'S??? ?????nh danh kh??ng ????ng ?????nh d???ng';
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
        <label>{t('Ng??y c???p')}</label>
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
        label={t('N??i c???p')}
        register={register}
        errors={errors?.placeOfIssue}
        clearErrors={clearErrors}
        placeholder={t('N??i c???p')}
        rules={{}}
        name='placeOfIssue'
      />

      <div className='form-group form-input-location'>
        <div className='input-label'>
          <label>{t('?????a ch???1')}</label>
        </div>
        <LocationComponent
          isClear={0}
          setValue={form.setValue}
          indentifyWards={form.watch('address.ward.identifyCode')}
          className='custom-input-location'
        />

        <input placeholder={t('?????a ch???')} {...register('address.street')} />
      </div>
      




      <div className={'form-group'}>  
        <label>
        Ngh??? nghi???p/ Kinh doanh
        </label>
        <input
          className={`form-control base-input`}
          type={type}
          placeholder="Nh???p ngh??? nghi???p/ Kinh doanh"
        />
      </div>
      <div className={'form-group'}>  
        <label>
        Ch???c v???
        </label>
        <input
          className={`form-control base-input`}
          type={type}
          placeholder="Nh???p ch???c v???"
        />
      </div>


     
      {watch('state') !== 'APPROVED' && (
        <div className='form-group form-input-checkbox'>
          <label>{t('G???i th??ng b??o cho ng?????i d??ng')}</label>
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
