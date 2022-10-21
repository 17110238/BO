import React, { Fragment, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import DatePickerBackUp from 'components/common/DatePickerCustom/DatePickerBackUp';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import ReactSelect from 'react-select';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import { getReportTransaction } from 'redux/actions/eWalletReportTransactionAction';
import dayjs from 'dayjs';
import { countMonthOfYear, updateURLParameter } from 'utils/helpers';
import { ReportTransactionType } from 'models/eWalletReportTransaction';
import numeral from 'numeral';
import { useRouter } from 'next/router';
interface Options {
  label: string;
  value: string;
}

export default function ReportTransactionContainer() {
  const { query } = useRouter();
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const loading = useSelector((state: any) => state.eWalletReportTransactionReducer.loading);
  const initialState = {
    from: dayjs(dayjs().month(dayjs(new Date()).month() - 2))
      .date(1)
      .startOf('date')
      .toISOString(),
    to: dayjs(dayjs().month(dayjs(new Date()).month()))
      .date(countMonthOfYear(dayjs(new Date()).month()))
      .endOf('date')
      .toISOString(),
  };
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      createdAt: initialState,
    },
  });
  const [dataReportTransaction, setDataReportTransaction] = useState<Array<ReportTransactionType>>(
    []
  );
  const [totalReportTransaction, setTotalReportTransaction] = useState<ReportTransactionType>();
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [isShowFilter, setShowFilter] = useState<boolean>(true);
  const dataOptions: Array<Options> = [
    { label: 'Toàn hệ thống', value: '' },
    { label: 'Khách hàng tổ chức', value: 'BUSINESS' },
    { label: 'Khách hàng cá nhân', value: 'PERSONAL' },
  ];
  const handleGetReportTransaction = (payload: any) => {
    setLoadingSearch(true);
    dispatch(
      getReportTransaction(payload, (status, res) => {
        if (status) {
          setDataReportTransaction(res.data);
          setTotalReportTransaction(res.total);
        }
        setLoadingSearch(false);
      })
    );
  };
  const handleSearchForm = (data: any) => {
    const { from, to } = data?.createdAt;
    let temp: any = {
      from: dayjs(from).startOf('date').toISOString(),
      to: dayjs(to).endOf('date').toISOString(),
    };
    if (!data?.accountType) delete data?.accountType;
    else temp = { ...temp, accountType: data?.accountType };
    for (const key in temp) {
      window.history.replaceState(
        '',
        '',
        updateURLParameter(window.location.href, key, encodeURIComponent(temp[key]))
      );
    }
    handleGetReportTransaction({
      ...data,
      createdAt: {
        from: dayjs(data.createdAt.from).startOf('date').toISOString(),
        to: dayjs(data.createdAt.to).endOf('date').toISOString(),
      },
    });
  };
  useEffect(() => {
    if (query?.from && query?.to) {
      let payload: any = {
        createdAt: {
          from: dayjs(query?.from.toString()).startOf('date').toISOString(),
          to: dayjs(query?.to.toString()).endOf('date').toISOString(),
        },
      };
      if (query?.accountType) payload = { ...payload, accountType: query?.accountType.toString() };
      reset(payload);
      handleGetReportTransaction(payload);
    } else {
      if (!(dataReportTransaction.length > 0)) {
        handleGetReportTransaction({
          createdAt: initialState,
        });
      }
    }
  }, [query]);
  return (
    <>
      {loading && <LoadingFullScreen />}
      <div className='reportTransaction-container'>
        <div className='reportTransaction-header__content'>
          <div className='reportTransaction-header__title'>
            <h2>{t('Báo cáo tình hình giao dịch')}</h2>
          </div>
          <div className='reportTransaction-header__filter'>
            <button
              className='reportTransaction-header__btn'
              style={isShowFilter ? {} : { borderColor: '#647081' }}
              onClick={() => {
                setShowFilter(!isShowFilter);
              }}>
              <svg
                width={14}
                height={12}
                xmlns='http://www.w3.org/2000/svg'
                style={{ transition: 'all 0.3s ease 0s' }}>
                <path
                  d='M6.99.005c1.977 0 3.954.001 5.93-.001.409 0 .73.151.938.507.237.405.177.817-.179 1.231-1.49 1.737-2.982 3.475-4.48 5.205a.762.762 0 0 0-.206.558c.014.614-.003 1.229.01 1.843.006.288-.094.49-.339.65-.93.61-1.854 1.23-2.779 1.85-.19.127-.381.215-.61.096-.237-.125-.279-.336-.278-.58.004-1.28-.004-2.56.005-3.841a.816.816 0 0 0-.212-.587C3.305 5.222 1.833 3.496.348 1.78.034 1.417-.114 1.037.103.583.318.13.706-.002 1.183 0 3.12.008 5.054.003 6.99.003v.002z'
                  fill={isShowFilter ? '#00BE00' : '#647081'}
                  fillRule='evenodd'
                />
              </svg>
              <span style={isShowFilter ? {} : { color: '#647081' }}>
                {t(isShowFilter ? 'Ẩn lọc' : 'Lọc')}
              </span>
            </button>
          </div>
        </div>
        {isShowFilter && (
          <div className='reportTransaction-search'>
            <form
              className='reportTransaction-search__content'
              onSubmit={handleSubmit(handleSearchForm)}>
              <div className='reportTransaction-search__group'>
                {/* <label htmlFor=''>{t('Khoảng thời gian')}</label> */}
                <DatePickerBackUp
                  control={control}
                  placeholder={'DD/MM/YYYY'}
                  className={`${errors?.createdAt?.from ? ' date-picker-from-error' : ' '}
              ${errors?.createdAt?.to ? ' date-picker-to-error' : ' '}
              `}
                  rules={{ from: { required: true }, to: { required: true } }}
                />
              </div>
              <div className='reportTransaction-search__group'>
                {/* <label htmlFor=''>{t('Hệ thống')}</label> */}
                <Controller
                  control={control}
                  name={'accountType'}
                  defaultValue={''}
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
                      options={dataOptions}
                      value={dataOptions.find((item: Options) => item.value === value)}
                      onChange={(e) => onChange(e?.value)}
                    />
                  )}
                />
              </div>
              <div className='reportTransaction-search__group'>
                <button
                  style={{ marginTop: '0px' }}
                  type='submit'
                  className='btn btn-primary btn-search'
                  disabled={loadingSearch}>
                  <i className='fas fa-analytics' />
                  {t('Thống kê')}
                </button>
              </div>
            </form>
          </div>
        )}
        <div className='reportTransaction-content'>
          <table className='reportTransaction-content__tableFixed'>
            <tbody>
              <tr className='tableFixed-head'>
                <td></td>
              </tr>
              <tr>
                <td>{t('Số Lượng GD Thành Công')}</td>
              </tr>
              <tr>
                <td>{t('Giá Trị GD Thành Công')}</td>
              </tr>
              <tr>
                <td>{t('Số Lượng GD Không Thành Công')}</td>
              </tr>
              <tr>
                <td>{t('Giá Trị GD Không Thành Công')}</td>
              </tr>
              <tr>
                <td>{t('Số Lượng GD Thanh Toán, Chuyển Tiền')}</td>
              </tr>
              <tr>
                <td>{t('Giá Trị GD Thanh Toán, Chuyển Tiền')}</td>
              </tr>
              <tr>
                <td>{t('Số Lượng GD Nạp')}</td>
              </tr>
              <tr>
                <td>{t('Giá Trị GD Nạp')}</td>
              </tr>
              <tr>
                <td>{t('Số Lượng GD Rút')}</td>
              </tr>
              <tr>
                <td>{t('Giá Trị GD Rút')}</td>
              </tr>
            </tbody>
          </table>
          <div className='overflow-table'>
            <table className='reportTransaction-content__table'>
              <tbody>
                <tr>
                  {dataReportTransaction.length > 0 &&
                    dataReportTransaction.map((item: ReportTransactionType) => {
                      return (
                        <Fragment key={Math.random()}>
                          <th className='table-fixedHead'>
                            {dayjs(item?.month).format('MM-YYYY')}
                          </th>
                        </Fragment>
                      );
                    })}
                  <th className='table-fixedHead'>Tổng</th>
                </tr>
                <tr>
                  {dataReportTransaction.length > 0 &&
                    dataReportTransaction.map((item: ReportTransactionType) => {
                      return (
                        <Fragment key={Math.random()}>
                          <th>{numeral(item.successCount).format('0,0')}</th>
                        </Fragment>
                      );
                    })}
                  <th>{numeral(totalReportTransaction?.successCount).format('0,0')}</th>
                </tr>
                <tr>
                  {dataReportTransaction.length > 0 &&
                    dataReportTransaction.map((item: ReportTransactionType) => {
                      return (
                        <Fragment key={Math.random()}>
                          <th>{numeral(item.successAmount).format('0,0')}</th>
                        </Fragment>
                      );
                    })}
                  <th>{numeral(totalReportTransaction?.successAmount).format('0,0')}</th>
                </tr>
                <tr>
                  {dataReportTransaction.length > 0 &&
                    dataReportTransaction.map((item: ReportTransactionType) => {
                      return (
                        <Fragment key={Math.random()}>
                          <th>{numeral(item.failCount).format('0,0')}</th>
                        </Fragment>
                      );
                    })}
                  <th>{numeral(totalReportTransaction?.failCount).format('0,0')}</th>
                </tr>
                <tr>
                  {dataReportTransaction.length > 0 &&
                    dataReportTransaction.map((item: ReportTransactionType) => {
                      return (
                        <Fragment key={Math.random()}>
                          <th>{numeral(item.failAmount).format('0,0')}</th>
                        </Fragment>
                      );
                    })}
                  <th>{numeral(totalReportTransaction?.failAmount).format('0,0')}</th>
                </tr>
                <tr>
                  {dataReportTransaction.length > 0 &&
                    dataReportTransaction.map((item: ReportTransactionType) => {
                      return (
                        <Fragment key={Math.random()}>
                          <th>{numeral(item.paymentCount).format('0,0')}</th>
                        </Fragment>
                      );
                    })}
                  <th>{numeral(totalReportTransaction?.paymentCount).format('0,0')}</th>
                </tr>
                <tr>
                  {dataReportTransaction.length > 0 &&
                    dataReportTransaction.map((item: ReportTransactionType) => {
                      return (
                        <Fragment key={Math.random()}>
                          <th>{numeral(item.paymentAmount).format('0,0')}</th>
                        </Fragment>
                      );
                    })}
                  <th>{numeral(totalReportTransaction?.paymentAmount).format('0,0')}</th>
                </tr>
                <tr>
                  {dataReportTransaction.length > 0 &&
                    dataReportTransaction.map((item: ReportTransactionType) => {
                      return (
                        <Fragment key={Math.random()}>
                          <th>{numeral(item.depositCount).format('0,0')}</th>
                        </Fragment>
                      );
                    })}
                  <th>{numeral(totalReportTransaction?.depositCount).format('0,0')}</th>
                </tr>
                <tr>
                  {dataReportTransaction.length > 0 &&
                    dataReportTransaction.map((item: ReportTransactionType) => {
                      return (
                        <Fragment key={Math.random()}>
                          <th>{numeral(item.depositAmount).format('0,0')}</th>
                        </Fragment>
                      );
                    })}
                  <th>{numeral(totalReportTransaction?.depositAmount).format('0,0')}</th>
                </tr>
                <tr>
                  {dataReportTransaction.length > 0 &&
                    dataReportTransaction.map((item: ReportTransactionType) => {
                      return (
                        <Fragment key={Math.random()}>
                          <th>{numeral(item.withdrawCount).format('0,0')}</th>
                        </Fragment>
                      );
                    })}
                  <th>{numeral(totalReportTransaction?.withdrawCount).format('0,0')}</th>
                </tr>
                <tr>
                  {dataReportTransaction.length > 0 &&
                    dataReportTransaction.map((item: ReportTransactionType) => {
                      return (
                        <Fragment key={Math.random()}>
                          <th>{numeral(item.withdrawAmount).format('0,0')}</th>
                        </Fragment>
                      );
                    })}
                  <th>{numeral(totalReportTransaction?.withdrawAmount).format('0,0')}</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
