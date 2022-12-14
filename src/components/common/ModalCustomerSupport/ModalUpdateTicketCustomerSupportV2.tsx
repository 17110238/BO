
import {
  assignTargetOptions,
  rulesForm,
  statusOptions,
  ticketTypeOptions,
} from 'components/CsTool/AddTicket/index';
import GetLogsContainer from 'components/CsTool/GetLogs/GetLosContainer';
import { LocationType } from 'models';
import React, { useEffect, useState, useRef, MouseEvent } from 'react';
import { Modal } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import ReactSelect, { SingleValue } from 'react-select';
import { getListCustomerSupport, updateTicket } from 'redux/actions';
import { Input } from 'ui/Form';
import alert from 'utils/helpers/alert';
import EkditorCustomerSupport from './EkditorCustomerSupport';
import RegisterDetailImgTicketCustomerSupport from './RegisterDetailImgTicketCustomerSupport';
import Viewer from 'viewerjs';
import { setRevalidateHeaders } from 'next/dist/server/send-payload';

interface Props {
  id?: number | any;
  show: boolean | undefined;
  onHide: (type?: string) => void;
  onResetId?: () => void;
  onCheckUpdate?: () => void;
}
interface SelectProp extends LocationType {
  value?: string;
  label?: string;
}
export const customStyles = {
  option: (provided: any, state: any) => ({
    ...provided,
    borderBottom: `1px solid #eff2f7`,
    color: state.isSelected ? '#0b0b0b' : '#0b0b0b',
    fontSize: '14px',
    fontFamily: 'Nunito Sans',
    height: 'auto',
    minHeight: '42px',
    display: 'inline-block',
  }),
  menu: (provided: any, state: any) => ({
    ...provided,
    boxShadow: '0 2px 15px 0 rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    zIndex: 9999,
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    border: 'none',
    background: 'none',
    borderRadius: '12px',
    color: '#00be00',
    height: '40px',
    minWidth: '107px',
    boxShadow: 'none',
  }),

  singleValue: (provided: any, state: any) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';
    return { ...provided, opacity, transition };
  },
};
const ModalUpdateTicketCustomerSupportV2: React.FC<Props> = ({
  id,
  show,
  onHide,
  onResetId,
  onCheckUpdate,
}) => {
  const { t } = useTranslation('common');
  const [check, setCheck] = useState<boolean>(false);
  const [dataImg, setDataImg] = useState<string[]>([]);
  const [idd, setIDD] = useState<number | undefined>();
  const handleChanceCheck = () => {
    setCheck(true);
  };
  const handleChanceCheckSubmit = () => {
    setCheck(!check);
  };

  const dispatch = useDispatch();

  const {
    handleSubmit,
    register,
    setValue,
    clearErrors,
    reset,
    getValues,
    setError,
    resetField,
    unregister,
    formState: { errors },
    control,
  } = useForm<any>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: false,
    defaultValues: {
      otherImages: dataImg || [],
    },
  });
  const formInfo = useForm<any>({
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
  });

  const formImgInfo = useForm<any>({
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
  });

  const {
    control: controlFormInfo,
    register: registerFormInfo,
    setValue: setValueFormInfo,
    getValues: getValueFormInfo,
    clearErrors: clearErrorsFormInfo,
    handleSubmit: handleSubmitFormInfo,
    watch,
    formState: { errors: errorsFormInfo },
  } = formInfo;

  const handleSubmitForm: SubmitHandler<any> = (data, e) => {
    e?.preventDefault();
    const { summary, status, contactPhone, customerPhone, content, ticketType, otherImages } = data;
    if (summary) delete data?.summary;
    if (contactPhone) delete data?.contactPhone;
    if (customerPhone) delete data?.customerPhone;
    if (content) delete data?.content;
    if (ticketType) delete data?.ticketType;
    const payload = { id: +idd!, ...data };

    dispatch(
      updateTicket(payload, (status, res) => {
        if (status) {
          alert('success', t('C???p nh???t ticket th??nh c??ng'), t);
          reset();
          onHide && onHide();
          onCheckUpdate && onCheckUpdate();
        } else {
          alert('error', t('C???p nh???t ticket th???t b???i'), t);
          onCheckUpdate && onCheckUpdate();
        }
      })
    );
  };

  useEffect(() => {
    dispatch(
      getListCustomerSupport(
        {
          filter: { referId: id },
        },
        (status, res) => {
          if (status) {
            const {
              id,
              assignTarget,
              contactPhone,
              content,
              contentEmail,
              createdAt,
              customerEmail,
              customerPhone,
              feedbackContent,
              otherImages,
              status,
              summary,
              ticketType,
            } = res[0];

            setIDD(id);
            setValue('assignTarget', assignTarget);
            setValue('contactPhone', contactPhone);
            setValue('content', content);
            setValue('customerPhone', customerPhone);
            setValue('feedbackContent', feedbackContent);
            setValue('otherImages', otherImages);
            setDataImg(otherImages);
            setValue('status', status);
            setValue('summary', summary);
            setValue('ticketType', ticketType);
            setValue('customerEmail', customerEmail);
          } else {
            alert('error', t(res.message), t);
          }
        }
      )
    );
  }, [id]);
  const handleHide = () => {
    reset();
    onHide && onHide();
    onResetId && onResetId();
  };

  return (
    <Modal
      show={show}
      onHide={handleHide}
      backdrop='static'
      // keyboard={false}
      className='modal-create-account-mc'>
      <Modal.Header closeButton>
        <Modal.Title>{t('C???p nh???t Ticket')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className='ticketupdate' onSubmit={handleSubmit(handleSubmitForm)} autoComplete='off'>
          <div className='d-flex content-body flex-column inputs-group'>
            <div className='inputs-group body_left'>
              <div
                className='register-contact-info'
                style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <Input
                  formGroupClassName={'disabled'}
                  type='text'
                  label={t('S??? ??i???n tho???i li??n h???')}
                  register={register}
                  name='contactPhone'
                  disabled={id && true}
                  style={{ cursor: 'no-drop' }}
                  errors={errors?.contactPhone}
                  clearErrors={clearErrors}
                  rules={rulesForm?.contactPhone}
                  placeholder={t('S??? ??i???n tho???i li??n h???')}
                  autoComplete='off'
                />

                <Input
                  formGroupClassName={'disabled'}
                  type='text'
                  label={t('S??? di???n tho???i ????ng k?? v??')}
                  register={register}
                  name='customerPhone'
                  disabled={id && true}
                  style={{ cursor: 'no-drop' }}
                  errors={errors.customerPhone}
                  clearErrors={clearErrors}
                  rules={rulesForm?.customerPhone}
                  placeholder={t('S??? ??i???n tho???i ????ng k?? v??')}
                  autoComplete='off'
                />

                <div
                  className='form-group disabled'
                  style={{ display: 'inline-block', cursor: 'no-drop' }}>
                  <label>{t('Danh m???c')}</label>
                  <Controller
                    control={control}
                    name={'ticketType'}
                    defaultValue={ticketTypeOptions[0].value}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <ReactSelect
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
                          return 'Kh??ng c?? k???t qu??? t??m ki???m';
                        }}
                        isDisabled={true}
                        styles={customStyles}
                        placeholder=''
                        value={ticketTypeOptions.find((c) => c.value === value)}
                        options={ticketTypeOptions}
                        onChange={(e: SingleValue<any>) => e.preventDefault()}
                      />
                    )}
                  />
                </div>
                <div
                  className={
                    'form-group ' + `${errors?.customerEmail?.message ? 'input-custom-error' : ''}`
                  }>
                  <label>{t('Email Kh??ch H??ng')}</label>
                  <input
                    type='text'
                    placeholder={t('Email Kh??ch H??ng')}
                    {...register('customerEmail', {
                      pattern: {
                        value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                        message: t('Email kh??ng ????ng ?????nh d???ng'),
                      },
                      required: false,
                    })}
                  />
                  <p className=' txt-valid'>
                    {errors?.customerEmail && (
                      <>
                        <i className='i-valid' />
                        {errors?.customerEmail?.message}
                      </>
                    )}
                  </p>
                </div>

                <div className='form-group ' style={{ display: 'inline-block' }}>
                  <label>{t('Ph??n c??ng')}</label>
                  <Controller
                    control={control}
                    name={'assignTarget'}
                    defaultValue={assignTargetOptions[0].value}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <ReactSelect
                        theme={(theme) => ({
                          ...theme,
                          borderRadius: 0,
                          backgroundColor: 'transparent',
                          colors: {
                            ...theme.colors,
                            primary25: '#EFF2F7',
                            primary: '#00be00',
                          },
                        })}
                        noOptionsMessage={() => {
                          return 'Kh??ng c?? k???t qu??? t??m ki???m';
                        }}
                        styles={customStyles}
                        placeholder=''
                        value={assignTargetOptions.find((c) => c.value === value)}
                        options={assignTargetOptions}
                        onChange={(e: SingleValue<any>) => onChange(e.value)}
                      />
                    )}
                  />
                </div>

                <div className='form-group' style={{ display: 'inline-block' }}>
                  <label>{t('Tr???ng Th??i')}</label>
                  <Controller
                    control={control}
                    name={'status'}
                    defaultValue={statusOptions[0]?.value}
                    render={({ field: { onChange, value }, fieldState: { error } }) => {
                      return (
                        <ReactSelect
                          theme={(theme) => ({
                            ...theme,
                            borderRadius: 0,
                            backgroundColor: 'none',
                            colors: {
                              ...theme.colors,
                              primary25: '#EFF2F7',
                              primary: '#00be00',
                            },
                          })}
                          noOptionsMessage={() => {
                            return 'Kh??ng c?? k???t qu??? t??m ki???m';
                          }}
                          styles={customStyles}
                          placeholder=''
                          value={statusOptions.find((c) => c.value === value)}
                          options={statusOptions}
                          onChange={(e: SingleValue<any>) => onChange(e.value)}
                        />
                      );
                    }}
                  />
                </div>

                <div
                  className={`form-group form-input-textarea disabled`}
                  style={{ width: '100%' }}>
                  <label>
                    {/* {t('Expired time')} */}
                    <label className='mr-0'>
                      {t('M?? t???')}
                      <span className='text-danger'> (*)</span>
                    </label>
                  </label>
                  <textarea
                    disabled
                    className='input-textarea'
                    placeholder={t('Nh???p m?? t???')}
                    style={{
                      width: '100%',
                      maxHeight: '150px',
                      minHeight: '80px',
                      cursor: 'no-drop',
                      color: 'gray',
                    }}
                    {...register('summary')}
                  />
                </div>

                <div
                  className={`form-group form-input-textarea disabled`}
                  style={{ width: '100%' }}>
                  <label>
                    {/* {t('Expired time')} */}
                    <label className='mr-0'>
                      {t('Chi ti???t')}
                      <span className='text-danger'> (*)</span>
                    </label>
                  </label>
                  <textarea
                    disabled
                    className='input-textarea'
                    placeholder={t('Nh???p m?? giao d???ch n???u c??')}
                    style={{
                      width: '100%',
                      maxHeight: '150px',
                      minHeight: '80px',
                      cursor: 'no-drop',
                      color: 'gray',
                    }}
                    {...register('content')}
                  />
                </div>

                <div className={`form-group form-input-textarea`} style={{ width: '100%' }}>
                  <label>
                    {/* {t('Expired time')} */}
                    <label className='mr-0'>{t('Ph???n h???i')}</label>
                  </label>
                  <textarea
                    className='input-textarea'
                    placeholder={t('N???i dung h??? tr??? kh??ch h??ng')}
                    style={{ width: '100%', maxHeight: '150px', minHeight: '80px' }}
                    {...register('feedbackContent')}
                  />
                </div>
              </div>
              <hr style={{ marginTop: '0.5rem', marginBottom: '1rem' }} />
              <div className='register-business-detail-img'>
                <RegisterDetailImgTicketCustomerSupport
                  formImgInfo={formImgInfo}
                  dataImg={dataImg}
                  setValues={setValue}
                  clearError={clearErrors}
                  resetField={resetField}
                  errors={errors}
                  register={register}
                  control={control}
                />
              </div>
            </div>
          </div>
          <hr style={{ marginTop: '0.5rem', marginBottom: '1rem' }} />
          <div
            className='inputs-group  p-0'
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
            }}>
            <div>
              <button
                className=' btn btn-primary mr-2'
                style={{ display: 'initial', minWidth: '150px' }}>
                {t('C???p nh???t Ticket')}
              </button>
              <div
                onClick={handleHide}
                className=' btn btn-outline-primary mr-0'
                style={{ display: 'inline-block', minWidth: '150px' }}>
                {t('H???y')}
              </div>
            </div>
            <div
              onClick={handleChanceCheck}
              className=' btn btn-primary mr-0'
              style={{ display: 'initial', minWidth: '150px' }}>
              {t('G???i email kh??ch h??ng')}
            </div>
          </div>
        </form>
        <EkditorCustomerSupport id={+idd!} onHideCheck={handleChanceCheckSubmit} check={check} />
      </Modal.Body>
      {/* getlog*/}
      <Modal.Header>
        <Modal.Title>{t('Get Logs')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{idd && <GetLogsContainer id={+idd!} />}</Modal.Body>
    </Modal>
  );
};

export default ModalUpdateTicketCustomerSupportV2;
