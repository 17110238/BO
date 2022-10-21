import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import ReactSelect from 'react-select';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { passwordTemporary } from 'redux/actions';
import { useDispatch } from 'react-redux';
import swal from 'sweetalert2';
interface Props {
  accountId: number | undefined;
  show: boolean | undefined;
  handleShow?: (() => void) | undefined;
  handleClose: (() => void) | undefined;
}

interface PasswordTemporary {
  expireAfterMinute: {
    value: number;
    label: string;
  };
  description: string;
}

const ModalPasswordTemporary: React.FC<Props> = ({ accountId, show, handleShow, handleClose }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [password, setPassword] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(true);
  const [dataTemporary, setDataTemporary] = useState<any>({})

  const {
    control,
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm<PasswordTemporary>({
    defaultValues: {
      expireAfterMinute: { value: 5, label: `${t('Expires in five minutes')}` },
      description: '',
    },
  });

  const onSubmit: SubmitHandler<PasswordTemporary> = (data, e) => {
    e?.preventDefault();
    // delete data.createdAt
    const dataUpdate = {
      ...data,
      accountId: Number(accountId),
      expireAfterMinute: data.expireAfterMinute?.value,
    };

    setDataTemporary(dataUpdate)

    dispatch(
      passwordTemporary(dataUpdate, (status, res) => {
        if (status) {
          setPassword(res?.password);
        } else {
          setPassword('');
        }
      })
    );
  };

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  }, [copied]);


  return (
    <Modal
      className='modal-account-mc'
      show={show}
      onHide={() => {
        handleClose && handleClose();
        setTimeout(() => {
          reset();
          setPassword('');
        }, 1000);
      }}>
      <Modal.Header closeButton>{t('Password temporary')}</Modal.Header>
      <Modal.Body>
        {!password ? (
          <form onSubmit={handleSubmit(onSubmit)} className='inputs-group'>
            <div className='form-group'>
              <label>
                {t('Expired time')}
                <span className='text-danger'> (*)</span>
              </label>
              <Controller
                control={control}
                name='expireAfterMinute'
                render={({ field }) => (
                  <ReactSelect
                    className='select-input-form'
                    classNamePrefix='input-select'
                    isSearchable={false}
                    onChange={(newValue) => field.onChange(newValue)}
                    options={[
                      { value: 5, label: `${t('Expires in five minutes')}` },
                      { value: 10, label: `${t('Expires in ten minutes')}` },
                      { value: 20, label: `${t('Expires in twenty minutes')}` },
                      { value: 30, label: `${t('Expires in thirty minutes')}` },
                      { value: 60, label: `${t('Expires in one hour')}` },
                    ]}
                    value={field.value}
                  />
                )}
              />
            </div>
            <div
              className={`form-group form-input-textarea ${
                errors?.description ? 'input-custom-error' : ''
              }`}
              style={{ backgroundColor: 'rgba(184, 182, 182, 0.301)' }}>
              <label>
                {/* {t('Expired time')} */}
                {t('Description')}
                <span className='text-danger'> (*)</span>
              </label>
              <textarea
                className='input-textarea'
                placeholder={t('Nhập mô tả')}
                style={{ width: '100%', maxHeight: '150px', minHeight: '80px' }}
                {...register('description', { 
                  required: `${t('Description is required')}`
              })}
              />
              {errors.description?.type === 'required' && (
                <p
                  className='mt-10 mb-0 txt-valid align-items-center'
                  style={{ lineHeight: '1.25' }}>
                  <i className='i-valid' />
                  {errors?.description?.message}
                </p>
              )}
            </div>
            <div
              className='btn-info-account-mc'
              style={{ display: 'flex', justifyContent: 'center' }}>
              <button className='btn btn-primary w-100 mt-3'>{t('Create')}</button>
            </div>
          </form>
        ) : (
          <div className='password-temporary'>
            <label>{t('Mật khẩu khởi tạo')}</label>
            <div className='password-temporary__main'>
              <CopyToClipboard
                onCopy={() => {
                  setCopied(true);
                  swal.fire({
                    toast: true,
                    showConfirmButton: false,
                    icon: 'success',
                    timer: 1200,
                    title: t('Copied'),
                    position: 'bottom-end',
                  });
                }}
                text={password}>
                <p className='password-temporary__text' style={{width: "100%"}}>{password}</p>
              </CopyToClipboard>
              {/* <button
                className='btn btn-light'
                onClick={() => {
                  // setPassword('');
                  reset();
                  dispatch(
                    passwordTemporary(dataTemporary, (status, res) => {
                      if (status) {
                        setPassword(res?.password);
                      } else {
                        setPassword('');
                      }
                    })
                  );
                }}>
                {t('Thay đổi')}
              </button> */}
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ModalPasswordTemporary;
