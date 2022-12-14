import callApiUPLOAD from 'api/UploadFiles';
import Dropzone from 'components/common/Dropzone/index';
import { customStyles } from 'components/common/ModalCustomerSupport/ModalUpdateTicketCustomerSupport';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { AccetedFile } from 'models';
import { useRouter } from 'next/dist/client/router';
import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-day-picker/lib/style.css';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect, { SingleValue } from 'react-select';
import { addTicket } from 'redux/actions';
import Input from 'ui/Form/InputV2';
import alert from 'utils/helpers/alert';
import { b64_to_utf8, saveState } from 'utils/helpers/utils';
import Viewer from 'viewerjs';
dayjs.extend(utc);
interface FormLoginSubmit {
  contactPhone: string;
  customerPhone: string;
  summary: string;
  content: string;
  ticketKey?: string;
  contentEmail?: string;
  customerEmail?: number | string;
  ticketType?: string;
  feedbackContent?: any;
  status?: any;
  assignTarget?: string[] | any;
  supportStaff?: string;
  referId?: string;
  otherImages: string[] | any;
  remindCount?: number;
}
export const rulesForm = {
  contactPhone: {
    required: true,
    isVNumber: true,
    isPhoneNumber: true,
    maxLength: 11,
  },
  customerPhone: { required: true, isVNumber: true, isPhoneNumber: true, maxLength: 11 },
  summary: { required: true },
  content: { required: true },
  customerEmail: { isEmail: true },
};
enum AssignTargetEnum {
  // OPERATOR = 'OPERATOR',
  OPERATOR_QC = 'OPERATOR_QC',
  OPERATOR_CS = 'OPERATOR_CS',
  OPERATOR_TM = 'OPERATOR_TM',
  DEVELOPER = 'DEVELOPER',
  ACCOUNTING = 'ACCOUNTING',
}
export enum SupportTicketStateEnum {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
  PROCESSING = 'PROCESSING',
  NEW = 'NEW',
  NEW_REPLY = 'NEW_REPLY',
  RESOLVED = 'RESOLVED',
}
export const ticketTypeOptions = [
  {
    label: 'T??i kho???n',
    value: 'AccountUser',
  },
  {
    label: 'Thanh to??n',
    value: 'Payment',
  },
  {
    label: 'Thanh to??n x?? h???i',
    value: 'SocialPayment',
  },
  { label: 'Isec', value: 'Isec' },
  {
    value: 'TransactionCancelling',
    label: 'H???y giao d???ch',
  },
  {
    value: 'Deposit',
    label: 'N???p',
  },
  {
    value: 'Withdraw',
    label: 'R??t,chuy???n',
  },
  {
    value: 'Dashboard',
    label: 'H??? tr??? merchant',
  },
  {
    value: 'Other',
    label: 'Kh??c',
  },
];

export enum SupportTicketLevelEnum {
  CRITICAL = 'CRITICAL',
  NORMAL = 'NORMAL',
}

export const SupportTicketLevelOptions = [
  {
    label: 'G???p',
    value: SupportTicketLevelEnum.CRITICAL,
  },
  {
    label: 'B??nh th?????ng',
    value: SupportTicketLevelEnum.NORMAL,
  },
];

export const statusOptions = [
  {
    label: 'M???i t???o',
    value: SupportTicketStateEnum.NEW,
  },
  {
    label: 'Ph???n h???i m???i',
    value: SupportTicketStateEnum.PROCESSING,
  },
  {
    label: '????ng',
    value: SupportTicketStateEnum.RESOLVED,
  },
  // {
  //   label: '????ng',
  //   value: SupportTicketStateEnum.CLOSE,
  // },
  {
    label: 'M???',
    value: SupportTicketStateEnum.OPEN,
  },
  {
    label: '??ang x??? l??',
    value: SupportTicketStateEnum.NEW_REPLY,
  },
];
export const statusOptionsObject = {
  [SupportTicketStateEnum.NEW_REPLY]: '??ang x??? l??',
  [SupportTicketStateEnum.OPEN]: 'M???',
  [SupportTicketStateEnum.CLOSE]: '????ng',
  [SupportTicketStateEnum.RESOLVED]: '????ng',
  [SupportTicketStateEnum.PROCESSING]: 'Ph???n h???i m???i',
  [SupportTicketStateEnum.NEW]: 'M???i t???o',
};

