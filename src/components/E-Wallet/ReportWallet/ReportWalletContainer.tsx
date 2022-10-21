import DatePickerBackUp from 'components/common/DatePickerCustom/DatePickerBackUp';
import dayjs from 'dayjs';
import { BalanceReportWallet, KycReportWallet, ReportWallet, SearchReportWallet } from 'models';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getReportWallet } from 'redux/actions/reportWallet';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import { countMonthOfYear, updateURLParameter } from 'utils/helpers';
import { useRouter } from 'next/router';
import numeral from 'numeral';
import { getBalance, getInfoKycWallet } from 'redux/actions/getBalanceReportWallet';

export default function ReportWalletContainer() {
  const { query } = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation('common');
  const loading = useSelector((state: any) => state.reportWalletReducer.loading);
  const [isShowFilter, setShowFilter] = useState<boolean>(true);
  const initialState = {
    from: dayjs(dayjs().month(dayjs(new Date()).month() - 2))
      .startOf('month')
      .toISOString(),
    to: dayjs().endOf('month').toISOString(),
  };
  const {
    control,
    getValues,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      createdAt: initialState,
    },
  });

  const [reportWallet, setReportWallet] = useState<Array<ReportWallet>>([]);
  const [balance, setBalance] = useState<BalanceReportWallet>();
  const [dataKyc, setDataKyc] = useState<KycReportWallet>();
  const [loadingSearch, setLoadingSearch] = useState<boolean>(true);
  const getListReportWallet = (payload: SearchReportWallet) => {
    setLoadingSearch(true);
    dispatch(
      getReportWallet(payload, (status, res) => {
        if (status) {
          setReportWallet(res);
        }
        setLoadingSearch(false);
      })
    );
  };
  const getBalanceReportWallet = () => {
    dispatch(
      getBalance((state, res) => {
        if (state) {
          setBalance(res);
        }
      })
    );
  };
  const getDataInfoKycWallet = () => {
    dispatch(
      getInfoKycWallet((state, res) => {
        if (state) {
          setDataKyc(res);
        }
      })
    );
  };
  const handleFilterForm = (data: any) => {
    const { from, to } = data?.createdAt;
    let temp: any = {
      from: dayjs(from).startOf('month').toISOString(),
      to: dayjs(to).endOf('month').toISOString(),
    };
    let payload: SearchReportWallet = {
      createdAt: {
        from: dayjs(from).startOf('month').toISOString(),
        to: dayjs(to).endOf('month').toISOString(),
      },
    };
    for (const key in temp) {
      window.history.replaceState(
        '',
        '',
        updateURLParameter(window.location.href, key, encodeURIComponent(temp[key]))
      );
    }
    getListReportWallet(payload);
  };
  useEffect(() => {
    let payload = {};
    if (query?.from && query?.to) {
      payload = {
        createdAt: {
          from: dayjs(query?.from.toString()).startOf('date').toISOString(),
          to: dayjs(query?.to.toString()).endOf('date').toISOString(),
        },
      };
      reset(payload);
      getListReportWallet(payload);
    } else {
      if (!(reportWallet.length > 0)) {
        const data = getValues();
        const { from, to } = data?.createdAt;
        payload = {
          createdAt: {
            from: dayjs(from).startOf('date').toISOString(),
            to: dayjs(to).endOf('date').toISOString(),
          },
        };
        getListReportWallet(payload);
      }
    }
    getBalanceReportWallet();
    getDataInfoKycWallet();
  }, [query]);
  return (
    <>
      {loading && <LoadingFullScreen />}
      <div className='reportWallet-container'>
        <div className='reportWallet-header'>
          <div className='reportWallet-header__content'>
            <div className='reportWallet-header__title'>
              <h2>{t('Báo cáo số lượng ví')}</h2>
            </div>
            <div className='reportWallet-header__filter'>
              <button
                className='reportWallet-header__btn'
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
        </div>
        {isShowFilter && (
          <form className='reportWallet-search' onSubmit={handleSubmit(handleFilterForm)}>
            <div className='reportWallet-search__content'>
              <div className='reportWallet-search__group'>
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
              <div className='reportWallet-search__group'>
                <button className='btn btn-primary btn-search' disabled={loadingSearch}>
                  <i className='fas fa-analytics' />
                  {t('Thống kê')}
                </button>
              </div>
            </div>
          </form>
        )}
        <div className='reportWallet-statistical' style={isShowFilter ? {} : { marginTop: '20px' }}>
          <div className='reportWallet-statistical__content'>
            <div className='reportWallet-statistical__group'>
              <label className='reportWallet-statistical__title'>{t('Tổng số ví')}</label>
              <p className='reportWallet-statistical__text'>
                {dataKyc?.userReg ? numeral(dataKyc?.userReg).format('0,0') : 0}
              </p>
            </div>
            <div className='reportWallet-statistical__group'>
              <label className='reportWallet-statistical__title'>{t('Tổng số KYC')}</label>
              <p className='reportWallet-statistical__text'>
                {dataKyc?.userKyc ? numeral(dataKyc?.userKyc).format('0,0') : 0}
              </p>
            </div>
            <div className='reportWallet-statistical__group'>
              <label className='reportWallet-statistical__title'>
                {t('Tổng số ví đã liên kết')}
              </label>
              <p className='reportWallet-statistical__text'>
                {dataKyc?.userLinked ? numeral(dataKyc?.userLinked).format('0,0') : 0}
              </p>
            </div>
            <div className='reportWallet-statistical__result'>
              <span>Dữ liệu cập nhật realtime</span>
            </div>
          </div>
          <div className='reportWallet-statistical__content'>
            <div className='reportWallet-statistical__group'>
              <label className='reportWallet-statistical__title'>{t('Tổng số dư hiện tại')}</label>
              <p className='reportWallet-statistical__text'>
                {balance?.balance ? numeral(balance?.balance).format('0,0') : 0}
              </p>
            </div>
            <div className='reportWallet-statistical__group'>
              <label className='reportWallet-statistical__title'>
                {t('Tổng số tiền ví đang hoạt động')}
              </label>
              <p className='reportWallet-statistical__text'>
                {balance?.balanceOpen ? numeral(balance?.balanceOpen).format('0,0') : 0}
              </p>
            </div>
            <div className='reportWallet-statistical__group'>
              <label className='reportWallet-statistical__title'>
                {t('Tổng số tiền ví bị khóa')}
              </label>
              <p className='reportWallet-statistical__text'>
                {balance?.balanceLock ? numeral(balance?.balanceLock).format('0,0') : 0}
              </p>
            </div>
            <div className='reportWallet-statistical__result'>
              <span>
                Dữ liệu cập nhật đến {dayjs(new Date()).subtract(1, 'days').format('DD-MM-YYYY')}{' '}
                23:59:59
              </span>
            </div>
          </div>
        </div>
        <div className='reportWallet-content'>
          <table className='reportWallet-content__tableFixed'>
            <tbody>
              <tr className='tableFixed-head'>
                <td></td>
              </tr>
              <tr>
                <td>{t('Ví đã đăng kí')}</td>
              </tr>
              <tr>
                <td>{t('Ví đã kích hoạt')}</td>
              </tr>
              <tr>
                <td>{t('Ví đang hoạt động')}</td>
              </tr>
            </tbody>
          </table>
          <div className='overflow-table'>
            <table className='reportWallet-content__table'>
              <tbody>
                <tr>
                  {reportWallet.length > 0 &&
                    reportWallet.map((item: ReportWallet) => {
                      return (
                        <th className='table-fixedHead' key={Math.random()}>
                          {dayjs(item.month).format('MM-YYYY')}
                        </th>
                      );
                    })}
                </tr>
                <tr>
                  {reportWallet.length > 0 &&
                    reportWallet.map((item: ReportWallet) => {
                      return (
                        <Fragment key={Math.random()}>
                          <th>{numeral(item.total).format('0,0')}</th>
                        </Fragment>
                      );
                    })}
                </tr>
                <tr>
                  {reportWallet.length > 0 &&
                    reportWallet.map((item: ReportWallet) => {
                      return (
                        <Fragment key={Math.random()}>
                          <th>{numeral(item.kycAmount).format('0,0')}</th>
                        </Fragment>
                      );
                    })}
                </tr>
                <tr>
                  {reportWallet.length > 0 &&
                    reportWallet.map((item: ReportWallet) => {
                      return (
                        <Fragment key={Math.random()}>
                          <th>{numeral(item.activeAccountAmount).format('0,0')}</th>
                        </Fragment>
                      );
                    })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
