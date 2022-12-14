import LocationComponent from 'components/common/Location/LocationComponent';
import dayjs from 'dayjs';
import { ContactInfoType, MerchantAccount } from 'models';
import React, { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import MaskedInput from 'react-maskedinput';
import { useSelector } from 'react-redux';
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
      <p className='inputs-group-v2__title'>{t('Th??ng tin ng?????i ?????i di???n')}</p>

      <Input
        formGroupClassName={`${errors?.contactInfo?.name?.message ? 'input-custom-error' : ''}`}
        type='text'
        label={t('H??? t??n')}
        register={register}
        errors={errors?.contactInfo?.name}
        clearErrors={clearErrors}
        placeholder={t('H??? t??n')}
        // rules={formRules.fullName}
        rules={{}}
        name='contactInfo.name'
      />
      <div
        className={`form-group ${errors?.contactInfo?.birthday?.type ? 'input-custom-error' : ''}`}>
        <label>
          {t('Ng??y sinh')}
          {/* <span className='text-danger'> (*)</span> */}
        </label>
        <div className='input-calendar'>
          <Controller
            control={control}
            name='contactInfo.birthday'
            // rules={{ required: true }}
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
          S??? CMND/H??? chi???u
          {/* <span className='text-danger'> (*)</span> */}
        </label>
        <input
          className={`form-control base-input ${
            errors?.contactInfo?.identifyNumber?.message ? 'input-error' : ''
          }`}
          placeholder={'CMND/H??? chi???u'}
          {...register('contactInfo.identifyNumber', {
            // required: {
            //   value: true,
            //   message: 'S??? CMND/H??? chi???u kh??ng ???????c tr???ng',
            // },
            // pattern: {
            //   value: /^([A-Z](\d{7}))$|^(\d{9})$|^(\d{12})$/g,
            //   message: 'S??? CMND/H??? chi???u kh??ng ????ng ?????nh d???ng',
            // },
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
          {t('Ng??y c???p')}
          {/* <span className='text-danger'> (*)</span> */}
        </label>
        <div className='input-calendar'>
          <Controller
            control={control}
            name='contactInfo.issueDate'
            // rules={{ required: true }}
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
      <Input
        formGroupClassName={`${
          errors?.contactInfo?.issuePlace?.message ? 'input-custom-error' : ''
        }`}
        type='text'
        label={t('N??i c???p')}
        register={register}
        errors={errors?.contactInfo?.issuePlace}
        clearErrors={clearErrors}
        placeholder={t('N??i c???p')}
        // rules={formRules.idNumberDate}
        rules={{}}
        name='contactInfo.issuePlace'
      />
      {merchantType === 'ENTERPRISE' && (
        <Input
          formGroupClassName={`${
            errors?.contactInfo?.position?.message ? 'input-custom-error' : ''
          }`}
          type='text'
          label={t('Ch???c v???')}
          register={register}
          errors={errors?.contactInfo?.position}
          clearErrors={clearErrors}
          placeholder={t('Ch???c v???')}
          // rules={formRules.position}
          rules={{}}
          name='contactInfo.position'
        />
      )}
      <Input
        formGroupClassName={`${errors?.contactInfo?.phone?.message ? 'input-custom-error' : ''}`}
        type='text'
        label={t('S??? ??i???n tho???i')}
        register={register}
        errors={errors?.contactInfo?.phone}
        clearErrors={clearErrors}
        placeholder={t('S??? ??i???n tho???i')}
        // rules={formRules.phone}
        rules={{}}
        name='contactInfo.phone'
        // disabled={username.replace(/^84+/g, '0') === contactInfo?.phone?.replace(/^84+/g, '0')}
      />
      <div
        className={
          'form-group ' + `${errors?.contactInfo?.email?.message ? 'input-custom-error' : ''}`
        }>
        <label>{t('Email')}</label>
        <input
          type='text'
          className='form-control base-input'
          placeholder={t('Email')}
          {...register('contactInfo.email', {
            // pattern: {
            //   value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/,
            //   message: t('Email kh??ng ????ng ?????nh d???ng'),
            // },
            // required: false,
          })}
          // disabled={username === contactInfo?.email}
        />
        {errors?.contactInfo?.email?.message && (
          <p className='mt-10 mb-0 txt-valid'>
            <i className='i-valid' />
            {errors?.contactInfo?.email?.message}
          </p>
        )}
      </div>
      <div
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
                    placeholder: t('Danh s??ch email c??ch nhau d???u ,'),
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

      {merchantType === 'INDIVIDUAL' && (
        <div className='form-group form-input-location flex-full'>
          <label>{t('?????a ch???')}</label>
          <input
            className='form-control base-input'
            placeholder={t('?????a ch???')}
            {...register('businessOverview.address')}
          />

          <LocationComponent
            isClear={0}
            indentifyWards={profile?.businessOverview?.locationIdentifyCode}
            setValue={setValue}
            className='custom-input-location form-control base-input'
          />
        </div>
      )}
    </div>
  );
};

// const formRules = {
//   fullName: {
//     required: true,
//     minLength: 4,
//     maxLength: 50,
//   },
//   idNumber: {
//     required: true,
//     minLength: 9,
//     maxLength: 12,
//   },
//   idNumberDate: {
//     required: true,
//   },
//   phone: {
//     minLength: 10,
//     maxLength: 11,
//   },
//   position: {
//     required: true,
//     maxLength: 20,
//   },
// };

export default InfoAccountForm;
