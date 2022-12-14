import callApiUPLOAD from 'api/UploadFiles';
import Dropzone from 'components/common/Dropzone/index';
import {
  assignTargetOptions,
  statusOptions,
  SupportTicketLevelOptions,
} from 'components/CsTool/AddTicket/index';
import { AccetedFile } from 'models';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect, { SingleValue } from 'react-select';
import { getDetailCustomerSupport, updateTicket } from 'redux/actions';
import { Input } from 'ui/Form';
import alert from 'utils/helpers/alert';
import { clearFalsyObject } from 'utils/helpers/replaceUrl';
import EkditorCustomerSupport from './EkditorCustomerSupport';
import { customStyles } from './ModalUpdateTicketCustomerSupport';
interface Props {
  id?: number | any;
  t: any;
  onHide: (type?: string) => void;
  onResetId?: () => void;
  onHideCheck?: () => void;
  onCheckUpdate?: () => void;
  onHandleHide?: () => void;
  onHandleChanceCheck?: () => void;
  onSubmitForm?: () => void;
  check?: boolean;
  onPreviewImg?: (e: React.MouseEvent<HTMLDivElement>, row?: any) => void;
}

const TicketUpdateInfor: React.FC<Props> = ({
  id,
  check,
  onHide,
  onResetId,
  onSubmitForm,
  onHideCheck,
  t,
  onHandleHide,
  onPreviewImg,
}) => {
  const [dataImg, setDataImg] = useState<string[]>([]);
  const [referIdCheck, setReferId] = useState<string>('');
  const [isFileValid, setIsFileValid] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();
  const [checkPickDB, setCheckPickDashBoard] = useState<Boolean>(false);
  const dataFilterValue: any = useSelector<any>((state) => state?.customerSupport?.listFilterValue);
  const [classify, setClassify] = useState<any>([]);
  const [cateGory, setCateGory] = useState<any>([]);
  const [method, setMethod] = useState<any>([]);

  const {
    handleSubmit,
    register,
    setValue,
    clearErrors,
    reset,
    getValues,
    resetField,
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

  const handleSubmitForm: SubmitHandler<any> = async (data, e) => {
    e?.preventDefault();
    const {
      summary,
      status,
      contactPhone,
      customerPhone,
      content,
      ticketType,
      otherImages,
      assignTarget,
      customerEmail,
      feedbackContent,
    } = data;

    delete data?.summary;
    delete data?.contactPhone;
    delete data?.customerPhone;
    delete data?.content;
    delete data?.ticketType;
    if (!assignTarget) delete data?.assignTarget;
    if (!customerEmail) delete data?.customerEmail;
    if (!status) delete data?.status;
    if (!feedbackContent) delete data?.feedbackContent;

    const payload = clearFalsyObject({ id: +id, ...data, otherImages: dataImg });

    dispatch(
      updateTicket(payload, (status, res) => {
        if (status) {
          alert('success', res?.message || t('C???p nh???t ticket th??nh c??ng'), t);
          reset();
          onHide && onHide();
          onResetId && onResetId();
          onSubmitForm && onSubmitForm();
        } else {
          alert('error', res?.message || t('C???p nh???t ticket th???t b???i'), t);
          onResetId && onResetId();
          onHide && onHide();
          onSubmitForm && onSubmitForm();
        }
      })
    );
  };

  useEffect(() => {
    (id || router?.query?.id) &&
      dispatch(
        getDetailCustomerSupport(
          {
            filter: { id: +id! || +router?.query?.id! },
          },
          (status, res) => {
            if (status) {
              const {
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
                referId,
                ticketType,
                classify,
                method,
                category,
                level,
              } = res[0];
              setValue('assignTarget', assignTarget);
              referId && setReferId(referId);
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
              setValue('level', level);

              if (classify === 'MERCHANT_DASHBOARD') {
                setCheckPickDashBoard(true);
              }
              let classifyChane = dataFilterValue?.map((el: any) => ({
                value: el.key,
                label: el.value,
              }));
              setClassify(classifyChane);
              if (classify) {
                let a;
                a = dataFilterValue.find((el: any) => {
                  return el.key === classify;
                });

                setCateGory(
                  a?.classifyData.map((el: any) => ({
                    value: el.key,
                    label: el.value,
                    data: el.methodData,
                  }))
                );

                let b = a?.classifyData
                  ?.find((el: any) => {
                    return el.key === category;
                  })
                  ?.methodData?.map((el: any) => ({
                    value: el.key,
                    label: el.value,
                  }));
                b?.length > 0 && setMethod(b);
              }
              setValue('classify', classify);
              setValue('method', method);
              setValue('category', category);
            } else {
              alert('error', t(res.message), t);
            }
          }
        )
      );
  }, []);

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} autoComplete='off'>
      <div className='d-flex content-body flex-column inputs-group'>
        <div className='register-contact-info update-ticket-container'>
          <div className='group-1'>
            <div className='group-item-title'>Th??ng tin kh??ch h??ng</div>

            <div className='group-item'>
              <span>S??T li??n h???</span>
              <Input
                formGroupClassName={'disabled'}
                type='text'
                label={''}
                register={register}
                name='contactPhone'
                disabled={id && true}
                style={{ cursor: 'no-drop' }}
                errors={{}}
                clearErrors={clearErrors}
                rules={{}}
                placeholder={t('S??? ??i???n tho???i li??n h???')}
                autoComplete='off'
              />
            </div>

            <div className='group-item'>
              <span>S??T ????ng k?? V??</span>
              <Input
                formGroupClassName={'disabled'}
                type='text'
                label={''}
                register={register}
                name='customerPhone'
                disabled={id && true}
                style={{ cursor: 'no-drop' }}
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
                  'form-group ' + `${errors?.customerEmail?.message ? 'input-custom-error' : ''}`
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
              <div style={{ position: 'relative' }}>
                <span>Danh m???c</span>
                {referIdCheck && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      zIndex: '99999999',
                      color: 'green',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      router.push(`/cham-soc-khach-hang/ticket?ticketId=${referIdCheck}`);
                    }}>
                    ( Xem dashboard ticket )
                  </div>
                )}
              </div>
              <div className='form-group disabled'>
                <Controller
                  control={control}
                  name={'classify'}
                  defaultValue={classify[0]?.value}
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
                      // hideSelectedOptions={true}
                      isDisabled={true}
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

            {!checkPickDB && (
              <div className='group-item'>
                <span>Ph??n lo???i</span>
                <div className='form-group '>
                  <Controller
                    control={control}
                    name={'category'}
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
                        isDisabled={true}
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
            )}

            {!checkPickDB && (
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
                        isDisabled={true}
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
            )}

            <div className='group-item'>
              <span>M?? t???</span>
              <div className={`form-input-textarea disabled`}>
                <textarea
                  disabled
                  className='input-textarea'
                  placeholder={t('Nh???p m?? t???')}
                  {...register('summary')}
                />
              </div>
            </div>
            <div className='group-item'>
              <span>Chi ti???t l???i</span>
              <div className={`form-input-textarea disabled`}>
                <textarea
                  disabled
                  className='input-textarea'
                  placeholder={t('Nh???p chi ti???t l???i')}
                  {...register('content')}
                />
              </div>
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

            <div className='group-item button-email'>
              <div onClick={onHideCheck} className='group-item-submit-email'>
                <i className='fab fa-telegram-plane'></i>
                {t('G???i email kh??ch h??ng')}
              </div>
            </div>
            <EkditorCustomerSupport id={+id} onHideCheck={onHideCheck} check={check} />
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
                        placeholder='Ch???n b??? ph???n x??? l??'
                        value={assignTargetOptions.find((c) => c.value === value) || ''}
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
              <div onClick={onHandleHide} className=' btn btn-huy mr-0'>
                {t('H???y')}
              </div>
              <button className=' btn btn-primary '>{t('C???p nh???t Ticket')}</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default TicketUpdateInfor;
