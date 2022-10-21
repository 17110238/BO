import i18next from 'i18next';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import AsyncSelect from 'components/common/AsyncSelect/AsyncSelect';
import dayjs from 'dayjs';
import ReactSelect, { defaultTheme, SingleValue } from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { SubscriptionClient } from 'graphql-subscriptions-client';
import FileSaver from 'file-saver';
import { handleDowloadSaga } from 'redux/actions/handleDowloadActions';
import {
  exportFileMismatchTransactions,
  exportFileMismatchTransactionsFailure,
  exportFileMismatchTransactionsSuccess,
} from 'redux/actions/transferActions';
import alert from 'utils/helpers/alert';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import utc from 'dayjs/plugin/utc';
import numeral from 'numeral';
dayjs.extend(utc);

const query1 = `
  subscription ExportMismatchTransactions {
    SubExport {
      SubExportExcel {
        message
        succeeded
        type
        accountId
        url
        data
      }
    }
  }
`;

export interface SearchParams {
  merchantId?: number;
  createdAt?: {
    from?: string;
    to?: string;
  };
  supplierTransaction?: string;
  paymentId?: string;
  amount?: number;
  description?: string;
  supplierState?: string;
  paymentState?: string;
}

interface BoxSearchTransferProps {
  showFilter?: boolean;
  submitForm: boolean;
  filter: any;
  handleSubmitSearch?: (data: SearchParams) => void;
  handleClearForm?: () => void;
  onChangeDateSearch?: (data: Date, name: string) => void;
  setSubmitForm: (a: boolean) => void;
  convertState: (state: string) => string;
  getPayloadFromURL: () => any;
}

