import { MerchantAccount } from 'models';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { LoadingUpdateType } from '../BodyMerchantProfile';

interface Props {
  hideBtnUpload?: boolean;
  hidePreviewInlineImgs?: boolean;
  hideTitle?: boolean;
  textEmpty?: string;
  merchantType?: string;
  loading?: LoadingUpdateType;
  form: UseFormReturn<MerchantAccount>;
  onClickImage?: React.MouseEventHandler<HTMLImageElement>;
  onUploadImage: React.ChangeEventHandler<HTMLInputElement>;
  onRemoveImage: React.MouseEventHandler<HTMLElement>;
}

const ImageProfileMerchant: React.FC<Props> = ({
  onUploadImage,
  onRemoveImage,
  onClickImage,
  hidePreviewInlineImgs = false,
  hideBtnUpload = false,
  hideTitle = false,
  textEmpty = '',
  loading,
  form,
  merchantType,
}) => {
  const { t } = useTranslation('common');
  const { watch } = form;
  const profile = useSelector<any, MerchantAccount>((state) => state.merchantRD.merchantProfile);
  const handleErrorImage: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const target = e.target as HTMLImageElement;

    target.src = '/assets/images/img-na.png';
    target.onerror = null;
  };

  const isEnterpriseType =
    (merchantType && merchantType === 'ENTERPRISE') ||
    (!merchantType && watch('businessOverview.type') === 'ENTERPRISE');

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

  return (
    <div className='image-profile-merchant'>
      {!hidePreviewInlineImgs && (
        <div className='inputs-group viewer-preview' style={{ marginBottom: '2rem' }}>
          <ul className='merchant-imgs-preview'>
            {[
              ...(watch('businessDetails.identifyImages') || []),
              ...(watch('businessDetails.licenseImages') || []),
              ...(watch('businessDetails.otherImages') || []),
            ].map((img, index) => {
              const imgType = img.split('.').at(-1)?.toUpperCase() || 'PDF';
              const noAcceptType = ['PDF', 'MOV', 'MP3', 'DOC', 'DOCX'];
              if (noAcceptType.includes(imgType)) return;
              return (
                <li key={index}>
                  <img src={process.env.NEXT_PUBLIC_API_UPLOAD + img} onError={handleErrorImage} />
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <div
        className={`inputs-group-image inputs-group-v2 ${
          profile.state === 'APPROVED' ? 'pt-0 inputs-group-image--none-preview' : ''
        }`}>
        {!hideTitle && <p className='inputs-group-v2__title'>{t('Hồ sơ lưu trữ')}</p>}
        <div className={`form-group active ${profile.state !== 'APPROVED' ? 'flex-full' : ''}`}>
          <label>
            {t('Hình ảnh định danh')}
            {/* <span className='text-danger'> (*)</span> */}
          </label>
          <div className='inputs-group-image__imgs-info'>
            {/* <div className={`imgs-info__upload-img `}>
              {!hideBtnUpload && (
                <label className='upload-img__btn'>
                  {!loading?.identifyImages ? (
                    <>
                      <input
                        accept='image/*'
                        type='file'
                        name='identifyImages'
                        hidden
                        onChange={onUploadImage}
                        multiple
                      />
                      <img src='/assets/icon/upload-big-arrow.png' width='24' height='24' alt='' />
                      Tải hình lên
                    </>
                  ) : (
                    <div className='loader'></div>
                  )}
                </label>
              )}
            </div> */}
            <div className='imgs-info__list '>
              {watch('businessDetails.identifyImages')?.map((img, index) => {
                return (
                  <RenderImg
                    src={process.env.NEXT_PUBLIC_API_UPLOAD + img}
                    dataName='identifyImages'
                    index={index}
                    key={index}
                    showCloseBtn={
                      // !!(
                      //   watch('businessDetails.identifyImages') &&
                      //   (watch('businessDetails.identifyImages') || [])?.length > 1
                      // )
                      false
                    }
                  />
                );
              })}
            </div>
          </div>
          {/* <div className='d-flex'>
            {!hideBtnUpload && (
              <div className='d-flex align-items-center'>
                <label className='btn-upload'>
                  <i className='fas fa-cloud-upload-alt fa-2x'></i>
                  <input
                    accept='image/*'
                    type='file'
                    name='identifyImages'
                    hidden
                    onChange={onUploadImage}
                    multiple
                  />
                  {t('Tải ảnh')}
                </label>
              </div>
            )}
            {textEmpty && !watch('businessDetails.'identifyImages')?.length && <p>{textEmpty}</p>}
            <div className='image-groups'>
              {watch('businessDetails.'identifyImages')?.map((img, index) => {
                return (
                  <RenderImg
                    src={process.env.NEXT_PUBLIC_API_UPLOAD + img}
                    dataName='identifyImages'
                    index={index}
                    key={index}
                    showCloseBtn={
                      !!(
                        watch('businessDetails.'identifyImages') &&
                        watch('businessDetails.'identifyImages').length > 1
                      )
                    }
                  />
                );
              })}
            </div>
          </div> */}
        </div>
        <div className={`form-group active ${profile.state !== 'APPROVED' ? 'flex-full' : ''}`}>
          <label>{t('Hợp đồng')}</label>
          <div className='inputs-group-image__imgs-info'>
            {/* <div className={`imgs-info__upload-img `}>
              {!hideBtnUpload && (
                <label className='upload-img__btn'>
                  {!loading?.merchantContract ? (
                    <>
                      <input
                        type='file'
                        accept='application/pdf, image/*'
                        name='merchantContract'
                        hidden
                        onChange={onUploadImage}
                      />
                      <img src='/assets/icon/upload-big-arrow.png' width='24' height='24' alt='' />
                      Tải hình lên
                    </>
                  ) : (
                    <div className='loader'></div>
                  )}
                </label>
              )}
            </div> */}
            <div className='imgs-info__list '>
              {watch('businessDetails.merchantContract') && (
                <RenderImg
                  src={
                    process.env.NEXT_PUBLIC_API_UPLOAD +
                    (watch('businessDetails.merchantContract.url') || '/')
                  }
                  index={0}
                  dataName='merchantContract'
                  key={0}
                  showCloseBtn={false}
                />
              )}
            </div>
          </div>
          {/* <div className='d-flex'>
            {!hideBtnUpload && (
              <div className='d-flex align-items-center'>
                <label className='btn-upload'>
                  <i className='fas fa-cloud-upload-alt fa-2x'></i>
                  <input
                    type='file'
                    accept='application/pdf, image/*'
                    name='contractImages'
                    hidden
                    onChange={onUploadImage}
                  />
                  {t('Tải ảnh')}
                </label>
              </div>
            )}
            {((textEmpty &&
              watch('businessDetails.'merchantContract') &&
              !Object.keys(watch('businessDetails.'merchantContract')).length) ||
              !watch('businessDetails.'merchantContract')) && <p>{textEmpty}</p>}
            {watch('businessDetails.'merchantContract') && (
              <div className='image-groups'>
                <RenderImg
                  src={
                    process.env.NEXT_PUBLIC_API_UPLOAD +
                    (watch('businessDetails.'merchantContract')?.url || '/')
                  }
                  dataName='merchantContract'
                  key={0}
                  showCloseBtn={false}
                />
              </div>
            )}
          </div> */}
        </div>
        {isEnterpriseType && (
          <>
            <div className={`form-group active ${profile.state !== 'APPROVED' ? 'flex-full' : ''}`}>
              <label>
                {t('Giấy CN ĐKKD')}
                {/* <span> (*)</span> */}
              </label>
              <div className='inputs-group-image__imgs-info'>
                {/* <div className={`imgs-info__upload-img `}>
                  {!hideBtnUpload && (
                    <label className='upload-img__btn'>
                      {!loading?.licenseImages ? (
                        <>
                          <input
                            accept='image/*, application/msword, application/pdf'
                            type='file'
                            name='licenseImages'
                            hidden
                            multiple
                            onChange={onUploadImage}
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
                  )}
                </div> */}
                <div className='imgs-info__list '>
                  {watch('businessDetails.licenseImages')?.map((img, index) => (
                    <RenderImg
                      src={process.env.NEXT_PUBLIC_API_UPLOAD + img}
                      dataName='licenseImages'
                      index={index}
                      key={index}
                      showCloseBtn={
                        // !!(
                        //   watch('businessDetails.licenseImages') &&
                        //   (watch('businessDetails.licenseImages') || [])?.length > 1
                        // )
                        false
                      }
                    />
                  ))}
                </div>
              </div>
              {/* <div className='d-flex'>
                {!hideBtnUpload && (
                  <div className='d-flex align-items-center'>
                    <label className='btn-upload'>
                      <i className='fas fa-cloud-upload-alt fa-2x'></i>
                      <input
                        accept='image/*, application/msword, application/pdf'
                        type='file'
                        name='licenseImages'
                        hidden
                        multiple
                        onChange={onUploadImage}
                      />
                      {t('Tải lên')}
                    </label>
                  </div>
                )}
                {textEmpty && !watch('businessDetails.'licenseImages')?.length && (
                  <p>{textEmpty}</p>
                )}
                <div className='image-groups'>
                  {watch('businessDetails.'licenseImages')?.map((img, index) => (
                    <RenderImg
                      src={process.env.NEXT_PUBLIC_API_UPLOAD + img}
                      dataName='licenseImages'
                      index={index}
                      key={index}
                      showCloseBtn={
                        !!(
                          watch('businessDetails.'licenseImages') &&
                          watch('businessDetails.'licenseImages').length > 1
                        )
                      }
                    />
                  ))}
                </div>
              </div> */}
            </div>
            <div className={`form-group active ${profile.state !== 'APPROVED' ? 'flex-full' : ''}`}>
              <label>{t('Giấy tờ khác')}</label>
              <div className='inputs-group-image__imgs-info'>
                <div className={`imgs-info__upload-img `}>
                  {!hideBtnUpload && (
                    <label className='upload-img__btn'>
                      {!loading?.otherImages ? (
                        <>
                          <input
                            type='file'
                            accept='application/pdf, image/*'
                            name='otherImages'
                            hidden
                            onChange={onUploadImage}
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
                  )}
                </div>
                <div className='imgs-info__list '>
                  {watch('businessDetails.otherImages')?.map((img, index) => {
                    return (
                      <RenderImg
                        src={process.env.NEXT_PUBLIC_API_UPLOAD + img}
                        dataName='otherImages'
                        index={index}
                        key={index}
                        showCloseBtn={
                          !!(
                            watch('businessDetails.otherImages') &&
                            (watch('businessDetails.otherImages') || [])?.length > 1
                          )
                        }
                      />
                    );
                  })}
                </div>
              </div>
              {/* <div className='d-flex'>
                {!hideBtnUpload && (
                  <div className='d-flex align-items-center'>
                    <label className='btn-upload'>
                      <i className='fas fa-cloud-upload-alt fa-2x'></i>
                      <input
                        type='file'
                        accept='application/pdf, image/*'
                        name='otherImages'
                        hidden
                        onChange={onUploadImage}
                      />
                      {t('Tải ảnh')}
                    </label>
                  </div>
                )}
                {textEmpty && !watch('businessDetails.'otherImages')?.length && <p>{textEmpty}</p>}
                {watch('businessDetails.'otherImages') && (
                  <div className='image-groups'>
                    {watch('businessDetails.'otherImages')?.map((img, index) => {
                      return (
                        <RenderImg
                          src={process.env.NEXT_PUBLIC_API_UPLOAD + img}
                          dataName='otherImages'
                          key={index}
                          showCloseBtn={
                            !!(
                              watch('businessDetails.'otherImages') &&
                              watch('businessDetails.'otherImages')?.length > 1
                            )
                          }
                        />
                      );
                    })}
                  </div>
                )}
              </div> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageProfileMerchant;
