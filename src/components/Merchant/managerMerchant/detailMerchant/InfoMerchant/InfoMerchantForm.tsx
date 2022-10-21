import LocationComponent from 'components/common/Location/LocationComponent';
import { MccCodeListType, MerchantAccount } from 'models';
import numeral from 'numeral';
import React, { useMemo, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { Controller, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import ReactSelect, { SingleValue } from 'react-select';
import { Input } from 'ui/Form';
import { optionRangeBussiness } from '../utils/constantSelectOptions';
import dayjs from 'dayjs';
import MaskedInput from 'react-maskedinput';
import TagsInput from 'react-tagsinput';

interface Props {
  form: UseFormReturn<MerchantAccount>;
  merchantType?: string;
  onClickImage?: React.MouseEventHandler<HTMLImageElement>;
  onUploadImage?: React.ChangeEventHandler<HTMLInputElement>;
  onRemoveImage?: React.MouseEventHandler<HTMLElement>;
  onRemoveHolder?: React.MouseEventHandler<HTMLElement>;
  onAddHolder?: React.MouseEventHandler<HTMLButtonElement>;
}

interface CodeProps extends MccCodeListType {
  value?: string;
  label?: string;
}

interface ContractDateType {
  contractDateStart: boolean;
  contractDateEnd: boolean;
}

const InfoMerchantForm: React.FC<Props> = ({
  onUploadImage,
  onRemoveImage,
  onClickImage,
  onRemoveHolder,
  onAddHolder,
  merchantType,
  form,
}) => {
  const {
    register,
    control,
    setValue,
    clearErrors,
    getValues,
    watch,
    formState: { errors },
  } = form;
  const profile = useSelector<any, MerchantAccount>((state) => state.merchantRD.merchantProfile);
  const dataNational = useSelector<any, []>((state) => state.utility.GetNationality) || [];
  const dataNationalFormat = useMemo(() => {
    return dataNational.map((item: any) => ({ label: item.value, value: item.name }));
  }, [dataNational]);
  const isEnterpriseMerchant = ['ENTERPRISE', 'FOREIGN_ENTERPRISE'].includes(merchantType || '');
  const isIndividualMerchant = ['INDIVIDUAL', 'FOREIGN_INDIVIDUAL'].includes(merchantType || '');
  const { t } = useTranslation('common');
  const mccCodes = useSelector<any, MccCodeListType[]>((state) => state?.utility?.mccCodes);

  const [contractDate, setContractDate] = useState<ContractDateType>({
    contractDateStart: false,
    contractDateEnd: false,
  });
  const convertField = (data: string) => {
    return dayjs(data.split('/').reverse().join('-'));
  };

  const handleCloseCalender = (type: string) => {
    switch (type) {
      case 'CONTRACTDATESTART':
        setContractDate({
          ...contractDate,
          contractDateStart: false,
        });
        break;

      case 'CONTRACTDATEEND':
        setContractDate({
          ...contractDate,
          contractDateEnd: false,
        });
        break;
      default:
        break;
    }
  };

  const handleOpenCalender = (type: string) => {
    switch (type) {
      case 'CONTRACTDATESTART':
        setContractDate({
          ...contractDate,
          contractDateStart: !contractDate?.contractDateStart,
        });
        break;
      case 'CONTRACTDATEEND':
        setContractDate({
          ...contractDate,
          contractDateEnd: !contractDate?.contractDateEnd,
        });
        break;
      default:
        break;
    }
  };

  const handleErrorImage: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const target = e.target as HTMLImageElement;

    target.src = '/assets/images/img-na.png';
    target.onerror = null;
  };

  const renderImageSrc = (src?: string, type?: string) => {
    const valid = new RegExp(/^(https)+/g);
    let subParams = '';
    switch (type) {
      case 'VIDEO':
        subParams = '#t=5';
        break;
      case 'EMPTY':
        subParams = '';
        break;

      default:
        subParams = '?w=100';
        break;
    }
    if (!src) return '/assets/images/img-na.png';

    if (valid.test(src)) return src + subParams;

    return process.env.NEXT_PUBLIC_API_UPLOAD + src + subParams;
  };

  // console.log(
  //   '🚀 ~ file: InfoMerchantForm.tsx ~ line 84 ~ watch',
  //   watch('businessOverview.shareholders')
  // );

  const cateCodes = useMemo<CodeProps[]>(() => {
    return mccCodes.map((ele) => ({
      ...ele,
      value: ele.code,
      label: ele.content,
    }));
  }, [mccCodes.length]);

  return (
    <>
      <div className='inputs-group-v2'>
        <p className='inputs-group-v2__title'>
          {isEnterpriseMerchant ? t('Thông tin doanh nghiệp') : t('Thông tin Merchant')}
        </p>

        {isEnterpriseMerchant && (
          <>
            <div className='form-group '>
              <label>{t('Mã đối tác')}</label>
              <input
                className='form-control base-input'
                placeholder={t('Địa chỉ')}
                value={profile.merchantId}
                type='text'
                disabled
              />
            </div>

            <Input
              formGroupClassName={`${
                errors?.businessOverview?.abbreviationName?.message ? 'input-custom-error' : ''
              }`}
              type='text'
              label={t('Tên doanh nghiệp')}
              register={register}
              errors={errors?.businessOverview?.abbreviationName}
              clearErrors={clearErrors}
              placeholder={t('Tên doanh nghiệp')}
              rules={formRules.abbreviationName}
              name='businessOverview.abbreviationName'
            />

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
          </>
        )}
      </div>
      <div className='inputs-group-v2 '>
        {!isEnterpriseMerchant && (
          <div className='form-group '>
            <label>{t('Mã đối tác')}</label>
            <input
              className='form-control base-input'
              placeholder={t('Địa chỉ')}
              value={profile.merchantId}
              type='text'
              disabled
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
          rules={formRules.industry}
          name='businessOverview.categoryName'
        />

        <div className={'form-group input-uppercase '}>
          <label>{t('Brand name')}</label>
          <input
            type='text'
            maxLength={25}
            className={`form-control ${
              errors?.businessOverview?.brandName?.message ? 'input-error' : ''
            } base-input`}
            placeholder={t('Nhập tên nhãn hiệu')}
            {...register('businessOverview.brandName', {
              pattern: {
                value: /^((?![~!@#$%^&*\(\)_+`\-=\{\}\|:";'<>?,./\\\[\]]).)*$/,
                message: t('Brand name') + ' sai định dạng',
              },
              onChange: (e) => {
                const value = e.target.value;
                const regex = /^((?![~!@#$%^&*\(\)_+`\-=\{\}\|:";'<>?,./\\\[\]]).)*$/;
                if (!regex.test(e.target.value)) {
                  e.target.value = value.replace(
                    /[~!@#$%^&*\(\)_+`\-=\{\}\|:";'<>?,./\\\[\]]/g,
                    ''
                  );
                }
                clearErrors('businessOverview.brandName');
              },
            })}
          />
        </div>

        <div
          className={
            'form-group ' + `${errors?.businessOverview?.taxCode?.type ? 'input-custom-error' : ''}`
          }>
          <label>
            {t('MST')}
            {isEnterpriseMerchant && <span> (*)</span>}
          </label>
          <input
            type='text'
            className={`form-control ${
              errors?.businessOverview?.taxCode?.message ? 'input-error' : ''
            } base-input`}
            placeholder={t('Mã số thuế')}
            {...register('businessOverview.taxCode', {
              required: {
                value: isEnterpriseMerchant,
                message: t('MST không được để trống'),
              },
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

        <Input
          formGroupClassName={`${errors?.contactInfo?.phone?.message ? 'input-custom-error' : ''}`}
          type='text'
          label={t('Số điện thoại')}
          register={register}
          errors={errors?.contactInfo?.phone}
          clearErrors={clearErrors}
          placeholder={t('Số điện thoại')}
          rules={formRules.phone}
          name='contactInfo.phone'
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
              pattern: {
                value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/,
                message: t('Email không đúng định dạng'),
              },
              required: false,
            })}
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
            'form-group ' + `${errors?.contactInfo?.email?.message ? 'input-custom-error' : ''}`
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
          <div className='form-group form-input-location'>
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
        )}

        <div className={`form-group `}>
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
          rules={formRules.website}
          name='businessOverview.homeUrl'
        />

        <div className={`form-group `}>
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
                  target.value = target.value.replace(/\D/g, '');
                  field.onChange(numeral(target.value).value());
                  clearErrors('businessOverview.maxAmountTransaction');
                }}
                placeholder={'0 VND'}
                maxLength={14}
                value={field?.value ? numeral(+field?.value).format('0,0') : ''}
              />
            )}
          />
        </div>

        <div className={`form-group ${errors?.minBalance?.type ? 'input-custom-error' : ''}`}>
          <label>
            {t('Số dư tối thiểu rút/chuyển (VND)')}
            <span className='text-danger'> (*)</span>
          </label>
          <Controller
            control={control}
            name='minBalance'
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <input
                className={`form-control base-input ${
                  errors?.minBalance?.type ? 'input-error' : ''
                }`}
                {...field}
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.replace(/\D/g, '');
                  field.onChange(numeral(target.value).value());
                  clearErrors('minBalance');
                }}
                placeholder={'0 VND'}
                maxLength={14}
                value={field?.value ? numeral(+field?.value!).format('0,0') : ''}
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

        <div className={`form-group ${errors?.product?.message ? 'input-custom-error' : ''}`}>
          <label>{t('Mặt hàng kinh doanh')}</label>
          <input
            className='form-control'
            placeholder={'Mặt hàng'}
            {...register('product', {
              onChange: (e) => {
                clearErrors('product');
              },
            })}
          />
          {errors?.product && (
            <p className='mt-10 mb-0 txt-valid'>
              <i className='i-valid' />
              {'Mặt hàng kinh doanh không được rỗng'}
            </p>
          )}
        </div>

        <div className={`form-group ${errors?.contractDateStart ? 'input-custom-error' : ''}`}>
          <label>
            {t('Hiệu lực hợp đồng từ ngày')}
            <span className='text-danger'> (*)</span>
          </label>
          <div className='input-calendar'>
            <Controller
              control={control}
              name='contractDateStart'
              // rules={{ required: true }}
              render={({ field }) => (
                <ReactDatePicker
                  placeholderText='DD/MM/YYYY'
                  locale={'en'}
                  onChange={(e: Date) => {
                    clearErrors('contractDateStart');
                    field.onChange(e && dayjs(e).format('DD/MM/YYYY'));
                  }}
                  disabled={true}
                  selected={field.value ? convertField(field.value).toDate() : null}
                  dateFormat='dd/MM/yyyy'
                  customInput={
                    <MaskedInput
                      style={{ cursor: 'no-drop' }}
                      mask='11/11/1111'
                      placeholder='dd/MM/yyyy'
                    />
                  }
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  open={contractDate.contractDateStart}
                  onSelect={() => handleCloseCalender('CONTRACTDATESTART')}
                  onClickOutside={() => handleCloseCalender('CONTRACTDATESTART')}
                  dropdownMode='select'
                />
              )}
            />

            <i
              className='far fa-calendar'
              style={{ cursor: 'pointer' }}
              onClick={() => handleOpenCalender('CONTRACTDATESTART')}></i>
          </div>
        </div>

        <div className={`form-group ${errors?.contractDateEnd ? 'input-custom-error' : ''}`}>
          <label>
            {t('Hiệu lực hợp đồng đến ngày')}
            <span className='text-danger'> (*)</span>
          </label>
          <div className='input-calendar'>
            <Controller
              control={control}
              name='contractDateEnd'
              rules={{ required: true }}
              render={({ field }) => (
                <ReactDatePicker
                  placeholderText='DD/MM/YYYY'
                  locale={'en'}
                  onChange={(e: Date) => {
                    clearErrors('contractDateEnd');
                    field.onChange(e && dayjs(e).format('DD/MM/YYYY'));
                  }}
                  selected={field.value ? convertField(field.value).toDate() : null}
                  dateFormat='dd/MM/yyyy'
                  customInput={<MaskedInput mask='11/11/1111' placeholder='dd/MM/yyyy' />}
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  open={contractDate.contractDateEnd}
                  onSelect={() => handleCloseCalender('CONTRACTDATEEND')}
                  onClickOutside={() => handleCloseCalender('CONTRACTDATEEND')}
                  dropdownMode='select'
                />
              )}
            />

            <i
              className='far fa-calendar'
              style={{ cursor: 'pointer' }}
              onClick={() => handleOpenCalender('CONTRACTDATEEND')}></i>
          </div>
        </div>

        {isEnterpriseMerchant && (
          <>
            <div className={`form-group`}>
              <label>{t('Tổng doanh thu 2 năm gần nhất (VND)')}</label>
              <Controller
                control={control}
                name='businessOverview.totalRevenue'
                render={({ field }) => (
                  <input
                    className={`form-control base-input `}
                    {...field}
                    onChange={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.value = target.value.replace(/\D/g, '');
                      field.onChange(target.value);
                      clearErrors('businessOverview.totalRevenue');
                    }}
                    placeholder={'0 VND'}
                    maxLength={20}
                    value={
                      field?.value ? numeral(+field?.value!.replace(/\D/g, '')).format('0,0') : ''
                    }
                  />
                )}
              />
            </div>

            <section className='inputs-group-image d-flex flex-row flex-wrap p-0'>
              <div className={'form-group'}>
                <label className='font-weight-normal'>{t('Danh sách thành viên điều hành')}</label>
                <div className='inputs-group-image__imgs-info'>
                  <div
                    className={`btn-upload btn-upload-single`}
                    style={{ marginTop: 10, marginRight: 0, flex: '1 0 auto' }}>
                    <label className='d-flex flex-column align-items-center m-0'>
                      <input
                        accept='image/*, application/pdf'
                        type='file'
                        name='executiveMemberList'
                        hidden
                        multiple
                        onChange={onUploadImage}
                      />
                      <i className='fas fa-cloud-upload-alt fa-2x'></i>Tải ảnh
                    </label>
                  </div>
                  <div className='imgs-info__list '>
                    {watch('businessDetails.executiveMemberList')?.map((img, index) => {
                      if (!img) return <React.Fragment key={index}></React.Fragment>;
                      const { isImage, fileIcon } = detectFileType(img);
                      if (!isImage)
                        return (
                          <div className='row-img-preview' key={index}>
                            <a target='_blank' href={process.env.NEXT_PUBLIC_API_UPLOAD + img}>
                              <img
                                src={`/assets/img/${fileIcon}.png`}
                                alt='face-kyc-img'
                                style={{ objectFit: 'contain', height: '60px' }}
                              />
                            </a>
                            <i
                              onClick={onRemoveImage}
                              data-name='executiveMemberList'
                              data-index={index}
                              className='fas fa-times-circle fa-lg icon-remove'></i>
                          </div>
                        );
                      return (
                        <div className='row-img-preview' key={index}>
                          <img
                            root-src={process.env.NEXT_PUBLIC_API_UPLOAD + img}
                            onClick={onClickImage}
                            src={renderImageSrc(process.env.NEXT_PUBLIC_API_UPLOAD + img)}
                            onError={handleErrorImage}
                            alt='face-kyc-img'
                          />
                          <i
                            onClick={onRemoveImage}
                            data-name='executiveMemberList'
                            data-index={index}
                            className='fas fa-times-circle fa-lg icon-remove'></i>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className={'form-group'}>
                <label className='font-weight-normal'>
                  {t('Quyết định bổ nhiệm người đại diện')}
                </label>
                <div className='inputs-group-image__imgs-info'>
                  <div
                    className={`btn-upload btn-upload-single`}
                    style={{ marginTop: 10, marginRight: 0, flex: '1 0 auto' }}>
                    <label className='d-flex flex-column align-items-center m-0'>
                      <input
                        accept='image/*, application/pdf'
                        type='file'
                        name='representativeContracts'
                        hidden
                        multiple
                        onChange={onUploadImage}
                      />
                      <i className='fas fa-cloud-upload-alt fa-2x'></i>Tải ảnh
                    </label>
                  </div>
                  <div className='imgs-info__list '>
                    {watch('businessDetails.representativeContracts')?.map((img, index) => {
                      if (!img) return <React.Fragment key={index}></React.Fragment>;
                      const { isImage, fileIcon } = detectFileType(img);
                      if (!isImage)
                        return (
                          <div className='row-img-preview' key={index}>
                            <a target='_blank' href={process.env.NEXT_PUBLIC_API_UPLOAD + img}>
                              <img
                                src={`/assets/img/${fileIcon}.png`}
                                alt='face-kyc-img'
                                style={{ objectFit: 'contain', height: '60px' }}
                              />
                            </a>
                            <i
                              onClick={onRemoveImage}
                              data-name='representativeContracts'
                              data-index={index}
                              className='fas fa-times-circle fa-lg icon-remove'></i>
                          </div>
                        );
                      return (
                        <div className='row-img-preview' key={index}>
                          <img
                            root-src={process.env.NEXT_PUBLIC_API_UPLOAD + img}
                            onClick={onClickImage}
                            src={renderImageSrc(process.env.NEXT_PUBLIC_API_UPLOAD + img)}
                            onError={handleErrorImage}
                            alt='face-kyc-img'
                          />
                          <i
                            onClick={onRemoveImage}
                            data-name='representativeContracts'
                            data-index={index}
                            className='fas fa-times-circle fa-lg icon-remove'></i>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            <hr className='w-100 my-2' />

            <div className={`w-100 mb-0 ml-0`}>
              <label style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Chủ sở hữu hưởng lợi <br />
              </label>
            </div>
            {/* <div className="form-group">
              <label style={{display:'block'}}>Người 1</label>
              <input className="form-control base-input" placeholder="" value="" style={{width: '80%', display: 'inline-block'}}/>%
              </div>
              <div className="form-group">
              <label style={{display:'block'}}>Người 2</label>
              <input className="form-control base-input " placeholder="" value="" style={{width: '80%', display: 'inline-block'}}/>%
              </div>
             */}

            {watch('businessOverview.shareholders')?.map((_, index) => {
              return (
                <div className='flex-full mt-3 w-100' key={index}>
                  <label className='w-100 d-flex align-items-center cursor-pointer'>
                    <hr className='w-100 m-0' />
                    <span>
                      <i
                        className='fas fa-times-circle ml-3 fa-lg text-danger'
                        data-index={index}
                        onClick={onRemoveHolder}></i>
                    </span>
                  </label>

                  <div className='d-flex flex-wrap'>
                    <div className={`form-group`}>
                      <label>Họ và Tên</label>
                      <input
                        className={`form-control base-input `}
                        placeholder={'Nhập họ tên'}
                        {...register(`businessOverview.shareholders.${index}.fullname`, {
                          onChange: (e) => {
                            clearErrors('businessOverview.companyAddress.name');
                          },
                        })}
                      />
                    </div>

                    <div className={`form-group`}>
                      <label>CMND / CCCD</label>
                      <input
                        className={`form-control base-input `}
                        maxLength={12}
                        placeholder={'Nhập CMND / CCCD'}
                        {...register(`businessOverview.shareholders.${index}.identifyNumber`, {
                          onChange: (e) => {
                            const target = e.target as HTMLInputElement;
                            target.value = target.value.replace(/\D/g, '');
                            clearErrors('businessOverview.companyAddress.address');
                          },
                        })}
                      />
                    </div>

                    <div className={`form-group`}>
                      <label>Chức vụ</label>
                      <input
                        className={`form-control base-input `}
                        placeholder={'Chức vụ'}
                        {...register(`businessOverview.shareholders.${index}.title`, {
                          onChange: (e) => {
                            clearErrors('businessOverview.companyAddress.phoneNumber');
                          },
                        })}
                      />
                    </div>

                    <div
                      className={`form-group ${
                        errors?.businessOverview?.shareholders &&
                        errors?.businessOverview?.shareholders[index]?.capitalRatio?.type
                          ? 'input-custom-error'
                          : ''
                      }`}>
                      <label>Tỷ lệ đóng góp (%)</label>
                      <input
                        className={`form-control base-input `}
                        placeholder={'Tỷ lệ'}
                        maxLength={3}
                        {...register(`businessOverview.shareholders.${index}.capitalRatio`, {
                          onChange: (e) => {
                            const target = e.target as HTMLInputElement;
                            target.value = `${
                              target.value ? +target.value.replace(/\D/g, '') : ''
                            }`;
                            clearErrors(`businessOverview.shareholders.${index}.capitalRatio`);
                          },
                          pattern: {
                            value: /(^\d$|^[1-9][0-9]$|100)/,
                            message: 'Tỷ lệ đóng góp sai định dạng',
                          },
                        })}
                      />
                      {errors?.businessOverview?.shareholders &&
                        errors?.businessOverview?.shareholders[index]?.capitalRatio?.type && (
                          <p className='mt-10 mb-0 txt-valid'>
                            <i className='i-valid' />
                            {errors?.businessOverview?.shareholders[index]?.capitalRatio?.message}
                          </p>
                        )}
                    </div>
                    <div className={`form-group`}>
                      <label>{t('Quốc tịch')}</label>
                      <Controller
                        control={control}
                        name={`businessOverview.shareholders.${index}.nationality`}
                        render={({ field }) => (
                          <ReactSelect
                            className='select-input-form'
                            classNamePrefix='input-select'
                            placeholder={t('Quốc tịch')}
                            value={
                              dataNationalFormat.find((ele) => ele.value === field.value) || ''
                            }
                            onChange={(newValue: SingleValue<any>) => {
                              field.onChange(newValue?.value);
                            }}
                            options={dataNationalFormat}
                          />
                        )}
                      />
                    </div>
                    {/* <div className={`form-group`}>
                      <label>Quốc tịch</label>
                      <input
                        className={`form-control base-input `}
                        placeholder={'Quốc tịch'}
                        {...register(`businessOverview.shareholders.${index}.nationality`, {
                          onChange: (e) => {
                            clearErrors('businessOverview.companyAddress.phoneNumber');
                          },
                        })}
                      />
                    </div> */}
                  </div>
                </div>
              );
            })}

            <button className='btn btn-primary mt-4 w-100' onClick={onAddHolder} type='button'>
              <i className='fas fa-plus'></i>
              Thêm pháp nhân
            </button>
            <hr className='w-100 my-2' />
          </>
        )}

        {isIndividualMerchant && (
          <>
            <hr className='w-100 my-2' />
            <div className={`w-100 mb-0 ml-0`}>
              <label style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Chủ sở hữu hưởng lợi
                {/* <span className='font-weight-normal font-italic'>
                  (Pháp nhân tham gia vốn điều lệ)
                </span> */}
              </label>
            </div>

            {watch('businessOverview.shareholders')?.map((_, index) => {
              return (
                <div className='flex-full mt-3' key={index} id='isIndividualMerchantdiv'>
                  {/* <label className='w-100 d-flex align-items-center cursor-pointer'>
                    <hr className='w-100 m-0' />
                    <span>
                      <i
                        className='fas fa-times-circle ml-3 fa-lg text-danger'
                        data-index={index}
                        onClick={onRemoveHolder}></i>
                    </span>
                  </label> */}

                  <div className='d-flex flex-wrap'>
                    <div className={`form-group`}>
                      <label>Họ và Tên</label>
                      <input
                        className={`form-control base-input `}
                        placeholder={'Nhập họ tên'}
                        {...register(`businessOverview.shareholders.${index}.fullname`, {
                          onChange: (e) => {
                            clearErrors('businessOverview.companyAddress.name');
                          },
                        })}
                      />
                    </div>

                    <div className={`form-group`}>
                      <label>CMND / CCCD</label>
                      <input
                        className={`form-control base-input `}
                        maxLength={12}
                        placeholder={'Nhập CMND / CCCD'}
                        {...register(`businessOverview.shareholders.${index}.identifyNumber`, {
                          onChange: (e) => {
                            const target = e.target as HTMLInputElement;
                            target.value = target.value.replace(/\D/g, '');
                            clearErrors('businessOverview.companyAddress.address');
                          },
                        })}
                      />
                    </div>

                    <div className={`form-group`}>
                      <label>Chức vụ</label>
                      <input
                        className={`form-control base-input `}
                        placeholder={'Chức vụ'}
                        maxLength={25}
                        disabled={true}
                        // value={'Chủ doanh nghiệp'}
                        {...register(`businessOverview.shareholders.${index}.title`, {
                          onChange: (e) => {
                            clearErrors('businessOverview.companyAddress.phoneNumber');
                          },
                        })}
                      />
                    </div>

                    <div
                      className={`form-group ${
                        errors?.businessOverview?.shareholders &&
                        errors?.businessOverview?.shareholders[index]?.capitalRatio?.type
                          ? 'input-custom-error'
                          : ''
                      }`}>
                      <label>Tỷ lệ đóng góp (%)</label>
                      <input
                        className={`form-control base-input `}
                        placeholder='Tỷ lệ'
                        maxLength={3}
                        disabled={true}
                        {...register(`businessOverview.shareholders.${index}.capitalRatio`, {
                          onChange: (e) => {
                            const target = e.target as HTMLInputElement;
                            target.value = `${
                              target.value ? +target.value.replace(/\D/g, '') : ''
                            }`;
                            clearErrors(`businessOverview.shareholders.${index}.capitalRatio`);
                          },
                          pattern: {
                            value: /(^\d$|^[1-9][0-9]$|100)/,
                            message: 'Tỷ lệ đóng góp sai định dạng',
                          },
                        })}
                      />
                      {errors?.businessOverview?.shareholders &&
                        errors?.businessOverview?.shareholders[index]?.capitalRatio?.type && (
                          <p className='mt-10 mb-0 txt-valid'>
                            <i className='i-valid' />
                            {errors?.businessOverview?.shareholders[index]?.capitalRatio?.message}
                          </p>
                        )}
                    </div>
                    <div className={`form-group`}>
                      <label>{t('Quốc tịch')}</label>
                      <Controller
                        control={control}
                        name={`businessOverview.shareholders.${index}.nationality`}
                        render={({ field }) => (
                          <ReactSelect
                            className='select-input-form'
                            classNamePrefix='input-select'
                            placeholder={t('Quốc tịch')}
                            value={
                              dataNationalFormat.find((ele) => ele.value === field.value) || ''
                            }
                            onChange={(newValue: SingleValue<any>) => {
                              field.onChange(newValue?.value);
                            }}
                            options={dataNationalFormat}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              className='btn btn-primary mt-4 w-100'
              onClick={onAddHolder}
              type='button'
              id='isIndividualMerchant'
              style={{ display: 'none' }}>
              <i className='fas fa-plus'></i>
              Chủ sở hữu hưởng lợi
            </button>
            <hr className='w-100 my-2' />
          </>
        )}

        <div className={`form-group form-input-textarea flex-full `}>
          <label>{t('Description')}</label>
          <textarea
            className='input-textarea'
            placeholder={t('Nhập mô tả doanh nghiệp')}
            style={{ width: '100%', maxHeight: '250px', minHeight: '50px' }}
            {...register('businessOverview.description')}
          />
        </div>
      </div>
    </>
  );
};

const detectFileType = (fileSrc: string) => {
  const fileType = fileSrc.split('.').at(-1)?.toUpperCase() || '';
  switch (true) {
    case fileType === 'PDF':
      return {
        isImage: false,
        fileIcon: 'pdf-icon',
      };

    case ['DOCX', 'DOC'].includes(fileType):
      return {
        isImage: false,
        fileIcon: 'word-icon',
      };

    case ['XLSX', 'XLS', 'CSV'].includes(fileType):
      return {
        isImage: false,
        fileIcon: 'excel-icon',
      };

    default:
      return {
        isImage: true,
        fileIcon: '',
      };
  }
};

const formRules = {
  industry: {},
  abbreviationName: {
    required: true,
  },
  brandName: {},
  taxCode: {
    maxLength: 15,
  },
  website: {},
  maxIncome: {
    maxLength: 12,
  },
  minBalance: {
    required: true,
  },
  phone: {
    minLength: 10,
    maxLength: 11,
  },
};

export default InfoMerchantForm;
