import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import dayjs from 'dayjs';
import {
  BankInfoType,
  DataManualBank,
  DepositBankType,
  ListAccountBankSearch,
  ManualBankSearch,
  ReportManulBankingType,
} from 'models';
import { useRouter } from 'next/router';
import numeral from 'numeral';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect, { SingleValue } from 'react-select';
import { getListAccountBank, getListBank, getListManualBank } from 'redux/actions/manualBankAction';
import { updateURLParameter } from 'utils/helpers';
import customStyles from 'utils/helpers/customStylesForReactSelect';

export default function ReportManualBankContainer() {
  const { query } = useRouter();
  const loading = useSelector((state: any) => state.manualBankReducer.loading);
  const initialState = {
    createdAt: {
      from: dayjs().date(1).startOf('date').toISOString(),
      to: dayjs(new Date()).endOf('date').toISOString(),
    },
    swiftCode: '',
    bankId: '',
  };
  const {
    control,
    getValues,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialState,
  });
  const dispatch = useDispatch();
  const [listBank, setListBank] = useState<Array<BankInfoType>>([]);
  const [listAccountBank, setListAccountBank] = useState<Array<DepositBankType>>([]);
  const [manualBank, setManualBank] = useState<DataManualBank>({
    data: [],
    total: {},
  });
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const handleGetListBank = () => {
    setLoadingSearch(true);
    dispatch(
      getListBank((status, listBank) => {
        if (status) {
          setListBank([...listBank, { bankName: 'Nạp ví', swiftCode: 'ADD_MONEY' }]);
        }
        setLoadingSearch(false);
      })
    );
  };
  const handleGetListAccountBank = () => {
    const payload: ListAccountBankSearch = {
      filter: {
        isActive: true,
      },
      paging: {
        start: 0,
        limit: 999,
      },
    };
    dispatch(
      getListAccountBank(payload, (status, accountBanks) => {
        if (status) {
          setListAccountBank(accountBanks);
        }
      })
    );
  };
  const handleGetListManualBank = (payload: ManualBankSearch) => {
    dispatch(
      getListManualBank(payload, (status, manualBank) => {
        if (status) {
          setManualBank(manualBank);
        }
      })
    );
  };
  const handleFilterForm = (data: any) => {
    let payload: any = {
      createdAt: data?.createdAt,
    };
    const { from, to } = data?.createdAt;
    let temp: any = {
      from,
      to,
    };
    if (data?.swiftCode) {
      payload = { ...payload, swiftCode: data?.swiftCode };
      temp = { ...temp, swiftCode: data?.swiftCode };
    }
    if (data?.bankId) {
      payload = { ...payload, bankId: parseInt(data?.bankId) };
      temp = { ...temp, bankId: parseInt(data?.bankId) };
    }
    for (const key in temp) {
      window.history.replaceState(
        '',
        '',
        updateURLParameter(window.location.href, key, encodeURIComponent(temp[key]))
      );
    }
    handleGetListManualBank(payload);
  };
  useEffect(() => {
    if (!(listAccountBank.length > 0)) handleGetListAccountBank();
    if (!(listBank.length > 0)) handleGetListBank();
    if (query?.from && query?.to) {
      let payload: any = {
        createdAt: {
          from: dayjs(query?.from.toString()).startOf('date').toISOString(),
          to: dayjs(query?.to.toString()).endOf('date').toISOString(),
        },
      };
      if (query?.swiftCode) payload = { ...payload, swiftCode: query?.swiftCode };
      if (query?.bankId) payload = { ...payload, bankId: parseInt(query?.bankId.toString()) };
      reset(payload);
      handleGetListManualBank(payload);
    } else {
      const data: any = getValues();
      if (!(manualBank?.data.length > 0)) {
        handleGetListManualBank({
          createdAt: {
            from: dayjs(data.createdAt.from).startOf('date').toISOString(),
            to: dayjs(data.createdAt.to).endOf('date').toISOString(),
          },
        });
      }
    }
  }, [query]);
  const { t } = useTranslation('common');
  return (
    <>
      {loading && <LoadingFullScreen />}
      <div
        className='manualBank-container'
        style={manualBank.data.length > 10 ? {} : { height: '75vh' }}>
        <div className='manualBank-header'>
          <div className='manualBank-header__title'>
            <h5>{t('Thống kê giao dịch ngân hàng thủ công')}</h5>
          </div>
          <div className='manualBank-header__btn'>
            <button
              className='filter-btn btn btn-active'
              style={showFilter ? {} : { borderColor: '#647081' }}
              onClick={() => {
                reset(initialState);
                setShowFilter(!showFilter);
              }}>
              <svg
                width={14}
                height={12}
                xmlns='http://www.w3.org/2000/svg'
                style={{ transition: 'all 0.3s ease 0s' }}>
                <path
                  d='M6.99.005c1.977 0 3.954.001 5.93-.001.409 0 .73.151.938.507.237.405.177.817-.179 1.231-1.49 1.737-2.982 3.475-4.48 5.205a.762.762 0 0 0-.206.558c.014.614-.003 1.229.01 1.843.006.288-.094.49-.339.65-.93.61-1.854 1.23-2.779 1.85-.19.127-.381.215-.61.096-.237-.125-.279-.336-.278-.58.004-1.28-.004-2.56.005-3.841a.816.816 0 0 0-.212-.587C3.305 5.222 1.833 3.496.348 1.78.034 1.417-.114 1.037.103.583.318.13.706-.002 1.183 0 3.12.008 5.054.003 6.99.003v.002z'
                  fill={showFilter ? '#00BE00' : '#647081'}
                  fillRule='evenodd'
                />
              </svg>
              <p style={showFilter ? {} : { color: '#647081' }}>
                {t(showFilter ? 'Ẩn lọc' : 'Hiện')}
              </p>
            </button>
          </div>
        </div>
        {showFilter && (
          <form
            className='manualBank-search'
            onSubmit={handleSubmit(handleFilterForm)}
            style={{ marginTop: '10px' }}>
            <div className='manualBank-group'>
              {/* <label htmlFor=''>{'Khoảng thời gian'}</label> */}
              <div className='manualBank-group__content'>
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
            <div className='manualBank-group'>
              {/* <label htmlFor=''>{'Ngân hàng'}</label> */}
              <div className='manualBank-group__content'>
                <Controller
                  control={control}
                  name={'swiftCode'}
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
                      placeholder={`-----${t('Tất cả ngân hàng')}-----`}
                      noOptionsMessage={() => t('Không có kết quả tìm kiếm')}
                      options={listBank?.map((item: BankInfoType) => {
                        return { label: item.bankName, value: item.swiftCode };
                      })}
                      value={listBank
                        ?.map((item: BankInfoType) => {
                          return { label: item.bankName, value: item.swiftCode };
                        })
                        .find((item: any) => item.value == value)}
                      onChange={(e: SingleValue<any>) => onChange(e?.value)}
                    />
                  )}
                />
              </div>
            </div>
            <div className='manualBank-group'>
              {/* <label htmlFor=''>{'Tài khoản'}</label> */}
              <div className='manualBank-group__content'>
                <Controller
                  control={control}
                  name={'bankId'}
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
                      placeholder={`-----${t('Tất cả tài khoản')}-----`}
                      noOptionsMessage={() => t('Không có kết quả tìm kiếm')}
                      options={listAccountBank?.map((item: DepositBankType) => {
                        return { label: item.fullName, value: item.id };
                      })}
                      value={listAccountBank
                        ?.map((item: DepositBankType) => {
                          return { label: item.fullName, value: item.id };
                        })
                        .find((item: any) => item.value == value)}
                      onChange={(e: SingleValue<any>) => onChange(e?.value)}
                    />
                  )}
                />
              </div>
            </div>
            <div className='manualBank-group'>
              <div className='manualBank-group__content'>
                <button
                  style={{ marginTop: '0px' }}
                  type='submit'
                  className='btn btn-primary btn-search'
                  disabled={loadingSearch}>
                  <i className='fas fa-search' />
                  {t('Thống kê')}
                </button>
              </div>
            </div>
          </form>
        )}
        <div className='manualBank-content'>
          <div className='manualBank-overflow'>
            <table className='manualBank-table'>
              <thead>
                <tr>
                  <td>{t('Ngày')}</td>
                  <td>{t('SL GD Nạp')}</td>
                  <td>{t('Giá Trị GD Nạp')}</td>
                  <td>{t('Giá Trị Thực Nạp')}</td>
                  <td>{t('Phí')}</td>
                </tr>
              </thead>
              <tbody>
                {manualBank.data?.length > 0 &&
                  manualBank.data?.map((item: ReportManulBankingType, index: number) => {
                    return (
                      <tr key={index}>
                        <td>{dayjs(item.date).format('DD-MM-YYYY')}</td>
                        <td>{item.count}</td>
                        <td>{numeral(item.amount).format('0,0')}</td>
                        <td>{numeral(item.total).format('0,0')}</td>
                        <td>{numeral(item.fee).format('0,0')}</td>
                      </tr>
                    );
                  })}
              </tbody>
              <tfoot>
                <tr>
                  <td>{t('Tổng Cộng')}</td>
                  <td>{numeral(manualBank?.total?.count).format('0,0')}</td>
                  <td>{numeral(manualBank?.total?.amount).format('0,0')}</td>
                  <td>{numeral(manualBank?.total?.total).format('0,0')}</td>
                  <td>{manualBank?.total?.fee}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
