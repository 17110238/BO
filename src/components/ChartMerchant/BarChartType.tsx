import React, { memo, useCallback, useEffect } from 'react';
import MainLayout from 'layouts/MainLayout';
import { Row, Form, Col, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';
import { useForm, SubmitHandler } from 'react-hook-form';
import dayjs from 'dayjs';
import { getListMerchantsReport, getListMerchantTypeReport } from 'redux/actions/chartMerchant';
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
import { ChartMerchant } from 'models/chartmerchant/chartmerchant';
import LoadingInline from 'components/common/Loading/LoadingInline';
import utc from 'dayjs/plugin/utc';
import { DataFormater } from 'utils/helpers';
dayjs.extend(utc);
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

const CustomTooltipRecharts = ({ active, payload, label }: any) => {
  if (active) {
    return (
      <div className='custom-tooltip' style={{ background: '#f9fbff' }}>
        <p className='label'>Tháng:{label}</p>
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
                    {item.dataKey == 'count' ? '' : 'đ'}
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
};
const BarChartType = () => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  // console.log('daysj', dayjs().startOf('year').utc().format());
  // console.log('daysj', dayjs().endOf('year').utc().format());

  useEffect(() => {
    const params: any = {
      createdAt: {
        from: dayjs().utc().startOf('year').format('YYYY-MM-DD'),
        to: dayjs().utc().endOf('year').format('YYYY-MM-DD'),
      },
    };
    dispatch(getListMerchantTypeReport(params, (status, data) => {}));
    return () => {};
  }, []);
  const dataMerchant =
    useSelector<any, ChartMerchant[]>((state) => state.chartMerchantReducers.dataMerchantType) ||
    [];
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
                      {item.dataKey == t('count') ? '' : ' đ'}
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
  let formatData = dataMerchant.map((item: any) => {
    let dataBuffer = item.result.map((item: any) => {
      let buffer: any = {};
      for (let obj in item) {
        buffer[t(`${obj}`)] = item[obj];
      }
      return buffer;
    });
  
    dataBuffer = dataBuffer.sort((a: any, b: any) => {
      return a.month - b.month;
    });
    return { name: item.merchantType, month: dataBuffer };
  });
  const isLoading =
    useSelector<any, boolean>((state) => state.chartMerchantReducers.loading) || false;
  let arrBar = [
    { payCode: t('count'), color: '#42a5f5' },
    { payCode: t('amount'), color: '#8884d8' },
  ];
  return (
    <ResponsiveContainer width='100%' height={470}>
      <BarChart
        width={500}
        height={300}
        data={formatData[1]?.name === "ENTERPRISE" ? formatData[1]?.month : formatData[0]?.month}
      
        margin={{
          top: 50,
          right: 30,
          left: 15,
          bottom: 15,
        }}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='month' />
        <YAxis tickFormatter={DataFormater} />
        <Tooltip content={<CustomTooltipRecharts />} />
        <Legend />
        {arrBar.map((item,index) => {
          return (<Bar dataKey={item.payCode} fill={item.color} key={index}/>)
          
        })}
      </BarChart>
    </ResponsiveContainer>
    // </div>
  );
};

export default memo(BarChartType);
