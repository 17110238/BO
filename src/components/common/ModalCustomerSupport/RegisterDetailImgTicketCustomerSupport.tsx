import callApiUPLOAD from 'api/UploadFiles';
import { RegisterImgCustomerSupportDetailInput } from 'models/customerSuport/customerSuport';
import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import {
  Control, UseFormClearErrors,
  UseFormRegister,
  UseFormResetField, UseFormReturn, UseFormSetValue
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import alert from 'utils/helpers/alert';
import Viewer from 'viewerjs';

interface Props {
  formImgInfo?: UseFormReturn<any>;
  register: UseFormRegister<any>;
  setValues: UseFormSetValue<any>;
  control: Control<any>;
  errors: any;
  resetField: UseFormResetField<any>;
  clearError: UseFormClearErrors<any>;
  dataImg?: string[] | any;
}

const RegisterImgTicketCustomerSuport: React.FC<Props> = ({
  register,
  setValues,
  control,
  errors,
  resetField,
  clearError,
  dataImg,
}) => {
  const { t } = useTranslation('common');
  const viewer = useRef<any>();
  const [img, setImg] = useState<string>('');
  const [identifyImages, setIdentifyImages] = useState<string[]>([]);
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

  useEffect(() => {
    if (dataImg.length > 0) {
      setIdentifyImages(dataImg);
    }
  }, [dataImg]);

  useEffect(() => {
    viewer.current && viewer.current.update();
  }, [img]);

  const handlePreviewImg = (e: MouseEvent<HTMLDivElement>, row?: any) => {
    viewer.current && viewer.current.show();
    const target = e.target as HTMLDivElement;
    setImg(row);
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
      const updateImage: RegisterImgCustomerSupportDetailInput = {};
      if (res.code === 1000) {
        switch (name) {
          case 'otherImages':
            updateImage.attachImages = [
              ...(identifyImages || []),
              ...res.data.map((info: { path: string }) => info.path),
            ];
            setIdentifyImages(updateImage.attachImages);
            setValues('otherImages', updateImage.attachImages);
            clearError('otherImages');
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
    const updateImage: RegisterImgCustomerSupportDetailInput = {};
    e.stopPropagation();
    switch (name) {
      case 'attachImages': {
        identifyImages.splice(index, 1);
        setIdentifyImages([...identifyImages]);
        setValues('otherImages', [...identifyImages]);
        break;
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
      <div className='preview-identity-img d-none ' style={{ zIndex: '10000' }}>
        <img src={img} alt='' />
      </div>
      <div className='inputs-group-image'>
        <span>{t('File đính kèm')}</span>
        <div className='form-group' style={{ paddingLeft: '0px' }}>
          <label>{t('Hình ảnh')}</label>
          <div className='d-flex'>
            <div className='d-flex align-items-center'>
              <label
                className={`btn-upload ${
                  errors?.businessDetails?.identifyImages ? 'btn-upload-error' : ''
                }`}>
                <i className='fas fa-cloud-upload-alt fa-2x'></i>
                <input
                  {...register('otherImages')}
                  accept='image/*'
                  type='file'
                  name='otherImages'
                  hidden
                  onChange={handleUploadImage}
                  multiple
                />
                {t('Tải ảnh')}
              </label>
            </div>
            <div className='image-groups'>
              {identifyImages?.map((img, index) => {
                return (
                  <div
                    className='row-img-preview'
                    data-index={index}
                    key={index}
                    onClick={(e) =>
                      handlePreviewImg(
                        e,
                        img.startsWith('http') ? img : process.env.NEXT_PUBLIC_API_UPLOAD + img
                      )
                    }>
                    <img
                      src={img.startsWith('http') ? img : process.env.NEXT_PUBLIC_API_UPLOAD + img}
                      alt='img-kyc'
                      onError={handleErrorImage}
                    />

                    <i
                      className='icon-remove fa-lg fas fa-times-circle'
                      data-index={index}
                      data-name='attachImages'
                      onClick={handleRemoveImage}></i>
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

export default RegisterImgTicketCustomerSuport;
