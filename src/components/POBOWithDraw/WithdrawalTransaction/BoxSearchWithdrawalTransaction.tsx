import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import dayjs from 'dayjs';
import i18next from 'i18next';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect, { SingleValue } from 'react-select';
import AsyncSelect from 'components/common/AsyncSelect/AsyncSelect';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import _ from 'lodash';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import FileSaver from 'file-saver';
import { SubscriptionClient } from 'graphql-subscriptions-client';
import { handleDowloadSaga } from 'redux/actions/handleDowloadActions';
import * as types from 'redux/types';
import { exportWithDraw } from 'redux/actions';
import alert from 'utils/helpers/alert';
const querySub = `subscription subExportMc {
  SubExport{
      SubExportExcel{
          message
          succeeded
          type
          accountId
          url
          data
      }
    }
  }`;
export interface SearchParams {
  typeId?: string;
  search?: string;
  method?: string;
  state?: string;
  destination?: string;
  transactionId?: string;
  partnerTransaction?: string;
  supplierTransaction?: string;
  bankTransaction?: string;
  merchantId?: string;
  createdAt?: {
    from?: any;
    to?: any;
  };
}
interface Props {
  showFilter?: boolean;
  valuesSearch?: SearchParams;
  submitForm: boolean;
  handleSubmitSearch?: (data: SearchParams) => void;
  handleClearForm?: () => void;
  onChangeDateSearch?: (data: Date, name: string) => void;
  withdrawList?: any[];
  setSubmitForm: (a: boolean) => void;
  boxSearchRef: any;
  filter: any;
  isLoading: boolean;
}

const transactionState = [
  'Tất cả trạng thái',
  'PENDING',
  'SUCCEEDED',
  'CANCELED',
  'FAILED',
  'REVIEW',
];

const methodState = ['Tất cả PTTT', 'WALLET', 'BANK'];

const typeIdState = [
  'transactionId',
  'bankTransaction',
  'supplierTransaction',
  'partnerTransaction',
  'merchantId',
];

