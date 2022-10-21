import React, { useEffect, useState } from 'react';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import { Controller, useForm } from 'react-hook-form';
import { t } from 'i18next';
import ReactSelect from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import {
  DataTelco,
  GetReportCardTelcoInput,
  SumTelco,
  SupplierFilterGetReportCardTelcoEnum,
} from 'models';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { getListTelcoByDate, getListTelcoByPrice } from 'redux/actions/telcoAction';
import numeral from 'numeral';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import { updateURLParameter } from 'utils/helpers';
import { useRouter } from 'next/router';

export default function TelcoManageContainer() {
  const { query } = useRouter();
  const dispatch = useDispatch();
  const initialState = {
    createdAt: {
      from: dayjs().date(1).startOf('date').toISOString(),
      to: dayjs(new Date()).endOf('date').toISOString(),
    },
    supplier: '',
  };
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    defaultValues: initialState,
  });
  const loading = useSelector((state: any) => state.reportTelcoReducer.loading);
  const [listTelcoPrice, setListTelcoPrice] = useState<Array<DataTelco>>([]);
  const [sumTelcoPrice, setSumTelcoPrice] = useState<SumTelco>();
  const [listTelcoDate, setListTelcoDate] = useState<Array<DataTelco>>([]);
  const [sumTelcoDate, setSumTelcoDate] = useState<SumTelco>();
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const listGatePayment = Object.values(SupplierFilterGetReportCardTelcoEnum).map((item: any) => {
    return { label: item === '' ? '---Tất cả nhà mạng---' : item, value: item };
  });
  const handleGetTelcoPrice = (payload: GetReportCardTelcoInput) => {
    setLoadingSearch(true);
    dispatch(
      getListTelcoByPrice(payload, (status, res) => {
        if (status) {
          setListTelcoPrice(res.data);
          setSumTelcoPrice(res.sumData);
        }
        setLoadingSearch(false);
      })
    );
  };
  const handleGetTelcoDate = (payload: GetReportCardTelcoInput) => {
    setLoadingSearch(true);
    dispatch(
      getListTelcoByDate(payload, (status, res) => {
        if (status) {
          setListTelcoDate(res.data);
          setSumTelcoDate(res.sumData);
        }
        setLoadingSearch(false);
      })
    );
  };
  const handleSearchForm = (data: any) => {
    let payload: any = {
      filter: {
        createdAt: {
          from: dayjs(data?.createdAt.from).startOf('date').toISOString(),
          to: dayjs(data?.createdAt.to).endOf('date').toISOString(),
        },
      },
    };
    const { from, to } = data?.createdAt;
    let temp: any = { from, to };
    if (data?.supplier) {
      payload = { ...payload, filter: { ...payload.filter, supplier: data.supplier } };
      temp = { ...temp, supplier: data.supplier };
    }
    window.history.replaceState('', '', `/vi-dien-tu/quan-ly-telco`);
    for (const key in temp) {
      if (temp[key]) {
        window.history.replaceState(
          '',
          '',
          updateURLParameter(window.location.href, key, encodeURIComponent(temp[key]))
        );
      }
    }
    handleGetTelcoPrice(payload);
    handleGetTelcoDate(payload);
  };
  useEffect(() => {
    let payload: any = {};
    if (query?.from && query?.to) {
      payload = {
        ...payload,
        filter: {
          createdAt: {
            from: dayjs(query?.from.toString()).startOf('date').toISOString(),
            to: dayjs(query?.to.toString()).endOf('date').toISOString(),
          },
        },
      };
      if (query?.supplier) {
        payload = {
          ...payload,
          filter: {
            ...payload.filter,
            supplier: query?.supplier,
          },
        };
      }
      reset(payload.filter);
      handleGetTelcoPrice(payload);
      handleGetTelcoDate(payload);
    } else {
      payload = {
        ...payload,
        filter: {
          createdAt: {
            from: dayjs().date(1).startOf('date').toISOString(),
            to: dayjs(new Date()).endOf('date').toISOString(),
          },
        },
      };
      if (!(listTelcoPrice.length > 0)) {
        handleGetTelcoPrice(payload);
      }
      if (!(listTelcoDate.length > 0)) {
        handleGetTelcoDate(payload);
      }
    }
  }, [query]);
  return (
    <>
      {loading && <LoadingFullScreen />}
      <div
        className='telcoManage-container'
        style={listTelcoPrice.length > 0 || listTelcoDate.length > 0 ? {} : { height: '75vh' }}>
        <div className='telcoManage-header'>
          <div className='telcoManage-header__title'>
            <h4>Báo Cáo Card Telco</h4>
          </div>
          <div className='telcoManage-header__filter'>
            <button
              className='filter-btn btn btn-active'
              style={showFilter ? {} : { borderColor: '#647081' }}
              onClick={() => {
                reset();
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
              <p style={showFilter ? {} : { color: '#647081' }} className='mb-0'>
                {t(showFilter ? 'Ẩn lọc' : 'Hiện')}
              </p>
            </button>
          </div>
        </div>
        {showFilter && (
          <form
            className='telcoManage-box-search'
            onSubmit={handleSubmit(handleSearchForm)}
            style={{ marginTop: '10px' }}>
            <div className='telcoManage-group__search'>
              {/* <label htmlFor=''>Khoảng thời gian</label> */}
              <DatePickerCustomV2
                placeholder={'DD/MM/YYYY'}
                control={control}
                className={`${errors?.createdAt?.from ? ' date-picker-from-error' : ' '}
              ${errors?.createdAt?.to ? ' date-picker-to-error' : ' '}
              `}
                rules={{ from: { required: true }, to: { required: true } }}
              />
            </div>
            <div className='telcoManage-group__search'>
              {/* <label htmlFor=''>Nhà mạng</label> */}
              <Controller
                control={control}
                name={'supplier'}
                render={({ field, fieldState: { error } }) => (
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
                    noOptionsMessage={() => t('Không có kết quả tìm kiếm')}
                    options={listGatePayment}
                    onChange={(e) => field.onChange(e?.value)}
                    value={listGatePayment.find((item) => item.value == field.value)}
                  />
                )}
              />
            </div>
            <div className='telcoManage-group__btn'>
              {/* <label htmlFor=''></label> */}
              <button
                className='telcoManage-btn-filter btn btn-primary btn-search'
                disabled={loadingSearch}>
                <i className='fas fa-search' />
                Thống kê
              </button>
            </div>
          </form>
        )}

        <div className='telcoManage-content'>
          <div className='telcoManage-table table-price'>
            <div className='telcoManage-table__header'>
              <i className='fa fa-calendar-alt'></i>
              <h4>BÁO CÁO BÁN CARD TELCO THEO MỆNH GIÁ</h4>
            </div>
            <div className='telcoManage-table__overflow'>
              <table className='telcoManage-table__content'>
                <thead>
                  <tr>
                    <td>Mệnh giá</td>
                    <td>SL Card</td>
                    <td>Giá Trị Card</td>
                    <td>Tiền Ví</td>
                  </tr>
                </thead>
                <tbody>
                  {listTelcoPrice.length > 0 &&
                    listTelcoPrice.map((item: DataTelco) => {
                      return (
                        <tr key={Math.random()}>
                          <td>{numeral(item.price).format('0,0')}</td>
                          <td>{numeral(item.totalCard).format('0,0')}</td>
                          <td>{numeral(item.totalAmountCard).format('0,0')}</td>
                          <td>{numeral(item.totalWallet).format('0,0')}</td>
                        </tr>
                      );
                    })}
                </tbody>
                <tfoot>
                  <tr>
                    <td>Tổng Cộng</td>
                    <td>
                      {sumTelcoPrice?.totalCard
                        ? numeral(sumTelcoPrice?.totalCard).format('0,0')
                        : 0}
                    </td>
                    <td>{numeral(sumTelcoPrice?.totalAmountCard).format('0,0')}</td>
                    <td>{numeral(sumTelcoPrice?.totalWallet).format('0,0')}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div className='telcoManage-table table-date'>
            <div className='telcoManage-table__header'>
              <i className='fa fa-calendar-alt'></i>
              <h4>BÁO CÁO BÁN CARD TELCO THEO NGÀY</h4>
            </div>
            <div className='telcoManage-table__overflow'>
              <table className='telcoManage-table__content date'>
                <thead>
                  <tr>
                    <td>Ngày</td>
                    <td>SL Card</td>
                    <td>Giá Trị Card</td>
                    <td>Tiền Ví</td>
                  </tr>
                </thead>
                <tbody>
                  {listTelcoDate.length > 0 &&
                    listTelcoDate.map((item: DataTelco) => {
                      return (
                        <tr key={Math.random()}>
                          <td>{dayjs(item.date).format('DD-MM-YYYY')}</td>
                          <td>{numeral(item.totalCard).format('0,0')}</td>
                          <td>{numeral(item.totalAmountCard).format('0,0')}</td>
                          <td>{numeral(item.totalWallet).format('0,0')}</td>
                        </tr>
                      );
                    })}
                </tbody>
                <tfoot>
                  <tr>
                    <td>Tổng Cộng</td>
                    <td>
                      {sumTelcoDate?.totalCard ? numeral(sumTelcoDate?.totalCard).format('0,0') : 0}
                    </td>
                    <td>{numeral(sumTelcoDate?.totalAmountCard).format('0,0')}</td>
                    <td>{numeral(sumTelcoDate?.totalWallet).format('0,0')}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
