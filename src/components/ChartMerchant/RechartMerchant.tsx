import React, { memo, useCallback, useEffect } from 'react';
import MainLayout from 'layouts/MainLayout';
import { Row, Form, Col, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import { useForm, SubmitHandler } from 'react-hook-form';
import dayjs from 'dayjs';
import { getListMerchantsReport } from 'redux/actions/chartMerchant';
import { StateTransactionEnum, MethodTransactionEnum } from 'models';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { ChartMerchant, GetMerchantsReport } from 'models/chartmerchant/chartmerchant';
import LoadingInline from 'components/common/Loading/LoadingInline';
import BarChartTypeMerchant from './BarChartTypeMerchant';
import NumberFormat from 'react-number-format';
import { DataFormater } from 'utils/helpers';
import useWindowDimensions from 'hook/useWindowDimension';
export interface SearchParams {
  createdAt: {
    from?: any;
    to?: any;
  };
}

interface TypeTooTip {
  color: string;
  value: string;
  name: string;
  dataKey: string;
}

const COLORS = ['#42a5f5', '#8884d8', '#82ca9d'];
const RechartMerchant = () => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const CustomTooltipRecharts = useCallback(({ active, payload, label }: any) => {
    if (active) {
      return (
        <div className='custom-tooltip' style={{ background: '#f9fbff' }}>
          <p className='label'>
            {t('Tháng')}: {label}
          </p>
          <div className='container'>
            {payload?.map((item: TypeTooTip, idx: number) => {
              return (
                <div className='row' key={idx}>
                  <div className='col-12 '>
                    <p className='name-method' style={{ color: item.color }}>
                      {item.name} :
                      <NumberFormat
                        value={item.value}
                        className='foo'
                        displayType={'text'}
                        thousandSeparator={true}
                      />
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  }, []);
  const dataMerchant =
    useSelector<any, GetMerchantsReport[]>( (state) => state.chartMerchantReducers.dataColumnMerchant) || [];
  const dataMerchantFormat = dataMerchant.map((item: any) => {
    // console.log('🚀 ~ file: BarChartTypeMerchant.tsx ~ line 126 ~ formatData ~ item', item);
    let buffer: any = {};
    for (let obj in item) {
      buffer[t(`${obj}`)] = item[obj];
    }
    return buffer;
  });

  const isLoading =
    useSelector<any, boolean>((state) => state.chartMerchantReducers.loading) || false;
  useEffect(() => {
    const params: any = {
      createdAt: {
        from: dayjs().startOf('year').format('YYYY-MM-DD'),
        to: dayjs().endOf('year').format('YYYY-MM-DD'),
      },
    };
    dispatch(getListMerchantsReport(params, (status, data) => {}));
    return () => {};
  }, []);
  let arrBar = [
    { payCode: t('total'), color: '#42a5f5' },
    { payCode: t('newMerchants'), color: '#8884d8' },
    { payCode: t('activeMerchants'), color: '#82ca9d' },
  ];
  return (
    <>
          <ResponsiveContainer width='100%' height={350}>
            <BarChart
              width={500}
              height={200}
              data={dataMerchantFormat}
              margin={{
                top: 15,
                right: 30,
                left: 15,
                bottom:15,
              }}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='month' />
              <YAxis tickFormatter={DataFormater} />
              <Tooltip content={<CustomTooltipRecharts />} />
              <Legend />
              {arrBar.map((item,index ) => {
                return <Bar dataKey={item.payCode} fill={item.color} key ={index} />;
              })}
            </BarChart>
          </ResponsiveContainer>
    </>
  );
};

export default memo(RechartMerchant);
