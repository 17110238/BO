import { statusOptions } from 'components/CsTool/AddTicket/index';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import ReactSelect, { SingleValue } from 'react-select';
import { getDetailCustomerSupport, getDetailDataDashBoardTicket } from 'redux/actions';
import { Input } from 'ui/Form';
import { customStyles } from './ModalDashBoardRelyTicket';

const FormInforTicket: React.FC<any> = ({
  id,
  onChangeState,
  onPreviewImg,
  onErrorImage,
  checkAddTicket,
}) => {
  const { t } = useTranslation('common');
  const [dataImg, setDataImg] = useState<string[]>([]);
  const dispatch = useDispatch<any>();
  const router = useRouter();

  const {
    register,
    setValue,
    clearErrors,
    getValues,
    formState: { errors },
    control,
  } = useForm<any>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: false,
    defaultValues: {
      otherImages: dataImg || [],
    },
  });
  const [idCheck, setIdCheck] = useState<any>('');

  useEffect(() => {
    dispatch(
      getDetailDataDashBoardTicket(
        {
          filter: { ticketId: id || router?.query?.ticketId },
        },
        (status, res) => {
          if (status) {
            const {
              ticketId,
              assignTarget,
              content,
              createdAt,
              email,
              merchantId,
              feedbackContent,
              ticketImages,
              state,
              title,
            } = res[0];
            setValue('ticketId', ticketId);

            dispatch(
              getDetailCustomerSupport(
                {
                  filter: { referId: ticketId },
                },
                (status, ress) => {
                  if (status) {
                    let { id } = ress[0];
                    setIdCheck(id);
                  }
                }
              )
            );
            setValue('assignTarget', assignTarget);
            setValue('content', content);
            setValue('createdAt', createdAt);
            setValue('email', email);
            setDataImg(ticketImages);
            setValue('merchantId', merchantId);
            setValue('state', state);
            setValue('title', title);
          }
        }
      )
    );
  }, [checkAddTicket]);

  return (
    <form className='ticketupdate' autoComplete='off'>
      <div className='head-title'>{'Thông tin ticket'}</div>
      <div className='d-flex content-body flex-column inputs-group'>
        <div className='inputs-group body_left'>
          <div
            className='register-contact-info'
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {!idCheck && (
              <div className='form-group disabled'>
                <Input
                  type='text'
                  label={`Ticket Id `}
                  register={register}
                  name='ticketId'
                  disabled={id && true}
                  style={{ cursor: 'no-drop', width: '100%' }}
                  errors={{}}
                  clearErrors={clearErrors}
                  rules={{}}
                  placeholder={t('TicketId')}
                  autoComplete='off'
                />
              </div>
            )}
            {idCheck && (
              <div
                className='form-group disabled'
                onClick={() => {
                  router.push(`/cham-soc-khach-hang?id=${idCheck}`);
                }}>
                <Input
                  type='text'
                  label={`Ticket Id ${idCheck ? '(Ấn để xem ticket nội bộ)' : ''}`}
                  register={register}
                  name='ticketId'
                  disabled={id && true}
                  style={{ cursor: 'no-drop', width: '100%' }}
                  errors={{}}
                  clearErrors={clearErrors}
                  rules={{}}
                  placeholder={t('TicketId')}
                  autoComplete='off'
                />
              </div>
            )}

            <Input
              formGroupClassName='disabled'
              type='text'
              label={t('Tiêu đề')}
              register={register}
              name='title'
              disabled={id && true}
              style={{ cursor: 'no-drop' }}
              errors={{}}
              clearErrors={clearErrors}
              rules={{}}
              placeholder={t('Tiêu đề')}
              autoComplete='off'
            />

            <div className='form-group' style={{ display: 'inline-block' }}>
              <label>{t('Trạng Thái')}</label>
              <Controller
                control={control}
                name={'state'}
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
                        return 'Không có kết quả tìm kiếm';
                      }}
                      styles={customStyles}
                      placeholder=''
                      value={statusOptions.find((c) => c.value === value)}
                      options={statusOptions}
                      onChange={(e: SingleValue<any>) => {
                        onChange(e.value);
                        onChangeState && onChangeState(e.value);
                      }}
                    />
                  );
                }}
              />
            </div>

            <div className={`form-group disabled`} style={{ cursor: 'no-drop' }}>
              <label>{t('Tạo lúc')}</label>
              <div style={{ color: 'gray' }}>
                {dayjs(getValues('createdAt')).format('HH:mm:ss DD/MM/YYYY')}
              </div>
            </div>
          </div>

          <div className={`form-group form-input-textarea disabled`} style={{ width: '100%' }}>
            <label>
              <label className='mr-0'>
                {t('Nội dung')}
                <span className='text-danger'> (*)</span>
              </label>
            </label>
            <textarea
              disabled
              className='input-textarea '
              placeholder={t('Nhập mô tả')}
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

          <hr style={{ marginTop: '0rem', marginBottom: '1rem' }} />
          <div className='register-business-detail-img'>
            <div className='image-groups'>
              {dataImg?.length === 0 && <>{'Không có hình ảnh'}</>}
              {dataImg?.length > 0 && (
                <>
                  <div>{'Hình ảnh đính kèm'}</div>
                  <div className='row-img-container'>
                    {dataImg?.map((imgg: any, index) => {
                      return (
                        <div className='row-img-preview' data-index={index} key={index}>
                          <img
                            style={{
                              display: 'block',
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                            }}
                            onClick={(e) =>
                              onPreviewImg &&
                              onPreviewImg(
                                e,
                                imgg.startsWith('http')
                                  ? imgg
                                  : process.env.NEXT_PUBLIC_API_UPLOAD + imgg
                              )
                            }
                            src={imgg}
                            alt='img-kyc'
                            onError={onErrorImage}
                          />
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default FormInforTicket;
