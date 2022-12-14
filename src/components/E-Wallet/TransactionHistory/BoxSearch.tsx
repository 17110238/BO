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
    ALL: 'T???t c??? d???ch v???',
    BILL: 'H??a ????n',
    ISEC: 'ISEC',
    SALARY: 'L????ng',
    CASHBACK: 'Ho??n ti???n',
    ISEC_BULK: 'S??? l?????ng l???n ISEC',
    ISEC_REDEEM: 'L??m tr??n ISEC',
    ISEC_SCRATCH: 'ISEC SCRATCH',
    ISEC_SEND: 'ISEC g???i',
    ISEC_SAVE: 'ISEC Ti???t ki???m',
    ISEC_RECEIVED: 'ISEC Nh???n',
    ISEC_DONATED: 'ISEC Cho/t???ng',
    CANCEL_ISEC: 'ISEC H???y',
    SOCIAL_LINK: 'Link g???i qua m???ng x?? h???i',
    SOCIAL_PAYMENT: 'Thanh to??n qua truy???n th??ng x?? h???i',
    SOCIAL_DONATE_MONEY_LINK: 'Link g???i ti???n quy??n g??p th??ng qua truy???n th??ng x?? h???i',
    SOCIAL_DONATE_MONEY: 'Ti???n quy??n g??p th??ng qua truy???n th??ng x?? h???i',
    SOCIAL_REQUEST_MONEY_LINK: 'Link Y??u c???u chuy???n ti???n',
    SOCIAL_SEND_MONEY: 'G???i ti???n qua truy???n th??ng x?? h???i',
    SOCIAL_SEND_MONEY_LINK: 'Link g???i ti???n qua truy???n th??ng x?? h???i',
    SOCIAL_PAYME_RECEIVE_MONEY: 'Nh???n ti???n qua link thanh to??n t??? PayME',
    SOCIAL_NAPAS_RECEIVE_MONEY: 'Nh???n ti???n qua link thanh to??n t??? Napas',
    SOCIAL_SEND_MONEY_LINK_RECIPIANT: 'Ng?????i nh???n chuy???n ti???n qua li??n k???t',
    REFUND_MONEY: 'Ho??n ti???n',
    ADD_MONEY: 'N???p Ti???n',
    MINUS_MONEY: 'Tr??? ti???n',
    WITHDRAW_BANK_MANUAL: 'R??t ti???n v??? t??i kho???n ng??n h??ng',
    DEPOSIT_BANK_MANUAL: 'N???p Ti???n t??? t??i kho???n ng??n h??ng',
    LINKED: 'Li??n k???t th???',
    DEPOSIT_PVCBANK: 'N???p ti???n b???ng s??? th??? ng??n h??ng',
    WITHDRAW_PVCBANK: 'R??t ti???n v??? s??? th??? ng??n h??ng',
    WITHDRAW_PAYME: 'R??t V??? V?? PayME',
    MOBILE_CARD: 'Card di ?????ng',
    MOBILE_TOPUP: 'N???p ??i???n tho???i',
    DEPOSIT: ' N???p ti???n',
    PAYMENT: 'Thanh To??n',
    WITHDRAW_BANK_GATEWAY: 'R??t ti???n v??? t??i kho???n ng??n h??ng th??ng qua c???ng thanh to??n',
    WITHDRAW_BANK_LINKED_PVCBANK: 'R??t ti???n v??? s??? th??? ng??n h??ng ???? li??n k???t',
    WITHDRAW_BANK_LINKED_GATEWAY:
      'R??t ti???n v??? t??i kho???n ng??n h??ng th??ng qua c???ng thanh to??n ???? li??n k???t',
    WITHDRAW_BANK_LINKED_OCBBANK: 'R??t ti???n v??? t??i kho???n ng??n h??ng li??n k???t OCB',
    PAYME_SEND_MONEY: 'G???i ti???n t??? v?? PayME',
    PAYME_RECEIVE_MONEY: 'Nh???n ti???n b???ng v?? PayME',
    TRANSFER_PAYME: 'Chuy???n ti???n b???ng v?? PayME',
    GATEWAY_PAYMENT: 'C???ng thanh to??n',
    SOCIAL_PAYMENT_REQUEST_MONEY_LINK: 'Li??n k???t y??u c???u chuy???n ti???n',
    SOCIAL_PAYMENT_RECEIVE_REQUEST_MONEY_LINK: 'Li??n k???t nh???n ti???n thanh to??n',
    SOCIAL_PAYMENT_SEND_MONEY_LINK: 'Li??n k???t g???i ti???n',
    SOCIAL_PAYMENT_DONATE_MONEY_LINK: 'Li??n k???t nh???n Quy??n g??p',
    SOCIAL_PAYMENT_PAYME_RECEIVE_MONEY: 'Nh???n ti???n thanh to??n t??? li??n k???t v??o v?? PayME',
    SOCIAL_PAYMENT_NAPAS_RECEIVE_MONEY: 'Nh???n ti???n thanh to??n t??? li??n k???t v??o Napas',
    SOCIAL_PAYMENT_SEND_MONEY: 'G???i ti???n thanh to??n',
    SOCIAL_PAYMENT_DONATE_MONEY: 'Nh???n quy??n g??p',
    ADVANCE_MONEY: 'T???m ???ng',
    CREDIT_STATEMENT: 'Sao k?? t??n d???ng',
    CREDIT_SETTLEMENT: '?????i so??t t??n d???ng',
    PAYME_CREDIT: 'V?? t??n d???ng PayME',
    PAY_QRCODE: 'Thanh to??n b???ng QR code',
  };
  return lanObj[text] || text;
};
const transLan = (text: any) => {
  const lanObj: any = {
    ALL: 'T???t c??? lo???i GD',
    DEPOSIT: 'N???p ti???n',
    WITHDRAW: 'R??t ti???n',
    MOBILE_CARD: 'Th??? c??o ??i???n tho???i',
    MOBILE_TOPUP: 'N???p ??i???n tho???i',
    BILL: 'Ho?? ????n',
    ISEC: 'ISEC',
    ISEC_CREATE: 'T???o Isec',
    CASHBACK: 'Ho??n ti???n',
    SOCIAL: 'B??n ngo??i',
    SOCIAL_PAYMENT: 'Thanh to??n qua truy???n th??ng x?? h???i',
    INTERNAL: 'N???i b???',
    LINKED: 'Li??n k???t th???',
    BONUS: 'Th?????ng',
    DISCOUNT: 'Chi???t kh???u',
    PAYMENT: 'Thanh to??n',
    RECEIVE_MONEY: 'Nh???n ti???n',
    DEPOSIT_BANK_MANUAL: 'N???p ti???n chuy???n kho???n',
    PAYME_SALARY: 'Chi l????ng',
    ADD_MONEY: 'N???p ti???n tr???c ti???p',
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
  'T???t c??? tr???ng th??i',
  ...convertEnumtoArray(StateEWalletTransactionBoEnum),
];

const methodState = ['T???t c??? Ph????ng th???c', ...convertEnumtoArray(MethodEWalletTransactionBOEnum)];

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
    value: transaction === 'T???t c??? tr???ng th??i' ? '' : transaction,
    label: t(`${transaction}`),
  }));

  const paymentMethodOptions = methodState.map((paymentMethod) => ({
    value: paymentMethod === 'T???t c??? Ph????ng th???c' ? '' : paymentMethod,
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
    { label: t('T???t c??? ???ng d???ng'), value: '' },
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
              alert('success', 'Xu???t file th??nh c??ng', t);
            } else {
              dispatch(exportFileTransactionHistoryFailure());
              alert('error', 'Xu???t file th???t b???i', t);
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
                defaultValue={{ value: '', label: t('T???t c??? ???ng d???ng') }}
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
                placeholder={'Gi?? tr??? giao d???ch'}
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
                defaultValue={{ value: '', label: t('T???t c??? tr???ng th??i') }}
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
                  return i18next.language === 'en' ? 'No options' : 'Kh??ng c?? k???t qu??? t??m ki???m';
                }}
                // placeholder={i18next.language === 'vi' ? 'Kh??ng t??m ???????c k???t qu???' : 'No options'}
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
                  return i18next.language === 'en' ? 'No options' : 'Kh??ng c?? k???t qu??? t??m ki???m';
                }}
                // placeholder={i18next.language === 'vi' ? 'Kh??ng t??m ???????c k???t qu???' : 'No options'}
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
                defaultValue={{ value: '', label: t('T???t c??? Ph????ng th???c') }}
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
                  return i18next.language === 'en' ? 'No options' : 'Kh??ng c?? k???t qu??? t??m ki???m';
                }}
                // placeholder={i18next.language === 'vi' ? 'Kh??ng t??m ???????c k???t qu???' : 'No options'}
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
                defaultValue={{ value: 'TG tao', label: t('Th???i gian t???o') }}
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
                  return i18next.language === 'en' ? 'No options' : 'Kh??ng c?? k???t qu??? t??m ki???m';
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
            {t('T??m ki???m')}
          </button>
          <button
            type='button'
            className='btn disableHover '
            disabled={isLoading as any}
            onClick={() => {
              handleExportTransactionHistoryExcelFile('EXPORT_TRANSACTION');
            }}>
            <img src={`/assets/icon/export-icon.png`} alt='export=icon' />
            {t('Xu???t file')}
          </button>
        </div>
      </Form>
    </div>
  );
};

export default BoxSearch;
