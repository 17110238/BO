import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Controller, SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { Input } from 'ui/Form';
import ReactSelect, { SingleValue } from 'react-select';
import {
  connectionTypeMcEnum,
  LocationType,
  MaxRangeBusinessEnum,
  CreateMerchantInput,
} from 'models';
import { useSelector, useDispatch } from 'react-redux';
import { createAccountMerchant, getLocationCityList, getSubLocationList } from 'redux/actions';
import RegisterBusinessDetailImg from 'components/Merchant/createAccountMerchant/RegisterBusinessDetailImg';
import alert from 'utils/helpers/alert';

interface Props {
  show: boolean | undefined;
  onHide: (type?: string) => void;
}
interface SelectProp extends LocationType {
  value?: string;
  label?: string;
}

const ModalCreateAccountMc: React.FC<Props> = ({ show, onHide }) => {
  const { t } = useTranslation('common');
  const optionTypeMC = [
    { value: 'INDIVIDUAL', label: t('INDIVIDUAL') },
    { value: 'ENTERPRISE', label: t('ENTERPRISE') },
  ];
  const optionRangeBussiness = [
    { value: MaxRangeBusinessEnum.less100m, label: t('less100m') },
    { value: MaxRangeBusinessEnum.max1b, label: t('max1b') },
    { value: MaxRangeBusinessEnum.max10b, label: t('max10b') },
    { value: MaxRangeBusinessEnum.up10b, label: t('up10b') },
  ];

  const optionConnectionTypeMC = [
    { value: connectionTypeMcEnum.ONLINE, label: t('ONLINE') },
    { value: connectionTypeMcEnum.OFFLINE, label: t('OFFLINE') },
  ];

  // state
  const [districts, setDistrict] = useState<SelectProp[]>([]);
  const [wards, setWards] = useState<SelectProp[]>([]);
  const [validationAddress, setValidationAddress] = useState<object>({
    city: '',
    district: '',
    wards: '',
    address: '',
  });

  // useSelector
  const locations = useSelector<any, LocationType[]>((state) => state?.utility?.locations);
  const dispatch = useDispatch();

  useEffect(() => {
    show && dispatch(getLocationCityList());
  }, [show]);

  const cities = useMemo<SelectProp[]>(() => {
    return locations.map((ele) => ({
      value: ele.identifyCode,
      label: ele.title,
    }));
  }, [locations.length]);

  const {
    handleSubmit,
    register,
    setValue,
    clearErrors,
    reset,
    getValues,
    setError,
    resetField,
    unregister,
    formState: { errors },
    control,
  } = useForm<CreateMerchantInput>({
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
    defaultValues: {
      businessOverview: {
        type: optionTypeMC[0].value,
        connectionType: optionConnectionTypeMC[0].value,
        maxRange: optionRangeBussiness[0].value,
      },
      businessDetails: {
        identifyImages: [],
        licenseImages: [],
        contracts: [],
      },
    },
  });
  const formInfo = useForm<CreateMerchantInput>({
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
  });

  const formImgInfo = useForm<CreateMerchantInput>({
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
  });

  const {
    control: controlFormInfo,
    register: registerFormInfo,
    setValue: setValueFormInfo,
    getValues: getValueFormInfo,
    clearErrors: clearErrorsFormInfo,
    handleSubmit: handleSubmitFormInfo,
    watch,
    formState: { errors: errorsFormInfo },
  } = formInfo;

  const rulesForm = {
    fullName: {
      maxLength: 50,
    },
    email: {
      required: true,
      isEmail: true,
    },
    phone: {
      minLength: 10,
      isVNumber: true,
      maxLength: 10,
      // isPhoneNumber: true,
    },
    abbreviationName: {
      minLength: 4,
      maxLength: 50,
    },
    categoryName: {
      required: true,
      trim: true,
    },
    website: {},
    brandName: {},
  };

  const handleSelectedLocation = (
    newValue: SingleValue<SelectProp>,
    field: any,
    type: string = ''
  ) => {
    field.onChange(newValue?.label);
    // setValueFormInfo('businessOverview.locationIdentifyCode', newValue?.value);
    setValue('businessOverview.locationIdentifyCode', newValue?.value);
    dispatch(
      getSubLocationList(
        {
          identifyCode: newValue?.value,
        },
        (state, res) => {
          const newLocal: LocationType[] = res?.data;
          if (state) {
            switch (type) {
              case 'city': {
                setWards([]);
                setValueFormInfo('businessOverview.district', '');
                setValueFormInfo('businessOverview.wards', '');
                dispatch(
                  getSubLocationList(
                    {
                      parentIdentifyCode: newValue?.value,
                    },
                    (state, res) => {
                      if (state) {
                        const newLocal: LocationType[] = res?.data;
                        setDistrict(
                          newLocal.map((ele) => ({
                            value: ele.identifyCode,
                            label: ele.title,
                          }))
                        );
                      }
                    }
                  )
                );
                break;
              }
              case 'district': {
                setValueFormInfo('businessOverview.wards', '');
                dispatch(
                  getSubLocationList(
                    {
                      parentIdentifyCode: newValue?.value,
                    },
                    (state, res) => {
                      if (state) {
                        const newLocal: LocationType[] = res?.data;
                        setWards(
                          newLocal.map((ele) => ({
                            value: ele.identifyCode,
                            label: ele.title,
                          }))
                        );
                      }
                    }
                  )
                );
                break;
              }
            }
          }
        }
      )
    );
  };

  // handle event onSubmit
  const handleSubmitForm: SubmitHandler<any> = (data, e) => {
    e?.preventDefault();

    // if (!data?.contactInfo?.email) {
    //   setError('contactInfo.email', {
    //     type: 'required',
    //     message: t('Email không được để rỗng'),
    //   });
    // }
    // if (!data?.businessOverview?.categoryName) {
    //   setError('businessOverview.categoryName', {
    //     type: 'required',
    //     message: t('Ngành nghề kinh doanh không được để rỗng'),
    //   });
    // }
    // if (data?.businessOverview.province === undefined) {
    //   setError('businessOverview.province', {
    //     type: 'required',
    //     message: '',
    //   });
    // }
    // if (data?.businessOverview.district === undefined) {
    //   setError('businessOverview.district', {
    //     type: 'required',
    //     message: '',
    //   });
    // }
    // if (data?.businessOverview.wards === undefined) {
    //   setError('businessOverview.wards', {
    //     type: 'required',
    //     message: '',
    //   });
    // }
    if (!data?.businessDetails.identifyImages.length) {
      setError('businessDetails.identifyImages', {
        type: 'required',
        message: '',
      });
    }
    if (!data?.businessDetails.licenseImages.length) {
      setError('businessDetails.licenseImages', {
        type: 'required',
        message: '',
      });
    }
    if (
      !data?.businessDetails.identifyImages.length ||
      !data?.businessDetails.licenseImages.length
    ) {
      return;
    }

    dispatch(
      createAccountMerchant(
        {
          contactInfo: data?.contactInfo,
          businessOverview: data?.businessOverview,
          businessDetails: data?.businessDetails,
        },
        (status, res) => {
          if (status) {
            alert('success', t(res.message), t);
            reset();
            onHide && onHide();
          } else {
            alert('error', t(res.message), t);
          }
        }
      )
    );
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        reset();
        onHide && onHide();
      }}
      backdrop='static'
      //keyboard={false}
      className='modal-create-account-mc'>
      <Modal.Header closeButton>
        <Modal.Title>{t('Tạo tài khoản Merchant')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(handleSubmitForm)} autoComplete='off'>
          <div className='d-flex content-body'>
            <div className='inputs-group body_left' style={{ width: '50%' }}>
              <div className='register-contact-info'>
                <Input
                  formGroupClassName={`${
                    errors?.contactInfo?.fullname?.message ? 'input-custom-error' : ''
                  }`}
                  type='text'
                  label={t('Họ tên')}
                  register={register}
                  errors={errors?.contactInfo?.fullname}
                  clearErrors={clearErrors}
                  placeholder={t('Họ tên')}
                  rules={rulesForm.fullName}
                  name='contactInfo.fullname'
                />
                <Input
                  formGroupClassName={`${
                    errors?.contactInfo?.email?.message ? 'input-custom-error' : ''
                  }`}
                  type='text'
                  label={t('Email')}
                  register={register}
                  name='contactInfo.email'
                  errors={errors?.contactInfo?.email}
                  clearErrors={clearErrors}
                  rules={rulesForm?.email}
                  placeholder={t('Enter email')}
                />
                <Input
                  formGroupClassName={`${
                    errors?.contactInfo?.phone?.message ? 'input-custom-error' : ''
                  }`}
                  type='phone'
                  label={t('Phone number')}
                  register={register}
                  name='contactInfo.phone'
                  errors={errors?.contactInfo?.phone}
                  clearErrors={clearErrors}
                  rules={rulesForm?.phone}
                  placeholder={t('Enter phone number')}
                />
              </div>
              <hr style={{ marginTop: '0.5rem', marginBottom: '1rem' }} />
              <div className='register-business-detail-img'>
                <RegisterBusinessDetailImg
                  formImgInfo={formImgInfo}
                  //register={registerImgInfo}
                  setValues={setValue}
                  clearError={clearErrors}
                  resetField={resetField}
                  errors={errors}
                  register={register}
                  control={control}
                />
              </div>
            </div>
            <div className='inputs-group body_right' style={{ width: '50%' }}>
              <div className='form-group'>
                <label>{t('Loại MC')}</label>
                <Controller
                  control={control}
                  name='businessOverview.type'
                  render={({ field }) => (
                    <ReactSelect
                      placeholder={t('Loại doanh nghiệp')}
                      className='select-input-form'
                      classNamePrefix='input-select'
                      value={optionTypeMC.find(
                        (value) => value.value === field.value?.toUpperCase()
                      )}
                      onChange={(e: any) => {
                        field.onChange(e.value);
                      }}
                      options={optionTypeMC}
                    />
                  )}
                />
              </div>
              <Input
                formGroupClassName={`${
                  errors?.businessOverview?.abbreviationName?.message ? 'input-custom-error' : ''
                }`}
                type='abbreviationName'
                label={t('Tên viết tắt')}
                register={register}
                name='businessOverview.abbreviationName'
                errors={errors?.businessOverview?.abbreviationName}
                clearErrors={clearErrors}
                rules={rulesForm?.abbreviationName}
                placeholder={t('Enter abbreviation name')}
              />
              <div className='form-group'>
                <label>{t('Doanh thu trung bình/ tháng')}</label>
                <Controller
                  control={control}
                  name='businessOverview.maxRange'
                  render={({ field }) => (
                    <ReactSelect
                      className='select-input-form'
                      classNamePrefix='input-select'
                      placeholder={t('Doanh thu')}
                      onChange={(e: any) => {
                        field.onChange(e.value);
                      }}
                      value={
                        optionRangeBussiness.find((value) => value.value === field.value) || null
                      }
                      options={optionRangeBussiness}
                    />
                  )}
                />
              </div>
              <div className='form-group'>
                <label>{t('Loại kết nối')}</label>
                <Controller
                  control={control}
                  name='businessOverview.connectionType'
                  render={({ field }) => (
                    <ReactSelect
                      className='select-input-form'
                      classNamePrefix='input-select'
                      placeholder={t('Loại kết nối')}
                      onChange={(e: any) => {
                        field.onChange(e.value);
                      }}
                      value={
                        optionConnectionTypeMC.find((value) => value.value === field.value) || null
                      }
                      options={optionConnectionTypeMC}
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
                name='businessOverview.categoryName'
                errors={errors?.businessOverview?.categoryName}
                clearErrors={clearErrors}
                rules={rulesForm?.categoryName}
                placeholder={t('Nhập ngành nghề kinh doanh')}
              />
              <div
                className={`${`form-group ${
                  errors?.businessOverview?.province ||
                  errors?.businessOverview?.district ||
                  errors?.businessOverview?.wards ||
                  errors?.businessOverview?.locationIdentifyCode ||
                  errors?.businessOverview?.address
                    ? 'input-custom-error'
                    : ''
                }`}`}>
                {/* <div className='form-group'> */}
                <div className='input-label' style={{ display: 'block' }}>
                  <label className='mr-0'>{t('Địa chỉ')}</label>
                  <span className='text-danger'> (*)</span>
                </div>
                <div className='multi-select'>
                  <Controller
                    control={control}
                    name='businessOverview.province'
                    render={({ field }) => {
                      return (
                        <ReactSelect
                          className='select-input-form input--none-border'
                          classNamePrefix='input-select'
                          placeholder={t('Tỉnh/Thành phố')}
                          onChange={(e) => handleSelectedLocation(e, field, 'city')}
                          options={cities}
                          value={cities.find((value) => value.label === field.value?.trim())}
                        />
                      );
                    }}
                    rules={{
                      required: true,
                    }}
                  />
                  <Controller
                    control={control}
                    name='businessOverview.district'
                    render={({ field }) => (
                      <ReactSelect
                        className='select-input-form input--none-border '
                        classNamePrefix='input-select'
                        placeholder={t('Quận/Huyện')}
                        onChange={(e) => handleSelectedLocation(e, field, 'district')}
                        options={districts}
                        value={
                          field.value
                            ? districts.find((ele) => ele.label === field.value?.trim())
                            : null
                        }
                      />
                    )}
                    rules={{
                      required: true,
                    }}
                  />
                  <Controller
                    control={control}
                    name='businessOverview.wards'
                    render={({ field }) => (
                      <ReactSelect
                        className='select-input-form input--none-border'
                        classNamePrefix='input-select'
                        placeholder={t('Xã/Phường')}
                        onChange={(e) => handleSelectedLocation(e, field)}
                        options={wards}
                        value={
                          field.value
                            ? wards.find((ele) => ele.label === field.value?.trim())
                            : null
                        }
                      />
                    )}
                    rules={{
                      required: true,
                    }}
                  />
                </div>
                <input
                  hidden
                  {...register('businessOverview.locationIdentifyCode', { required: true })}
                />
                <input
                  placeholder={t('Nhập địa chỉ')}
                  {...register('businessOverview.address', { required: true })}
                />
              </div>
              <Input
                formGroupClassName={`${
                  errors?.businessOverview?.brandName?.message ? 'input-custom-error' : ''
                }`}
                type='text'
                label={t('Brand Name')}
                register={register}
                errors={errors?.businessOverview?.brandName}
                clearErrors={clearErrors}
                placeholder={t('Nhập tên nhãn hiệu')}
                rules={rulesForm.brandName}
                name='businessOverview.brandName'
              />
              <Input
                formGroupClassName={`${
                  errors?.businessOverview?.website?.message ? 'input-custom-error' : ''
                }`}
                type='text'
                label={t('Website')}
                register={register}
                errors={errors?.businessOverview?.website}
                clearErrors={clearErrors}
                placeholder={t('Trang Website')}
                rules={rulesForm.website}
                name='businessOverview.website'
              />
              <div
                className={`form-group form-input-textarea ${
                  errors?.businessOverview?.description ? 'input-custom-error' : ''
                }`}>
                <label>{t('Description')}</label>
                <textarea
                  className='input-textarea'
                  placeholder={t('Nhập mô tả')}
                  style={{ width: '100%', maxHeight: '150px', minHeight: '80px' }}
                  {...register('businessOverview.description')}
                />
              </div>
            </div>
          </div>
          <hr style={{ marginTop: '0.5rem', marginBottom: '1rem' }} />
          <div className='inputs-group d-block p-0' style={{ textAlign: 'center' }}>
            <button
              className=' btn btn-primary mr-0'
              style={{ display: 'initial', minWidth: '100px' }}>
              {t('Tạo mới')}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalCreateAccountMc;
