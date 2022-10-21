import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { getTopMerchantCategory } from 'redux/actions';
import { renderCustomizedLabel } from './QuantityMerchantContainer';
const COLORS = [
  '#52C9D9',
  '#52D954',
  '#D9D452',
  '#D97252',
  '#52B0D9',
  '#7D52D9',
  '#D95252',
  '#52D9B9',
  '#5270D9',
  '#D952BB',
];
// Chart.defaults.font.size = 30;
const TopJobMerchantContainer = ({dataCateGory} :any) => {

  const CustomTooltip = (data: any) => {
    let element = document.querySelectorAll('.recharts-pie-sector');
    data?.payload[0]?.payload.color &&
      element.forEach((el: any) => {
        if (el.querySelector('path')?.getAttribute('fill') === data?.payload[0]?.payload.color) {
          el?.querySelector('path')?.setAttribute('style', 'opacity:1');
        } else {
          el?.querySelector('path')?.setAttribute('style', 'opacity:0.3');
        }
      });
    if (data.active && data.payload && data.payload.length) {
      return (
        <div
          className='custom-tooltip'
          style={{
            backgroundColor: '#243746',
            color: 'white',
            padding: '10px',
            borderRadius: '12px',
          }}>
          <p className='desc' style={{ fontSize: 13 }}>
            {data.payload[0].name}:
          </p>
          <p className='label' style={{ fontSize: 13 }}>
            {data.payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className='top-job-merchant'>
      <div className='top-job--merchant__title'>
        {'Top 10 ngành nghề kinh doanh có nhiều Merchant'}
      </div>
      <ResponsiveContainer>
        <PieChart width={400} height={400}>
          <Pie
            data={dataCateGory}
            cx='50%'
            cy='50%'
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={150}
            fill='#8884d8'
            dataKey='value'
            onMouseLeave={() => {
              let element = document.querySelectorAll('.recharts-pie-sector');
              element.forEach((el: any) => {
                el?.querySelector('path')?.setAttribute('style', 'opacity:1;transition:all 1s');
              });
            }}>
            {dataCateGory?.map((entry: any, index: any) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip cursor={{ opacity: '0' }} content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className='top-category-card-container'>
        {dataCateGory?.map((entry: any, index: any) => (
          <div key={index} className='top-card-category-item'>
            <div
              style={{ backgroundColor: COLORS[index] }}
              className='top-card-category-item-color'></div>
            <div className='top-card-category-item-name'>{entry?.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopJobMerchantContainer;
