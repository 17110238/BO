import dayjs from 'dayjs';
import _ from 'lodash';
import { SendContractMerchant } from 'models';
import { FC, useState } from 'react';
import { Modal } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import MaskedInput from 'react-maskedinput';
import { useDispatch } from 'react-redux';
import { createManualCrosscheck } from 'redux/actions';
import alert from 'utils/helpers/alert';
import { clearFalsyObject } from 'utils/helpers/replaceUrl';
interface CalendarStateType {
  calenderDateFrom: boolean;
  calenderDateTo: boolean;
}
interface Props {
  show: boolean;
  merchantId?: string;
  onHide: () => void;
}

const ModalCreateSettlement: FC<Props> = ({ show, onHide, merchantId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('common');

  const [calenderState, setCalenderState] = useState<CalendarStateType>({
    calenderDateFrom: false,
    calenderDateTo: false,
  });

  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
    setError,
    watch,
    clearErrors,
    reset,
  } = useForm<SendContractMerchant>({
    shouldFocusError: false,
    reValidateMode: 'onSubmit',
  });

  const handelSendConstract: SubmitHandler<SendContractMerchant> = (data, e) => {
    e?.preventDefault();

    if (
      !_.isEmpty(_.pickBy(data.createdAt)) &&
      dayjs(data?.createdAt?.from).isSameOrAfter(dayjs(data?.createdAt?.to))
    ) {
      setError('createdAt.from', {
        type: 'max',
        message: `Ngày bắt đầu phải nhỏ hơn ngày kết thúc`,
      });
      return;
    }

    const submitData: any = clearFalsyObject({
      ...data,
      merchantId: +merchantId!,
    });

    dispatch(
      createManualCrosscheck({ ...submitData }, (state, res) => {
        alert(state ? 'success' : 'error', res?.message, t);
        reset();
        onHide && onHide();
      })
    );
  };

  const convertField = (data: Date, type: string = 'FROM') => {
    switch (type) {
      case 'FROM':
        return dayjs(data).utc().format();
      case 'TO':
        return dayjs(data).endOf('minute').utc().format();
      case 'TO_END_DATE':
        return dayjs(data).endOf('date').utc().format();

      default:
        return dayjs();
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

  return (
    <>
      <Modal
        className='modal-basic-ui'
        show={show}
        onHide={() => {
          onHide && onHide();
          setTimeout(() => {
            reset();
          }, 500);
        }}>
        <Modal.Header closeButton>
          <p>
            Đối soát thủ công <span className='highlist--strong'>#ID: {merchantId}</span>
          </p>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(handelSendConstract)} className='inputs-group p-0'>
            <div
              className={`form-group ${errors?.createdAt?.from?.type ? 'input-custom-error' : ''}`}>
              <label>{t('Từ ngày')}</label>
              <div className='input-calendar'>
                <Controller
                  control={control}
                  name='createdAt.from'
                  rules={{
                    required: watch('createdAt.to'),
                  }}
                  render={({ field }) => (
                    <ReactDatePicker
                      placeholderText='DD/MM/YYYY HH:mm'
                      locale={'en'}
                      onChange={(e: Date) => {
                        field.onChange(e && convertField(e));
                        clearErrors('createdAt.from');
                      }}
                      selected={field.value ? new Date(field.value) : null}
                      dateFormat='dd/MM/yyyy HH:mm'
                      peekNextMonth
                      customInput={
                        <MaskedInput mask='11/11/1111 11:11' placeholder='dd/MM/yyyy HH:mm' />
                      }
                      showMonthDropdown
                      showYearDropdown
                      showTimeInput
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
                {errors?.createdAt?.from?.type === 'max' && (
                  <p className='mt-10 mb-0 txt-valid'>
                    <i className='i-valid' />
                    {errors?.createdAt?.from?.message}
                  </p>
                )}
              </div>
            </div>
            <div
              className={`form-group ${errors?.createdAt?.to?.type ? 'input-custom-error' : ''}`}>
              <label>{t('Tới ngày')}</label>
              <div className='input-calendar'>
                <Controller
                  control={control}
                  name='createdAt.to'
                  rules={{
                    required: watch('createdAt.from'),
                  }}
                  render={({ field }) => (
                    <ReactDatePicker
                      placeholderText='DD/MM/YYYY HH:mm'
                      locale={'en'}
                      onChange={(e: Date) => {
                        field.onChange(e && convertField(e, 'TO'));
                        clearErrors('createdAt.to');
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
                  required: 'Mô tả không được rỗng',
                  onChange: () => {
                    clearErrors('description');
                  },
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
              <button className='btn btn-primary w-100 mt-3'>{t('Gửi')}</button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalCreateSettlement;
