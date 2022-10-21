import { WalletAppVersionType } from 'models';
import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getWalletVersion, updateWalletVersion } from 'redux/actions';
import { Input } from 'ui/Form';
import alert from 'utils/helpers/alert';

interface Props {
  show: boolean;
  isSDK?: boolean;
  onHide: (type?: string) => void;
}

interface WalletAppVersionTypeExtend {
  versions: WalletAppVersionType[];
}

const ModalUpdateConfigVersion: React.FC<Props> = ({ show, isSDK, onHide }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();

  const rules = {
    versionNotSupported: {
      required: true,
      maxLength: 12,
    },
    versionNewest: {
      required: true,
      maxLength: 12,
    },
    updateURL: {
      required: true,
    },
  };

  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
    handleSubmit,
    reset,
  } = useForm<WalletAppVersionTypeExtend>({
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
  });

  const handleSubmitFormVersion: SubmitHandler<WalletAppVersionTypeExtend> = (data, e) => {
    e?.preventDefault();
    let succeeded = 0;
    let message = '';

    data.versions.forEach((ver) => {
      delete ver.clientInfo.platform;
      delete ver.createdAt;
      delete ver.updatedAt;

      dispatch(
        updateWalletVersion(ver, (state, res) => {
          succeeded += +state;
          message = res?.message;
          !state && alert('error', t(res.message), t);
          if (succeeded === data.versions.length) {
            setTimeout(() => {
              reset();
            }, 500);
            onHide && onHide();
            alert('success', t(message), t);
          }
        })
      );
    });
  };

  useEffect(() => {
    show &&
      dispatch(
        getWalletVersion((status, res) => {
          if (status) setValue('versions', res?.data);
        })
      );
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={() => {
        reset();
        onHide && onHide();
      }}
      className='modal-system-config modal-version-config'
      backdrop='static'
      //keyboard={false}
      >
      <Modal.Header closeButton>
        {!isSDK ? t('Cập nhật phiên bản ứng dụng') : t('Cập nhật phiên bản SDK')}
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(handleSubmitFormVersion)}>
          <div className='version-group'>
            <div className='version-item'>
              <h4 className='version-item__title'>
                <img src='/assets/img/system-config/web-app.png' alt='icon-title' />
                {t('WEBSITE')}
              </h4>
              <div className='inputs-group version-item__form'>
                <Input
                  formGroupClassName={`${
                    errors?.versions &&
                    errors?.versions[isSDK ? 5 : 2]?.clientInfo?.versionNotSupported
                      ? 'input-custom-error'
                      : ''
                  }`}
                  errors={
                    errors?.versions &&
                    errors?.versions[isSDK ? 5 : 2]?.clientInfo?.versionNotSupported
                  }
                  type='text'
                  label={t('Phiên bản không còn hỗ trợ')}
                  register={register}
                  clearErrors={clearErrors}
                  placeholder={t('1.0.*')}
                  rules={rules.versionNotSupported}
                  name={`versions.${isSDK ? 5 : 2}.clientInfo.versionNotSupported`}
                />
                <Input
                  formGroupClassName={`${
                    errors?.versions && errors?.versions[isSDK ? 5 : 2]?.clientInfo?.versionNewest
                      ? 'input-custom-error'
                      : ''
                  }`}
                  type='text'
                  label={t('Phiên bản mới nhất')}
                  register={register}
                  clearErrors={clearErrors}
                  placeholder={t('1.0.*')}
                  rules={rules.versionNewest}
                  name={`versions.${isSDK ? 5 : 2}.clientInfo.versionNewest`}
                  errors={
                    errors?.versions && errors?.versions[isSDK ? 5 : 2]?.clientInfo?.versionNewest
                  }
                />
                <Input
                  formGroupClassName={`${
                    errors?.versions && errors?.versions[isSDK ? 5 : 2]?.updateURL
                      ? 'input-custom-error'
                      : ''
                  }`}
                  errors={errors?.versions && errors?.versions[isSDK ? 5 : 2]?.updateURL}
                  type='text'
                  label={t('Cập nhật đường dẫn')}
                  register={register}
                  clearErrors={clearErrors}
                  placeholder='https://*....'
                  rules={rules.updateURL}
                  name={`versions.${isSDK ? 5 : 2}.updateURL`}
                />
                <div
                  className={`form-group form-input-textarea ${false ? 'input-custom-error' : ''}`}
                  style={{ backgroundColor: 'rgba(184, 182, 182, 0.301)' }}>
                  <label>{t('Nội dung thông báo')}</label>
                  <textarea
                    className='input-textarea'
                    placeholder={t('Nhập thông báo')}
                    style={{ width: '100%', maxHeight: '250px', minHeight: '50px' }}
                    {...register(`versions.${isSDK ? 5 : 2}.updateTitle`)}
                  />
                </div>
              </div>
            </div>
            <div className='version-item'>
              <h4 className='version-item__title'>
                <img src='/assets/img/system-config/app-store.png' alt='icon-title' />
                {t('IOS')}
              </h4>
              <div className='inputs-group version-item__form'>
                <Input
                  formGroupClassName={`${
                    errors?.versions &&
                    errors?.versions[isSDK ? 3 : 0]?.clientInfo?.versionNotSupported
                      ? 'input-custom-error'
                      : ''
                  }`}
                  errors={
                    errors?.versions &&
                    errors?.versions[isSDK ? 3 : 0]?.clientInfo?.versionNotSupported
                  }
                  type='text'
                  label={t('Phiên bản không còn hỗ trợ')}
                  register={register}
                  clearErrors={clearErrors}
                  placeholder={t('1.0.*')}
                  rules={rules.versionNotSupported}
                  name={`versions.${isSDK ? 3 : 0}.clientInfo.versionNotSupported`}
                />
                <Input
                  formGroupClassName={`${
                    errors?.versions && errors?.versions[isSDK ? 3 : 0]?.clientInfo?.versionNewest
                      ? 'input-custom-error'
                      : ''
                  }`}
                  errors={
                    errors?.versions && errors?.versions[isSDK ? 3 : 0]?.clientInfo?.versionNewest
                  }
                  type='text'
                  label={t('Phiên bản mới nhất')}
                  register={register}
                  clearErrors={clearErrors}
                  placeholder={t('1.0.*')}
                  rules={rules.versionNewest}
                  name={`versions.${isSDK ? 3 : 0}.clientInfo.versionNewest`}
                />
                <Input
                  formGroupClassName={`${
                    errors?.versions && errors?.versions[isSDK ? 3 : 0]?.updateURL
                      ? 'input-custom-error'
                      : ''
                  }`}
                  errors={errors?.versions && errors?.versions[isSDK ? 3 : 0]?.updateURL}
                  type='text'
                  label={t('Cập nhật đường dẫn')}
                  register={register}
                  clearErrors={clearErrors}
                  placeholder='https://*....'
                  rules={rules.updateURL}
                  name={`versions.${isSDK ? 3 : 0}.updateURL`}
                />
                <div
                  className={`form-group form-input-textarea ${false ? 'input-custom-error' : ''}`}
                  style={{ backgroundColor: 'rgba(184, 182, 182, 0.301)' }}>
                  <label>{t('Nội dung thông báo')}</label>
                  <textarea
                    className='input-textarea'
                    placeholder={t('Nhập thông báo')}
                    style={{ width: '100%', maxHeight: '250px', minHeight: '50px' }}
                    {...register(`versions.${isSDK ? 3 : 0}.updateTitle`)}
                  />
                </div>
              </div>
            </div>
            <div className='version-item'>
              <h4 className='version-item__title'>
                <img src='/assets/img/system-config/play.png' alt='icon-title' />
                {t('ANDROID')}
              </h4>
              <div className='inputs-group version-item__form'>
                <Input
                  formGroupClassName={`${
                    errors?.versions &&
                    errors?.versions[isSDK ? 4 : 1]?.clientInfo?.versionNotSupported
                      ? 'input-custom-error'
                      : ''
                  }`}
                  errors={
                    errors?.versions &&
                    errors?.versions[isSDK ? 4 : 1]?.clientInfo?.versionNotSupported
                  }
                  type='text'
                  label={t('Phiên bản không còn hỗ trợ')}
                  register={register}
                  clearErrors={clearErrors}
                  placeholder={t('1.0.*')}
                  rules={rules.versionNotSupported}
                  name={`versions.${isSDK ? 4 : 1}.clientInfo.versionNotSupported`}
                />
                <Input
                  formGroupClassName={`${
                    errors?.versions && errors?.versions[isSDK ? 4 : 1]?.clientInfo?.versionNewest
                      ? 'input-custom-error'
                      : ''
                  }`}
                  errors={
                    errors?.versions && errors?.versions[isSDK ? 4 : 1]?.clientInfo?.versionNewest
                  }
                  type='text'
                  label={t('Phiên bản mới nhất')}
                  register={register}
                  clearErrors={clearErrors}
                  placeholder={t('1.0.*')}
                  rules={rules.versionNewest}
                  name={`versions.${isSDK ? 4 : 1}.clientInfo.versionNewest`}
                />
                <Input
                  formGroupClassName={`${
                    errors?.versions && errors?.versions[isSDK ? 4 : 1]?.updateURL
                      ? 'input-custom-error'
                      : ''
                  }`}
                  errors={errors?.versions && errors?.versions[isSDK ? 4 : 1]?.updateURL}
                  type='text'
                  label={t('Cập nhật đường dẫn')}
                  register={register}
                  clearErrors={clearErrors}
                  placeholder='https://*....'
                  rules={rules.updateURL}
                  name={`versions.${isSDK ? 4 : 1}.updateURL`}
                />
                <div
                  className={`form-group form-input-textarea ${false ? 'input-custom-error' : ''}`}
                  style={{ backgroundColor: 'rgba(184, 182, 182, 0.301)' }}>
                  <label>{t('Nội dung thông báo')}</label>
                  <textarea
                    className='input-textarea'
                    placeholder={t('Nhập thông báo')}
                    style={{ width: '100%', maxHeight: '250px', minHeight: '50px' }}
                    {...register(`versions.${isSDK ? 4 : 1}.updateTitle`)}
                  />
                </div>
              </div>
            </div>
          </div>
          <hr className='mt-0 mb-4' />
          <button className='btn btn-primary w-25 mx-auto'>
            <i className='fas fa-save'></i>
            {t('Cập nhật')}
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalUpdateConfigVersion;
