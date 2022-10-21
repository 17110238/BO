import AsyncSelect from 'components/common/AsyncSelect/AsyncSelect';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import FileSaver from 'file-saver';
import { SubscriptionClient } from 'graphql-subscriptions-client';
import { t } from 'i18next';
import _ from 'lodash';
import { ReportMerchantEwalletInput } from 'models';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { handleDowloadSaga } from 'redux/actions/handleDowloadActions';
import { exportReportEwalletMc } from 'redux/actions/reportEwalletMcAction';
import * as types from 'redux/types';
import alert from 'utils/helpers/alert';
import { convertToQueryString, removeEmpty } from 'utils/helpers/handleQuerySearch';
import DatePickerCustomV3 from 'components/common/DatePickerCustom/DatePickerV3';
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
interface Props {
  loading?: boolean;
  handleSearch?: (data: ReportMerchantEwalletInput | {}) => void;
  setSubmitForm?: any;
  showFilter?: boolean;
  filter?: ReportMerchantEwalletInput
}

const BoxSearchReportEwalletMc: React.FC<Props> = ({ loading, handleSearch, setSubmitForm, showFilter, filter }) => {
  const router = useRouter();
  const { query }: any = router
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const defaultValue = {
    createdAt: {
      from: dayjs().subtract(1, 'month').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    },
  };
  const [initialValue, setInitialValue] = useState<any>({});

  const {
    control,
    clearErrors,
    formState: { errors },
    reset,
    getValues,
    handleSubmit,
  } = useForm<any>({
    shouldFocusError: false,
    reValidateMode: 'onSubmit',
    defaultValues: useMemo(() => {
      return initialValue;
    }, [initialValue]),
  });


  const handleSubmitSearchForm: SubmitHandler<any> = (data, e) => {
    e?.preventDefault();
    const convertFilter = {
      ...data,
      from: data?.createdAt?.from,
      to: data?.createdAt?.to,
    };

    const spreadCreatedAt = removeEmpty(_.pickBy(_.omit(convertFilter, ['createdAt'])));
    router.replace(`/cong-thanh-toan/bao-cao-so-du-doi-tac?${convertToQueryString(spreadCreatedAt)}`, undefined, {
      shallow: true,
    });
  };

  useEffect(() => {
    reset();
    reset(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (_.isEmpty(query)) {
      handleSearch && handleSearch(defaultValue);
      setInitialValue(defaultValue);
      return;
    }

    if (query.from && !query.to) {
      const result = {
        createdAt: {
          from: query.from,
          to: dayjs().endOf('date').utc().format(),
        }
      }

      handleSearch && handleSearch(result);
      setInitialValue(result);

      return;
    }

    if (!_.isEmpty(query)) {
      const convertedQueryObj = _.omit(
        {
          ...query,
          createdAt: {
            from: query?.from,
            to: query?.to,
          },
        },
        ['from', 'to']
      );

      const result = removeEmpty(convertedQueryObj);


      handleSearch && handleSearch(result);
      setInitialValue(result);
    }
  }, [query]);

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
  const exportFileReportEwalletMc = async () => {
    setIsLoading(true)
    dispatch(exportReportEwalletMc({ ...filter, merchantId: +filter?.merchantId! }, (status, res) => { }));
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
                type: types.EXPORT_REPORT_EWALLET_MC.SUCCESS,
              });
              alert('success', 'Xuất file thành công', t);
              setIsLoading(false)
            } else {
              // dispatch(exportFileTransactionFailure());
              dispatch({
                type: types.EXPORT_REPORT_EWALLET_MC.FAILURE,
              });
              alert('error', 'Xuất file thất bại', t);
              setIsLoading(false)
            }
          })
        );
      },
    });
  };

  return (
    <>
      {showFilter && <div className='report-ewallet-mc__box-search'>
        <form onSubmit={handleSubmit(handleSubmitSearchForm)}>
          <div className='form-group form-search'>
            {/* <label>{t('Danh sách Merchant')}</label> */}
            <AsyncSelect
              asyncType='MERCHANT'
              returnType='number'
              keyReturn='merchantId'
              control={control}
              clearError={clearErrors}
              name='merchantId'
              placeHolder='Nhập để tìm kiếm'
              {...{
                className: 'search-merchant-select',
                classNamePrefix: 'merchant-async-select',
              }}
            />
          </div>
          <div className='form-group form-date'>
            {/* <label>{t('Thời gian')}</label> */}
            <div className='date-picker-custom'>
              {/* <DatePickerCustomV2
                clearErrors={clearErrors}
                className={`${errors?.createdAt?.from ? ' date-picker-from-error' : ' '}
              ${errors?.createdAt?.to ? ' date-picker-to-error' : ' '}
              `}
                rules={{ from: { required: true }, to: { required: true } }}
                placeholder={'DD/MM/YYYY HH:MM'}
                control={control}
              /> */}
              <DatePickerCustomV3 placeholder={'DD/MM/YYYY HH:mm:ss'} control={control} />
            </div>
          </div>

          <div className='form-btn d-flex'>
            <button
              className='btn btn-primary btn-search'
              disabled={loading}
              style={{ minWidth: '120px' }}>
              {loading ? (
                <>
                  <i className='fas fa-spinner fa-pulse'></i>
                  {t('Thống kê')}
                </>
              ) : (
                <>
                  <i className='fas fa-analytics'></i>
                  {t('Thống kê')}
                </>
              )}
            </button>
            <button
              type='button'
              className={`btn disableHover btn-export`}
              onClick={exportFileReportEwalletMc}
              style={{ whiteSpace: 'nowrap' }}
            >
              <img src='/assets/icon/export-icon.png' alt='export=icon' />
              {t('Xuất file')}
            </button>
          </div>
        </form>
      </div>}
      {isLoading && <LoadingFullScreen />}
    </>
  );
};

export default BoxSearchReportEwalletMc;
