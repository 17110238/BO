import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import alert from 'utils/helpers/alert';
import { CreateCardInput } from 'models/lockedCards/lockedCardsState';
import { lockedCard } from 'redux/actions/lockedCardActions';
import { useDispatch } from 'react-redux';
import { BankType, typeEnumCard } from 'models';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import i18next, { t } from 'i18next';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
interface Props {
  t: (a: string) => string;
  show: boolean;
  handleClose: () => void;
  setSubmitForm: (a: boolean) => void;
}

const cardOptions = [
  {
    label: 'ATM',
    value: 'ATM',
  },
  {
    label: t('Tín dụng quốc tế'),
    value: 'CREDIT_INTERNATIONAL',
  },
  {
    label: t('Tín dụng trong nước'),
    value: 'CREDIT_DOMESTIC',
  },
];

const ModalLockCard = ({ handleClose, show, t, setSubmitForm }: Props) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    getValues,
    setValue,
    clearErrors,
    setFocus,
  } = useForm<any>({
    mode: 'onSubmit',
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [numberCard, setNumberCard] = useState<string>('ATM');
  const [listBank, setListBank] = useState<BankType[]>([]);

  const onSubmit: SubmitHandler<any> = (data) => {
    const payload: CreateCardInput = {
      cardNumber: numberCard === 'ATM' ? data.cardNumber : data.numberFirst6 + data.numberEnd4,
      cardName: data.cardName,
      type: data.type,
      swiftCode: data.swiftCode,
      state: isOpen ? typeEnumCard.OPEN : typeEnumCard.LOCKED,
    };
    !data.swiftCode && delete payload.swiftCode;
    setIsLoading(true);
    dispatch(
      lockedCard(payload, (status, res) => {
        if (status) {
          alert('success', res);
          setSubmitForm && setSubmitForm(true);
          onClose();
        } else {
          alert('error', res);
        }
        setIsLoading(false);
      })
    );
  };

  const onClose = () => {
    reset();
    handleClose();
    setNumberCard('ATM');
  };

  const handleCheckBox = () => {
    setIsOpen(!isOpen);
  };

  const handleChangeCard = (value: any) => {
    setNumberCard(value);
  };

  const allowOnlyNumber = (value: string) => {
    return value.replace(/[^0-9]/g, '');
  };

  return (
    <Modal className='modal-lock-card' show={show} backdrop='static' enforceFocus={false}>
      <Modal.Body>
        <div className='modal-lock-card__title pb-2 border-bottom'>
          <p>{t('Khóa thẻ')}</p>
          <img
            src='/assets/img/icon-close-modal.svg'
            className='icon-close-modal icon-close'
            onClick={onClose}
            alt='close icon'
          />
        </div>

        <Form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <div className=''>
            <Form.Label className='font-weight-bold'>{t('Loại thẻ')}</Form.Label>
            <Form.Group>
              <Controller
                control={control}
                name={'type'}
                defaultValue={cardOptions[0].value}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <ReactSelect
                    styles={{
                      ...customStyles,
                      menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                      menu: (provided) => ({ ...provided, zIndex: 2 }),
                    }}
                    defaultValue={cardOptions[0]}
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: '#EFF2F7',
                        primary: '#00be00',
                      },
                    })}
                    noOptionsMessage={() => {
                      return i18next.language === 'en' ? 'No options' : 'Không có kết quả tìm kiếm';
                    }}
                    options={cardOptions}
                    value={cardOptions.find((val) => val.value === value)}
                    onChange={(e: any) => {
                      onChange(e.value), handleChangeCard(e.value);
                    }}
                  />
                )}
              />
            </Form.Group>
          </div>
          {numberCard === 'ATM' ? (
            <div className='mb-3'>
              <Form.Label className='font-weight-bold'>{t('Số thẻ')}</Form.Label>
              <Controller
                control={control}
                name='cardNumber'
                rules={{ required: 'Số thẻ không được rỗng' }}
                render={({ field: { onChange, value } }) => (
                  <input
                    {...register('cardNumber')}
                    className='mb-1 form-control base-input text-left'
                    maxLength={19}
                    placeholder={`${t('Enter')} ${
                      t('Số thẻ').charAt(0).toLocaleLowerCase() + t('Số thẻ').slice(1)
                    }`}
                    onChange={(e) => {
                      onChange(allowOnlyNumber(e.target.value));
                    }}
                    value={value}
                  />
                )}
              />
              {errors?.cardNumber && (
                <p className='mt-1 mb-1 txt-valid'>
                  <i className='i-valid' />
                  {errors?.cardNumber?.message}
                </p>
              )}
            </div>
          ) : (
            <div className='mb-3 d-flex flex-column'>
              <Form.Label className='font-weight-bold'>{t('Số thẻ')}</Form.Label>
              <div className='d-flex align-items-center'>
                <Controller
                  control={control}
                  name='numberFirst6'
                  rules={{ required: '6 số đầu không được rỗng' }}
                  render={({ field: { onChange, value } }) => (
                    <input
                      {...register('numberFirst6')}
                      className={`mb-1 form-control base-input ${
                        errors?.numberFirst6 ? ' border border-warning' : ''
                      }`}
                      maxLength={6}
                      minLength={6}
                      placeholder={`${t('Enter')} ${
                        t('6 số đầu').charAt(0).toLocaleLowerCase() + t('6 số đầu').slice(1)
                      }`}
                      onChange={(e) => {
                        onChange(allowOnlyNumber(e.target.value));
                      }}
                      value={value}
                    />
                  )}
                />
                <span className='text-nowrap px-2 font-weight-bold'>X-X</span>
                <Controller
                  control={control}
                  name='numberEnd4'
                  rules={{ required: '4 số cuối không được rỗng' }}
                  render={({ field: { onChange, value } }) => (
                    <input
                      {...register('numberEnd4')}
                      className={`mb-1 form-control base-input ${
                        errors?.numberEnd4 ? ' border border-warning' : ''
                      }`}
                      maxLength={4}
                      minLength={4}
                      placeholder={`${t('Enter')} ${
                        t('4 số cuối').charAt(0).toLocaleLowerCase() + t('4 số cuối').slice(1)
                      }`}
                      onChange={(e) => {
                        onChange(allowOnlyNumber(e.target.value));
                      }}
                      value={value}
                    />
                  )}
                />
              </div>
            </div>
          )}

          <div className='mb-3'>
            <Form.Label className='font-weight-bold'>{t('Tên chủ thẻ')}</Form.Label>
            <Form.Control
              className='text-left'
              placeholder={`${t('Enter')} ${
                t('Tên chủ thẻ').charAt(0).toLocaleLowerCase() + t('Tên chủ thẻ').slice(1)
              }`}
              {...register('cardName', { required: 'Tên chủ thẻ không được rỗng' })}
            />
            {errors?.cardName && (
              <p className='mt-1 mb-1 txt-valid'>
                <i className='i-valid' />
                {errors?.cardName?.message}
              </p>
            )}
          </div>

          {numberCard === 'ATM' && (
            <div className='mb-3'>
              <Form.Label className='font-weight-bold'>SwiftCode</Form.Label>
              <Form.Control
                className='text-left'
                type='text'
                placeholder={`${t('Enter')} SwiftCode`}
                {...register('swiftCode')}
              />
            </div>
          )}

          <div className='mb-2'>
            <Form.Label className='font-weight-bold'>{t('Trạng thái')}</Form.Label>
            <div className='text-right'>
              <label className='switch'>
                <input type='checkbox' checked={isOpen} readOnly onClick={() => handleCheckBox()} />
                <span className='slider'></span>
              </label>
            </div>
          </div>

          <div className='btn-group mt-4'>
            <Button type='submit' className='btn-submit btn' variant='primary'>
              {t('Đồng ý')}
            </Button>
          </div>
        </Form>
        {isLoading && <LoadingFullScreen />}
      </Modal.Body>
    </Modal>
  );
};

export default ModalLockCard;
