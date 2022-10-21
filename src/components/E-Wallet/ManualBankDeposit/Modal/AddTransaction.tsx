import { yupResolver } from '@hookform/resolvers/yup';
import { CreateEwalletPaymentBoInput, ListAccountBankSearch } from 'models';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal, Col } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import alert from 'utils/helpers/alert';
import numeral from 'numeral';
import { createBankTransferTransaction } from 'redux/actions/manualBankAction';
import Loading from 'components/Login/shared/Loading';
interface Props {
  t: (a: string) => string;
  show: boolean;
  handleClose: () => void;
  handleRecall?: (a: boolean) => void;
  listAccountBank: any[];
}

const AddTransaction: React.FC<Props> = ({
  t,
  show,
  handleClose,
  handleRecall,
  listAccountBank,
}) => {
  const inputRef = useRef<any>(null);
  const dispatch = useDispatch();
  const schema = yup
    .object({
      amount: yup.string().required(t('Giá trị này là bắt buộc.')),
      bankTransaction: yup.string().required(t('Giá trị này là bắt buộc.')),
      description: yup.string().required(t('Giá trị này là bắt buộc.')),
      phone: yup.string().required(t('Giá trị này là bắt buộc.')),
    })
    .required();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateEwalletPaymentBoInput>({
    mode: 'onBlur',
    resolver: yupResolver<yup.AnyObjectSchema>(schema),
  });

  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    inputRef?.current?.focus();
  }, [show]);

  const handleCloseModal = () => {
    handleClose();
    reset();
  };
  const justNumbers = (string: any) => {
    var numsStr = string.replace(/\D/g, '');
    return parseInt(numsStr);
  };

  const onSubmit: SubmitHandler<CreateEwalletPaymentBoInput> = (data) => {
    const payload = {
      bankId: data.bankId,
      amount: justNumbers(data.amount),
      bankTransaction: data.bankTransaction,
      description: data.description,
      phone: data.phone,
    };
    setLoading(true);
    dispatch(
      createBankTransferTransaction(payload, (status, response) => {
        if (status) {
          alert('success', response?.message, t);
          handleRecall?.(true);
        } else {
          alert('error', response?.message, t);
        }
        setLoading(false);
        handleCloseModal();
      })
    );
  };

  const allowOnlyNumber = (value: string) => {
    return value.replace(/[^0-9]/g, '');
  };

  const handleOnlyEnterNumber = (event: any) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <Modal
      className='modal-bank-transaction-deposit-issue'
      show={show}
      onHide={handleCloseModal}
      backdrop='static'>
      <Modal.Body>
        {isLoading && <Loading />}
        <div className='title-modal-bank-transaction-deposit'>
          <p>{t('Thêm GD Chuyển khoản Ngân hàng')}</p>
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
                name={'bankId'}
                defaultValue={listAccountBank[0]?.value}
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
                        defaultValue={listAccountBank[0]}
                        theme={(theme) => ({
                          ...theme,
                          borderRadius: 0,
                          colors: {
                            ...theme.colors,
                            primary25: '#EFF2F7',
                            primary: '#00be00',
                          },
                        })}
                        options={listAccountBank}
                        value={listAccountBank.find((val: any) => val.value === value)}
                        onChange={(e: SingleValue<any>) => {
                          onChange(e.value);
                        }}
                      />
                      {errors?.bankId?.message && (
                        <p className='text-danger mt-1'>{errors.bankId.message}</p>
                      )}
                    </div>
                  </div>
                )}
              />
            </Form.Group>

            <Form.Group as={Col} className='mt-4 d-flex align-items-center' xl='12'>
              <Form.Label className='label-control with-label'>{t('bankTransaction')}</Form.Label>
              <div className='flex-grow-1'>
                <Form.Control
                  className={`form-control mb-1`}
                  placeholder={`${t('Enter')} ${t('Mã GD ngân hàng').toLowerCase()}`}
                  {...register('bankTransaction')}
                />
                {errors?.bankTransaction?.message && (
                  <p className='text-danger mt-1'>{errors.bankTransaction.message}</p>
                )}
              </div>
            </Form.Group>

            <Form.Group as={Col} className='mt-4 d-flex' xl='12'>
              <Form.Label className='label-control with-label mt-1'>{t('Nội Dung CK')}</Form.Label>
              <div className='flex-grow-1'>
                <Form.Control
                  as='textarea'
                  className={`form-control mb-1`}
                  placeholder={`${t('Enter')} ${t('Nội Dung CK').toLowerCase()}`}
                  {...register('description')}
                />
                {errors?.description?.message && (
                  <p className='text-danger mt-1'>{errors.description.message}</p>
                )}
              </div>
            </Form.Group>

            <Form.Group as={Col} className='mt-4 d-flex align-items-center' xl='12'>
              <Form.Label className='label-control with-label'>{t('Số tiền')}</Form.Label>
              <div className='flex-grow-1'>
                <Controller
                  control={control}
                  name='amount'
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Form.Control
                      {...register('amount')}
                      className='mb-1'
                      maxLength={12}
                      placeholder={`${t('Enter')} ${t('Số tiền').toLowerCase()}`}
                      onChange={(e) => {
                        onChange(+allowOnlyNumber(e.target.value));
                      }}
                      value={value ? numeral(value).format('0,0') : ''}
                    />
                  )}
                />
                {errors?.amount?.message && (
                  <p className='text-danger mt-1'>{errors.amount.message}</p>
                )}
              </div>
            </Form.Group>

            <Form.Group as={Col} className='mt-4 d-flex align-items-center' xl='12'>
              <Form.Label className='label-control with-label'>{t('TK nhận (phone)')}</Form.Label>
              <div className='flex-grow-1'>
                <Form.Control
                  className={`form-control mb-1`}
                  placeholder={`${t('Enter')} ${t('username or phone number to receive')}`}
                  {...register('phone')}
                  maxLength={11}
                  onKeyPress={(event: any) => {
                    handleOnlyEnterNumber(event);
                  }}
                />
                {errors?.phone?.message && (
                  <p className='text-danger mt-1'>{errors.phone.message}</p>
                )}
              </div>
            </Form.Group>

            <Button type='submit' className='btn-bank-transaction-deposit mt-5' variant='primary'>
              {t('Lưu giao dịch')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddTransaction;
