import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import FileSaver from 'file-saver';
import { SubscriptionClient } from 'graphql-subscriptions-client';
import i18next from 'i18next';
import {
  MethodEWalletTransactionBOEnum,
  StateEWalletTransactionBoEnum,
  TagEWalletTransactionBoEnum,
} from 'models';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect, { SingleValue } from 'react-select';
import {
  exportFileTransactionHistory,
  exportFileTransactionHistoryFailure,
  exportFileTransactionHistorySucess,
} from 'redux/actions/eWalletTransactionHistoryActions';
import { handleDowloadSaga } from 'redux/actions/handleDowloadActions';
import alert from 'utils/helpers/alert';
import { convertEnumtoArray } from 'utils/helpers/convertEnumtoArray';
import customStyles from 'utils/helpers/customStylesForReactSelect';
dayjs.extend(utc);

const query1 = `subscription subExportMc {
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
  amount?: string | number;
  typeId?: string;
  search?: string;
  select?: {
    transactionId?: string;
    phone?: string;
    accountId?: number;
    id?: number;
    paymentTransaction?: string;
    transportTransaction?: string;
  };
  appId?: number;
  type?: string;
  tags?: string;
  state?: string;
  code?: string;
  method?: string;
  timeType?: string;
  createdAt?: { from?: any; to?: any };
  publishedAt?: { from?: any; to?: any };
}
interface Props {
  showFilter?: boolean;
  valuesSearch?: SearchParams;
  submitForm: boolean;
  handleSubmitSearch?: (data: SearchParams) => void;
  handleClearForm?: () => void;
  onChangeDateSearch?: (data: Date, name: string) => void;
  setSubmitForm: (a: boolean) => void;
  boxSearchRef: any;
  applicationList: any[];
  serviceList: string[];
  filter: any;
  isLoading: boolean;
}
const transService = (text: any) => {
  const lanObj: any = {
    ALL: 'Tất cả dịch vụ',
    BILL: 'Hóa đơn',
    ISEC: 'ISEC',
    SALARY: 'Lương',
    CASHBACK: 'Hoàn tiền',
    ISEC_BULK: 'Số lượng lớn ISEC',
    ISEC_REDEEM: 'Làm tròn ISEC',
    ISEC_SCRATCH: 'ISEC SCRATCH',
    ISEC_SEND: 'ISEC gửi',
    ISEC_SAVE: 'ISEC Tiết kiệm',
    ISEC_RECEIVED: 'ISEC Nhận',
    ISEC_DONATED: 'ISEC Cho/tặng',
    CANCEL_ISEC: 'ISEC Hủy',
    SOCIAL_LINK: 'Link gửi qua mạng xã hội',
    SOCIAL_PAYMENT: 'Thanh toán qua truyền thông xã hội',
    SOCIAL_DONATE_MONEY_LINK: 'Link gửi tiền quyên góp thông qua truyền thông xã hội',
    SOCIAL_DONATE_MONEY: 'Tiền quyên góp thông qua truyền thông xã hội',
    SOCIAL_REQUEST_MONEY_LINK: 'Link Yêu cầu chuyển tiền',
    SOCIAL_SEND_MONEY: 'Gửi tiền qua truyền thông xã hội',
    SOCIAL_SEND_MONEY_LINK: 'Link gửi tiền qua truyền thông xã hội',
    SOCIAL_PAYME_RECEIVE_MONEY: 'Nhận tiền qua link thanh toán từ PayME',
    SOCIAL_NAPAS_RECEIVE_MONEY: 'Nhận tiền qua link thanh toán từ Napas',
    SOCIAL_SEND_MONEY_LINK_RECIPIANT: 'Người nhận chuyển tiền qua liên kết',
    REFUND_MONEY: 'Hoàn tiền',
    ADD_MONEY: 'Nạp Tiền',
    MINUS_MONEY: 'Trừ tiền',
    WITHDRAW_BANK_MANUAL: 'Rút tiền về tài khoản ngân hàng',
    DEPOSIT_BANK_MANUAL: 'Nạp Tiền từ tài khoản ngân hàng',
    LINKED: 'Liên kết thẻ',
    DEPOSIT_PVCBANK: 'Nạp tiền bằng số thẻ ngân hàng',
    WITHDRAW_PVCBANK: 'Rút tiền về số thẻ ngân hàng',
    WITHDRAW_PAYME: 'Rút Về Ví PayME',
    MOBILE_CARD: 'Card di động',
    MOBILE_TOPUP: 'Nạp điện thoại',
    DEPOSIT: ' Nạp tiền',
    PAYMENT: 'Thanh Toán',
    WITHDRAW_BANK_GATEWAY: 'Rút tiền về tài khoản ngân hàng thông qua cổng thanh toán',
    WITHDRAW_BANK_LINKED_PVCBANK: 'Rút tiền về số thẻ ngân hàng đã liên kết',
    WITHDRAW_BANK_LINKED_GATEWAY:
      'Rút tiền về tài khoản ngân hàng thông qua cổng thanh toán đã liên kết',
    WITHDRAW_BANK_LINKED_OCBBANK: 'Rút tiền về tài khoản ngân hàng liên kết OCB',
    PAYME_SEND_MONEY: 'Gửi tiền từ ví PayME',
    PAYME_RECEIVE_MONEY: 'Nhận tiền bằng ví PayME',
    TRANSFER_PAYME: 'Chuyển tiền bằng ví PayME',
    GATEWAY_PAYMENT: 'Cổng thanh toán',
    SOCIAL_PAYMENT_REQUEST_MONEY_LINK: 'Liên kết yêu cầu chuyển tiền',
    SOCIAL_PAYMENT_RECEIVE_REQUEST_MONEY_LINK: 'Liên kết nhận tiền thanh toán',
    SOCIAL_PAYMENT_SEND_MONEY_LINK: 'Liên kết gửi tiền',
    SOCIAL_PAYMENT_DONATE_MONEY_LINK: 'Liên kết nhận Quyên góp',
    SOCIAL_PAYMENT_PAYME_RECEIVE_MONEY: 'Nhận tiền thanh toán từ liên kết vào ví PayME',
    SOCIAL_PAYMENT_NAPAS_RECEIVE_MONEY: 'Nhận tiền thanh toán từ liên kết vào Napas',
    SOCIAL_PAYMENT_SEND_MONEY: 'Gửi tiền thanh toán',
    SOCIAL_PAYMENT_DONATE_MONEY: 'Nhận quyên góp',
    ADVANCE_MONEY: 'Tạm ứng',
    CREDIT_STATEMENT: 'Sao kê tín dụng',
    CREDIT_SETTLEMENT: 'Đối soát tín dụng',
    PAYME_CREDIT: 'Ví tín dụng PayME',
    PAY_QRCODE: 'Thanh toán bằng QR code',
  };
  return lanObj[text] || text;
};
const transLan = (text: any) => {
  const lanObj: any = {
    ALL: 'Tất cả loại GD',
    DEPOSIT: 'Nạp tiền',
    WITHDRAW: 'Rút tiền',
    MOBILE_CARD: 'Thẻ cào điện thoại',
    MOBILE_TOPUP: 'Nạp điện thoại',
    BILL: 'Hoá đơn',
    ISEC: 'ISEC',
    ISEC_CREATE: 'Tạo Isec',
    CASHBACK: 'Hoàn tiền',
    SOCIAL: 'Bên ngoài',
    SOCIAL_PAYMENT: 'Thanh toán qua truyền thông xã hội',
    INTERNAL: 'Nội bộ',
    LINKED: 'Liên kết thẻ',
    BONUS: 'Thưởng',
    DISCOUNT: 'Chiết khấu',
    PAYMENT: 'Thanh toán',
    RECEIVE_MONEY: 'Nhận tiền',
    DEPOSIT_BANK_MANUAL: 'Nạp tiền chuyển khoản',
    PAYME_SALARY: 'Chi lương',
    ADD_MONEY: 'Nạp tiền trực tiếp',
  };
  return lanObj[text] || '';
};

const searchState = [
  'phone',
  'transactionId',
  'accountId',
  'id',
  'paymentTransaction',
  'transportTransaction',
];

const transactionState = [
  'Tất cả trạng thái',
  ...convertEnumtoArray(StateEWalletTransactionBoEnum),
];

const methodState = ['Tất cả Phương thức', ...convertEnumtoArray(MethodEWalletTransactionBOEnum)];

const typeTransaction = ['ALL', ...convertEnumtoArray(TagEWalletTransactionBoEnum)];

const timeState = ['createdAt', 'publishedAt'];

const BoxSearch: React.FC<Props> = ({
  showFilter,
  handleSubmitSearch,
  handleClearForm,
  submitForm = false,
  applicationList,
  boxSearchRef,
  setSubmitForm,
  filter,
  serviceList,
  isLoading,
}) => {
  const { t, i18n } = useTranslation('common');

  const router = useRouter();
  const { query }: any = useRouter();
  const dispatch = useDispatch();
  const [socket, setSocket] = useState('');
  const client = new SubscriptionClient(socket, {
    reconnect: true,
    lazy: true, // only connect when there is a query
    connectionCallback: (error) => {
      error && console.error(error);
    },
  });

  const typeService = ['ALL', ...serviceList];

  useEffect(() => {
    let socket = new WebSocket(`${process.env.NEXT_PUBLIC_GAPI_GRAPHQL_URL_WS}/graphql`);
    setSocket(socket.url);
  }, []);

  const { register, getValues, control, handleSubmit, reset, setValue, clearErrors } =
    useForm<SearchParams>({
      defaultValues: {
        createdAt: {
          from: dayjs().subtract(30, 'day').startOf('day').utc().format(),
          to: dayjs().endOf('date').utc().format(),
        },
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

  const onSubmit: SubmitHandler<SearchParams> = (data: any, e) => {
    e?.preventDefault();
    let temp = {
      ...data,
      from: data.createdAt?.from ? data.createdAt?.from : '',
      to: data.createdAt?.to ? data.createdAt?.to : '',
      amount: data.amount
        ? parseInt(
            data.amount.split(',').reduce((str: string, value: string) => {
              return (str += value);
            }, '')
          )
        : undefined,
    };

    let payload = {
      ...data,
      select: {
        [data.typeId]:
          data.typeId === 'accountId' || data.typeId === 'id'
            ? Number(data.search)
            : data.search.trim(),
      },
      appId: data.appId,
      tags: data.tags,
      state: data.state,
      code: data.code,
      method: data.method,
      createdAt: data.timeType === 'createdAt' ? data.createdAt : '',
      publishedAt: data.timeType === 'publishedAt' ? data.createdAt : '',
      amount: data.amount
        ? parseInt(
            data.amount.split(',').reduce((str: string, value: string) => {
              return (str += value);
            }, '')
          )
        : undefined,
    };

    !data.search && delete payload.select;
    delete payload.timeType;
    for (let key in payload) {
      if (payload.hasOwnProperty(key)) {
        if (!payload[key]) {
          delete payload[key];
        }
      }
    }

    for (let key in temp) {
      if (temp.hasOwnProperty(key)) {
        if (temp[key] === undefined) {
          delete temp[key];
        }
      }
    }

    delete temp.createdAt;
    window.history.replaceState('', '', `/vi-dien-tu/lich-su-giao-dich`);
    for (const key in temp) {
      if (temp[key]) {
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
      if (query?.amount) setValue('amount', query?.amount);
    }
  }, [query?.search, query?.state, query?.method, query?.from, query?.to, query?.amount]);

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
        if (query?.amount) temp = { ...temp, amount: +query?.amount };
        if (!(from && to)) {
          temp = {
            ...temp,
            createdAt: {
              from: dayjs().subtract(30, 'day').startOf('day').utc().format(),
              to: dayjs().endOf('date').utc().format(),
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
  }, [query?.search, query?.state, query?.method, query?.from, query?.to, query?.amount]);

  const transactionStateOptions = transactionState.map((transaction) => ({
    value: transaction === 'Tất cả trạng thái' ? '' : transaction,
    label: t(`${transaction}`),
  }));

  const paymentMethodOptions = methodState.map((paymentMethod) => ({
    value: paymentMethod === 'Tất cả Phương thức' ? '' : paymentMethod,
    label: t(`${paymentMethod}`),
  }));

  const transactionIdOptions = typeTransaction.map((transaction) => ({
    value: transaction === 'ALL' ? '' : transaction,
    label: transLan(transaction),
  }));
  const serviceOptions = typeService.map((service) => ({
    value: service === 'ALL' ? '' : service,
    label: transService(service),
  }));

  const [applicationOptions, setApplicationOptions] = useState<any[]>([
    { label: t('Tất cả ứng dụng'), value: '' },
  ]);

  applicationList.map((application) => {
    let obj: any = {};
    obj.label = application.name;
    obj.value = application.id;
    applicationOptions.push(obj);
  });

  const searchTypeOptions = searchState.map((search) => ({
    value: search,
    label: t(`${search}`),
  }));

  const timeOptions = timeState.map((pobo) => ({
    value: pobo,
    label: t(`${pobo}`),
  }));

  const accountIdLogin = useSelector<any>(
    (state) => state?.authReducers?.accountInfo?.profile.accountId
  );

  const defaultPlayhoderValue = 'phone';
  const [playhoderValue, setPlayhoderValue] = useState<string>(defaultPlayhoderValue);
  const phone = 'phone',
    transactionId = 'transactionId',
    accountId = 'accountId',
    id = 'id',
    paymentTransaction = 'paymentTransaction',
    transportTransaction = 'transportTransaction';
  const handleOnChangeTypeId = (type: string) => {
    let typeFilter: any = {
      phone,
      transactionId,
      accountId,
      id,
      paymentTransaction,
      transportTransaction,
    };
    const value: any = typeFilter[type];
    setPlayhoderValue(value);
  };

  const sub = client.request({ query: query1 });
  const handleExportTransactionHistoryExcelFile = async (type: string) => {
    dispatch(exportFileTransactionHistory({ ...filter }, (state, res) => {}));
    sub.subscribe({
      next({ data }: any) {
        let dataForm = data?.SubExport?.SubExportExcel;
        let urlData = data?.SubExport?.SubExportExcel?.data;
        dispatch(
          handleDowloadSaga({ data: `${urlData}` }, async (state, res) => {
            if (state && dataForm?.accountId === accountIdLogin) {
              await FileSaver.saveAs(res, `${new Date().getTime()}.xlsx`);
              dispatch(exportFileTransactionHistorySucess());
              alert('success', 'Xuất file thành công', t);
            } else {
              dispatch(exportFileTransactionHistoryFailure());
              alert('error', 'Xuất file thất bại', t);
            }
          })
        );
      },
    });
  };

  useEffect(() => {
    return () => {
      dispatch(exportFileTransactionHistoryFailure());
    };
  }, [router]);

  const [phoneTransaction, setPhoneTransaction] = useState<string>('');

  useEffect(() => {
    const url_string = window.location.href;
    const url = new URL(url_string);
    const searchValue = url.searchParams.get('searchValue');
    const type = url.searchParams.get('type');
    if (searchValue && type === 'transaction') {
      setValue('search', searchValue);
      setValue('typeId', 'transactionId');

      const payload = {
        select: {
          transactionId: searchValue,
        },
        createdAt: {
          from: dayjs().subtract(30, 'day').toISOString(),
          to: dayjs().endOf('date').toISOString(),
        },
        search: searchValue,
      };
      handleSubmitSearch && handleSubmitSearch(payload);
    }

    if (searchValue && type === 'accountId') {
      setValue('search', searchValue);
      setValue('typeId', 'accountId');
      const payload = {
        select: {
          accountId: +searchValue,
        },
        createdAt: {
          from: dayjs().subtract(30, 'day').toISOString(),
          to: dayjs().endOf('date').toISOString(),
        },
        search: searchValue,
      };
      handleSubmitSearch && handleSubmitSearch(payload);
    }
  }, []);

  return (
    <div className='box-search-transaction-history' ref={boxSearchRef}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group as={Col} className='searchType' xl='3' md='6' sm='6'>
          <Controller
            control={control}
            name={'typeId'}
            defaultValue={'phone'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                styles={{
                  ...customStyles,
                  menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                  menu: (provided) => ({ ...provided, zIndex: 2 }),
                }}
                defaultValue={{ value: '', label: t('phone') }}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: '#EFF2F7',
                    primary: '#00be00',
                  },
                })}
                options={searchTypeOptions}
                value={searchTypeOptions.find((val) => val.value === value)}
                onChange={(e: SingleValue<any>) => {
                  onChange(e.value), handleOnChangeTypeId(e.value);
                }}
              />
            )}
          />
        </Form.Group>

        <Form.Group as={Col} className='search' md='6' xl='3' sm='6'>
          <Form.Control
            type='text'
            placeholder={`${t('Enter')}: ${
              playhoderValue === phone
                ? t('phone').charAt(0).toLocaleLowerCase() + t('phone').slice(1)
                : playhoderValue === transactionId
                ? t('transactionId').charAt(0).toLocaleLowerCase() + t('transactionId').slice(1)
                : playhoderValue === accountId
                ? t('accountId').charAt(0).toLocaleLowerCase() + t('accountId').slice(1)
                : playhoderValue === id
                ? t('id').charAt(0).toLocaleLowerCase() + t('id').slice(1)
                : playhoderValue === paymentTransaction
                ? t('paymentTransaction').charAt(0).toLocaleLowerCase() +
                  t('paymentTransaction').slice(1)
                : playhoderValue === transportTransaction
                ? t('transportTransaction').charAt(0).toLocaleLowerCase() +
                  t('transportTransaction').slice(1)
                : ''
            }`}
            autoComplete='off'
            {...register('search')}
            defaultValue={phoneTransaction}
          />
        </Form.Group>

        <Form.Group as={Col} className='application' xl='3' md='6' sm='6'>
          <Controller
            control={control}
            name={'appId'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                styles={{
                  ...customStyles,
                  menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                  menu: (provided) => ({ ...provided, zIndex: 2 }),
                }}
                defaultValue={{ value: '', label: t('Tất cả ứng dụng') }}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: '#EFF2F7',
                    primary: '#00be00',
                  },
                })}
                options={applicationOptions}
                value={applicationOptions.find((val) => val.value === value)}
                onChange={(e: SingleValue<any>) => {
                  onChange(e.value);
                }}
              />
            )}
          />
        </Form.Group>

        <Form.Group as={Col} className='transactionType' xl='3' md='6' sm='6'>
          <Controller
            control={control}
            name={'tags'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                styles={{
                  ...customStyles,
                  menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                  menu: (provided) => ({ ...provided, zIndex: 2 }),
                }}
                defaultValue={transactionIdOptions[0]}
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
                  onChange(e.value);
                }}
              />
            )}
          />
        </Form.Group>

        <Form.Group as={Col} className='search' md='6' xl='3' sm='6'>
          <Controller
            name='amount'
            control={control}
            render={({ field }) => (
              <NumberFormat
                className='form-control'
                placeholder={'Giá trị giao dịch'}
                thousandSeparator
                maxLength={15}
                autoComplete='off'
                {...field}
              />
            )}
          />
        </Form.Group>

        <Form.Group as={Col} className='state' xl='3' md='6' sm='6'>
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

        <Form.Group as={Col} className='service' xl='3' md='6' sm='6'>
          <Controller
            control={control}
            name={'code'}
            defaultValue={''}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                styles={{
                  ...customStyles,
                  menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                  menu: (provided) => ({ ...provided, zIndex: 2 }),
                }}
                defaultValue={serviceOptions[0]}
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
                options={serviceOptions}
                value={serviceOptions.find((val) => val.value === value)}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </Form.Group>

        <Form.Group as={Col} className='method' xl='3' md='6' sm='6'>
          <Controller
            control={control}
            name={'method'}
            defaultValue={''}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                styles={{
                  ...customStyles,
                  menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                  menu: (provided) => ({ ...provided, zIndex: 2 }),
                }}
                defaultValue={{ value: '', label: t('Tất cả Phương thức') }}
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

        <Form.Group as={Col} className='time' xl='3' md='6' sm='6'>
          <Controller
            control={control}
            name={'timeType'}
            defaultValue={'createdAt'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                styles={{
                  ...customStyles,
                  menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                  menu: (provided) => ({ ...provided, zIndex: 2 }),
                }}
                defaultValue={{ value: 'TG tao', label: t('Thời gian tạo') }}
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
                options={timeOptions}
                value={timeOptions.find((val) => val.value === value)}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </Form.Group>

        <div className='form-group ml-3 form-date'>
          <div className='date-picker-custom'>
            <DatePickerCustomV2 placeholder={'DD/MM/YYYY'} control={control} />
          </div>
        </div>

        <div className='d-flex ml-3 search-button-group'>
          <button className='btn btn-primary btn-search mr-1' disabled={isLoading as any}>
            <i className='fas fa-search'></i>
            {t('Tìm kiếm')}
          </button>
          <button
            type='button'
            className='btn disableHover '
            disabled={isLoading as any}
            onClick={() => {
              handleExportTransactionHistoryExcelFile('EXPORT_TRANSACTION');
            }}>
            <img src={`/assets/icon/export-icon.png`} alt='export=icon' />
            {t('Xuất file')}
          </button>
        </div>
      </Form>
    </div>
  );
};

export default BoxSearch;
