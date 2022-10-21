import { yupResolver } from '@hookform/resolvers/yup';
import { UpdateEwalletDepositBankBoInput } from 'models';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal, Col } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import alert from 'utils/helpers/alert';
import { updateDepositBank } from 'redux/actions/manualBankAction';
import callApiUPLOAD from 'api/UploadFiles';
import Loading from 'components/common/Loading/LoadingFullScreen';
interface Props {
  t: (a: string) => string;
  show: boolean;
  handleClose: () => void;
  handleRecall: (a: boolean) => void;
  fullName: string;
  number: string;
  city: string;
  branch: string;
  balance: number;
  bankId: number;
  bankName: string;
}

const UpdateBank: React.FC<Props> = ({
  t,
  show,
  handleClose,
  handleRecall,
  fullName,
  number,
  city,
  branch,
  bankId,
  balance,
  bankName,
}) => {
  const inputRef = useRef<any>(null);
  const dispatch = useDispatch();
  const schema = yup
    .object({
      fullName: yup.string().required(t('Giá trị này là bắt buộc.')),
      branch: yup.string().required(t('Giá trị này là bắt buộc.')),
    })
    .required();

  const [logo, setLogo] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const handleErrorImage: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const target = e.target as HTMLImageElement;

    target.src = '/assets/images/img-na.png';
    target.onerror = null;
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateEwalletDepositBankBoInput>({
    mode: 'all',
    resolver: yupResolver<yup.AnyObjectSchema>(schema),
  });

  useEffect(() => {
    inputRef?.current?.focus();
  }, [show]);

  const handleCloseModal = () => {
    handleClose();
    reset();
  };
  const onSubmit: SubmitHandler<UpdateEwalletDepositBankBoInput> = (data) => {
    const payload: any = {
      id: bankId,
      isActive: data.isActive,
      fullName: data.fullName,
      branch: data.branch,
      image: data.image,
    };
    for (let key in payload) {
      if (payload.hasOwnProperty(key)) {
        if (payload[key] === '' || payload[key] === undefined) {
          delete payload[key];
        }
      }
    }
    setLoading(true);
    dispatch(
      updateDepositBank(payload, (status, response) => {
        if (status) {
          alert('success', response?.message, t);
          handleRecall?.(true);
          reset();
        } else {
          alert('error', response?.message, t);
        }
        setLoading(false);
        handleCloseModal();
      })
    );
  };

  const handleUploadImage: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const formData = new FormData();
    const files = e.target.files;
    files && formData.append('files', files[0]);

    try {
      const { data: res } = await callApiUPLOAD(formData);
      setLogo(process.env.NEXT_PUBLIC_API_UPLOAD + res.data[0].path);
      setValue('image', process.env.NEXT_PUBLIC_API_UPLOAD + res.data[0].path);
    } catch (error) {
      alert('error', 'Error Upload File', t);
    }
  };

  useEffect(() => {
    setValue('fullName', fullName);
    setValue('branch', branch);
  }, [fullName, branch]);

  return (
    <Modal
      className='modal-bank-transaction-deposit-issue'
      show={show}
      onHide={handleCloseModal}
      backdrop='static'>
      <Modal.Body>
        <div className='title-modal-bank-transaction-deposit'>
          <p>{t('Cập nhật TK ngân hàng')}</p>
          <img
            src='/assets/img/icon-close-modal.svg'
            className='icon-close-modal icon-close'
            onClick={handleCloseModal}
            alt=''
          />
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className='form-group form-element-textarea mb-20'>
            <Form.Group as={Col} className='mt-4 d-flex' xl='12'>
              <Form.Label className='label-control with-label mt-1'>{t('Ngân hàng')}</Form.Label>
              <div className='flex-grow-1'>
                <Form.Control
                  className={`form-control mb-1 bg-light`}
                  placeholder={`${t('Enter')} ${t('Tên chủ TK')}`}
                  defaultValue={bankName}
                  disabled
                />
              </div>
            </Form.Group>

            <Form.Group as={Col} className='mt-4 d-flex align-items-center' xl='12'>
              <Form.Label className='label-control with-label'>Logo</Form.Label>
              <div className='d-flex align-items-center mt-2'>
                {!!logo ? (
                  <div className='img-box'>
                    <img
                      className='w-100 logo-issuer'
                      alt=''
                      src={logo}
                      onError={handleErrorImage}
                    />
                    <button
                      className='btn btn-remove-img'
                      onClick={() => {
                        setLogo('');
                        setValue('image', '');
                      }}>
                      <i className='fas fa-trash m-0'></i>
                    </button>
                  </div>
                ) : (
                  <label className='btn-upload d-flex flex-column'>
                    <i className='fas fa-cloud-upload-alt fa-2x'></i>
                    <input
                      accept='image/*'
                      type='file'
                      name='image'
                      className='d-none'
                      onChange={handleUploadImage}
                    />
                    <span>Tải ảnh</span>
                  </label>
                )}
              </div>
            </Form.Group>

            <Form.Group as={Col} className='mt-4 d-flex' xl='12'>
              <Form.Label className='label-control with-label mt-1'>{t('Tên chủ TK')}</Form.Label>
              <div className='flex-grow-1'>
                <Form.Control
                  className={`form-control mb-1`}
                  placeholder={`${t('Enter')} ${t('Tên chủ TK')}`}
                  {...register('fullName')}
                  defaultValue={fullName}
                />
                {errors?.fullName?.message && (
                  <p className='text-danger mt-1'>{errors.fullName.message}</p>
                )}
              </div>
            </Form.Group>

            <Form.Group as={Col} className='mt-4 d-flex align-items-center' xl='12'>
              <Form.Label className='label-control with-label'>{t('Số tài khoản')}</Form.Label>
              <div className='flex-grow-1'>
                <Form.Control
                  className={`form-control mb-1 bg-light`}
                  defaultValue={number}
                  disabled
                />
              </div>
            </Form.Group>

            <Form.Group as={Col} className='mt-4 d-flex align-items-center' xl='12'>
              <Form.Label className='label-control with-label'>
                {t('Tỉnh / Thành mở TK')}
              </Form.Label>
              <div className='flex-grow-1'>
                <Form.Control
                  className={`form-control mb-1 bg-light`}
                  defaultValue={city}
                  disabled
                />
              </div>
            </Form.Group>

            <Form.Group as={Col} className='mt-4 d-flex align-items-center' xl='12'>
              <Form.Label className='label-control with-label'>{t('Chi nhánh')}</Form.Label>
              <div className='flex-grow-1'>
                <Form.Control
                  className={`form-control mb-1`}
                  placeholder={`${t('Enter')} ${t('Chi nhánh')}`}
                  {...register('branch')}
                  defaultValue={branch}
                />
                {errors?.branch?.message && (
                  <p className='text-danger mt-1'>{errors.branch.message}</p>
                )}
              </div>
            </Form.Group>

            <Form.Group as={Col} className='mt-4 d-flex align-items-center' xl='12'>
              <Form.Label className='label-control with-label'>{t('Số dư')}</Form.Label>
              <div className='flex-grow-1'>
                <Form.Control
                  className={`form-control mb-1 bg-light`}
                  defaultValue={balance}
                  disabled
                />
              </div>
            </Form.Group>

            <Button type='submit' className='btn-bank-transaction-deposit mt-5' variant='primary'>
              {t('Lưu giao dịch')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
      {isLoading && <Loading />}
    </Modal>
  );
};

export default UpdateBank;
