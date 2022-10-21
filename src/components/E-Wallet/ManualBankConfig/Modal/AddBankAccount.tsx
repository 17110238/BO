import { yupResolver } from '@hookform/resolvers/yup';
import { CreateDepositBankInput, DepositBankType } from 'models';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal, Col } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import Loading from 'components/common/Loading/LoadingFullScreen';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import alert from 'utils/helpers/alert';
import { createDepositBank } from 'redux/actions/manualBankAction';
import callApiUPLOAD from 'api/UploadFiles';
import { getSubLocationList } from 'redux/actions';
interface Props {
  t: (a: string) => string;
  show: boolean;
  handleClose: () => void;
  handleRecall: (a: boolean) => void;
  listDepositBank: Array<DepositBankType>;
}

const AddBankAccount: React.FC<Props> = ({
  t,
  show,
  handleClose,
  handleRecall,
  listDepositBank,
}) => {
  const inputRef = useRef<any>(null);
  const dispatch = useDispatch();
  const schema = yup
    .object({
      fullName: yup.string().required(t('Giá trị này là bắt buộc.')),
      number: yup.string().required(t('Giá trị này là bắt buộc.')),
      branch: yup.string().required(t('Giá trị này là bắt buộc.')),
    })
    .required();

  const [logo, setLogo] = useState<string>('');
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
  } = useForm<CreateDepositBankInput>({
    mode: 'all',
    resolver: yupResolver<yup.AnyObjectSchema>(schema),
  });

  useEffect(() => {
    inputRef?.current?.focus();
  }, [show]);

  const [bankOptions, setBankOptions] = useState<any>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    listDepositBank.map((bank: any) => {
      let obj: any = {};
      obj.label = bank.bankName;
      obj.value = bank.swiftCode;
      bankOptions.push(obj);
    });
  }, [listDepositBank]);

  const handleCloseModal = () => {
    handleClose();
  };
  const onSubmit: SubmitHandler<CreateDepositBankInput> = (data) => {
    const payload = {
      swiftCode: data.swiftCode,
      image: data.image,
      fullName: data.fullName,
      number: data.number,
      city: data.city,
      branch: data.branch,
    };
    setLoading(true);
    dispatch(
      createDepositBank(payload, (status, response) => {
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

  const [cityOptions, setCityOptions] = useState<any>([]);
  useEffect(() => {
    const payload = {};
    dispatch(
      getSubLocationList(payload, (state, locations) => {
        if (state) {
          locations?.data.map((location: any) => {
            let obj: any = {};
            obj.label = location.title;
            obj.value = location.identifyCode;
            cityOptions.push(obj);
          });
        }
      })
    );
  }, []);

  return (
    <Modal
      className='modal-bank-transaction-deposit-issue'
      show={show}
      onHide={handleCloseModal}
      backdrop='static'>
      <Modal.Body>
        <div className='title-modal-bank-transaction-deposit'>
          <p>{t('Thêm TK ngân hàng')}</p>
          <img
            src='/assets/img/icon-close-modal.svg'
            className='icon-close-modal icon-close'
            onClick={handleCloseModal}
            alt=''
          />
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className='form-group form-element-textarea mb-20'>
            <Form.Group as={Col} className='mt-4' xl='12'>
              <Controller
                control={control}
                name={'swiftCode'}
                defaultValue={bankOptions[0]?.value}
                rules={{ required: true }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <div className='d-flex align-items-center'>
                    <Form.Label className='mt-2 with-label'>{t('Ngân hàng')}</Form.Label>
                    <div className='flex-grow-1'>
                      <ReactSelect
                        styles={{
                          ...customStyles,
                          menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                          menu: (provided) => ({ ...provided, zIndex: 2 }),
                        }}
                        defaultValue={bankOptions[0]}
                        theme={(theme) => ({
                          ...theme,
                          borderRadius: 0,
                          colors: {
                            ...theme.colors,
                            primary25: '#EFF2F7',
                            primary: '#00be00',
                          },
                        })}
                        options={bankOptions}
                        value={bankOptions.find((val: any) => val.value === value)}
                        onChange={(e: SingleValue<any>) => {
                          onChange(e.value);
                        }}
                      />
                    </div>
                  </div>
                )}
              />
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
                    <span className='mt-2'>{t('Tải ảnh')}</span>
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
                  className={`form-control mb-1`}
                  placeholder={`${t('Enter')} ${t('Số tài khoản')}`}
                  {...register('number')}
                />
                {errors?.number?.message && (
                  <p className='text-danger mt-1'>{errors.number.message}</p>
                )}
              </div>
            </Form.Group>

            <Form.Group as={Col} className='mt-4' xl='12'>
              <Controller
                control={control}
                name={'city'}
                defaultValue={cityOptions[0]?.value}
                rules={{ required: true }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <div className='d-flex align-items-center'>
                    <Form.Label className='mt-2 with-label'>{t('Ngân hàng')}</Form.Label>
                    <div className='flex-grow-1'>
                      <ReactSelect
                        styles={{
                          ...customStyles,
                          menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                          menu: (provided) => ({ ...provided, zIndex: 2 }),
                        }}
                        defaultValue={cityOptions[0]}
                        theme={(theme) => ({
                          ...theme,
                          borderRadius: 0,
                          colors: {
                            ...theme.colors,
                            primary25: '#EFF2F7',
                            primary: '#00be00',
                          },
                        })}
                        options={cityOptions}
                        value={cityOptions.find((val: any) => val.value === value)}
                        onChange={(e: SingleValue<any>) => {
                          onChange(e.value);
                        }}
                      />
                    </div>
                  </div>
                )}
              />
            </Form.Group>

            <Form.Group as={Col} className='mt-4 d-flex align-items-center' xl='12'>
              <Form.Label className='label-control with-label'>{t('Chi nhánh')}</Form.Label>
              <div className='flex-grow-1'>
                <Form.Control
                  className={`form-control mb-1`}
                  placeholder={`${t('Enter')} ${t('Chi nhánh')}`}
                  {...register('branch')}
                />
                {errors?.branch?.message && (
                  <p className='text-danger mt-1'>{errors.branch.message}</p>
                )}
              </div>
            </Form.Group>

            <Button type='submit' className='btn-bank-transaction-deposit mt-5' variant='primary'>
              {t('Lưu tài khoản')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
      {isLoading && <Loading />}
    </Modal>
  );
};

export default AddBankAccount;
