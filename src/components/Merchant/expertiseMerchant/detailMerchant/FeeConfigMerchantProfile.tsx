import LoadingInline from 'components/common/Loading/LoadingInline';
import { MerchantAccount, MerchantFeeItem, FeeMerchantConfig } from 'models';
import React, { ChangeEventHandler, useEffect, useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ReactSelect from 'react-select';
import { TypeConfigFeeMcEnum } from 'redux/actions';
import EcommerceFeeConfigTable from './FeeConfigDataTable/EcommerceFeeConfigTable';
import PoboFeeConfigTable from './FeeConfigDataTable/PoboFeeConfigTable';
import { SubmitErrorHandler, UseFormReturn } from 'react-hook-form';
import { useSelector } from 'react-redux';
interface Props {
  profile: MerchantAccount;
  loading: boolean;
  collapse?: boolean;
  isSubmit?: boolean;
  formPoboFee: UseFormReturn<FeeMerchantConfig>;
  formEcommerceFee: UseFormReturn<FeeMerchantConfig>;
  formLogFee: UseFormReturn<Pick<MerchantFeeItem, 'logInfo'>>;
  setIsSubmit: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmitForm: (data: MerchantFeeItem[], type: TypeConfigFeeMcEnum, isFeeChange: boolean) => void;
  isApproveFeeConfig: boolean;
  onSubmitError: SubmitErrorHandler<FeeMerchantConfig | Pick<MerchantFeeItem, 'logInfo'>>;
  onClickImage?: React.MouseEventHandler<HTMLImageElement>;
  onRemoveImage: React.MouseEventHandler<HTMLElement>;
  onUploadImage: React.ChangeEventHandler<HTMLInputElement>;
  onClickHistoryFee?: React.MouseEventHandler<HTMLElement>;
}

interface MethodProps {
  value: string;
  label: string;
}

interface LoadingComponentType {
  table: boolean;
  uploadFile: boolean;
}

const FeeConfigMerchantProfile: React.FC<Props> = ({
  profile,
  formEcommerceFee,
  formPoboFee,
  formLogFee,
  collapse,
  loading = false,
  isSubmit = false,
  isApproveFeeConfig,
  setIsSubmit,
  onSubmitForm,
  onSubmitError,
  onClickImage,
  onRemoveImage,
  onUploadImage,
  onClickHistoryFee,
}) => {
  const { t } = useTranslation('common');

  const {
    register,
    formState: { errors },
    clearErrors,
    watch,
    handleSubmit,
  } = formLogFee;

  const merchantFee = useSelector<any, FeeMerchantConfig>((state) => state?.merchantRD.merchantFee);

  const [methodSelected, setMethodSelected] = useState<MethodProps>({
    value: 'ecommerceFee',
    label: t('Ecommerce'),
  });

  const [checked, setChecked] = useState<string>('INIT');
  const [loadingComponent, setLoadingComponent] = useState<LoadingComponentType>({
    table: false,
    uploadFile: false,
  });
  const [isSubmitButtonPressed, setIsSubmitedButtonPressed] = useState(false);

  const handleCheckAllConfig: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    setChecked(target.checked ? 'CHECKED' : 'UNCHECK');
  };

  const optionTransactionChannel = [
    { value: 'ecommerceFee', label: t('Ecommerce') },
    { value: 'poboFeeList', label: t('Pobo') },
  ];

  const handleErrorImage: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const target = e.target as HTMLImageElement;

    target.src = '/assets/images/img-na.png';
    target.onerror = null;
  };

  const RenderImg: React.FC<{
    src: string;
    showCloseBtn: boolean;
    dataName: string;
    index?: string | number;
  }> = ({ src, showCloseBtn, dataName, index }) => {
    let fileType = src?.toLowerCase().split('.').at(-1);
    if (!fileType) return <React.Fragment key={0}></React.Fragment>;

    switch (true) {
      case fileType === 'pdf':
        return (
          <div className='row-img-preview' key={index}>
            <a href={src} target='_blank'>
              <img style={{ width: 'unset' }} src='/assets/img/pdf-icon.png' />
            </a>
            {showCloseBtn && (
              <i
                className='icon-remove fa-lg fas fa-times-circle'
                data-index={index}
                data-name={dataName}
                onClick={onRemoveImage}></i>
            )}
          </div>
        );
      case ['doc', 'docx'].includes(fileType):
        return (
          <div className='row-img-preview' key={index}>
            <a href={src} target='_blank'>
              <img style={{ width: 'unset' }} src='/assets/img/word-icon.png' />
            </a>
            {showCloseBtn && (
              <i
                className='icon-remove fa-lg fas fa-times-circle'
                data-index={index}
                data-name={dataName}
                onClick={onRemoveImage}></i>
            )}
          </div>
        );

      default:
        return (
          <div className='row-img-preview' key={index}>
            <img
              src={src + '?w=100'}
              root-src={src + '?w=100'}
              onError={handleErrorImage}
              onClick={onClickImage}
            />
            {showCloseBtn && (
              <i
                className='icon-remove fa-lg fas fa-times-circle'
                data-index={index}
                data-name={dataName}
                onClick={onRemoveImage}></i>
            )}
          </div>
        );
    }
  };

  useEffect(() => {
    if (loadingComponent.table) {
      setTimeout(() => {
        formLogFee.clearErrors('logInfo');
        setLoadingComponent((prev) => ({ ...prev, table: false }));
      }, 500);
    }
  }, [loadingComponent]);

  return (
    <Collapse in={collapse || false}>
      {loading ? (
        <div className='loading-block'>
          <LoadingInline loading={loading} />
        </div>
      ) : (
        <div className='fee-config block-section-body__form-section px-0'>
          <div className='fee-config__header inputs-group-v2'>
            <div className='form-group' style={{ maxWidth: 230 }}>
              <label>{t('Kênh giao dịch')}</label>
              <ReactSelect
                className='select-input-form'
                classNamePrefix='input-select'
                menuPlacement='bottom'
                isSearchable={false}
                value={optionTransactionChannel.find((ele) => ele.value === methodSelected.value)}
                onChange={(value) => {
                  value && setMethodSelected(value);
                  setChecked('INIT');
                  setLoadingComponent((prev) => ({ ...prev, table: true }));
                }}
                options={optionTransactionChannel}
              />
            </div>
          </div>
          <div className='fee-config__group-fee-actions'>
            <label className='check-all-input'>
              <input
                type='checkbox'
                checked={checked === 'CHECKED'}
                onChange={handleCheckAllConfig}
              />
              {t('Check all')}
            </label>
            <button
              type='button'
              className='text-highlight btn btn--none-style'
              onClick={onClickHistoryFee}>
              {t('Lịch sử cấu hình phí')}
            </button>
          </div>
          <div className='fee-config__content'>
            {methodSelected.value === 'ecommerceFee' ? (
              <EcommerceFeeConfigTable
                setChecked={setChecked}
                checkAll={checked}
                loading={loadingComponent.table}
                isSubmit={isSubmit}
                onSubmitForm={onSubmitForm}
                onSubmitError={onSubmitError}
                isSubmitBtnPressed={isSubmitButtonPressed}
                form={formEcommerceFee}
                formLog={formLogFee}
                isApproveFeeConfig={isApproveFeeConfig}
                data={merchantFee}
              />
            ) : (
              <PoboFeeConfigTable
                setChecked={setChecked}
                checkAll={checked}
                loading={loadingComponent.table}
                isSubmit={isSubmit}
                onSubmitForm={onSubmitForm}
                onSubmitError={onSubmitError}
                isSubmitBtnPressed={isSubmitButtonPressed}
                form={formPoboFee}
                formLog={formLogFee}
                isApproveFeeConfig={isApproveFeeConfig}
                data={merchantFee}
              />
            )}
          </div>
          <form className='fee-config__log-info image-profile-merchant d-flex'>
            <div className='inputs-group-v2' style={{ width: '27.5vw', flexBasis: 'auto' }}>
              <div
                className={`form-group flex-full form-input-textarea ${
                  errors.logInfo?.description ? 'input-custom-error' : ''
                }`}>
                <label>
                  {t('Description')}
                  {/* <span className='text-danger'> (*)</span> */}
                </label>
                <textarea
                  className='input-textarea'
                  placeholder='Mô tả'
                  style={{ width: '100%', height: '100%', maxHeight: '250px', margin: '10px 0' }}
                  {...register('logInfo.description', {
                    onChange: () => {
                      clearErrors('logInfo.description');
                    },
                  })}
                />
              </div>
            </div>
            {/* <div className='inputs-group-image inputs-group-v2'>
              <div
                className={`form-group flex-full inputs-group-image__imgs-log-fee ${
                  errors.logInfo?.images ? 'input-custom-error' : ''
                }`}>
                <label>
                  {t('Hình ảnh')}
                  <span className='text-danger'> (*)</span>
                </label>
                <div className='inputs-group-image__imgs-info'>
                  <div className={`imgs-info__upload-img `}>
                    <label className='upload-img__btn'>
                      {!loadingComponent.uploadFile ? (
                        <>
                          <input
                            accept='image/*'
                            type='file'
                            name='identifyImages'
                            hidden
                            onChange={async (e) => {
                              setLoadingComponent((prev) => ({ ...prev, uploadFile: true }));
                              await onUploadImage(e);
                              setLoadingComponent((prev) => ({ ...prev, uploadFile: false }));
                            }}
                            multiple
                          />
                          <img
                            src='/assets/icon/upload-big-arrow.png'
                            width='24'
                            height='24'
                            alt=''
                          />
                          Tải hình lên
                        </>
                      ) : (
                        <div className='loader'></div>
                      )}
                    </label>
                  </div>
                  <div className='imgs-info__list '>
                    {watch('logInfo.images')?.map((img, index) => {
                      return (
                        <RenderImg
                          src={process.env.NEXT_PUBLIC_API_UPLOAD + img}
                          dataName='images'
                          index={index}
                          key={index}
                          showCloseBtn={true}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div> */}
          </form>
          <div className={`fee-config__footer`}>
            <div className='fee-config__footer-right mx-auto '>
              {/* <button
                className='btn btn-primary my-3 '
                onClick={() => {
                  handleSubmit((data, e) => {
                    e?.preventDefault();
                  })();
                  setIsSubmit(true);
                  setIsSubmitedButtonPressed(!isSubmitButtonPressed);
                }}>
                <i className='fas fa-save'></i>
                {t('Lưu thông tin')}
              </button> */}
            </div>
          </div>
        </div>
      )}
    </Collapse>
  );
};

export default FeeConfigMerchantProfile;
