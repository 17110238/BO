import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen'
import React from 'react'
import formatCurrency from 'utils/helpers/formatCurrency'
import { useTranslation } from 'react-i18next'
import LoadingInline from 'components/common/Loading/LoadingInline';

interface Props {
  data?: any;
  isLoading?: boolean
}

const TradingStaticsDataTable: React.FC<Props> = ({
  data,
  isLoading
}) => {

  const { t } = useTranslation('common');

  return (
    <>
      <LoadingInline loading={isLoading} />
      <div className='reportTransaction-content'>
        {/* <table className='table table-striped table-bordered' style={{ minWidth: 850 }}>
          <thead>
            <tr>
              <th style={{ minWidth: 200, border: "1px solid #ddd" }}></th>
              {data?.column?.filter((p: any) => p.title !== '').map((item: any, index: any) => (
                <th style={{ textAlign: 'center', fontWeight: "bold", border: "1px solid #ddd" }} key={index}>{item.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.dataTable?.map((item: any, index: any) => {
              return (
                <tr key={index} style={{ backgroundColor: "transparent" }}>
                  <td style={{ textAlign: 'left', fontWeight: "bold", border: "1px solid #ddd" }}>{item?.title}</td>
                  {
                    data?.column?.filter((p: any) => p.title !== '').map((value: any, count: any) => {
                      return <td style={{ textAlign: 'right', border: "1px solid #ddd" }} key={count}>{formatCurrency(item[value.field]) || 0}</td>
                    })
                  }
                </tr>
              )
            })}
          </tbody>
        </table> */}
        <table className='reportTransaction-content__tableFixed'>
          <tbody>
            {
              !isLoading && <tr className='tableFixed-head'>
                <td></td>
              </tr>
            }
            {data?.dataTable?.map((item: any, index: any) => {
              return (
                <tr>
                  <td>{item?.title}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className='overflow-table'>
          <table className='reportTransaction-content__table'>
            <tbody>
              {/* <tr>
                  {dataReportTransaction.length > 0 &&
                    dataReportTransaction.map((item: ReportTransactionType) => {
                      return (
                        <Fragment key={Math.random()}>
                          <th className='table-fixedHead'>
                            {dayjs(item?.month).format('MM-YYYY')}
                          </th>
                        </Fragment>
                      );
                    })}
                  <th className='table-fixedHead'>Tổng</th>
                </tr> */}
              <tr>
                {data?.column?.filter((p: any) => p.title !== '').map((item: any, index: any) => (
                  <th style={{ textAlign: 'center', fontWeight: "bold", border: "1px solid #ddd" }} key={index}>{item.title}</th>
                ))}
              </tr>
              {data?.dataTable?.map((item: any, index: any) => {
                return (
                  <tr key={index} style={{ backgroundColor: "transparent" }}>
                    {
                      data?.column?.filter((p: any) => p.title !== '').map((value: any, count: any) => {
                        return <td style={{ textAlign: 'right', border: "1px solid #ddd", paddingRight: '15px', color: `${value.field === 'total' && "blue"}`, fontWeight: `${value.field === 'total' && "bold"}` }} key={count}>{formatCurrency(item[value.field]) || 0}</td>
                      })
                    }
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>

  )
}

export default TradingStaticsDataTable