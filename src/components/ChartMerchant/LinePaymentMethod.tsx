import React, { memo, useCallback, useEffect } from 'react';
import NumberFormat from 'react-number-format';
import { Row, Form, Col, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import { useForm, SubmitHandler } from 'react-hook-form';
import dayjs from 'dayjs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { getListPaymentMenthodReport } from 'redux/actions/chartMerchant';
import { colorList } from 'utils/helpers/constColor';
import {
  ChartMerchant,
  dataPaymentMethod,
  paymentMethodTypes,
} from 'models/chartmerchant/chartmerchant';
import { DataFormater } from 'utils/helpers';
interface SearchParams {
  search?: string;
  method?: string | null;
  state?: string | null;
  createdAt?: {
    from?: any;
    to?: any;
  };
}
interface TypeTooTip {
  color: string;
  value: string;
  name: string;
}


const LinePaymentMethod = () => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const dataPaymentMenthod = useSelector<any, dataPaymentMethod[]>((state) => state.chartMerchantReducers.dataPaymentMethod) || [];
  const countArr = dataPaymentMenthod.map((item, index) => {
    const res: any = {};
    res.month = item.month;
    item.result.forEach((method) => {
      res[t(`${method.method}`)] = method.count;
    });
    return res;
  }) || [];
  const formatDataCount =
 
    countArr.sort((a: any, b: any) => {
      return a.month - b.month;
    }) || [];
  const countArr1 = dataPaymentMenthod.map((item, index) => {
    const res: any = {};
    res.month = item.month;
    item.result.forEach((method) => {
      res[t(`${method.method}`)] = method.total;
    });
    return res;
  }) || [];
  const formatDataAmont = countArr1.sort((a: any, b: any) => {
    return a.month - b.month;
  }) || [];
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
    dispatch(getListPaymentMenthodReport(params, (status, data) => { }));

    return () => { };
  }, []);
//   ALIPAY_DIRECT: 351110
// ALIPAY_ECOMMERCE: 60000
// Chuyển khoản: 653467000
// MOMO: 110000
// Thẻ ATM: 8132233753
// Thẻ credit Quốc tế: 6305260
// Thẻ credit Việt Nam: 8170556
// Ví PayME: 291320946
// WECHAT: 40000
  let arrLine = [
    { payCode: 'Ví PayME', color: '#b61827' },
    { payCode: 'Thẻ credit Quốc tế', color: '#0086c3' },
    { payCode: 'Thẻ credit Việt Nam', color: '#4d2c91' },
    { payCode: 'Thẻ ATM', color: '#26418f' },
    { payCode: 'Chuyển khoản', color: '#c27ba0' },
    { payCode: 'ALIPAY_ECOMMERCE', color: '#00766c' },
    { payCode: 'ALIPAY_DIRECT', color: '#6b9b37' },
  ];
  return (
    <>
      <div
        style={{ background: '#fff', width: '100%', borderRadius: '15px', overflow: 'hidden' }}
        className='pb-2  mt-3'>
        <h5
          className=' py-3 pl-2 text-center'
          style={{ borderBottom: '1px solid #d1d1d199', fontSize: '18px', fontWeight: 600, lineHeight: 1.2, color: '#272b41' }}>
          {t('Thống kê giao dịch theo phương thức')}
        </h5>
        <Row className='w-100'>
          <Col className='col-12 col-lg-12 col-xl-6 col-xxl-6 '>
            <h5 className='py-2 text-center' style={{ fontSize: '15px', fontWeight: 600, lineHeight: 1.2, color: '#272b41' }}>{t('Thống kê giao dịch theo số lượng')} </h5>
            <ResponsiveContainer width='100%' height={350}>
              <LineChart
                width={500}
                height={350}
                syncId='anyId'
                data={formatDataCount}
                margin={{
                  top: 15,
                  right: 30,
                  left: 15,
                  bottom: 15,
                }}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <YAxis tickFormatter={DataFormater} />
                <Tooltip content={<CustomTooltipRecharts1 />} />
                <Legend />
                {arrLine.map((item, index) => {
                  return <Line type='monotone' dataKey={item.payCode} stroke={item.color} key={index} />;
                })}
                {/* <Line type='monotone' dataKey={t('PAYME')} stroke='#b61827' activeDot={{ r: 8 }} />
                <Line type='monotone' dataKey={t('ALIPAY_ECOMMERCE')} stroke='#4d2c91' />
                <Line type='monotone' dataKey={t('ATM')} stroke='#26418f' />
                <Line type='monotone' dataKey={t('CREDIT_INTERNATIONAL')} stroke='#0086c3' />
                <Line type='monotone' dataKey={t('EBUY')} stroke='#00766c' />
                <Line type='monotone' dataKey={t('MANUAL_BANK')} stroke='#6b9b37' /> */}
              </LineChart>
            </ResponsiveContainer>
          </Col>
          <Col className='col-12 col-lg-12 col-xl-6 col-xxl-6 '>
            <h5 className='py-2  text-center' style={{ fontSize: '15px', fontWeight: 600, lineHeight: 1.2, color: '#272b41' }}> {t('Thống kê giao dịch theo số tiền')}</h5>
            <ResponsiveContainer width='100%' height={350}>
              <LineChart
                width={500}
                height={350}
                data={formatDataAmont}
                syncId='anyId'
                margin={{
                  top: 15,
                  right: 30,
                  left: 15,
                  bottom: 15,
                }}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <YAxis tickFormatter={DataFormater} />
                <Tooltip content={<CustomTooltipRecharts />} />
                <Legend />
                {arrLine.map((item, index) => {
                  return <Line type='monotone' dataKey={item.payCode} stroke={item.color} key={index} />;
                })}
                {/* <Line type='monotone' dataKey={t('PAYME')} stroke='#b61827' activeDot={{ r: 8 }} />
                <Line type='monotone' dataKey={t('ALIPAY_ECOMMERCE')} stroke='#4d2c91' />
                <Line type='monotone' dataKey={t('ATM')} stroke='#26418f' />
                <Line type='monotone' dataKey={t('CREDIT_INTERNATIONAL')} stroke='#0086c3' />
                <Line type='monotone' dataKey={t('EBUY')} stroke='#00766c' />
                <Line type='monotone' dataKey={t('MANUAL_BANK')} stroke='#6b9b37' /> */}
                {/* <Brush /> */}
              </LineChart>
            </ResponsiveContainer>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default memo(LinePaymentMethod);
