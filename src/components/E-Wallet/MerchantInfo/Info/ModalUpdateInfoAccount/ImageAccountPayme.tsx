import { EwalletAccount } from 'models/merchantInfo/merchantInfoState';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { swalVideoCustom } from 'utils/helpers';

interface Props {
  account?: EwalletAccount;
  form: UseFormReturn<EwalletAccount>;
  textEmpty?: string;
  onUploadImage?: React.ChangeEventHandler<HTMLInputElement>;
  onClickImage?: React.MouseEventHandler<HTMLImageElement>;
  onRemoveImage?: React.MouseEventHandler<HTMLElement>;
}

const ImageKYCPayme: React.FC<Props> = ({
  account,
  form,
  textEmpty = '[Hiện đang trống]',
  onUploadImage,
  onClickImage,
  onRemoveImage,
}) => {
  const { t } = useTranslation('common');
  const { watch } = form;
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

  return (
    <div className='image-kyc-payme'>
      <div className='inputs-group'>
        <ul className='merchant-imgs-preview'>
          {[
            ...(watch('kyc.kycMerchant.lincenseImage') ?? []),
            watch('kyc.image.back'),
            watch('kyc.image.front'),
            watch('kyc.face.face'),
          ].map((img, index) => {
            if (!img) return <React.Fragment key={index}></React.Fragment>;
            if (img.split('.').includes('pdf'))
              return <React.Fragment key={index}></React.Fragment>;
            return (
              <li key={index}>
                <img
                  src={renderImageSrc(img,'EMPTY')}
                  onError={handleErrorImage}
                />
              </li>
            );
          })}
        </ul>
      </div>
      <div className='inputs-group-image'>
        <div className='form-group'>
          <label>{t('Hình ảnh KYC')}</label>
          <div className='d-flex'>
            <div className='d-flex align-items-center'>
              <div className='btn-upload'>
                {!watch('kyc.image.front') ? (
                  <label className='d-flex flex-column align-items-center m-0'>
                    <input
                      accept='image/*'
                      type='file'
                      data-title='kyc.image.front'
                      hidden
                      onChange={onUploadImage}
                    />
                    <i className='fas fa-cloud-upload-alt fa-2x'></i>
                    {t('Mặt trước')}
                  </label>
                ) : (
                  <>
                    <img
                      src={renderImageSrc(watch('kyc.image.front'))}
                      alt='front-kyc-img'
                      onError={handleErrorImage}
                    />
                    <i
                      data-title='kyc.image.front'
                      className='fas fa-times-circle fa-2x icon-remove'
                      onClick={onRemoveImage}></i>
                  </>
                )}
              </div>
              <div className='btn-upload'>
                {!watch('kyc.image.back') ? (
                  <label className='d-flex flex-column align-items-center m-0'>
                    <input
                      accept='image/*'
                      type='file'
                      data-title='kyc.image.back'
                      hidden
                      onChange={onUploadImage}
                    />
                    <i className='fas fa-cloud-upload-alt fa-2x'></i>
                    {t('Mặt sau')}
                  </label>
                ) : (
                  <>
                    <img
                      src={renderImageSrc(watch('kyc.image.back') )}
                      alt='front-kyc-img'
                      onError={handleErrorImage}
                    />
                    <i
                      data-title='kyc.image.back'
                      className='fas fa-times-circle fa-2x icon-remove'
                      onClick={onRemoveImage}></i>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='form-group'>
          <label>{t('Hình ảnh khuôn mặt/video')}</label>
          <div className='d-flex'>
            <div className='d-flex align-items-center'>
              <div className='btn-upload'>
                {!watch('kyc.face.face') ? (
                  <label className='d-flex flex-column align-items-center m-0'>
                    <input
                      accept='image/*'
                      type='file'
                      data-title='kyc.face.face'
                      hidden
                      onChange={onUploadImage}
                    />
                    <i className='fas fa-cloud-upload-alt fa-2x'></i>
                    {t('Tải ảnh')}
                  </label>
                ) : (
                  <>
                    <img
                      src={renderImageSrc (watch('kyc.face.face')) }
                      onError={handleErrorImage}
                      onClick={onClickImage} alt='video-kyc-img' />
                    <i
                      data-title='kyc.face.face'
                      className='fas fa-times-circle fa-2x icon-remove'
                      onClick={onRemoveImage}></i>
                  </>
                )}
              </div>

              <div className='btn-upload'>
                {!watch('kyc.video.video') ? (
                  <label className='d-flex flex-column align-items-center m-0'>
                    <input
                      accept='video/*'
                      type='file'
                      data-title='kyc.video.video'
                      hidden
                      onChange={onUploadImage}
                    />
                    <i className='fas fa-cloud-upload-alt fa-2x'></i>
                    {t('Tải video')}
                  </label>
                ) : (
                  <>
                    <a
                      // href={process.env.NEXT_PUBLIC_API_UPLOAD + watch('kyc.video.video')}
                      //   target='_blank'
                      onClick={() => {
                        swalVideoCustom(
                          renderImageSrc(watch('kyc.video.video'),"VIDEO") 
                        );
                      }}>
                      <img src={'/assets/images/video-icon.png'} alt='video-kyc-img' />
                    </a>
                    <i
                      data-title='kyc.video.video'
                      className='fas fa-times-circle fa-2x icon-remove'
                      onClick={onRemoveImage}></i>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {watch('accountType') === 'BUSINESS' && (
          <div className='form-group'>
            <label>{t('Giấy phép kinh doanh')}</label>
            <div className='d-flex'>
              <div className='d-flex align-items-center'>
                <div className='btn-upload'>
                  <label className='d-flex flex-column align-items-center m-0'>
                    <input
                      accept='image/*, application/pdf'
                      type='file'
                      data-title='kyc.kycMerchant.lincenseImage'
                      hidden
                      onChange={onUploadImage}
                      multiple
                    />
                    <i className='fas fa-cloud-upload-alt fa-2x'></i>
                    {t('Tải ảnh')}
                  </label>
                </div>

                {watch('kyc.kycMerchant.lincenseImage') && (
                  <div className='image-groups'>
                    {watch('kyc.kycMerchant.lincenseImage')!.map((img, index) => {
                      let isPdf = img?.toLowerCase().split('.').includes('pdf');
                      const src = `${process.env.NEXT_PUBLIC_API_UPLOAD}${img}`;
                      return (
                        <div className='row-img-preview' key={index}>
                          {isPdf ? (
                            <a href={src} target='_blank' className='pl-2'>
                              <img style={{ width: 'unset' }} src='/assets/img/pdf-icon.png' />
                              <i
                                className='icon-remove fa-lg fas fa-times-circle'
                                data-index={index}
                                data-title='kyc.kycMerchant.lincenseImage'
                                onClick={onRemoveImage}></i>
                            </a>
                          ) : (
                            <>
                              <img src={src} onError={handleErrorImage} onClick={onClickImage} />
                              <i
                                className='icon-remove fa-lg fas fa-times-circle'
                                data-index={index}
                                data-title='kyc.kycMerchant.lincenseImage'
                                onClick={onRemoveImage}></i>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageKYCPayme;
