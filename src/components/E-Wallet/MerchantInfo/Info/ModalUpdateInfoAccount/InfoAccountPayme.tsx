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
      <p className='inputs-group__title'>{t('Th??ng tin t??i kho???n')}</p>
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
        label={t('S??? ?????nh danh')}
        register={register}
        errors={errors?.kyc?.identifyNumber}
        clearErrors={clearErrors}
        placeholder={t('?????nh danh')}
        rules={{ required: true, minLength: 9 }}
        name='kyc.identifyNumber'
      />

      <div className='form-group'>
        <label>{t('Ng??y c???p')}</label>
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
        label={t('N??i c???p')}
        register={register}
        errors={errors?.kyc?.placeOfIssue}
        clearErrors={clearErrors}
        placeholder={t('N??i c???p')}
        rules={{}}
        name='kyc.placeOfIssue'
      />
      <Input
        formGroupClassName={`${errors?.career?.message ? 'input-custom-error' : ''}`}
        type='text'
        label={t('Ngh??? nghi???p')}
        register={register}
        errors={errors?.kyc?.placeOfIssue}
        clearErrors={clearErrors}
        placeholder={t('Ngh??? nghi???p')}
        rules={{}}
        name='career'
      />
      <Input
        formGroupClassName={`${errors?.position?.message ? 'input-custom-error' : ''}`}
        type='text'
        label={t('Ch???c v???')}
        register={register}
        errors={errors?.kyc?.placeOfIssue}
        clearErrors={clearErrors}
        placeholder={t('Ch???c v???')}
        rules={{}}
        name='position'
      />
      <div className='form-group form-input-location'>
        <div className='input-label'>
          <label>{t('?????a ch??? th?????ng tr??')}</label>
        </div>
        <LocationComponent
          isClear={0}
          setValue={form.setValue}
          indentifyWards={form.watch('address.ward.identifyCode')}
          className='custom-input-location'
        />
        <input placeholder={t('?????a ch??? th?????ng tr?? ')} {...register('address.street')} />
      </div>
      <div className='form-group form-input-location'>
        <div className='input-label'>
          <label>{t('?????a ch??? t???m tr??')}</label>
        </div>
        <LocationComponent
          isClear={0}
          setValue={form.setValue}
          indentifyWards={form.watch('temporaryAddress.ward.identifyCode')}
          className='custom-input-location'
          name='location'
        />
        <input placeholder={t('?????a ch??? t???m tr??')} {...register('temporaryAddress.street')} />
      </div>
      <p className='inputs-group__title'>{t('Th??ng tin ch??? s??? h???u h?????ng l???i')}</p>
      {fields.map((item, idx) => (
        <React.Fragment key={item.id}>
          <div className='form-group'>
            <label>H??? t??n</label>
            <input
              className='form-control base-input'
              type='text'
              placeholder='Nh???p h??? t??n'
              {...register(`shareHolders.${idx}.fullname`)}
            />
          </div>
          <div className='form-group'>
            <label>CMND/CCCD</label>
            <input
              className='form-control base-input'
              type='number'
              placeholder='Nh???p CMND/CCCD'
              {...register(`shareHolders.${idx}.identifyNumber`, {
                validate: (value) => value?.length === 9 || value?.length === 12,
                onChange: () => clearErrors(`shareHolders.${idx}.identifyNumber`),
              })}
            />
            {shareHoldersErrors?.length > 0 && shareHoldersErrors[idx]?.identifyNumber && (
              <span className='text-danger fs-12'>CMND/CCCD ph???i c?? 9 ho???c 12 k?? t???</span>
            )}
          </div>
          <div className='form-group'>
            <label>Ch???c v???</label>
            <input
              className='form-control base-input'
              type='text'
              placeholder='H??? t??n'
              {...register(`shareHolders.${idx}.title`)}
            />
          </div>
          <div className='form-group'>
            <label>T??? l??? g??p v???n</label>
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
                  placeholder='Nh???p t??? l??? g??p v???n'
                  suffix='%'
                />
              )}
            />
            {shareHoldersErrors?.length > 0 && shareHoldersErrors[idx]?.capitalRatio && (
              <span className='text-danger fs-12'>T??? l??? g??p v???n kh??ng v?????t qu?? 100%</span>
            )}
          </div>
          <hr />
        </React.Fragment>
      ))}
    </div>
  );
};

export default InfoKYCPayme;