export const assignTargetOptions = [
  // {
  //   label: 'V???n h??nh',
  //   value: AssignTargetEnum.OPERATOR,
  // },
  {
    label: 'V???n h??nh - TM',
    value: AssignTargetEnum.OPERATOR_TM,
  },
  {
    label: 'V???n h??nh - CS',
    value: AssignTargetEnum.OPERATOR_CS,
  },
  {
    label: 'V???n h??nh - QC',
    value: AssignTargetEnum.OPERATOR_QC,
  },
  {
    label: 'Dev',
    value: AssignTargetEnum.DEVELOPER,
  },
  {
    label: 'K??? to??n',
    value: AssignTargetEnum.ACCOUNTING,
  },
];
interface Props {
  show: boolean | undefined;
  onHide: () => void;
  onSubmitForm?: any;
  onPreviewImg?:(e: React.MouseEvent<HTMLDivElement>,row?:any) => void ;
  
}
const AddTicket: React.FC<Props> = ({ show, onHide, onSubmitForm ,onPreviewImg}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const dispatch = useDispatch();
  const { id }: any = router.query;
  const {
    register,
    formState: { errors },
    handleSubmit,
    clearErrors,
    setError,
    setValue,
    getValues,
    reset,
    control,
  } = useForm<FormLoginSubmit | any>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: false,
    defaultValues: {
      contactPhone: '',
      customerPhone: '',
      summary: '',
      content: '',
    },
  });
  const [dataImg, setDataImg] = useState<string[]>([]);
  const [isFileValid, setIsFileValid] = useState(true);
  const dataFilterValue: any = useSelector<any>((state) => state?.customerSupport?.listFilterValue);
  const [classify, setClassify] = useState<any>([]);
  const [cateGory, setCateGory] = useState<any>([]);
  const [method, setMethod] = useState<any>([]);

  useEffect(() => {
    let classifyChane = dataFilterValue?.map((el: any) => ({
      value: el.key,
      label: el.value,
    }));
    classifyChane.shift();
    setClassify(classifyChane);
  }, []);

  useEffect(() => {
    if (typeof router.query.urlRedirect !== 'undefined') {
      saveState('decodeUrl', b64_to_utf8(router.query.urlRedirect));
    }
  }, [router.query.urlRedirect]);

  const handleUploadImage = async (file: any) => {
    const formData = new FormData();
    formData.append('files', file[0]);
    try {
      const { data: res } = await callApiUPLOAD(formData);
      const updateImage: any = {};
      if (res.code === 1000) {
        updateImage.attachImages = [
          ...res.data.map((info: { path: string }) => {
            return process.env.NEXT_PUBLIC_API_UPLOAD + info.path;
          }),
        ];
        setDataImg([...dataImg, ...updateImage.attachImages]);
      }
    } catch (err) {
      alert('error', 'Error Upload File', t);
    }
  };

  const handleSubmitCreateUser: SubmitHandler<any> = (data, e) => {
    e?.preventDefault();
    Object.entries(data).forEach((value) => {
      if (!value[1]) {
        delete data[value[0]];
      }
    });
    const params: FormLoginSubmit | any = {
      ...data,
      otherImages: dataImg,
    };
    dispatch(
      addTicket(params, (status, response) => {
        if (status) {
          reset();
          alert('success', t('T???o ticket th??nh c??ng'), t);
          onHide && onHide();
          onSubmitForm && onSubmitForm();
          setDataImg([]);
        } else {
          setDataImg([]);
          onHide && onHide();
          alert('error', response.message, t);
        }
      })
    );
  };

  const handleHile = () => {
    onHide && onHide();
    clearErrors();
    reset();
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleHile}
        backdrop='static'
        // keyboard={false}
        className='modal-create-account-mc update-ticket'>
        <Modal.Header closeButton>
          <Modal.Title>{t('Th??m ticket')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(handleSubmitCreateUser)} autoComplete='off'>
            <div className='d-flex content-body flex-column inputs-group'>
              <div className='register-contact-info update-ticket-container '>
                <div className='group-1'>
                  <div className='group-item-title'>Th??ng tin kh??ch h??ng</div>
                  {/* {1 c??i item} */}
                  <div className='group-item'>
                    <span>
                      S??T li??n h??? <span className='text-danger'>*</span>
                    </span>
                    <Input
                      type='text'
                      label={''}
                      register={register}
                      name='contactPhone'
                      formGroupClassName={errors?.contactPhone ? `form-group error` : 'form-group'}
                      errors={errors?.contactPhone}
                      clearErrors={clearErrors}
                      rules={rulesForm?.contactPhone}
                      placeholder={t('S??? ??i???n tho???i li??n h???')}
                      autoComplete='off'
                    />
                  </div>

                  <div className='group-item'>
                    <span>S??T ????ng k?? V??</span>
                    <Input
                      type='text'
                      label={''}
                      register={register}
                      name='customerPhone'
                      formGroupClassName='form-group'
                      errors={{}}
                      clearErrors={clearErrors}
                      rules={{}}
                      placeholder={t('S??? ??i???n tho???i ????ng k?? v??')}
                      autoComplete='off'
                    />
                  </div>

                  <div className='group-item'>
                    <span>Email kh??ch h??ng</span>
                    <div
                      className={
                        'form-group ' +
                        `${errors?.customerEmail?.message ? 'input-custom-error' : ''}`
                      }>
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
                  </div>
                </div>

                <div className='group-1'>
                  <div className='group-item-title'>Th??ng tin h??? tr???</div>
                  {/* {1 c??i item} */}
                  <div className='group-item'>
                    <span>
                      Danh m???c<span className='text-danger'>*</span>
                    </span>
                    <div className={`form-group ${errors?.classify ? 'error' : ''}`}>
                      <Controller
                        control={control}
                        name={'classify'}
                        defaultValue={''}
                        // rules={{require:true}}
                        rules={{ required: true }}
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
                            classNamePrefix='react-select'
                            className='react-select'
                            noOptionsMessage={() => {
                              return 'Kh??ng c?? k???t qu??? t??m ki???m';
                            }}
                            styles={customStyles}
                            placeholder='Ch???n danh m???c'
                            value={classify.find((c: any) => c.value === value) || ''}
                            options={classify}
                            onChange={(e: SingleValue<any>) => {
                              onChange(e.value);
                              let choseclassIf = dataFilterValue?.filter((el: any) => {
                                return el.key === e.value;
                              });
                              let chooseCateGory = choseclassIf[0]?.classifyData?.map(
                                (el: any, index: number) => ({
                                  value: el.key,
                                  label: el.value,
                                  data: el.methodData,
                                })
                              );
                              setCateGory(chooseCateGory);
                              setMethod([]);
                              setValue('method', '');
                              setValue('category', '');
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className='group-item'>
                    <span>Ph??n lo???i</span>
                    <div className={`form-group ${errors?.category ? 'error' : ''}`}>
                      <Controller
                        control={control}
                        name={'category'}
                        // rules={{ required: true }}
                        defaultValue={''}
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
                            className='react-select'
                            classNamePrefix='react-select'
                            styles={customStyles}
                            placeholder='Ch???n ph??n lo???i'
                            value={cateGory?.find((c: any) => c.value === value) || ''}
                            options={cateGory}
                            onChange={(e: SingleValue<any>) => {
                              onChange(e.value);

                              let methodchoose = cateGory?.find((el: any) => {
                                return el.value === e.value;
                              });
                              setMethod(
                                methodchoose?.data?.map((el: any) => ({
                                  value: el.key,
                                  label: el.value,
                                }))
                              );
                              setValue('method', '');
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className='group-item'>
                    <span>Ph????ng th???c</span>
                    <div className='form-group '>
                      <Controller
                        control={control}
                        name={'method'}
                        defaultValue={''}
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
                            className='react-select'
                            classNamePrefix='react-select'
                            noOptionsMessage={() => {
                              return 'Kh??ng c?? k???t qu??? t??m ki???m';
                            }}
                            styles={customStyles}
                            placeholder='Ch???n ph????ng th???c'
                            value={method?.find((c: any) => c.value === value) || ''}
                            options={method}
                            onChange={(e: SingleValue<any>) => onChange(e.value)}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className='group-item'>
                    <span>
                      M?? t??? <span className='text-danger'>*</span>
                    </span>

                    <div className={`form-input-textarea`}>
                      <textarea
                        className={`input-textarea form-input-textarea ${
                          errors.summary ? 'input-custom-error' : ''
                        }`}
                        placeholder={t('Nh???p m?? t???')}
                        {...register('summary', {
                          required: `${t('M?? t??? l?? b???t bu???c')}`,
                        })}
                      />
                    </div>
                    <p className='txt-valid'>
                      {errors?.summary && (
                        <>
                          <i className='i-valid' />
                          {errors?.summary?.message}
                        </>
                      )}
                    </p>
                  </div>

                  <div className='group-item'>
                    <span>
                      Chi ti???t l???i<span className='text-danger'>*</span>
                    </span>

                    <div className={`form-input-textarea`}>
                      <textarea
                        className={`input-textarea  form-input-textarea ${
                          errors.content ? 'input-custom-error' : ''
                        }`}
                        placeholder={t('Nh???p chi ti???t')}
                        {...register('content', {
                          required: `${t('Chi ti???t l?? b???t bu???c')}`,
                        })}
                      />
                    </div>
                    <p className='txt-valid'>
                      {errors?.content && (
                        <>
                          <i className='i-valid' />
                          {errors?.content?.message}
                        </>
                      )}
                    </p>
                  </div>

                  <div className='group-item'>
                    <Dropzone
                      acceptFile={AccetedFile.img}
                      setFile={setDataImg}
                      file={dataImg}
                      isFileValid={isFileValid}
                      setIsFileValid={setIsFileValid}
                      multiple={true}
                      checkadd={true}
                      isStaticUpload={true}
                      onDropProps={handleUploadImage}
                      onClickReviewImg={onPreviewImg}
                    />
                  </div>
                  <div className='group-item'>
                    <span>Ph???n h???i kh??ch h??ng</span>
                    <div className={`form-input-textarea`}>
                      <textarea
                        className='input-textarea'
                        placeholder={t('N???i dung h??? tr??? kh??ch h??ng')}
                        {...register('feedbackContent')}
                      />
                    </div>
                  </div>
                </div>

                <div className='group-2'>
                  <div className='wrap'>
                    <div className='group-item-title'>Th??ng tin ticket</div>
                    <div className='group-item'>
                      <span>C???p ?????</span>
                      <div className='form-group '>
                        <Controller
                          control={control}
                          name={'level'}
                          defaultValue={SupportTicketLevelOptions[0].value}
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
                              className='react-select'
                              classNamePrefix='react-select'
                              noOptionsMessage={() => {
                                return 'Kh??ng c?? k???t qu??? t??m ki???m';
                              }}
                              styles={customStyles}
                              placeholder='Ch???n c???p ?????'
                              value={SupportTicketLevelOptions.find((c) => c.value === value) || ''}
                              options={SupportTicketLevelOptions}
                              onChange={(e: SingleValue<any>) => onChange(e.value)}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className='group-item'>
                      <span>B??? ph???n x??? l??</span>
                      <div className='form-group '>
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
                              className='react-select'
                              classNamePrefix='react-select'
                              noOptionsMessage={() => {
                                return 'Kh??ng c?? k???t qu??? t??m ki???m';
                              }}
                              styles={customStyles}
                              placeholder='Ch???n b??? ph???n s??? l??'
                              value={assignTargetOptions.find((c) => c.value === value)}
                              options={assignTargetOptions}
                              onChange={(e: SingleValue<any>) => onChange(e.value)}
                            />
                          )}
                        />
                      </div>
                    </div>

                    <div className='group-item'>
                      <span>Tr???ng th??i</span>
                      <div className='form-group '>
                        <Controller
                          control={control}
                          name={'status'}
                          defaultValue={statusOptions[0].value}
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
                              className='react-select'
                              classNamePrefix='react-select'
                              noOptionsMessage={() => {
                                return 'Kh??ng c?? k???t qu??? t??m ki???m';
                              }}
                              styles={customStyles}
                              placeholder='Ch???n tr???ng th??i'
                              value={statusOptions.find((c) => c.value === value) || ''}
                              options={statusOptions}
                              onChange={(e: SingleValue<any>) => onChange(e.value)}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='wrapp'>
                    <div onClick={handleHile} className=' btn btn-huy mr-0'>
                      {t('H???y')}
                    </div>
                    <button className=' btn btn-primary '>{t('Th??m ticket')}</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default AddTicket;
