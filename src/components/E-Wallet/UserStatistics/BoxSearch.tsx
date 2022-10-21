import FileSaver from 'file-saver';
import { SubscriptionClient } from 'graphql-subscriptions-client';
import i18next, { t } from 'i18next';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect, { SingleValue } from 'react-select';
import { handleDowloadSaga } from 'redux/actions/handleDowloadActions';
import alert from 'utils/helpers/alert';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import { convertEnumtoArray } from 'utils/helpers/convertEnumtoArray';
import { GenderEnum } from 'models';
import {
  exportFileReportUser,
  exportFileReportUserFailure,
  exportFileReportUserSucess,
  getAppInfo,
} from 'redux/actions';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

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
  search?: string;
  appId?: number;
  kycState?: string;
  gender?: string;
  from?: number;
  to?: number;
  fullname?: string;
}
interface Props {
  showFilter?: boolean;
  valuesSearch?: SearchParams;
  submitForm: boolean;
  handleSubmitSearch?: (data: SearchParams) => void;
  handleClearForm?: () => void;
  onChangeDateSearch?: (data: Date, name: string) => void;
  boxSearchRef: any;
  filter: any;
  t: (a: string) => string;
  isLoading: boolean;
}

const stateKYCOptions = [
  {
    label: 'Tất cả trạng thái KYC',
    value: '',
  },

  {
    label: t('Chờ duyệt'),
    value: 'PENDING',
  },

  {
    label: t('Từ chối'),
    value: 'REJECTED',
  },

  {
    label: t('Đã duyệt'),
    value: 'APPROVED',
  },

  {
    label: t('Hủy'),
    value: 'CANCELED',
  },

  {
    label: t('Bị khóa'),
    value: 'BANNED',
  },
];

const genderState = ['Tất cả giới tính', ...convertEnumtoArray(GenderEnum)];

