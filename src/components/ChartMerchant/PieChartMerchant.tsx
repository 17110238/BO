import LoadingInline from 'components/common/Loading/LoadingInline';
import { TableMerchant } from 'components/TableMerchant';
import dayjs from 'dayjs';
import { ChartMerchant, LocationAmount } from 'models/chartmerchant/chartmerchant';
import React, { memo, useCallback, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
  Tooltip,
  LabelList,
} from 'recharts';
import { getListPaymentLocationReport } from 'redux/actions/chartMerchant';
import useWindowDimension from 'hook/useWindowDimension.js';
import NumberFormat from 'react-number-format';
const COLORS = ["#6666CC","#33CC00","#FFCC00","#FFCCCC","#FFFFCC","#99FFCC","#8884d8", "#83a6ed", "#8dd1e1", '#82ca9d', '#d0ed57', '#8bc34a', '#ffc658', "#980000",
  "#e6b8af", "#cc4125", "#85200c", "#999999", "#34a853", "#0000ff", "#ff00ff", "#4b86e8", "#46bdc6", "#ff6d02", "#e69138", "#c27ba0", "#674ea7", "#2cdbdc", "#6aa84f","#336666","#FF3366","#0000BB"];
interface TypeTooTip {
  color: string;
  value: string;
  name: string;
}
const style = {
  top: '50%',
  right: 0,
  transform: 'translate(0, -50%)',
  lineHeight: '24px',
};
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill='white' textAnchor={x > cx ? 'start' : 'end'} dominantBaseline='central'>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
const PieChartMerchant = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('common');
  const { width: screenWidth } = useWindowDimension();
  const dataMerchant =

    useSelector<any, LocationAmount[]>(
      (state) => state.chartMerchantReducers.dataLocationMerchant
    ) || [];
  const isLoading =
    useSelector<any, boolean>((state) => state.chartMerchantReducers.loading) || false;
  let dataAmount = dataMerchant.map((item, index) => {
    return { name: item.location, value: item.amount };
  });
  let dataCount = dataMerchant.map((item, index) => {
    return { name: item.location, value: item.count };
  });
  let formatLegend = dataMerchant.map((item, index) => {
    return { name: item.location, value: item.location, color: COLORS[index % COLORS.length] };
  });
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
                      đ
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
  const CustomTooltipRecharts1 = useCallback(({ active, payload, label }: any) => {
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
  useEffect(() => {
    const params: any = {
      createdAt: {
        from: dayjs().startOf('year').format('YYYY-MM-DD'),
        to: dayjs().endOf('year').format('YYYY-MM-DD'),
      },
    };
    dispatch(getListPaymentLocationReport(params, (status, data) => { }));
    return () => { };
  }, []);
  return (
    <div className='barchart py-4'>
      <div className='barchart__content'>
        <LoadingInline loading={isLoading} />
        <h5 className='py-3  mb-2 text-left pl-4' style={{ borderBottom: '1px solid #d1d1d199' }} > {t('Thống kê theo khu vực')} </h5>
        <ResponsiveContainer width='100%' height={400}>
          <PieChart width={200} height={200}>
            <Pie
              data={dataAmount}
              cx='20%'
              cy='50%'
              labelLine={false}
              legendType='circle'
              label={renderCustomizedLabel}
              outerRadius={screenWidth > 550 ? '70%' : '60'}
              dataKey='value'>
              {dataAmount.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Pie
              data={dataCount}
              cx='80%'
              cy='50%'
              labelLine={false}
              legendType='circle'
              label={renderCustomizedLabel}
              outerRadius={screenWidth > 550 ? '70%' : '60'}
              dataKey='value'>
              {dataCount.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltipRecharts1 />} />
         
            {/* <Legend content={renderLegend} height={200} payload={formatLegend} /> */}
            <Legend  overflow={'scorll' } height={100} payload={formatLegend} wrapperStyle={{overflowY:'auto'}} />
          </PieChart>
        </ResponsiveContainer>
      </div>
   
      <div className='barchart__content'>
        <h5 className='py-3 text-left pl-4'> {t('Dữ liệu thống kê theo khu vực')}</h5>
        <TableMerchant />
      </div>
    </div>
  );
};
export default memo(PieChartMerchant);
