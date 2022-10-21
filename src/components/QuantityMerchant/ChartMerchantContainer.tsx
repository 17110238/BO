import dayjs from 'dayjs';
import React from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
interface Props {
  dataChart?: any;
}
const CustomTooltip = (data: any) => {
  // console.log(data);
  if (data.active && data.payload && data.payload.length) {
    return (
      <div
        className='custom-tooltip'
        style={{ color: 'white', padding: '10px', borderRadius: '12px' }}>
        <p className='desc'>{dayjs(data.payload[0].payload.key).format('DD/MM/YYYY')}</p>
        <p className='label'>{`${
          data.payload[0].dataKey === 'pendingAmount'
            ? 'Merchant chờ duyệt'
            : data.payload[0].dataKey === 'total'
            ? 'Tổng Merchant'
            : data.payload[0].dataKey === 'activeAmount'
            ? 'Merchant đang hoạt động'
            : data.payload[0].dataKey === 'approvedAmount'
            ? 'Merchant đã duyệt'
            : ''
        } : ${data.payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};
const ChartMerchantContainer: React.FC<Props> = ({ dataChart }) => {
  return (
    <div className='chart-merchant-container'>
      <div className='chart-merchant-item'>
        <img src='/assets/icon/block2.svg' alt='icon-block' />
        <div className='merchant-description'>
          <div className='merchant-title'>Tổng merchant</div>
          <div className='merchant-data'>{dataChart?.total?.total}</div>
        </div>
        <ResponsiveContainer>
          <AreaChart
            data={dataChart?.data}
            margin={{
              top: 30,
              left: 0,
              bottom: 0,
            }}>
            <Tooltip content={<CustomTooltip />} />
            <Area type='monotone' dataKey='total' stackId='1' stroke='#10ED00' fill='#C8FFCE' />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className='chart-merchant-item'>
        <img src='/assets/icon/block3.svg' alt='icon-block' />
        <div className='merchant-description'>
          <div className='merchant-title'>Merchant chờ duyệt</div>
          <div className='merchant-data'>{dataChart?.total?.pendingAmount}</div>
        </div>
        <ResponsiveContainer>
          <AreaChart
            data={dataChart?.data}
            margin={{
              top: 30,
              left: 0,
              bottom: 0,
            }}>
            <Tooltip content={<CustomTooltip />} />
            <Area
              type='monotone'
              dataKey='pendingAmount'
              stackId='2'
              stroke='#DBA000'
              fill='#FFDD80'
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className='chart-merchant-item'>
        <img src='/assets/icon/block1.svg' alt='icon-block' />
        <div className='merchant-description'>
          <div className='merchant-title'>Merchant đang hoạt động</div>
          <div className='merchant-data'>{dataChart?.total?.activeAmount}</div>
        </div>
        <ResponsiveContainer>
          <AreaChart
            data={dataChart?.data}
            margin={{
              top: 30,
              left: 0,
              bottom: 0,
            }}>
            <Tooltip content={<CustomTooltip />}/>
            <Area
              type='monotone'
              dataKey='activeAmount'
              stackId='3'
              stroke='#0099FF'
              fill='#B6E2FF'
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className='chart-merchant-item'>
        <img src='/assets/icon/block4.svg' alt='icon-block' />
        <div className='merchant-description'>
          <div className='merchant-title'>Merchant đã duyệt</div>
          <div className='merchant-data'>{dataChart?.total?.approvedAmount}</div>
        </div>
        <ResponsiveContainer>
          <AreaChart
            data={dataChart?.data}
            margin={{
              top: 30,
              left: 0,
              bottom: 0,
            }}>
            <Tooltip  content={<CustomTooltip />}/>
            <Area
              type='monotone'
              dataKey='approvedAmount'
              stackId='4'
              stroke='#FF7A3B'
              fill='#FFDBDB'
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartMerchantContainer;
