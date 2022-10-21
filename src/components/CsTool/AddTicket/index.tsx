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
    label: 'Tài khoản',
    value: 'AccountUser',
  },
  {
    label: 'Thanh toán',
    value: 'Payment',
  },
  {
    label: 'Thanh toán xã hội',
    value: 'SocialPayment',
  },
  { label: 'Isec', value: 'Isec' },
  {
    value: 'TransactionCancelling',
    label: 'Hủy giao dịch',
  },
  {
    value: 'Deposit',
    label: 'Nạp',
  },
  {
    value: 'Withdraw',
    label: 'Rút,chuyển',
  },
  {
    value: 'Dashboard',
    label: 'Hỗ trợ merchant',
  },
  {
    value: 'Other',
    label: 'Khác',
  },
];

export enum SupportTicketLevelEnum {
  CRITICAL = 'CRITICAL',
  NORMAL = 'NORMAL',
}

export const SupportTicketLevelOptions = [
  {
    label: 'Gấp',
    value: SupportTicketLevelEnum.CRITICAL,
  },
  {
    label: 'Bình thường',
    value: SupportTicketLevelEnum.NORMAL,
  },
];

export const statusOptions = [
  {
    label: 'Mới tạo',
    value: SupportTicketStateEnum.NEW,
  },
  {
    label: 'Phản hồi mới',
    value: SupportTicketStateEnum.PROCESSING,
  },
  {
    label: 'Đóng',
    value: SupportTicketStateEnum.RESOLVED,
  },
  // {
  //   label: 'Đóng',
  //   value: SupportTicketStateEnum.CLOSE,
  // },
  {
    label: 'Mở',
    value: SupportTicketStateEnum.OPEN,
  },
  {
    label: 'Đang xử lý',
    value: SupportTicketStateEnum.NEW_REPLY,
  },
];
export const statusOptionsObject = {
  [SupportTicketStateEnum.NEW_REPLY]: 'Đang xử lý',
  [SupportTicketStateEnum.OPEN]: 'Mở',
  [SupportTicketStateEnum.CLOSE]: 'Đóng',
  [SupportTicketStateEnum.RESOLVED]: 'Đóng',
  [SupportTicketStateEnum.PROCESSING]: 'Phản hồi mới',
  [SupportTicketStateEnum.NEW]: 'Mới tạo',
};

export const assignTargetOptions = [
  // {
  //   label: 'Vận hành',
  //   value: AssignTargetEnum.OPERATOR,
  // },
  {
    label: 'Vận hành - TM',
    value: AssignTargetEnum.OPERATOR_TM,
  },
  {
    label: 'Vận hành - CS',
    value: AssignTargetEnum.OPERATOR_CS,
  },
  {
    label: 'Vận hành - QC',
    value: AssignTargetEnum.OPERATOR_QC,
  },
  {
    label: 'Dev',
    value: AssignTargetEnum.DEVELOPER,
  },
  {
    label: 'Kế toán',
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
          alert('success', t('Tạo ticket thành công'), t);
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
          <Modal.Title>{t('Thêm ticket')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(handleSubmitCreateUser)} autoComplete='off'>
            <div className='d-flex content-body flex-column inputs-group'>
              <div className='register-contact-info update-ticket-container '>
                <div className='group-1'>
                  <div className='group-item-title'>Thông tin khách hàng</div>
                  {/* {1 cái item} */}
                  <div className='group-item'>
                    <span>
                      SĐT liên hệ <span className='text-danger'>*</span>
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
                      placeholder={t('Số điện thoại liên hệ')}
                      autoComplete='off'
                    />
                  </div>

                  <div className='group-item'>
                    <span>SĐT Đăng kí Ví</span>
                    <Input
                      type='text'
                      label={''}
                      register={register}
                      name='customerPhone'
                      formGroupClassName='form-group'
                      errors={{}}
                      clearErrors={clearErrors}
                      rules={{}}
                      placeholder={t('Số điện thoại đăng kí ví')}
                      autoComplete='off'
                    />
                  </div>

                  <div className='group-item'>
                    <span>Email khách hàng</span>
                    <div
                      className={
                        'form-group ' +
                        `${errors?.customerEmail?.message ? 'input-custom-error' : ''}`
                      }>
                      <input
                        type='text'
                        placeholder={t('Email Khách Hàng')}
                        {...register('customerEmail', {
                          pattern: {
                            value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                            message: t('Email không đúng định dạng'),
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
                  <div className='group-item-title'>Thông tin hỗ trợ</div>
                  {/* {1 cái item} */}
                  <div className='group-item'>
                    <span>
                      Danh mục<span className='text-danger'>*</span>
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
                              return 'Không có kết quả tìm kiếm';
                            }}
                            styles={customStyles}
                            placeholder='Chọn danh mục'
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
                    <span>Phân loại</span>
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
                              return 'Không có kết quả tìm kiếm';
                            }}
                            className='react-select'
                            classNamePrefix='react-select'
                            styles={customStyles}
                            placeholder='Chọn phân loại'
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
                    <span>Phương thức</span>
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
                              return 'Không có kết quả tìm kiếm';
                            }}
                            styles={customStyles}
                            placeholder='Chọn phương thức'
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
                      Mô tả <span className='text-danger'>*</span>
                    </span>

                    <div className={`form-input-textarea`}>
                      <textarea
                        className={`input-textarea form-input-textarea ${
                          errors.summary ? 'input-custom-error' : ''
                        }`}
                        placeholder={t('Nhập mô tả')}
                        {...register('summary', {
                          required: `${t('Mô tả là bắt buộc')}`,
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
                      Chi tiết lỗi<span className='text-danger'>*</span>
                    </span>

                    <div className={`form-input-textarea`}>
                      <textarea
                        className={`input-textarea  form-input-textarea ${
                          errors.content ? 'input-custom-error' : ''
                        }`}
                        placeholder={t('Nhập chi tiết')}
                        {...register('content', {
                          required: `${t('Chi tiết là bắt buộc')}`,
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
                    <span>Phản hồi khách hàng</span>
                    <div className={`form-input-textarea`}>
                      <textarea
                        className='input-textarea'
                        placeholder={t('Nội dung hỗ trợ khách hàng')}
                        {...register('feedbackContent')}
                      />
                    </div>
                  </div>
                </div>

                <div className='group-2'>
                  <div className='wrap'>
                    <div className='group-item-title'>Thông tin ticket</div>
                    <div className='group-item'>
                      <span>Cấp độ</span>
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
                                return 'Không có kết quả tìm kiếm';
                              }}
                              styles={customStyles}
                              placeholder='Chọn cấp độ'
                              value={SupportTicketLevelOptions.find((c) => c.value === value) || ''}
                              options={SupportTicketLevelOptions}
                              onChange={(e: SingleValue<any>) => onChange(e.value)}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className='group-item'>
                      <span>Bộ phận xử lý</span>
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
                                return 'Không có kết quả tìm kiếm';
                              }}
                              styles={customStyles}
                              placeholder='Chọn bộ phận sử lí'
                              value={assignTargetOptions.find((c) => c.value === value)}
                              options={assignTargetOptions}
                              onChange={(e: SingleValue<any>) => onChange(e.value)}
                            />
                          )}
                        />
                      </div>
                    </div>

                    <div className='group-item'>
                      <span>Trạng thái</span>
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
                                return 'Không có kết quả tìm kiếm';
                              }}
                              styles={customStyles}
                              placeholder='Chọn trạng thái'
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
                      {t('Hủy')}
                    </div>
                    <button className=' btn btn-primary '>{t('Thêm ticket')}</button>
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
