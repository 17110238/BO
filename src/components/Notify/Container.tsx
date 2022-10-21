import React, { useEffect, useState, useRef } from 'react';
import InlineLoading from 'components/common/Loading/LoadingInline';
import Loading from 'components/common/Loading/LoadingFullScreen';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getHistory, sendSms } from 'redux/actions/notifyActions';
import { GetLogType, GetLogInput, NotifyState } from 'models';
import { useTranslation } from 'react-i18next';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import ReactSelect, { SingleValue } from 'react-select';
import { Input } from 'ui/Form';
import alert from 'utils/helpers/alert';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import HeaderSendSMS from './HeaderSendSMS';
import HeaderHistory from './Header';
import BoxSearchHistory from './BoxSearch';
import DataTableHistory from './DataTable';
import { useRouter } from 'next/router';

export interface SearchParams {
  search?: string;
  state?: string;
  createdAt?: {
    from?: string;
    to?: string;
  };
}

function index() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setShowFilter(!showFilter);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(true);
  const [selectedInputMethod, setSelectedInputMethod] = useState<string>('manual');
  const [phoneList, setPhoneList] = useState<any>([]);
  const [fileName, setFileName] = useState<string>('');
  const [filter, setFilter] = useState({});
  const [smsHistory, setSmsHistory] = useState<GetLogType[]>([]);
  const isLoadingSms = useSelector<any, NotifyState>(
    (state) => state?.notifyReducer.loadingSendSMS
  );
  const [showHistory, setShowHistory] = useState<boolean>(true);
  const [showFormSms, setShowFormSms] = useState<boolean>(true);
  const [showHistoryMinHeight, setShowHistoryMinHeight] = useState<boolean>(false);

  const handleGetHistory = (start?: number, limit?: number, sort?: {}) => {
    const payload: GetLogInput = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function handleGetHistory(payload: GetLogInput) {
      dispatch(
        getHistory(payload, (status, res) => {
          setSmsHistory(res);
          setSubmitForm(false);
        })
      );
    }

    return {
      payload,
      getList: handleGetHistory,
      submitForm,
    };
  };

  const getPayloadFromURL = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const payload: any = {};
    payload.createdAt = {};
    searchParams.forEach((value, key) => {
      if (key === 'from') {
        payload.createdAt.from = value;
      } else if (key === 'to') {
        payload.createdAt.to = value;
      } else {
        payload[key] = value;
      }
    });

    if (payload.createdAt && Object.keys(payload.createdAt).length === 0) delete payload.createdAt;

    return payload;
  };

  useEffect(() => {
    const payload = getPayloadFromURL();
    if (Object.keys(payload).length !== 0) {
      handleSubmitSearch && handleSubmitSearch(payload);
    }
  }, []);

  const updateURLParams = (filter: any) => {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams();
    for (const key in filter) {
      if (filter[key]) {
        if (key === 'createdAt') {
          if (filter.createdAt?.from) searchParams.set('from', filter.createdAt?.from);
          if (filter.createdAt?.to) searchParams.set('to', filter.createdAt?.to);
        } else {
          searchParams.set(key, filter[key]);
        }
      } else {
        searchParams.delete(key);
      }
    }
    if (searchParams.toString())
      router.replace(path + '?' + searchParams.toString(), undefined, { shallow: true });
    else router.replace(path, undefined, { shallow: true });
  };

  const handleSubmitSearch: SubmitHandler<SearchParams> = (data) => {
    const payload: any = { ...data };
    payload.createdAt &&
      Object.keys(payload?.createdAt).forEach(
        (key) => !payload.createdAt[key] && delete payload.createdAt[key]
      );

    Object.keys(payload).forEach((key) => !payload[key] && delete payload[key]);

    if (payload.createdAt && Object.keys(payload.createdAt).length === 0) delete payload.createdAt;

    updateURLParams(payload);
    setFilter({ ...payload });
    setSubmitForm(true);
  };

  const handleChangeTags = (tags: any) => {
    setPhoneList(tags);
    setValue('phoneList', tags);
  };

  const handleHideSmsBox = () => {
    if (showFormSms) {
      setShowFormSms(false);
    } else {
      setShowFormSms(true);
    }
  };

  const handleHideHistoryBox = () => {
    if (showHistory) {
      setShowHistory(false);
    } else {
      setShowHistory(true);
    }
  };

  const defaultValues = {
    campaign: '',
    content: '',
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
    setValue,
    setError,
    clearErrors,
  } = useForm<any>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
  });

  const resetForm = () => {
    reset();
    setPhoneList([]);
    setFileName('');
  };

  const resetCustomerSets = () => {
    setPhoneList([]);
    setValue('content', '');
  };

  const handleUploadFile = (e: any) => {
    const name = e.target.files[0]?.name;
    if (name) {
      setFileName(name);
    } else {
      setFileName('');
    }
  };

  const onSubmit = (data: any) => {
    let payload;

    if (data.file?.length > 0) {
      payload = {
        campaign: data.campaign,
        file: data.file[0],
      };
    } else if (phoneList.length) {
      payload = {
        campaign: data.campaign,
        content: data.content,
        phoneList,
      };
    } else {
      payload = {
        campaign: data.campaign,
        content: data.content,
      };
    }

    dispatch(
      sendSms(payload, (status, response) => {
        if (status) {
          setSubmitForm(true);
          resetForm();
          alert('success', response);
        } else {
          alert('error', response);
        }
        setSubmitForm(false);
      })
    );
  };

  const inputMethods = [
    {
      label: 'Nhập thủ công',
      value: 'manual',
    },
    {
      label: 'Import file',
      value: 'import',
    },
  ];

  const notificationTypes = [
    {
      label: 'SMS',
      value: 'sms',
    },
  ];

  const allowOnlyNumber = (value: any) => {
    if (/[0-9]/.test(value.key)) {
      value.preventDefault();
    }
  };

  return (
    <div className='send-notify-container'>
      <div className='send-sms'>
        <HeaderSendSMS t={t} handleHideSmsBox={handleHideSmsBox} showFormSms={showFormSms} />
        {showFormSms && (
          <form className='send-sms-content-box' onSubmit={handleSubmit(onSubmit)}>
            <div className='form-input'>
              <label>{t('Loại')}</label>
              <Controller
                control={control}
                name={'notificationType'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <ReactSelect
                    defaultValue={notificationTypes[0]}
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: '#EFF2F7',
                        primary: '#00be00',
                      },
                    })}
                    styles={{
                      ...customStyles,
                      menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                      menu: (provided) => ({ ...provided, zIndex: 2 }),
                    }}
                    options={notificationTypes}
                    value={notificationTypes.find((val) => val.value === value)}
                    onChange={(e: SingleValue<any>) => onChange(e.value)}
                  />
                )}
              />
            </div>

            <div className='form-input'>
              <label>
                {t('Chiến dịch')}
                <span className='text-danger'> (*)</span>
              </label>
              <input
                {...register('campaign', { required: 'Chiến dịch không được rỗng' })}
                type='text'
                className='form-control'
                placeholder={t('Nhập chiến dịch')}
              />
              {errors?.campaign && (
                <p className='mt-10 mb-0 txt-valid'>
                  <i className='i-valid' />
                  {errors?.campaign?.message}
                </p>
              )}
            </div>

            <div className='form-input'>
              <label>
                {t('Tập khách hàng')}
                <span className='text-danger'> (*)</span>
              </label>
              <Controller
                control={control}
                name={'customerSets'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <ReactSelect
                    defaultValue={inputMethods[0]}
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: '#EFF2F7',
                        primary: '#00be00',
                      },
                    })}
                    styles={{
                      ...customStyles,
                      menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                      menu: (provided) => ({ ...provided, zIndex: 2 }),
                    }}
                    options={inputMethods}
                    value={inputMethods.find((val) => val.value === value)}
                    onChange={(e: SingleValue<any>) => {
                      onChange(e.value);
                      resetCustomerSets();
                      setSelectedInputMethod(e.value);
                    }}
                  />
                )}
              />

              {selectedInputMethod === 'manual' && (
                <div className='form-input corresponding-input-content'>
                  <TagsInput
                    {...register('phoneList', {
                      required: 'Danh sách số điện thoại không được rỗng',
                      valueAsNumber: true,
                    })}
                    value={phoneList}
                    validationRegex={/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/}
                    onChange={handleChangeTags}
                    addKeys={[188, 13]}
                    inputProps={{
                      placeholder: t('Nhập danh sách số điện thoại cách nhau dấu ,'),
                      style: { minWidth: '300px' },
                    }}
                    addOnBlur={true}
                  />
                  {errors?.phoneList && (
                    <p className='mt-10 mb-3 txt-valid'>
                      <i className='i-valid' />
                      {errors?.phoneList?.message}
                    </p>
                  )}
                  <textarea
                    placeholder='Nhập tin nhắn/email được gửi cho user'
                    rows={3}
                    {...register('content', { required: 'Nội dung không được rỗng' })}
                  />
                  {errors?.content && (
                    <p className='mt-1 mb-0 txt-valid'>
                      <i className='i-valid' />
                      {errors?.content?.message}
                    </p>
                  )}
                </div>
              )}

              {selectedInputMethod === 'import' && (
                <div className='form-input corresponding-input-content'>
                  <label
                    htmlFor='file'
                    className={`btn-upload ${
                      errors?.businessDetails?.identifyImages ? 'btn-upload-error' : ''
                    }`}>
                    <i className='fas fa-file-excel fa-2x'></i>
                    {fileName || t('Import file')}
                  </label>
                  <input
                    id='file'
                    {...register('file')}
                    accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                    type='file'
                    onChange={handleUploadFile}
                  />
                </div>
              )}
            </div>

            <div className='d-flex align-items-center justify-content-center mt-3'>
              <button
                style={{
                  height: 'fit-content',
                  fontSize: 'medium',
                  lineHeight: '36px',
                  minWidth: '120px',
                }}
                type='submit'
                onClick={handleSubmit(onSubmit)}
                className='btn btn-success'>
                {t('Gửi')}
              </button>
            </div>

            {isLoadingSms && <Loading />}
          </form>
        )}
      </div>

      <div className='history'>
        <HeaderHistory
          showFilter={showFilter}
          showHistory={showHistory}
          toggleFilter={toggleFilter}
          t={t}
          handleHideHistoryBox={handleHideHistoryBox}
        />
        <BoxSearchHistory
          showHistory={showHistory}
          showFilter={showFilter}
          submitForm={submitForm}
          handleSubmitSearch={handleSubmitSearch}
          setSubmitForm={setSubmitForm}
          getPayloadFromURL={getPayloadFromURL}
        />
        <DataTableHistory
          t={t}
          data={smsHistory}
          getDataList={handleGetHistory}
          setSubmitForm={setSubmitForm}
          showHistory={showHistory}
        />
      </div>
    </div>
  );
}

export default index;