const BoxSearch: React.FC<Props> = ({
  showFilter,
  handleSubmitSearch,
  handleClearForm,
  submitForm,
  boxSearchRef,
  filter,
  isLoading,
  t,
}) => {
  const router = useRouter();
  const { query }: any = useRouter();
  const dispatch = useDispatch();
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');

  const [socket, setSocket] = useState('');
  const client = new SubscriptionClient(socket, {
    reconnect: true,
    lazy: true, // only connect when there is a query
    connectionCallback: (error) => {
      error && console.error(error);
    },
  });

  const [dataApplication, setDataApplication] = useState<any>([]);

  useEffect(() => {
    let socket = new WebSocket(`${process.env.NEXT_PUBLIC_GAPI_GRAPHQL_URL_WS}/graphql`);
    setSocket(socket.url);
  }, []);

  const schema = yup
    .object({
      from: yup.number().required(),
      to: yup.number().required(),
    })
    .required();

  const noValidateSchema = yup.object({});

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
    mode: 'onSubmit',
    resolver: yupResolver<yup.AnyObjectSchema>(!from && !to ? noValidateSchema : schema),
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
      from: data?.from ? data?.from : '',
      to: data?.to ? data?.to : '',
    };

    let payload = {
      ...data,
      fullname: data.fullname.trim(),
    };

    for (let key in temp) {
      if (temp.hasOwnProperty(key)) {
        if (temp[key] === undefined) {
          delete temp[key];
        }
      }
    }

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

  const accountIdLogin = useSelector<any>(
    (state) => state?.authReducers?.accountInfo?.profile.accountId
  );

  const sub: any = client.request({ query: query1 });

  const handleExportExcelFile = async () => {
    dispatch(exportFileReportUser({ ...filter }, (state, res) => {}));
    client?.unsubscribeAll();
    sub.subscribe({
      next({ data }: any) {
        let dataForm = data?.SubExport?.SubExportExcel;
        let urlData = data?.SubExport?.SubExportExcel?.data;
        dispatch(
          handleDowloadSaga({ data: `${urlData}` }, async (state, res) => {
            if (state && dataForm?.accountId === accountIdLogin) {
              await FileSaver.saveAs(res, `${new Date().getTime()}.xlsx`);
              dispatch(exportFileReportUserSucess());
              alert('success', 'Xuất file thành công', t);
              client?.unsubscribeAll();
            } else {
              dispatch(exportFileReportUserFailure());
              alert('error', 'Xuất file thất bại', t);
              client?.unsubscribeAll();
            }
          })
        );
      },
    });
  };

  useEffect(() => {
    return () => {
      dispatch(exportFileReportUserFailure());
    };
  }, [router]);

  const handleOnlyEnterNumberFrom = (event: any) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
    from.length === 0 && event.which == 48 && event.preventDefault();
  };

  const handleOnlyEnterNumberTo = (event: any) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
    to.length === 0 && event.which == 48 && event.preventDefault();
  };

  const genderptions = genderState.map((gender) => ({
    value: gender === 'Tất cả giới tính' ? '' : gender,
    label: t(`${gender}`),
  }));

  useEffect(() => {
    if (submitForm) {
      dispatch(
        getAppInfo((status, appInfoData) => {
          if (status) {
            const arrayApplication = [
              {
                label: t('Tất cả ứng dụng'),
                value: '',
              },
            ];

            appInfoData[0].store?.map((app: any) => {
              let obj: any = {};
              obj.value = app.id;
              obj.label = app.name;
              arrayApplication.push(obj);
            });
            setDataApplication(arrayApplication);
          }
        })
      );
    }
  }, []);

  return (
    <div className='box-search-user-statistics' ref={boxSearchRef}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group as={Col} className='name' md='2' xl='3' sm='2'>
          <Form.Control
            type='text'
            placeholder={`${t('Enter')}: ${
              t('Họ và tên').charAt(0).toLocaleLowerCase() + t('Họ và tên').slice(1)
            }`}
            autoComplete='off'
            {...register('fullname')}
          />
        </Form.Group>

        <Form.Group as={Col} className='state' xl='6' md='3' sm='6'>
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
                noOptionsMessage={() => {
                  return i18next.language === 'en' ? 'No options' : 'Không có kết quả tìm kiếm';
                }}
                options={dataApplication}
                value={dataApplication.find((val: any) => val.value === value)}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </Form.Group>

        <Form.Group as={Col} className='state' xl='6' md='3' sm='6'>
          <Controller
            control={control}
            name={'kycState'}
            defaultValue={''}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                styles={{
                  ...customStyles,
                  menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                  menu: (provided) => ({ ...provided, zIndex: 2 }),
                }}
                defaultValue={{ value: '', label: t('Tất cả trạng thái KYC') }}
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
                options={stateKYCOptions}
                value={stateKYCOptions.find((val) => val.value === value)}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </Form.Group>

        <Form.Group as={Col} className='gender' xl='2' md='3' sm='2'>
          <Controller
            control={control}
            name={'gender'}
            defaultValue={''}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                styles={{
                  ...customStyles,
                  menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                  menu: (provided) => ({ ...provided, zIndex: 2 }),
                }}
                defaultValue={{ value: '', label: t('Tất cả giới tính') }}
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
                options={genderptions}
                value={genderptions.find((val) => val.value === value)}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </Form.Group>

        <Form.Group as={Col} className='age' xl='2' md='2' sm='2'>
          <div className='d-flex align-items-center'>
            <Form.Control
              type='text'
              placeholder={`${t('Độ tuổi')} (${t('From')})`}
              autoComplete='off'
              maxLength={3}
              {...register('from')}
              onKeyPress={(event: any) => handleOnlyEnterNumberFrom(event)}
              onChange={(event: any) => setFrom(event.target.value)}
              className={`fromAge ${errors?.from ? 'box-search-error' : ' '}`}
            />

            <i className='fa fa-chevron-right mx-2 text-muted' />

            <Form.Control
              type='text'
              placeholder={`${t('Độ tuổi')} (${t('Đến1')})`}
              autoComplete='off'
              maxLength={3}
              {...register('to')}
              onKeyPress={(event: any) => handleOnlyEnterNumberTo(event)}
              onChange={(event: any) => setTo(event.target.value)}
              className={`toAge ${errors?.to?.message ? 'box-search-error' : ' '}`}
            />
          </div>
        </Form.Group>

        <div className='d-flex ml-2 search-button-group'>
          <button className='btn btn-primary btn-search mr-2' disabled={isLoading as any}>
            <i className='fas fa-clipboard-list'></i>
            {t('Statistics')}
          </button>
          {/* <button
            type='button'
            disabled={isLoading as any}
            className='btn disableHover '
            onClick={() => {
              handleExportExcelFile();
            }}>
            <img src={`/assets/icon/export-icon.png`} alt='export=icon' />
            {t('Xuất file')}
          </button> */}
        </div>
      </Form>
    </div>
  );
};

export default BoxSearch;