export default function BoxSearchWithdrawalTransaction({
  showFilter,
  handleSubmitSearch,
  handleClearForm,
  submitForm,
  setSubmitForm,
  boxSearchRef,
  isLoading,
  filter,
}: Props) {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const { query }: any = useRouter();
  const [isLoadingExport, setIsLoadingExport] = useState<boolean>(false)
  const dispatch = useDispatch()

  const {
    register,
    getValues,
    control,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<SearchParams>({
    shouldFocusError: false,
    reValidateMode: 'onSubmit',
    defaultValues: {
      createdAt: {
        from: dayjs().subtract(30, 'day').startOf('date').toISOString(),
        to: dayjs().endOf('date').toISOString(),
      },
      typeId: 'transactionId',
    },
  });

  const updateURLParameter = (url: string, param: any, paramVal: any): string => {
    let newAdditionalURL = '';
    let tempArray = url.split('?');
    let baseURL = tempArray[0];
    let additionalURL = tempArray[1];
    let temp = '';
    if (additionalURL) {
      tempArray = additionalURL.split('&');
      for (let i = 0; i < tempArray.length; i++) {
        if (tempArray[i].split('=')[0] != param) {
          newAdditionalURL += temp + tempArray[i];
          temp = '&';
        }
      }
    }
    let rows_txt = temp + '' + param + '=' + paramVal;
    return baseURL + '?' + newAdditionalURL + rows_txt;
  };

  const [bankSelect, setBankSelect] = useState<string>('');
  const [showbankSelect, setShowBankSelect] = useState<boolean>(false);

  const onSubmit: SubmitHandler<SearchParams> = (data: any, e) => {
    e?.preventDefault();
    let temp = {
      ...data,
      from: data.createdAt?.from ? data.createdAt?.from : '',
      to: data.createdAt?.to ? data.createdAt?.to : '',
    };

    let payload = {
      ...data,
      transactionId: data.typeId === 'transactionId' ? data.search.trim() : '',
      partnerTransaction: data.typeId === 'partnerTransaction' ? data.search.trim() : '',
      bankTransaction: data.typeId === 'bankTransaction' ? data.search.trim() : '',
      supplierTransaction: data.typeId === 'supplierTransaction' ? data.search.trim() : '',
      merchantId:
        data.typeId === 'merchantId' ? (data.merchantId ? data.merchantId.toString() : '') : '',
    };

    !data.createdAt?.from && delete payload.createdAt.from;
    !data.createdAt?.to && delete payload.createdAt.to;

    for (let key in payload) {
      if (payload.hasOwnProperty(key)) {
        if (payload[key] === '') {
          delete payload[key];
        }
      }
    }

    for (let key in temp) {
      if (temp.hasOwnProperty(key)) {
        if (temp[key] === '' || temp[key] === undefined) {
          delete temp[key];
        }
      }
    }

    delete temp.createdAt;
    for (const key in temp) {
      if (Array.isArray(temp[key]) && temp[key].length > 0) {
        window.history.replaceState(
          '',
          '',
          updateURLParameter(window.location.href, key, encodeURIComponent(temp[key][0]))
        );
      } else {
        window.history.replaceState(
          '',
          '',
          updateURLParameter(window.location.href, key, encodeURIComponent(temp[key]))
        );
      }
    }
    handleSubmitSearch && handleSubmitSearch(payload);
  };

  useEffect(() => {
    if (Object.keys(query).length > 0) {
      const from = dayjs().subtract(30, 'day').toISOString();
      const to = dayjs().endOf('date').toISOString();
      if (query?.from && query?.to)
        setValue('createdAt', { from: query.from.toString(), to: query.to.toString() });
      if (query?.from && !query?.to) setValue('createdAt', { from: query.from.toString() });
      if (!query?.from && query?.to) setValue('createdAt', { to: query.to.toString() });
    }
  }, [query?.search, query?.state, query?.method, query?.from, query?.to]);

  useEffect(() => {
    if (Object.keys(query).length > 0) {
      let flag = false;
      let temp: SearchParams = {};
      let from = query?.from && query?.from !== '' ? query?.from : '';
      let to = query?.to && query?.to !== '' ? query?.to : '';
      for (const key in query) {
        if (new RegExp(`<[^>]*script`).test(query[key])) {
          flag = false;
          break;
        }
        flag = true;
      }
      if (flag) {
        temp = {
          ...temp,
          search: query?.search ? query?.search : '',
        };
        if (!(from && to)) {
          temp = {
            ...temp,
            createdAt: {
              from: dayjs().subtract(30, 'day').toISOString(),
              to: dayjs().endOf('date').toISOString(),
            },
          };
        }
        if (from && to) {
          temp = {
            ...temp,
            createdAt: {
              from,
              to,
            },
          };
        }
        if (to && !from) {
          temp = {
            ...temp,
            createdAt: {
              to,
            },
          };
          delete temp?.createdAt?.from;
        }
        if (from && !to) {
          temp = {
            ...temp,
            createdAt: {
              from,
            },
          };
          delete temp?.createdAt?.to;
        }
      }
      handleSubmitSearch && handleSubmitSearch(temp);
    }
  }, [query?.search, query?.state, query?.method, query?.from, query?.to]);

  const transactionStateOptions = transactionState.map((transaction) => ({
    value: transaction === 'Tất cả trạng thái' ? '' : transaction,
    label: t(`${transaction}`),
  }));

  const paymentMethodOptions = methodState.map((paymentMethod) => ({
    value: paymentMethod === 'Tất cả PTTT' ? '' : paymentMethod,
    label: t(`${paymentMethod}`),
  }));

  const transactionIdOptions = typeIdState.map((transaction) => ({
    value: transaction,
    label: t(`${transaction}`),
  }));

  const [maGDPlayhoder, setMaGDPlayhoder] = useState<boolean>(true);
  const [maNHPlayhoder, setMaNHPlayhoder] = useState<boolean>(false);
  const [maNCClayhoder, setMaNCClayhoder] = useState<boolean>(false);
  const [maDTPlayhoder, setMaDTPlayhoder] = useState<boolean>(false);

  useEffect(() => {
    if (bankSelect === 'merchantId') {
      setShowBankSelect(true);
    } else {
      setShowBankSelect(false);
    }
    if (bankSelect === 'bankTransaction') {
      setMaGDPlayhoder(false);
      setMaNHPlayhoder(true);
      setMaNCClayhoder(false);
      setMaDTPlayhoder(false);
    }
    if (bankSelect === 'supplierTransaction') {
      setMaGDPlayhoder(false);
      setMaNHPlayhoder(false);
      setMaNCClayhoder(true);
      setMaDTPlayhoder(false);
    }
    if (bankSelect === 'partnerTransaction') {
      setMaGDPlayhoder(false);
      setMaNHPlayhoder(false);
      setMaNCClayhoder(false);
      setMaDTPlayhoder(true);
    }
    if (bankSelect === 'transactionId') {
      setMaGDPlayhoder(true);
      setMaNHPlayhoder(false);
      setMaNCClayhoder(false);
      setMaDTPlayhoder(false);
    }
  }, [bankSelect]);

  const accountIdLogin = useSelector<any>(
    (state) => state?.authReducers?.accountInfo?.profile.accountId
  );


  useEffect(() => {
    let socket = new WebSocket(`${process.env.NEXT_PUBLIC_GAPI_GRAPHQL_URL_WS}/graphql`);
    setSocket(socket.url);
  }, []);

  const [socket, setSocket] = useState('');
  const client = new SubscriptionClient(socket, {
    reconnect: true,
    lazy: true, // only connect when there is a query
    connectionCallback: (error) => {
      error && console.error(error);
    },
  });
  const sub = client.request({ query: querySub });
  const exportWithDrawFile = async () => {
    setIsLoadingExport(true);
    dispatch(exportWithDraw({ ...filter }, (status, res) => { }));
    sub.subscribe({
      next({ data }: any) {
        let dataForm = data?.SubExport?.SubExportExcel;
        let urlData = data?.SubExport?.SubExportExcel?.data;
        client?.unsubscribeAll();
        dispatch(
          handleDowloadSaga({ data: `${urlData}` }, async (state, res) => {
            if (state && dataForm.accountId === accountIdLogin) {
              await FileSaver.saveAs(res, `${new Date().getTime()}.xlsx`);
              // dispatch(exportFileTransactionSucess());
              dispatch({
                type: types.EXPORT_WITH_DRAW.SUCCESS,
              });
              alert('success', 'Xuất file thành công', t);
              setIsLoadingExport(false)
            } else {
              // dispatch(exportFileTransactionFailure());
              dispatch({
                type: types.EXPORT_WITH_DRAW.FAILURE,
              });
              alert('error', 'Xuất file thất bại', t);
              setIsLoadingExport(false)
            }
          })
        );
      },
    });
  };

  return (
    <>
      <div className='box-search-withdrawal' ref={boxSearchRef}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group as={Col} className='transactionId' xl='3' md='6' sm='4'>
            <Controller
              control={control}
              name={'typeId'}
              defaultValue={''}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <ReactSelect
                  styles={{
                    ...customStyles,
                    menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                    menu: (provided) => ({ ...provided, zIndex: 2 }),
                  }}
                  defaultValue={{ value: 'transactionId', label: 'Mã giao dịch' }}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary25: '#EFF2F7',
                      primary: '#00be00',
                    },
                  })}
                  options={transactionIdOptions}
                  value={transactionIdOptions.find((val) => val.value === value)}
                  onChange={(e: SingleValue<any>) => {
                    onChange(e.value), setBankSelect(e.value);
                  }}
                />
              )}
            />
          </Form.Group>

          {showbankSelect ? (
            <Form.Group as={Col} className='search-merchant' xl='3' md='6' sm='4'>
              <AsyncSelect
                asyncType='MERCHANT'
                control={control}
                clearError={clearErrors}
                name='merchantId'
                keyReturn='merchantId'
                {...{
                  className: 'search-merchant-select',
                  classNamePrefix: 'merchant-async-select',
                }}
              />
            </Form.Group>
          ) : (
            <Form.Group as={Col} className='search' md='6' xl='3' sm='4'>
              <Form.Control
                type='text'
                placeholder={
                  maGDPlayhoder
                    ? t('Enter_transaction_code')
                    : maNHPlayhoder
                      ? t('Enter_your_bank_transaction_code')
                      : maNCClayhoder
                        ? t('Enter supplier transaction code')
                        : maDTPlayhoder
                          ? t('Enter the partner transaction code')
                          : ''
                }
                autoComplete='off'
                {...register('search')}
              />
            </Form.Group>
          )}

          <Form.Group as={Col} className='state' xl='3' md='6' sm='4'>
            <Controller
              control={control}
              name={'state'}
              defaultValue={''}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <ReactSelect
                  styles={{
                    ...customStyles,
                    menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                    menu: (provided) => ({ ...provided, zIndex: 2 }),
                  }}
                  defaultValue={{ value: '', label: t('Tất cả trạng thái') }}
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
                  // placeholder={i18next.language === 'vi' ? 'Không tìm được kết quả' : 'No options'}
                  options={transactionStateOptions}
                  value={transactionStateOptions.find((val) => val.value === value)}
                  onChange={(e: SingleValue<any>) => onChange(e.value)}
                />
              )}
            />
          </Form.Group>

          <Form.Group as={Col} className='method' xl='3' md='6' sm='4'>
            <Controller
              control={control}
              name={'destination'}
              defaultValue={''}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <ReactSelect
                  styles={{
                    ...customStyles,
                    menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                    menu: (provided) => ({ ...provided, zIndex: 2 }),
                  }}
                  defaultValue={{ value: '', label: t('Tất cả PTTT') }}
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
                  // placeholder={i18next.language === 'vi' ? 'Không tìm được kết quả' : 'No options'}
                  options={paymentMethodOptions}
                  value={paymentMethodOptions.find((val) => val.value === value)}
                  onChange={(e: SingleValue<any>) => onChange(e.value)}
                />
              )}
            />
          </Form.Group>

          <div className='form-group ml-3 form-date'>
            <div className='date-picker-custom'>
              <DatePickerCustomV2
                placeholder={'DD/MM/YYYY'}
                control={control}
                className={`${errors?.createdAt?.from ? ' date-picker-from-error' : ' '}
              ${errors?.createdAt?.to ? ' date-picker-to-error' : ' '}
              `}
                rules={{ from: { required: true }, to: { required: true } }}
              />
            </div>
          </div>

          <div className='ml-3 search-button-group d-flex'>
            <button className='btn btn-primary btn-search' disabled={isLoading as any}>
              <i className='fas fa-search'></i>
              {t('Tìm kiếm')}
            </button>
            <button
              type='button'
              className={`btn disableHover btn-export`}
              onClick={exportWithDrawFile}
              style={{ whiteSpace: 'nowrap' }}
            >
              <img src='/assets/icon/export-icon.png' alt='export=icon' />
              {t('Xuất file')}
            </button>
          </div>
        </Form>
      </div>
      {isLoadingExport && <LoadingFullScreen />}
    </>
  );
}
