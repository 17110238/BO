import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import FileSaver from 'file-saver';
import { SubscriptionClient } from 'graphql-subscriptions-client';
import _ from 'lodash';
import { TypeSearchBill } from 'models/ewalletPartnerService';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect, useMemo, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect, { SingleValue } from 'react-select';
import { exportPartnerService } from 'redux/actions/ewalletPartnerService';
import { handleDowloadSaga } from 'redux/actions/handleDowloadActions';
import * as types from 'redux/types';
import alert from 'utils/helpers/alert';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import { convertToQueryString, removeEmpty } from 'utils/helpers/handleQuerySearch';
import { searchType } from '../../utils/constantOptionSelect';
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
  handleSearchForm: (data: any) => void;
  title?: string;
  filter?: any;
  loading?: boolean;
  submitForm: boolean,
  setSubmitForm: (a: boolean) => void;
  showFilter? : boolean
}

const transactionState = [
  'ALL',
  'SUCCEEDED',
  'PENDING',
  'CANCELED',
  'FAILED',
  'EXPIRED',
  'CLAIMED',
  'ESCROW',
  'REFUNDED',
  'CANCELED_SUCCEEDED',
];

const BoxSearchEwalletServiceBillReport: React.FC<Props> = ({
  handleSearchForm,
  title,
  filter,
  loading,
  submitForm = false,
  setSubmitForm,
  showFilter
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { query } : any = router
  const [initialValue, setInitialValue] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const stringifyQuery = JSON.stringify(query);
  const dispatch = useDispatch()

  const defaultValue = {
    searchType: "PHONE",
    createdAt: {
      from: dayjs().subtract(1, 'month').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    },
  };
  const { register, getValues, control, handleSubmit, reset, setValue, clearErrors } = useForm<any>(
    {
      defaultValues: useMemo(() => {
        return initialValue;
      }, [initialValue]),
    }
  );

  const accountIdLogin = useSelector<any>(
    (state) => state?.authReducers?.accountInfo?.profile.accountId
  );


  const transactionStateOptions = transactionState.map((value) => ({
    value: value === 'ALL' ? 'ALL' : value,
    label: t(`${value}`),
  }));

  const onSubmit: SubmitHandler<any> = (data, e) => {
    e?.preventDefault();
    const convertFilter = {
      ...data,
      from: data?.createdAt?.from,
      to: data?.createdAt?.to,
    };
    const spreadCreatedAt = removeEmpty(_.pickBy(_.omit(convertFilter, ['createdAt'])));
    router.replace(`/vi-dien-tu/tai-khoan/vi-dien-tu/doi-tac/chi-tiet-${title === 'BILL_ESTIO' ? "estio" : "ocb"}?${convertToQueryString(spreadCreatedAt)}`, undefined, {
      shallow: true,
    });
    // handleSearchForm && handleSearchForm(data)
  };
  useEffect(() => {
    reset();
    reset(initialValue);
  }, [initialValue]);



  const searchTypeOptions = searchType.map((value) => ({
    value: value.toUpperCase(),
    label: t(value.toUpperCase()),
  }));

  useEffect(() => {
    if (_.isEmpty(query)) {
      handleSearchForm && handleSearchForm(defaultValue);
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

      handleSearchForm && handleSearchForm(result);
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
      

      handleSearchForm && handleSearchForm(result);
      setInitialValue(result);
    }
  }, [query]);

  const onClearForm: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    router.replace(`/vi-dien-tu/tai-khoan/vi-dien-tu/doi-tac/chi-tiet-${title === 'BILL_ESTIO' ? "estio" : "ocb"}`, undefined, { shallow: true });
  };
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
  const exportFilePartnerService = async () => {
    setIsLoading(true)
    dispatch(exportPartnerService({ ...filter, service: title }, (status, res) => { }));
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
                type: types.EXPORT_PARTNER_SERVICE.SUCCESS,
              });
              alert('success', 'Xuất file thành công', t);
              setIsLoading(false)
            } else {
              // dispatch(exportFileTransactionFailure());
              dispatch({
                type: types.EXPORT_PARTNER_SERVICE.FAILURE,
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
      {showFilter &&
        <div className='box-search-partner-service'>
          <Form onSubmit={handleSubmit(onSubmit)} className='d-flex row'>
            <Form.Group as={Col} xl={4} className='form-search'>
              <div className='groups-inputs-search-type'>
                <Form.Control
                  type='text'
                  placeholder={t('Nhập để tìm kiếm')}
                  autoComplete='off'
                  {...register('searchValue')}
                />
                <Controller
                  control={control}
                  name={'searchType'}
                  defaultValue={TypeSearchBill.PHONE}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <ReactSelect
                      styles={customStyles}
                      className='form-control-type'
                      classNamePrefix='form-control-select'
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                          ...theme.colors,
                          primary25: '#EFF2F7',
                          primary: '#00be00',
                        },
                      })}
                      isSearchable={false}
                      noOptionsMessage={() => t('Không có kết quả tìm kiếm')}
                      options={searchTypeOptions}
                      value={searchTypeOptions.find((val) => val.value === value)}
                      onChange={(e: SingleValue<any>) => onChange(e.value)}
                    />
                  )}
                />
              </div>
            </Form.Group>
            <Form.Group as={Col} xl={2} className='form-state'>
              <Controller
                defaultValue={'ALL'}
                control={control}
                name={'state'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <ReactSelect
                    styles={customStyles}
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: '#EFF2F7',
                        primary: '#00be00',
                      },
                    })}
                    placeholder=''
                    noOptionsMessage={() => t('Không có kết quả tìm kiếm')}
                    value={transactionStateOptions.find((c: any) => c.value === value)}
                    options={transactionStateOptions}
                    onChange={(e: SingleValue<any>) => {
                      onChange(e.value);
                    }}
                  />
                )}
              />
            </Form.Group>
            <Form.Group as={Col} xl={4} className="form-date-from-to">
              <div className='form-group form-date'>
                <div className='date-picker-custom'>
                  <DatePickerCustomV2 placeholder={'DD/MM/YYYY HH:MM'} control={control} />
                </div>
              </div>
            </Form.Group>
            <div className='d-flex align-items-center search-button-group col-xl-6 ml-0 '>
              <button className='btn btn-primary btn-search ml-0' style={{ whiteSpace: 'nowrap', minWidth: '120px' }} disabled={loading}>
                {!loading && (
                  <>
                    <i className="fas fa-analytics"></i>
                    {t('Thống kê')}
                  </>
                )}
                {loading && <><i className='fas fa-spinner fa-pulse'></i>{t('Thống kê')}</>}
              </button>
              <div className='btn-clear' onClick={onClearForm}>
                <i className='fas fa-eraser mr-2'></i>
                {t('Clear')}
              </div>
              <button
                type='button'
                className={`btn disableHover btn-export`}
                onClick={exportFilePartnerService}
                style={{ whiteSpace: 'nowrap' }}
              >
                <img src='/assets/icon/export-icon.png' alt='export=icon' />
                {t('Xuất file')}
              </button>
            </div>
          </Form>
        </div>
      }
      {isLoading && <LoadingFullScreen />}
    </>
  );
};

export default BoxSearchEwalletServiceBillReport;
