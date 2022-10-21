import { VersionType } from 'models';
import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getVersionApp, updateConfigVersion } from 'redux/actions';
import { Input } from 'ui/Form';
import alert from 'utils/helpers/alert';

interface Props {
  show: boolean;
  onHide: (type?: string) => void;
}

interface VersionExtendType {
  versions: VersionType[];
}

const ModalUpdateConfigVersion: React.FC<Props> = ({ show, onHide }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();

  const versions = useSelector<any, VersionType[]>((state) => state.versionReducer.versions);
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
  } = useForm<VersionExtendType>({
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
  });

  const handleSubmitFormVersion: SubmitHandler<VersionExtendType> = (data, e) => {
    e?.preventDefault();

    let succeeded = 0;
    let message = '';

    data.versions.forEach((ver) => {
      delete ver?.clientInfo?.platform;
      delete ver.createdAt;
      delete ver.updatedAt;

      dispatch(
        updateConfigVersion(ver, (state, res) => {
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
        getVersionApp((state, res) => {
          state && setValue('versions', res.data);
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
      <Modal.Header closeButton>{t('Cập nhật phiên bản ứng dụng')}</Modal.Header>
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
                    errors?.versions && errors?.versions[2]?.clientInfo?.versionNotSupported
                      ? 'input-custom-error'
                      : ''
                  }`}
                  type='text'
                  label={t('Phiên bản không còn hỗ trợ')}
                  register={register}
                  errors={errors?.versions && errors?.versions[2]?.clientInfo?.versionNotSupported}
                  clearErrors={clearErrors}
                  placeholder={t('1.0.*')}
                  rules={rules.versionNotSupported}
                  name='versions.2.clientInfo.versionNotSupported'
                />
                <Input
                  formGroupClassName={`${
                    errors?.versions && errors?.versions[2]?.clientInfo?.versionNewest
                      ? 'input-custom-error'
                      : ''
                  }`}
                  type='text'
                  label={t('Phiên bản mới nhất')}
                  register={register}
                  errors={errors?.versions && errors?.versions[2]?.clientInfo?.versionNewest}
                  clearErrors={clearErrors}
                  placeholder={t('1.0.*')}
                  rules={rules.versionNewest}
                  name='versions.2.clientInfo.versionNewest'
                />
                <Input
                  formGroupClassName={`${
                    errors?.versions && errors?.versions[2]?.updateURL ? 'input-custom-error' : ''
                  }`}
                  type='text'
                  label={t('Cập nhật đường dẫn')}
                  register={register}
                  errors={errors?.versions && errors?.versions[2]?.updateURL}
                  clearErrors={clearErrors}
                  placeholder='https://*....'
                  rules={rules.updateURL}
                  name='versions.2.updateURL'
                />
                <div
                  className={`form-group form-input-textarea ${false ? 'input-custom-error' : ''}`}
                  style={{ backgroundColor: 'rgba(184, 182, 182, 0.301)' }}>
                  <label>{t('Nội dung thông báo')}</label>
                  <textarea
                    className='input-textarea'
                    placeholder={t('Nhập thông báo')}
                    style={{ width: '100%', maxHeight: '250px', minHeight: '50px' }}
                    {...register('versions.2.updateTitle')}
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
                    errors?.versions && errors?.versions[0]?.clientInfo?.versionNotSupported
                      ? 'input-custom-error'
                      : ''
                  }`}
                  type='text'
                  label={t('Phiên bản không còn hỗ trợ')}
                  register={register}
                  errors={errors?.versions && errors?.versions[0]?.clientInfo?.versionNotSupported}
                  clearErrors={clearErrors}
                  placeholder={t('1.0.*')}
                  rules={rules.versionNotSupported}
                  name='versions.0.clientInfo.versionNotSupported'
                />
                <Input
                  formGroupClassName={`${
                    errors?.versions && errors?.versions[0]?.clientInfo?.versionNewest
                      ? 'input-custom-error'
                      : ''
                  }`}
                  type='text'
                  label={t('Phiên bản mới nhất')}
                  register={register}
                  errors={errors?.versions && errors?.versions[0]?.clientInfo?.versionNewest}
                  clearErrors={clearErrors}
                  placeholder={t('1.0.*')}
                  rules={rules.versionNewest}
                  name='versions.0.clientInfo.versionNewest'
                />
                <Input
                  formGroupClassName={`${
                    errors?.versions && errors?.versions[0]?.updateURL ? 'input-custom-error' : ''
                  }`}
                  type='text'
                  label={t('Cập nhật đường dẫn')}
                  register={register}
                  errors={errors?.versions && errors?.versions[0]?.updateURL}
                  clearErrors={clearErrors}
                  placeholder='https://*....'
                  rules={rules.updateURL}
                  name='versions.0.updateURL'
                />
                <div
                  className={`form-group form-input-textarea ${false ? 'input-custom-error' : ''}`}
                  style={{ backgroundColor: 'rgba(184, 182, 182, 0.301)' }}>
                  <label>{t('Nội dung thông báo')}</label>
                  <textarea
                    className='input-textarea'
                    placeholder={t('Nhập thông báo')}
                    style={{ width: '100%', maxHeight: '250px', minHeight: '50px' }}
                    {...register('versions.0.updateTitle')}
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
                    errors?.versions && errors?.versions[1]?.clientInfo?.versionNotSupported
                      ? 'input-custom-error'
                      : ''
                  }`}
                  type='text'
                  label={t('Phiên bản không còn hỗ trợ')}
                  register={register}
                  errors={errors?.versions && errors?.versions[1]?.clientInfo?.versionNotSupported}
                  clearErrors={clearErrors}
                  placeholder={t('1.0.*')}
                  rules={rules.versionNotSupported}
                  name='versions.1.clientInfo.versionNotSupported'
                />
                <Input
                  formGroupClassName={`${
                    errors?.versions && errors?.versions[1]?.clientInfo?.versionNewest
                      ? 'input-custom-error'
                      : ''
                  }`}
                  type='text'
                  label={t('Phiên bản mới nhất')}
                  register={register}
                  errors={errors?.versions && errors?.versions[1]?.clientInfo?.versionNewest}
                  clearErrors={clearErrors}
                  placeholder={t('1.0.*')}
                  rules={rules.versionNewest}
                  name='versions.1.clientInfo.versionNewest'
                />
                <Input
                  formGroupClassName={`${
                    errors?.versions && errors?.versions[1]?.updateURL ? 'input-custom-error' : ''
                  }`}
                  type='text'
                  label={t('Cập nhật đường dẫn')}
                  register={register}
                  errors={errors?.versions && errors?.versions[1]?.updateURL}
                  clearErrors={clearErrors}
                  placeholder='https://*....'
                  rules={rules.updateURL}
                  name='versions.1.updateURL'
                />
                <div
                  className={`form-group form-input-textarea ${false ? 'input-custom-error' : ''}`}
                  style={{ backgroundColor: 'rgba(184, 182, 182, 0.301)' }}>
                  <label>{t('Nội dung thông báo')}</label>
                  <textarea
                    className='input-textarea'
                    placeholder={t('Nhập thông báo')}
                    style={{ width: '100%', maxHeight: '250px', minHeight: '50px' }}
                    {...register('versions.1.updateTitle')}
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
