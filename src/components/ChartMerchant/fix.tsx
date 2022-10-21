import React, { useEffect, useState } from 'react'
import BarChartTypeMerchant from './BarChartTypeMerchant';
import RechartMerchant from './RechartMerchant';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import useWindowDimensions from 'hook/useWindowDimension';

export const ChartFix1 = () => {
    const { t } = useTranslation('common');
    const { width: screenWidth } = useWindowDimensions();
    const [witdth, setWitdh] = useState<number>(screenWidth)
    useEffect(() => {
        setWitdh(screenWidth)


    }, [])


    return (
        <>

            <div className='barchart'>
                <div className='barchart__content' style={{width:'40%' ,background:'#eff0f3',marginTop:'0px'}}>
                    <ResponsiveContainer width='100%' height={2}>
                        <BarChart data={[]} >
                        </BarChart>
                    </ResponsiveContainer>

                </div>
                <div className='barchart__content' style={{width:'40%',background:'#eff0f3',marginTop:'0px'}}>
                    <ResponsiveContainer width='100%' height={2}>
                        <BarChart data={[]} >
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </>
    )
}
