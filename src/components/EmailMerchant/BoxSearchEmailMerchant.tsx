import AsyncSelect from 'components/common/AsyncSelect/AsyncSelect';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import FileSaver from 'file-saver';
import { SubscriptionClient } from 'graphql-subscriptions-client';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { exportEmailMerchant } from 'redux/actions';
import { handleDowloadSaga } from 'redux/actions/handleDowloadActions';
import * as types from 'redux/types';
import { clearFalsyObject, handleReplaceUrl } from 'utils/helpers/replaceUrl';
import alert from 'utils/helpers/alert';
dayjs.extend(utc);
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
export interface PayloadRevenueMCFilterType {
  filter?: any;
  merchantId?: number;
  method?: string;
  createdAt?: {
    from?: any;
    to?: any;
  };
  loading?: any;
}

interface Props {
  onSubmitForm: (data: PayloadRevenueMCFilterType | {}) => void;
  showFilter: boolean | any;
  filter?: any;
  loading?: any | boolean;
  submitForm:boolean;
}

const BoxSearchEmailMerchant: React.FC<Props> = ({ onSubmitForm, showFilter, filter, loading,submitForm }) => {
  const router = useRouter();
  const { query }: any = useRouter();
  const dispatch = useDispatch();
  const {
    control,
    clearErrors,
    formState: { errors },
    reset,
    setValue,
    handleSubmit,
    getValues,
  } = useForm<PayloadRevenueMCFilterType>({
    shouldFocusError: false,
    reValidateMode: 'onSubmit',
    defaultValues: {
      createdAt: {
        from: dayjs().subtract(7, 'day').startOf('day').utc().format(),
        to: dayjs().endOf('date').utc().format(),
      },
    },
  });
  const accountIdLogin = useSelector<any>(
    (state) => state?.authReducers?.accountInfo?.profile.accountId
  );

  const [socket, setSocket] = useState('');
  const client = new SubscriptionClient(socket, {
    reconnect: true,
    lazy: true, // only connect when there is a query
    connectionCallback: (error) => {
      error && console.error(error);
    },
  });

  useEffect(() => {
    let socket = new WebSocket(`${process.env.NEXT_PUBLIC_GAPI_GRAPHQL_URL_WS}/graphql`);
    setSocket(socket.url);
  }, []);

  const onClearForm: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    router.replace(router.pathname, undefined, { shallow: true });
    reset();
    onSubmitForm && onSubmitForm(getValues());
  };

  const handleSubmitSearchForm: SubmitHandler<PayloadRevenueMCFilterType> = (data, e) => {
    e?.preventDefault();
    const formatData = JSON.parse(JSON.stringify(data));
    formatData?.merchantId === -1 && delete formatData.merchantId;

    onReplaceUrl(formatData);
    onSubmitForm && onSubmitForm(formatData);
  };

  const onReplaceUrl = (query: PayloadRevenueMCFilterType) => {
    const cloneQuery = {
      ...query,
      from: query?.createdAt?.from,
      to: query?.createdAt?.to,
    };

    delete cloneQuery.createdAt;

    const params = Object.keys(cloneQuery)
      .map(function (key) {
        return key + '=' + cloneQuery[key as keyof {}];
      })
      .join('&');

    router.push({ pathname: router.pathname, query: params });
  };



  const sub = client.request({ query: querySub });
  const exportEmailMerchantView = async () => {
    dispatch(exportEmailMerchant({ ...filter }, (status, res) => {}));

    // so lets actually do something with the response
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
                type: types.EXPORT_EMAIL_MERCHANT.SUCCESS,
              });

              alert('success', 'Xuất file thành công', t);
            } else {
              // dispatch(exportFileTransactionFailure());
              dispatch({
                type: types.EXPORT_EMAIL_MERCHANT.FAILURE,
              });

              alert('error', 'Xuất file thất bại', t);
            }
          })
        );
      },
    });
  };
  
  useEffect(() => {
    if (submitForm) {
      onSubmitForm && onSubmitForm(getValues());
    }
  }, [submitForm]);

  useEffect(() => {
    if (loading) {
      dispatch({
        type: types.EXPORT_EMAIL_MERCHANT.SUCCESS,
      });
    }
  }, []);

  useEffect(() => {
    const params = { ...router.query };
    if (!Object.keys(router.query).length) return;
    delete params.to;
    delete params.from;

    const payload = clearFalsyObject({
      ...params,
      createdAt: {
        from: router.query?.from,
        to: router.query?.to,
      },
    });

    reset(payload, { keepDefaultValues: true });
  }, []);

  return (
    showFilter && (
      <div className='boxsearch-email-merchant'>
        <form onSubmit={handleSubmit(handleSubmitSearchForm)}>
          <div className=' form-search'>
         
            <AsyncSelect
              asyncType='MERCHANT'
              control={control}
              clearError={clearErrors}
              name='merchantId'
              keyReturn='merchantId'
              placeHolder='Nhập để tìm kiếm'
              {...{
                className: 'search-merchant-select',
                classNamePrefix: 'merchant-async-select',
              }}
            />
          </div>

          <div className='form-search form-date'>
           
            <div className='date-picker-custom'>
              <DatePickerCustomV2
                clearErrors={clearErrors}
                className={`${errors?.createdAt?.from ? ' date-picker-from-error' : ' '}
              ${errors?.createdAt?.to ? ' date-picker-to-error' : ' '}
              `}
                rules={{ from: { required: true }, to: { required: true } }}
                
                control={control}
              />
            </div>
          </div>

          <div className='form-search form-search-button'>
            <button className='btn btn-primary btn-search' disabled={loading}>
              {!loading && (
                <>
                  <i className='fas fa-clipboard-list'></i>
                  Thống kê
                </>
              )}

              {loading && <i className='fas fa-spinner fa-pulse'></i>}
            </button>
            <div
              className={`btn btn-clear btn-search ${loading ? 'btn--disabled' : ''}`}
              onClick={onClearForm}>
              <i className='fas fa-eraser mr-2'></i>Xóa
            </div>
            {/* <button
              type='button'
              className={`btn disableHover  btn-search`}
              onClick={exportEmailMerchantView}>
              <img src='/assets/icon/export-icon.png' alt='export=icon' />
              {t('Xuất file')}
            </button> */}
          </div>
        </form>
      </div>
    )
  );
};

export default BoxSearchEmailMerchant;
