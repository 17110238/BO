import Nodata from 'components/common/NoData/Nodata';
import { EWalletBankReport } from 'models';
import React from 'react';
import { ReportEwalletDetail } from './BankReportFormContainer';
import { tableReport } from './constants/constTableReport';

interface Props {
  merchantReport: EWalletBankReport;
  ewalletReport: EWalletBankReport;
  billReport: EWalletBankReport;
  detailReport: ReportEwalletDetail;
}

const DataTableReportForm: React.FC<Props> = ({
  merchantReport,
  ewalletReport,
  detailReport,
  billReport,
}) => {
  if (
    ![
      ...Object.keys(merchantReport),
      ...Object.keys(ewalletReport),
      ...Object.keys(detailReport),
      ...Object.keys(billReport),
    ]?.length
  ) {
    return (
      <Nodata
        style={{
          width: '100%',
          backgroundColor: 'white',
          borderRadius: 10,
        }}
      />
    );
  }

  return (
    <div className='report-social-container__datatable' style={{ zoom: '90%' }}>
      {/* id export  */}
      <table className='table-basic' id='bank-report-table'>
        <tr className='table-basic__header-table'>
          <th className='header-table__item' style={{ maxWidth: '100px', minWidth: '100px' }}>
            Chỉ mục
          </th>
          <th className='header-table__item' style={{ maxWidth: '300px', minWidth: '300px' }}>
            Chỉ tiêu
          </th>
          <th className='header-table__item'>Thông tin chi tiết</th>
          <th className='header-table__item' style={{ maxWidth: '60px', minWidth: '60px' }}>
            Ghi chú
          </th>
        </tr>
        {tableReport(merchantReport, ewalletReport, billReport, detailReport).map((col, index) => {
          if (Object.keys(col).length === 0)
            return (
              <tr className='table-basic__empty-row' key={index}>
                <td style={{ backgroundColor: '#e6e6e6' }}></td>
              </tr>
            );
          return (
            <tr className='table-basic__body' key={index}>
              <td style={{ maxWidth: '100px', minWidth: '100px' }}>{col.heading}</td>
              {typeof col.target === 'object' ? (
                <td style={col?.target?.style || {}} colSpan={col.target.colspan}>
                  {col.target.value}
                </td>
              ) : (
                <>
                  <td style={{ maxWidth: '300px', minWidth: '300px' }}>{col.target}</td>
                  <td>{col.detail}</td>
                </>
              )}
              <td style={{ maxWidth: '60px', minWidth: '60px' }}>{col.note}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default DataTableReportForm;
