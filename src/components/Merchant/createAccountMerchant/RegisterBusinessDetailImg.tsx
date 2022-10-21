import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import alert from 'utils/helpers/alert';
import callApiUPLOAD from 'api/UploadFiles';
import { BusinessDetailsType, CreateMerchantInput, RegisterBusinessDetailInput } from 'models';
import Viewer from 'viewerjs';
import {
  Control,
  Controller,
  UseFormClearErrors,
  UseFormRegister,
  UseFormResetField,
  UseFormSetValue,
  UseFormWatch,
  UseFormReturn,
} from 'react-hook-form';
import { register } from 'numeral';

interface Props {
  formImgInfo: UseFormReturn<CreateMerchantInput>;
  register: UseFormRegister<CreateMerchantInput>;
  setValues: UseFormSetValue<CreateMerchantInput>;
  control: Control<CreateMerchantInput>;
  errors: any;
  resetField: UseFormResetField<CreateMerchantInput>;
  clearError: UseFormClearErrors<CreateMerchantInput>;
}

const RegisterBusinessDetailImg: React.FC<Props> = ({
  formImgInfo,
  register,
  setValues,
  control,
  errors,
  resetField,
  clearError
}) => {
  const { t } = useTranslation('common');
  const viewer = useRef<any>();
  const [identifyImages, setIdentifyImages] = useState<string[]>([]);
  const [licenseImages, setLicenseImages] = useState<string[]>([]);
  const [contracts, setContracts] = useState<string[]>([]);
  const [img, setImg] = useState<string>('')

  useEffect(() => {
    const previewBlock = document.querySelector('.preview-identity-img') as HTMLElement;
    viewer.current = new Viewer(previewBlock, {
      zIndex: 10000,
      title: false,
      button: false,
      toolbar: {
        zoomIn: 1,
        zoomOut: 1,
        oneToOne: 1,
        reset: 1,
        prev: 0,
        play: 0,
        next: 0,
        rotateLeft: 1,
        rotateRight: 1,
        flipHorizontal: 1,
        flipVertical: 1,
      },
    });
    return () => {
      viewer.current && viewer.current.hide();
    };
  }, []);

  //update show image by viewerjs
  useEffect(() => {
    viewer.current && viewer.current.update();
  }, [img]);

  const {
    control: controlImgInfo,
    register: registerImgInfo,
    setValue: setValueImgInfo,
    getValues: getValueImgInfo,
    clearErrors: clearErrorsImgInfo,
    handleSubmit: handleSubmitImgInfo,
    formState: { errors: errorsImgInfo },
  } = formImgInfo;

  const handlePreviewImg = (e: MouseEvent<HTMLDivElement>, row?: any) => {
    viewer.current && viewer.current.show();
    
    const target = e.target as HTMLDivElement;
    // const index = Number(target?.getAttribute('data-index'));

    setImg(row)
  };


  const handleUploadImage: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const files = e.target.files;
    const name = e.target.name;

    if (!files?.length) return;

    const formData = new FormData();

    for (const file of files) {
      formData.append('files', file);
    }

    try {
      const { data: res } = await callApiUPLOAD(formData);
      const updateImage: RegisterBusinessDetailInput = {};
      if (res.code === 1000) {
        switch (name) {
          case 'businessDetails.identifyImages':
            updateImage.identifyImages = [
              ...(identifyImages || []),
              ...res.data.map((info: { path: string }) => info.path),
            ];
            setIdentifyImages(updateImage.identifyImages);
            setValues('businessDetails.identifyImages', updateImage.identifyImages);
            clearError('businessDetails.identifyImages');
            break;
          case 'businessDetails.licenseImages':
            updateImage.licenseImages = [
              ...(licenseImages || []),
              ...res.data.map((info: { path: string }) => info.path),
            ];
            setLicenseImages(updateImage.licenseImages);
            setValues('businessDetails.licenseImages', updateImage.licenseImages);
            clearError('businessDetails.licenseImages');
            break;
          case 'businessDetails.contracts':
            updateImage.contracts = [
              ...(contracts || []),
              ...res.data.map((info: { path: string }) => info.path),
            ];
            setContracts(updateImage.contracts);
            setValues('businessDetails.contracts', updateImage.contracts);
            // resetField('businessDetails.contracts')
            // clearError('businessDetails.contracts')
            break;
          default:
            break;
        }
      }
    } catch (err) {
      alert('error', 'Error Upload File', t);
    }
  };

  const handleRemoveImage: React.MouseEventHandler<HTMLElement> = (e) => {
    
    const target = e.target as HTMLElement;
    const name = target.getAttribute('data-name');
    const index = +(target.getAttribute('data-index') || -1);

    const updateImage: RegisterBusinessDetailInput = {};
    e.stopPropagation()
    switch (name) {
      case 'identifyImages': {
        identifyImages.splice(index, 1);
        setIdentifyImages([...identifyImages]);
        setValues('businessDetails.identifyImages', []);
        break;
      }
      case 'licenseImages': {
        licenseImages.splice(index, 1);
        setLicenseImages([...licenseImages]);
        setValues('businessDetails.licenseImages', []);
        break;
      }
      case 'contracts': {
        contracts.splice(index, 1);
        setContracts([...contracts]);
        setValues('businessDetails.contracts', []);
      }
      default:
        break;
    }
  };

  const handleErrorImage: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const target = e.target as HTMLImageElement;
    target.src = '/assets/images/img-na.png';
    target.onerror = null;
  };

  

  return (
    <>
      <div className='preview-identity-img d-none ' style={{zIndex : '10000'}}>
        <img src={img} alt="" />
      </div>
      <div className='inputs-group-image'>
        <span>{t('Hồ sơ lưu trữ')}</span>
        <div className='form-group' style={{ paddingLeft: '0px' }}>
          <label>
            {t('Hình ảnh KYC')}
            <span className='text-danger'> (*)</span>
          </label>
          <div className='d-flex'>
            <div className='d-flex align-items-center'>
              <label
                className={`btn-upload ${
                  errors?.businessDetails?.identifyImages ? 'btn-upload-error' : ''
                }`}>
                <i className='fas fa-cloud-upload-alt fa-2x'></i>
                <input
                  {...register('businessDetails.identifyImages')}
                  accept='image/*'
                  type='file'
                  name='businessDetails.identifyImages'
                  hidden
                  onChange={handleUploadImage}
                  multiple
                />
                {t('Tải ảnh')}
              </label>
            </div>
            <div className='image-groups' style={{ width: '270px' }}>
              {identifyImages?.map((img, index) => {
                return (
                  <div
                    className='row-img-preview'
                    data-index={index}
                    key={index}
                    onClick={(e) => handlePreviewImg(e,process.env.NEXT_PUBLIC_API_UPLOAD + img )}>
                    <img
                      src={process.env.NEXT_PUBLIC_API_UPLOAD + img}
                      alt='img-kyc'
                      onError={handleErrorImage}
                    />
                    {identifyImages && identifyImages?.length > 0 ? (
                      <i
                        className='icon-remove fa-lg fas fa-times-circle'
                        data-index={index}
                        data-name='identifyImages'
                        onClick={handleRemoveImage}></i>
                    ) : (
                      <></>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className='form-group' style={{ paddingLeft: '0px' }}>
          <label>
            {t('Hình ảnh giấy phép KD')}
            <span className='text-danger'> (*)</span>
          </label>
          <div className='d-flex'>
            <div className='d-flex align-items-center'>
              <label
                className={`btn-upload ${
                  errors?.businessDetails?.licenseImages ? 'btn-upload-error' : ''
                }`}>
                <i className='fas fa-cloud-upload-alt fa-2x'></i>
                <input
                  {...register('businessDetails.licenseImages')}
                  accept='image/*'
                  type='file'
                  name='businessDetails.licenseImages'
                  hidden
                  onChange={handleUploadImage}
                  multiple
                />
                {t('Tải ảnh')}
              </label>
            </div>
            <div className='image-groups' style={{ width: '270px' }}>
              {licenseImages?.map((img, index) => {
                return (
                  <div
                    className='row-img-preview'
                    data-index={index}
                    key={index}
                    onClick={(e) => handlePreviewImg(e, process.env.NEXT_PUBLIC_API_UPLOAD + img)}>
                    <img
                      src={process.env.NEXT_PUBLIC_API_UPLOAD + img}
                      alt='img-hdkd'
                      onError={handleErrorImage}
                    />
                    {licenseImages && licenseImages?.length > 0 ? (
                      <i
                        className='icon-remove fa-lg fas fa-times-circle'
                        data-index={index}
                        data-name='licenseImages'
                        onClick={handleRemoveImage}></i>
                    ) : (
                      <></>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className='form-group' style={{ paddingLeft: '0px' }}>
          <label>
            {t('Hợp đồng')}
            <span className='text-danger'> (*)</span>
          </label>
          <div className='d-flex'>
            <div className='d-flex align-items-center'>
              <label
                className={`btn-upload ${
                  errors.businessDetails?.contracts ? 'btn-upload-error' : ''
                }`}>
                <i className='fas fa-cloud-upload-alt fa-2x'></i>
                <input
                  {...register('businessDetails.contracts')}
                  type='file'
                  accept='application/pdf, image/*'
                  // name='contracts'
                  hidden
                  onChange={handleUploadImage}
                />
                {t('Tải ảnh')}
              </label>
            </div>
            <div className='image-groups' style={{ width: '250px' }}>
              {contracts?.map((img, index) => {
                let isPdf = img?.toLowerCase().split('.').includes('pdf');
                const src = `${process.env.NEXT_PUBLIC_API_UPLOAD}${img}`;
                return (
                  <div className='row-img-preview' key={index}>
                    {isPdf ? (
                      <a href={src} target='_blank' className='pl-2'>
                        <img style={{ width: 'unset' }} src='/assets/img/pdf-icon.png' />
                        {contracts && contracts?.length > 0 ? (
                          <i
                            className='icon-remove fa-lg fas fa-times-circle'
                            data-index={index}
                            data-name='contracts'
                            onClick={handleRemoveImage}></i>
                        ) : (
                          <></>
                        )}
                      </a>
                    ) : (
                      <>
                        <img src={src} />
                        {contracts && contracts.length > 0 ? (
                          <i
                            className='icon-remove fa-lg fas fa-times-circle'
                            data-index={index}
                            data-name='contracts'
                            onClick={handleRemoveImage}></i>
                        ) : (
                          <></>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterBusinessDetailImg;