export default function BoxSearchTransfer({
  showFilter,
  handleSubmitSearch,
  handleClearForm,
  submitForm = false,
  setSubmitForm,
  convertState,
  getPayloadFromURL,
  filter,
}: BoxSearchTransferProps) {
  const { t } = useTranslation('common');
  const query = useRouter().query;
  const refSelect = useRef<any>();
  const accountIdLogin = useSelector<any>(
    (state) => state?.authReducers?.accountInfo?.profile.accountId
  );
  const dispatch = useDispatch();
  const isLoading = useSelector<any, boolean>((state) => state?.transferReducer?.loading);
  const [socket, setSocket] = useState<string>('');
  const client = new SubscriptionClient(socket, {
    reconnect: true,
    lazy: true, // only connect when there is a query
    connectionCallback: (error) => {
      error && console.error(error);
    },
  });

  const [amountt, setAmountt] = useState<number>(0)

  const defaultStartDate = dayjs().subtract(30, 'day').startOf('day').utc().format();
  const defaultEndDate = dayjs().endOf('date').utc().format();

  const defaultValues = {
    createdAt: {
      from: defaultStartDate,
      to: defaultEndDate,
    },
  };

  useEffect(() => {
    let socket = new WebSocket(`${process.env.NEXT_PUBLIC_GAPI_GRAPHQL_URL_WS}/graphql`);
    setSocket(socket.url);
  }, []);

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    e.key === 'Enter' && isLoading && e.preventDefault();
  };

  const supplierStates = [
    {
      label: 'Tất cả trạng thái NH',
      value: '',
    },
    {
      label: convertState('SUCCESS'),
      value: 'SUCCESS',
    },
    {
      label: convertState('PENDING'),
      value: 'PENDING',
    },
  ];

  const paymentStates = [
    {
      label: 'Tất cả trạng thái CTT',
      value: '',
    },
    {
      label: convertState('PENDING'),
      value: 'PENDING',
    },
    {
      label: convertState('SUCCEEDED'),
      value: 'SUCCEEDED',
    },
    {
      label: convertState('CANCELED'),
      value: 'CANCELED',
    },
    {
      label: convertState('FAILED'),
      value: 'FAILED',
    },
  ];

  const { register, getValues, setValue, control, handleSubmit, reset, clearErrors } =
    useForm<SearchParams>({
      defaultValues,
    });

  const getDateInput = (type: string, endDate: any, startDate: any = null) => {
    if (type === 'from') {
      if (startDate) return startDate;
      else if (!endDate) return defaultStartDate;
      else return dayjs().subtract(30, 'day').startOf('day').utc().format();
    } else {
      if (endDate) return endDate;
      else return defaultEndDate;
    }
  };

  const onSubmit: SubmitHandler<SearchParams> = (data: any) => {
    setValue('createdAt.from', getDateInput('from', data.createdAt.to, data.createdAt.from));
    setValue('createdAt.to', getDateInput('to', data.createdAt.to));
    handleSubmitSearch && handleSubmitSearch(data);
  };

  const sub = client.request({ query: query1 });
  const handleExportMismatchTransactions = async () => {
    dispatch(exportFileMismatchTransactions(filter, () => {}));

    sub.subscribe({
      next({ data }: any) {
        let dataForm = data?.SubExport?.SubExportExcel;
        let urlData = data?.SubExport?.SubExportExcel?.data;
        dispatch(
          handleDowloadSaga({ data: `${urlData}` }, async (state, res) => {
            if (state && dataForm?.accountId === accountIdLogin) {
              await FileSaver.saveAs(res, `${new Date().getTime()}.xlsx`);
              dispatch(exportFileMismatchTransactionsSuccess());
              alert('success', 'Xuất file thành công', t);
            } else {
              dispatch(exportFileMismatchTransactionsFailure());
              alert('error', 'Xuất file thất bại', t);
            }
          })
        );
      },
    });
  };

  useEffect(() => {
    if (Object.keys(query)?.length !== 0) {
      const payload = getPayloadFromURL();
      reset(payload);
    }
  }, []);

  const allowOnlyNumber = (value: string) => {
    return value.replace(/[^0-9]/g, '');
  };

  return (
    <>
      {showFilter && (
        <div className='box-search-transfer-list'>
          <Form onSubmit={handleSubmit(onSubmit)} onKeyDown={(e) => checkKeyDown(e)}>
            <Form.Group as={Col} className='merchant-dropdown-list' xl='2' sm='3'>
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

            <Form.Group as={Col} className='trans-id' xl='2' md='2' sm='3'>
              <Form.Control
                type='text'
                placeholder={`${t('Enter')}: ${
                  t('Mã NCC').charAt(0).toLocaleLowerCase() + t('Mã NCC').slice(1)
                }`}
                autoComplete='off'
                {...register('supplierTransaction')}
                onChange={(e) => setValue('supplierTransaction', e.target.value.trim())}
              />
            </Form.Group>

            <Form.Group as={Col} className='order-id' xl='2' md='2' sm='3'>
              <Form.Control
                type='text'
                placeholder={`${t('Enter')}: ${
                  t('Mã thanh toán').charAt(0).toLocaleLowerCase() + t('Mã thanh toán').slice(1)
                }`}
                autoComplete='off'
                {...register('paymentId')}
                onChange={(e) => setValue('paymentId', e.target.value.trim())}
              />
            </Form.Group>

            <Form.Group as={Col} className='amount' xl='2' md='2' sm='2'>
                  <Controller
                  control={control}
                  name='amount'
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Form.Control
                      className='mb-1'
                      maxLength={15}
                      placeholder={`${t('Enter')}: ${t('Số tiền').toLowerCase()}`}
                      onChange={(e) => {
                        onChange(+allowOnlyNumber(e.target.value));
                      }}
                      value={value ? numeral(value).format('0,0') : ''}
                    />
                  )}
                />
            </Form.Group>

            <Form.Group as={Col} className='description' xl='2' md='2' sm='12'>
              <Form.Control
                type='text'
                placeholder={`${t('Enter')}: ${
                  t('Nội dung').charAt(0).toLocaleLowerCase() + t('Nội dung').slice(1)
                }`}
                autoComplete='off'
                {...register('description')}
                onChange={(e) => setValue('description', e.target.value.trim())}
              />
            </Form.Group>

            <Form.Group as={Col} className='supplier-state-dropdown-list' xl='2' md='2' sm='2'>
              <Controller
                control={control}
                name={'supplierState'}
                defaultValue={''}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <ReactSelect
                    styles={{
                      ...customStyles,
                      menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                      menu: (provided) => ({ ...provided, zIndex: 2 }),
                    }}
                    defaultValue={supplierStates[0]}
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: '#EFF2F7',
                        primary: '#00be00',
                      },
                    })}
                    options={supplierStates}
                    value={supplierStates.find((val) => val.value === value)}
                    placeholder=''
                    onChange={(e: SingleValue<any>) => onChange(e.value)}
                  />
                )}
              />
            </Form.Group>

            <Form.Group as={Col} className='payment-state-dropdown-list' xl='2' md='2' sm='2'>
              <Controller
                control={control}
                name={'paymentState'}
                defaultValue={''}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <ReactSelect
                    styles={{
                      ...customStyles,
                      menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                      menu: (provided) => ({ ...provided, zIndex: 2 }),
                    }}
                    defaultValue={paymentStates[0]}
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: '#EFF2F7',
                        primary: '#00be00',
                      },
                    })}
                    options={paymentStates}
                    value={paymentStates.find((val) => val.value === value)}
                    placeholder=''
                    onChange={(e: SingleValue<any>) => onChange(e.value)}
                  />
                )}
              />
            </Form.Group>

            <div className='form-group px-3 form-date form-search'>
              <div className='date-picker-custom'>
                <DatePickerCustomV2 placeholder={'DD/MM/YYYY'} control={control} />
              </div>
            </div>

            <div className='d-flex ml-3 search-button-group'>
              <button className='btn btn-primary btn-search' disabled={isLoading}>
                <i className='fas fa-analytics'></i>
                <p>{t('Thống kê')}</p>
              </button>
              <button
                type='button'
                className='btn btn-export disable-hover'
                onClick={handleExportMismatchTransactions}>
                <img src={`/assets/icon/export-icon.png`} alt='export=icon' />
                {t('Xuất file')}
              </button>
            </div>
          </Form>
        </div>
      )}
    </>
  );
}
