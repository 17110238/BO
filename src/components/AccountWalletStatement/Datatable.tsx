import { AccountStatmentSecureWalletResponsed } from 'models/overviewReportWallet';
import React from 'react'
import formatCurrency from 'utils/helpers/formatCurrency';

interface Props {
  data: AccountStatmentSecureWalletResponsed
}

const Datatable: React.FC<Props> = ({
  data
}) => {
  return (
    <div className="cls-block-table">
      <table className='w-100'>
        <tbody>
          <tr className='title'>
            <th style={{minWidth: '200px'}}>T&Ecirc;N BANK</th>
            <th style={{minWidth: '200px'}}>SỐ T&Agrave;I KHOẢN</th>
            <th style={{minWidth: '200px'}}>Tổng SLGD ghi nợ</th>
            <th style={{minWidth: '200px'}}>Tổng GTGD ghi nợ</th>
            <th style={{minWidth: '200px'}}>Tổng SLGD ghi c&oacute;</th>
            <th style={{minWidth: '200px'}}>Tổng GTGD ghi c&oacute;</th>
            <th style={{minWidth: '200px'}}>SỐ DƯ</th>
          </tr>
          {/* <tr>
            <td>BIDV</td>
            <td>13510001156564</td>
            <td>12</td>
            <td>3.500.000</td>
            <td>7</td>
            <td>4.750.000</td>
            <td>290.047.500</td>
          </tr>
          <tr>
            <td>VIETINBANK</td>
            <td>110002880944</td>
            <td>2</td>
            <td>1.000.000</td>
            <td>3</td>
            <td>2.000.000</td>
            <td>35.421.000</td>
          </tr>
          <tr>
            <td>OCB</td>
            <td>0111100020551007</td>
            <td>4</td>
            <td>4.961.782</td>
            <td>7</td>
            <td>14.951.980</td>
            <td>420.145.000</td>
          </tr>
          <tr>
            <td>PVCOMBANK</td>
            <td>102000638290</td>
            <td>3</td>
            <td>570.000</td>
            <td>5</td>
            <td>800.000</td>
            <td>124.752.000</td>
          </tr>
          <tr>
            <td>SACOMBANK</td>
            <td>060248416702</td>
            <td>3</td>
            <td>480.000</td>
            <td>7</td>
            <td>850.000</td>
            <td>997.812.222</td>
          </tr> */}
          {
            data?.accountList?.map((item, index) => {
              return (
                <tr className={index % 2 == 0 ? 'even' : 'odd'} key={index}>
                  <td className='text-left'>{item?.bankName}</td>
                  <td className='text-left'>{item.accountNumber}</td>
                  <td className='text-right'>{formatCurrency(item.debitQuantity)}</td>
                  <td className='text-right'>{formatCurrency(item.debitAmount)}</td>
                  <td className='text-right'>{formatCurrency(item.creditQuantity)}</td>
                  <td className='text-right'>{formatCurrency(item.creditAmount)}</td>
                  <td className='text-right'>{formatCurrency(item.surplus)}</td>
                </tr>
              )
            })
          }
          {/* <tr>
            <td className='text-left'>TỔNG</td>
            <td>&nbsp;</td>
            <td>24</td>
            <td>10.511.782</td>
            <td>29</td>
            <td>23.351.980</td>
            <td>1.868.177.722</td>
          </tr> */}
          <tr>
            <td className='text-left font-weight-bold'>{data?.total?.bankName || "TỔNG"}</td>
            <td className='text-left font-weight-bold'>{data?.total?.accountNumber}</td>
            <td className='text-right font-weight-bold'>{formatCurrency(data?.total?.debitQuantity)}</td>
            <td className='text-right font-weight-bold'>{formatCurrency(data?.total?.debitAmount)}</td>
            <td className='text-right font-weight-bold'>{formatCurrency(data?.total?.creditQuantity)}</td>
            <td className='text-right font-weight-bold'>{formatCurrency(data?.total?.creditAmount)}</td>
            <td className='text-right font-weight-bold'>{formatCurrency(data?.total?.surplus)}</td>
          </tr>
        </tbody>
      </table>

    </div>
  );
};

export default Datatable;
