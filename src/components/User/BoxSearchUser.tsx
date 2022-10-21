import React, { useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useForm, SubmitHandler } from 'react-hook-form';
import updateURLParameter from 'utils/helpers/changeUrl';
import Router from 'next/router';
// import DatePickerCustomNew from 'components/common/DatePickerCustom/DatePickerCustomNew';
export interface searchParams {
  search?: string | number;
}
interface BoxSearchAccountMcProps {
  showFilter?: boolean;
  handleSubmitSearch: (data: searchParams) => void;
  submitForm: boolean;
  loading: boolean;
  setSubmitForm: (a: boolean) => void;
}

export default function BoxSearchUser({
  showFilter,
  handleSubmitSearch,
  submitForm,
  loading,
  setSubmitForm
}: BoxSearchAccountMcProps) {
  const { t } = useTranslation('common');
  const { register, handleSubmit, control, reset, getValues, setValue } = useForm<searchParams>();
  const onSubmit: SubmitHandler<searchParams> = (data, e) => {
    e?.preventDefault();
    // setSubmitForm(true);
    let dataUrl: any = { ...data };
    let formatDataUrl = dataUrl?.search === undefined ? { ...dataUrl, search: '' } : dataUrl;
    let newURL = updateURLParameter(window.location.href, 'locId', 'newLoc');
    newURL = updateURLParameter(newURL, 'resId', 'newResId');
    for (let obj in formatDataUrl) {
      if (obj == 'createdAt') {
        if (Object.keys(formatDataUrl[obj]).length != 0) {
          window.history.replaceState(
            '',
            '',
            updateURLParameter(
              window.location.href,
              'from',
              encodeURIComponent(formatDataUrl[obj]?.from || '')
            )
          );
          // encodeURIComponent(dayjs(formatDataUrl[obj].to).format('YYYY-MM-DD'))
          // fromat day
          window.history.replaceState(
            '',
            '',
            updateURLParameter(
              window.location.href,
              'to',
              encodeURIComponent(formatDataUrl[obj]?.to || '')
            )
          );
        }
      } else {
        window.history.replaceState(
          '',
          '',
          updateURLParameter(window.location.href, obj, encodeURIComponent(formatDataUrl[obj]))
        );
      }
    }
    handleSubmitSearch && handleSubmitSearch(data);
  };
  useEffect(() => {
    if (submitForm) {
      handleSubmitSearch && handleSubmitSearch(getValues());
    }
  }, [submitForm]);
  useEffect(() => {
   
    
    if (Router.query?.search) {
      setSubmitForm(true);
      let dataUrl: any = Router.query;
      setValue('search', dataUrl?.search || '');
    } else {
      handleSubmitSearch({search: ''})
    }

  }, []);
  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='account-manage__box-search d-flex flex-wrap align-items-end'>
          <Form.Group className='form-group form-search w__300 mr-3' >
            {/* <Form.Label>
              {t('Tìm kiếm')}
            </Form.Label> */}
            <Form.Control
              type='text'
              placeholder={t('Nhập : Số điện thoại, Họ tên, Email,Tên đăng nhập')}
              {...register('search')}
              autoComplete='off'
            />
          </Form.Group>
          <Form.Group className=' form-btn'>
            <button
              type='submit'
              className='btn btn-primary btn-search'
              style={{ minWidth: '120px' }} disabled={loading}>

              {loading ? <i className="fa fa-spinner fa-spin"></i> : <i className='fas fa-search'></i>}
              {t('Tìm kiếm')}
            </button>
          </Form.Group>



        </div>
      </Form>
      {/* <div className='deposit-manage__box-search'>
      <form onSubmit={handleSubmit(handleSubmitSearchForm)}>
        <div className='form-group form-search'>
          <label>{t('Tất cả Merchant')}</label>
          <AsyncSelectMerchant
            control={control}
            clearError={clearErrors}
            name='merchantId'
            {...{
              className: 'search-merchant-select',
              classNamePrefix: 'merchant-async-select',
            }}
          />
        </div>
        <div className='form-btn'>
          <button className='btn btn-primary btn-search'>
            <i className='fas fa-search'></i>
            {t('Tìm kiếm')}
          </button>
        </div>
      </form>
    </div> */}
      {/* <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='d-flex justify-content-between flex-wrap'>
          <Form.Group className='mb-0 w__300'>
            <Form.Control
              type='text'
              placeholder={t('Nhập : Số điện thoại, Họ tên, Email,Tên đăng nhập')}
              {...register('search')}
            />
          </Form.Group>
          <Form.Group className='padding__left1 mb-0'>
            <button
              type='submit'
              className='btn btn-primary btn-add '
              style={{ minWidth: '120px' }}>
              <i className='fas fa-search'></i> {t('Tìm kiếm')}
            </button>
          </Form.Group>
        </div>
      </Form> */}
    </>
  );
}
