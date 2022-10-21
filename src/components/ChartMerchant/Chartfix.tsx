import React, { useEffect, useState } from 'react'
import BarChartTypeMerchant from './BarChartTypeMerchant';
import RechartMerchant from './RechartMerchant';
import { useTranslation } from 'react-i18next';
import useWindowDimensions from 'hook/useWindowDimension';

export const ChartFix = () => {
    const { t } = useTranslation('common');
    return (
        <>
            <div className='barchart'>
                <div className='barchart__content' style={{}}>
                    <h5 className='py-3  mb-2  text-left  pl-4 ' style={{ borderBottom: '1px solid #d1d1d199' }}>
                        {t('Thống kê dữ liệu merchant')}
                    </h5>
                    <RechartMerchant />
                </div>
                <div className='barchart__content'>
                    <h5
                     className='py-3  text-left mb-2  pl-4'
                    style={{ borderBottom: '1px solid #d1d1d199' }}>
                    {t('Thống kê giao dịch cá nhân')}
                    </h5>
                    <BarChartTypeMerchant />
                </div>

            </div>
        </>
    )
}
