import dayjs from 'dayjs';
import { PayloadDisableSettlement } from 'models';
import numeral from 'numeral';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import MaskedInput from 'react-maskedinput';
import { useDispatch } from 'react-redux';
import { Input } from 'ui/Form';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { mailDisableSettlement } from 'redux/actions';
import alert from 'utils/helpers/alert';
dayjs.extend(isSameOrAfter);
interface CalendarStateType {
  calenderDateFrom: boolean;
  calenderDateTo: boolean;
}

interface Props {
  show: boolean;
  merchantId?: string;
  onHide: () => void;
}

export default function ModalMailDisableSettlement({ show, onHide, merchantId }: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation('common');

  const [calenderState, setCalenderState] = useState<CalendarStateType>({
    calenderDateFrom: false,
    calenderDateTo: false,
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    clearErrors,
    setError,
    resetField,
    control,
  } = useForm<PayloadDisableSettlement>({
    shouldFocusError: false,
    reValidateMode: 'onSubmit',
  });

  const convertField = (data: Date, type: string = 'FROM') => {
    switch (type) {
      case 'FROM':
        return dayjs(data).utc().format();

      case 'TO':
        return dayjs(data).endOf('minute').utc().format();

      default:
        return dayjs();
        break;
    }
  };

  const handleCloseCalender = (type: string) => {
    switch (type) {
      case 'DATE_FROM':
        setCalenderState({
          ...calenderState,
          calenderDateFrom: false,
        });
        break;

      case 'DATE_TO':
        setCalenderState({
          ...calenderState,
          calenderDateTo: false,
        });
        break;

      default:
        break;
    }
  };

  const handleOpenCalender = (type: string) => {
    switch (type) {
      case 'DATE_FROM':
        setCalenderState({
          ...calenderState,
          calenderDateFrom: !calenderState.calenderDateFrom,
        });
        break;

      case 'DATE_TO':
        setCalenderState({
          ...calenderState,
          calenderDateTo: !calenderState.calenderDateTo,
        });
        break;

      default:
        break;
    }
  };

  const handelSendConstract: SubmitHandler<PayloadDisableSettlement> = (data, e) => {
    e?.preventDefault();

    if (dayjs(data.startDay).isSameOrAfter(dayjs(data.endDay))) {
      setError('startDay', {
        type: 'max',
        message: `Ngày bắt đầu phải nhỏ hơn ngày kết thúc`,
      });
      return;
    }

    dispatch(
      mailDisableSettlement(
        {
          ...data,
          merchantId: +merchantId!,
        },
        (state, res) => {
          alert(state ? 'success' : 'error', res?.message, t);
          reset();
          onHide && onHide();
        }
      )
    );
  };

  useEffect(() => {
    if (show) {
      resetField('dateNumber');
    }
  }, [show]);

  return (
    <>
      <Modal
        className='modal-basic-ui'
        show={show}
        onHide={() => {
          onHide && onHide();
          reset();
        }}>
        <Modal.Header closeButton>
          <p>
            Tạm ngừng đối soát <span className='highlist--strong'>#ID: {merchantId}</span>
          </p>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(handelSendConstract)} className='inputs-group p-0'>
            <div className={`form-group ${errors?.startDay?.type ? 'input-custom-error' : ''}`}>
              <label>
                {t('Từ ngày')}
                <span className='text-danger'> (*)</span>
              </label>
              <div className='input-calendar'>
                <Controller
                  control={control}
                  name='startDay'
                  rules={{ required: true }}
                  render={({ field }) => (
                    <ReactDatePicker
                      placeholderText='DD/MM/YYYY HH:mm'
                      locale={'en'}
                      onChange={(e: Date) => {
                        field.onChange(e && convertField(e));
                        clearErrors('startDay');
                      }}
                      selected={field.value ? new Date(field.value) : null}
                      dateFormat='dd/MM/yyyy HH:mm'
                      peekNextMonth
                      showTimeInput
                      customInput={
                        <MaskedInput mask='11/11/1111 11:11' placeholder='dd/MM/yyyy HH:mm' />
                      }
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode='select'
                      open={calenderState.calenderDateFrom}
                      onSelect={() => handleCloseCalender('DATE_FROM')}
                      onClickOutside={() => handleCloseCalender('DATE_FROM')}
                    />
                  )}
                />

                <i
                  className='far fa-calendar'
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleOpenCalender('DATE_FROM')}></i>
                {errors?.startDay?.type === 'max' && (
                  <p className='mt-10 mb-0 txt-valid'>
                    <i className='i-valid' />
                    {errors?.startDay?.message}
                  </p>
                )}
              </div>
            </div>
            <div className={`form-group ${errors?.endDay?.type ? 'input-custom-error' : ''}`}>
              <label>
                {t('Tới ngày')}
                <span className='text-danger'> (*)</span>
              </label>
              <div className='input-calendar'>
                <Controller
                  control={control}
                  name='endDay'
                  rules={{ required: true }}
                  render={({ field }) => (
                    <ReactDatePicker
                      placeholderText='DD/MM/YYYY HH:mm'
                      locale={'en'}
                      onChange={(e: Date) => {
                        field.onChange(e && convertField(e, 'TO'));
                        clearErrors('endDay');
                      }}
                      selected={field.value ? new Date(field.value) : null}
                      dateFormat='dd/MM/yyyy HH:mm'
                      peekNextMonth
                      showTimeInput
                      customInput={
                        <MaskedInput mask='11/11/1111 11:11' placeholder='dd/MM/yyyy HH:mm' />
                      }
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode='select'
                      open={calenderState.calenderDateTo}
                      onSelect={() => handleCloseCalender('DATE_TO')}
                      onClickOutside={() => handleCloseCalender('DATE_TO')}
                    />
                  )}
                />

                <i
                  className='far fa-calendar'
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleOpenCalender('DATE_TO')}></i>
              </div>
            </div>
            <Input
              formGroupClassName={`${errors?.dateNumber?.message ? 'input-custom-error' : ''}`}
              type='number'
              label={t('Số ngày')}
              register={register}
              errors={errors?.dateNumber}
              clearErrors={clearErrors}
              placeholder={t('0')}
              rules={{ required: true, min: 1 }}
              name='dateNumber'
            />

            <div className={`form-group ${errors?.amount?.type ? 'input-custom-error' : ''}`}>
              <label>
                {t('Số tiền (VND)')}
                <span className='text-danger'> (*)</span>
              </label>
              <Controller
                control={control}
                name='amount'
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    onChange={(e) => {
                      const target = e.target as HTMLInputElement;
                      field.onChange(numeral(target.value).value());
                      clearErrors('amount');
                    }}
                    autoComplete='off'
                    placeholder={'0 VND'}
                    maxLength={14}
                    value={field?.value ? numeral(+field?.value!).format('0,0') : ''}
                  />
                )}
              />
              {errors?.amount?.type && (
                <p className='mt-10 mb-0 txt-valid'>
                  <i className='i-valid' />
                  {'Số tiền không được rỗng'}
                </p>
              )}
            </div>
            <div
              className='btn-info-account-mc'
              style={{ display: 'flex', justifyContent: 'center' }}>
              <button className='btn btn-primary w-100 mt-3'>{t('Gửi')}</button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
