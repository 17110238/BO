import { WalletKYC } from 'models';
import React, { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StateModalUpdate } from '../../modals/ModalUpdateInfoKYCPayme';
import Swal from 'sweetalert2';
import { swalVideoCustom } from 'utils/helpers';
interface Props {
  kyc?: WalletKYC;
  form: UseFormReturn<WalletKYC>;
  textEmpty?: string;
  type: StateModalUpdate;
  onUploadImage?: React.ChangeEventHandler<HTMLInputElement>;
  onClickImage?: React.MouseEventHandler<HTMLImageElement>;
  onRemoveImage?: React.MouseEventHandler<HTMLElement>;
}

const ImageKYCPayme: React.FC<Props> = ({
  kyc,
  form,
  type,
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
            watch('image.front'),
            watch('image.back'),
            ...(kyc?.state === 'APPROVED' &&
            ['PENDING', 'APPROVED'].includes(kyc?.identifyIC?.state || '')
              ? [watch('identifyIC.front'), watch('identifyIC.back')]
              : []),
            watch('face.face'),
            ...(watch('merchant.lincenseImage') ?? []),
          ].map((img, index) => {
            if (!img) return <React.Fragment key={index}></React.Fragment>;
            if (img.split('.').includes('pdf'))
              return <React.Fragment key={index}></React.Fragment>;
            return (
              <li key={index}>
                <img src={renderImageSrc(img!, 'EMPTY')} onError={handleErrorImage} />
              </li>
            );
          })}
        </ul>
      </div>
      <div className='inputs-group-image'>
        <div className='form-group'>
          <label>{t('Hình ảnh định danh')}</label>
          <div className='d-flex'>
            <div className='d-flex align-items-center'>
              <div className='btn-upload'>
                {!watch('image.front') ? (
                  <label className='d-flex flex-column align-items-center m-0'>
                    <input
                      accept='image/*'
                      type='file'
                      data-title='image.front'
                      hidden
                      onChange={onUploadImage}
                    />
                    <i className='fas fa-cloud-upload-alt fa-2x'></i>
                    {t('Mặt trước')}
                  </label>
                ) : (
                  <>
                    <img
                      src={renderImageSrc(watch('image.front'))}
                      alt='front-kyc-img'
                      onError={handleErrorImage}
                    />
                    <i
                      data-title='image.front'
                      className='fas fa-times-circle fa-2x icon-remove'
                      onClick={onRemoveImage}></i>
                  </>
                )}
              </div>
              <div className='btn-upload'>
                {!watch('image.back') ? (
                  <label className='d-flex flex-column align-items-center m-0'>
                    <input
                      accept='image/*'
                      type='file'
                      data-title='image.back'
                      hidden
                      onChange={onUploadImage}
                    />
                    <i className='fas fa-cloud-upload-alt fa-2x'></i>
                    {t('Mặt sau')}
                  </label>
                ) : (
                  <>
                    <img
                      src={renderImageSrc(watch('image.back'))}
                      alt='front-kyc-img'
                      onError={handleErrorImage}
                    />
                    <i
                      data-title='image.back'
                      className='fas fa-times-circle fa-2x icon-remove'
                      onClick={onRemoveImage}></i>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {kyc?.state === 'APPROVED' &&
          ['PENDING', 'APPROVED'].includes(kyc?.identifyIC?.state || '') && (
            <div className='form-group'>
              <label>{t('Hình ảnh định danh IC')}</label>
              <div className='d-flex'>
                <div className='d-flex align-items-center'>
                  <div className='btn-upload'>
                    {!watch('identifyIC.front') ? (
                      <label className='d-flex flex-column align-items-center m-0'>
                        <input
                          accept='image/*'
                          type='file'
                          data-title='identifyIC.front'
                          hidden
                          onChange={onUploadImage}
                        />
                        <i className='fas fa-cloud-upload-alt fa-2x'></i>
                        {t('Mặt trước')}
                      </label>
                    ) : (
                      <>
                        <img
                          src={renderImageSrc(watch('identifyIC.front'))}
                          alt='front-kyc-img'
                          onError={handleErrorImage}
                        />
                        <i
                          data-title='identifyIC.front'
                          className='fas fa-times-circle fa-2x icon-remove'
                          onClick={onRemoveImage}></i>
                      </>
                    )}
                  </div>
                  <div className='btn-upload'>
                    {!watch('identifyIC.back') ? (
                      <label className='d-flex flex-column align-items-center m-0'>
                        <input
                          accept='image/*'
                          type='file'
                          data-title='identifyIC.back'
                          hidden
                          onChange={onUploadImage}
                        />
                        <i className='fas fa-cloud-upload-alt fa-2x'></i>
                        {t('Mặt sau')}
                      </label>
                    ) : (
                      <>
                        <img
                          src={renderImageSrc(watch('identifyIC.back'))}
                          alt='front-kyc-img'
                          onError={handleErrorImage}
                        />
                        <i
                          data-title='identifyIC.back'
                          className='fas fa-times-circle fa-2x icon-remove'
                          onClick={onRemoveImage}></i>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        <div className='form-group'>
          <label>{t('Hình ảnh khuôn mặt / video')}</label>
          <div className='d-flex'>
            <div className='d-flex align-items-center'>
              {type !== StateModalUpdate.UPDATE_ACCOUNT && (
                <div className='btn-upload'>
                  {!watch('face.face') ? (
                    <label className='d-flex flex-column align-items-center m-0'>
                      <input
                        accept='image/*'
                        type='file'
                        data-title='face.face'
                        hidden
                        onChange={onUploadImage}
                      />
                      <i className='fas fa-cloud-upload-alt fa-2x'></i>
                      {t('Tải ảnh')}
                    </label>
                  ) : (
                    <>
                      <img
                        src={renderImageSrc(watch('face.face'))}
                        alt='face-kyc-img'
                        onError={handleErrorImage}
                      />

                      <i
                        data-title='face.face'
                        className='fas fa-times-circle fa-2x icon-remove'
                        onClick={onRemoveImage}></i>
                    </>
                  )}
                </div>
              )}

              <div className='btn-upload'>
                {!watch('video.video') ? (
                  <label className='d-flex flex-column align-items-center m-0'>
                    <input
                      accept='video/*'
                      type='file'
                      data-title='video.video'
                      hidden
                      onChange={onUploadImage}
                    />
                    <i className='fas fa-cloud-upload-alt fa-2x'></i>
                    {t('Tải video')}
                  </label>
                ) : (
                  <>
                    <a
                      // href={process.env.NEXT_PUBLIC_API_UPLOAD + watch('video.video')}
                      //   target='_blank'
                      onClick={() => {
                        swalVideoCustom(renderImageSrc(watch('video.video'), 'EMPTY'));
                      }}>
                      <img src={'/assets/images/video-icon.png'} alt='video-kyc-img' />
                    </a>
                    <i
                      data-title='video.video'
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
                      data-title='merchant.lincenseImage'
                      hidden
                      onChange={onUploadImage}
                      multiple
                    />
                    <i className='fas fa-cloud-upload-alt fa-2x'></i>
                    {t('Tải ảnh')}
                  </label>
                </div>

                {watch('merchant.lincenseImage') && (
                  <div className='image-groups'>
                    {watch('merchant.lincenseImage')!.map((img, index) => {
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
                                data-title='merchant.lincenseImage'
                                onClick={onRemoveImage}></i>
                            </a>
                          ) : (
                            <>
                              <img src={src} onError={handleErrorImage} onClick={onClickImage} />
                              <i
                                className='icon-remove fa-lg fas fa-times-circle'
                                data-index={index}
                                data-title='merchant.lincenseImage'
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
