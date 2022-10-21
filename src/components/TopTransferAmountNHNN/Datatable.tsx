import React, { FC, useEffect, useMemo, useState, MouseEventHandler } from 'react';
import numeral from 'numeral';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
interface topCountAmountEwalletType {
  accountId: any;
  fullname: any;
  identifyNumberTaxCode: any;
  depositCount: any;
  depositAmount: any;
  withdrawCount: any;
  withdrawAmount: any;
  paymentCount: any;
  paymentAmount: any;
  totalCount: any;
  totalAmount: any;
}

interface Props {
  loading?: any;
  data: topCountAmountEwalletType[];
  getDataList?: any;
  setSubmitForm: any;
  dataAmount: topCountAmountEwalletType[];
}

const Datatable: FC<Props> = ({ loading, data, dataAmount }) => {
  return (
    <>
      <div className='cls-header'>Giao dịch của khách hàng có số lượng giao dịch nhiều nhất </div>
      <div className='cls-block-table'>
        <table>
          <tbody>
            <tr className='title'>
              <th colSpan={1} rowSpan={2}>
                STT
              </th>
              <th colSpan={1} rowSpan={2} style={{ minWidth: '200px' }}>
                Tên khách hàng
              </th>
              <th colSpan={1} rowSpan={2}>
                accountId
              </th>
              <th colSpan={1} rowSpan={2}>
                Số CMND/CCCD
              </th>
              <th colSpan={2} rowSpan={1}>
                Nạp tiền
              </th>
              <th colSpan={2} rowSpan={1}>
                R&uacute;t tiền
              </th>
              <th colSpan={2} rowSpan={1}>
                Thanh to&aacute;n, chuyển
              </th>
              <th colSpan={2} rowSpan={1}>
                Kh&aacute;c
              </th>
              <th colSpan={2} rowSpan={1}>
                Tổng cộng
              </th>
            </tr>
            <tr className='title'>
              <th>Số lượng giao dịch</th>
              <th>Gi&aacute; trị giao dịch</th>
              <th>Số lượng giao dịch</th>
              <th>Gi&aacute; trị giao dịch</th>
              <th>Số lượng giao dịch</th>
              <th>Gi&aacute; trị giao dịch</th>
              <th>Số lượng giao dịch</th>
              <th>Gi&aacute; trị giao dịch</th>
              <th>Số lượng giao dịch</th>
              <th>Gi&aacute; trị giao dịch</th>
            </tr>

            {data?.length > 0 &&
              data?.map((value: topCountAmountEwalletType, index: number) => {
                return (
                  <tr className={index % 2 == 0 ? 'odd' : 'even'} key={index}>
                    <td>{index + 1}</td>
                    <td className='text-left'>{value.fullname}</td>
                    <td className='text-left'>{value.accountId}</td>
                    <td className='text-left'>{value.identifyNumberTaxCode}</td>
                    <td className='text-right'>{value.depositCount}</td>
                    <td className='text-right'>{numeral(value.depositAmount).format('0,0')}</td>
                    <td className='text-right'>{value.withdrawCount}</td>
                    <td className='text-right'>{numeral(value.withdrawAmount).format('0,0')}</td>
                    <td className='text-right'>{value.paymentCount}</td>
                    <td className='text-right'>{numeral(value.paymentAmount).format('0,0')}</td>
                    <td className='text-right'>&nbsp;</td>
                    <td className='text-right'>&nbsp;</td>
                    <td className='text-right'>{value.totalCount}</td>
                    <td className='text-right'>{numeral(value.totalAmount).format('0,0')}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className='cls-header'>
        Giao dịch của khách hàng cá nhân có giá trị giao dịch nhiều nhất{' '}
      </div>
      <div className='cls-block-table'>
        <table>
          <tbody>
            <tr className='title'>
              <th colSpan={1} rowSpan={2}>
                STT
              </th>
              <th colSpan={1} rowSpan={2} style={{ minWidth: '200px' }}>
                T&ecirc;n kh&aacute;ch h&agrave;ng
              </th>
              <th colSpan={1} rowSpan={2}>
                T&ecirc;n v&iacute;/số hiệu v&iacute;
              </th>
              <th colSpan={1} rowSpan={2}>
                Số CMND/CCCD
              </th>
              <th colSpan={2} rowSpan={1}>
                Nạp tiền
              </th>
              <th colSpan={2} rowSpan={1}>
                R&uacute;t tiền
              </th>
              <th colSpan={2} rowSpan={1}>
                Thanh to&aacute;n, chuyển
              </th>
              <th colSpan={2} rowSpan={1}>
                Kh&aacute;c
              </th>
              <th colSpan={2} rowSpan={1}>
                Tổng cộng
              </th>
            </tr>
            <tr className='title'> 
              <th>Số lượng giao dịch</th>
              <th>Gi&aacute; trị giao dịch</th>
              <th>Số lượng giao dịch</th>
              <th>Gi&aacute; trị giao dịch</th>
              <th>Số lượng giao dịch</th>
              <th>Gi&aacute; trị giao dịch</th>
              <th>Số lượng giao dịch</th>
              <th>Gi&aacute; trị giao dịch</th>
              <th>Số lượng giao dịch</th>
              <th>Gi&aacute; trị giao dịch</th>
            </tr>

            {dataAmount?.length > 0 &&
              dataAmount?.map((value: topCountAmountEwalletType, index: number) => {
                return (
                  <tr className={index % 2 == 0 ? 'odd' : 'even'} key={index}>
                    <td>{index + 1}</td>
                    <td className='text-left'>{value.fullname}</td>
                    <td className='text-left'>{value.accountId}</td>
                    <td className='text-left'>{value.identifyNumberTaxCode}</td>
                    <td className='text-right'>{value.depositCount}</td>
                    <td className='text-right'>{numeral(value.depositAmount).format('0,0')}</td>
                    <td className='text-right'>{value.withdrawCount}</td>
                    <td className='text-right'>{numeral(value.withdrawAmount).format('0,0')}</td>
                    <td className='text-right'>{value.paymentCount}</td>
                    <td className='text-right'>{numeral(value.paymentAmount).format('0,0')}</td>
                    <td className='text-right'>&nbsp;</td>
                    <td className='text-right'>&nbsp;</td>
                    <td className='text-right'>{value.totalCount}</td>
                    <td className='text-right'>{numeral(value.totalAmount).format('0,0')}</td>
                  </tr>
                );
              })}

            {/* <tr>
              <td>15</td>
              <td>ĐINH QUANG TRUNG</td>
              <td>86927590</td>
              <td>272505615</td>
              <td>5</td>
              <td>2.475.000</td>
              <td>0</td>
              <td>0</td>
              <td>7</td>
              <td>2.658.500</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>12</td>
              <td>5.133.500</td>
            </tr> */}
          </tbody>
        </table>
      </div>

      {loading && <LoadingFullScreen />}
    </>
    // <table style={{ borderCollapse: 'collapse', width: '100%' }} width={1181}>
    //   <colgroup>
    //     <col style={{ width: '158pt' }} width={210} />
    //     <col style={{ width: '77pt' }} width={103} />
    //     <col style={{ width: '82pt' }} width={109} />
    //     <col style={{ width: '95pt' }} width={126} />
    //     <col span={2} style={{ width: '78pt' }} width={104} />
    //     <col style={{ width: '79pt' }} width={105} />
    //     <col span={5} style={{ width: '48pt' }} width={64} />
    //   </colgroup>
    //   <tbody>
    //     <tr>
    //       <td
    //         className='xl66'
    //         style={{
    //           borderBottom: '1px solid black',
    //           height: 20,
    //           width: 210,
    //           paddingTop: 1,
    //           paddingRight: 1,
    //           paddingLeft: 1,
    //           verticalAlign: 'bottom',
    //           whiteSpace: 'nowrap',
    //           borderTop: '1px solid black',
    //           borderRight: '1px solid black',
    //           borderLeft: '1px solid black',
    //         }}>
    //         <span style={{ fontSize: 15 }}>
    //           <span style={{ fontWeight: 700 }}>
    //             <span style={{ color: 'black' }}>
    //               <span style={{ fontStyle: 'normal' }}>
    //                 <span style={{ textDecoration: 'none' }}>
    //                   <span style={{ fontFamily: 'Calibri,sans-serif' }}>TÊN</span>
    //                 </span>
    //               </span>
    //             </span>
    //           </span>
    //         </span>
    //       </td>
    //       <td
    //         className='xl66'
    //         style={{
    //           borderBottom: '1px solid black',
    //           width: 103,
    //           paddingTop: 1,
    //           paddingRight: 1,
    //           paddingLeft: 1,
    //           verticalAlign: 'bottom',
    //           whiteSpace: 'nowrap',
    //           borderTop: '1px solid black',
    //           borderRight: '1px solid black',
    //           borderLeft: 'none',
    //         }}>
    //         <span style={{ fontSize: 15 }}>
    //           <span style={{ fontWeight: 700 }}>
    //             <span style={{ color: 'black' }}>
    //               <span style={{ fontStyle: 'normal' }}>
    //                 <span style={{ textDecoration: 'none' }}>
    //                   <span style={{ fontFamily: 'Calibri,sans-serif' }}>Số dư đầu</span>
    //                 </span>
    //               </span>
    //             </span>
    //           </span>
    //         </span>
    //       </td>
    //       <td
    //         className='xl66'
    //         style={{
    //           borderBottom: '1px solid black',
    //           width: 109,
    //           paddingTop: 1,
    //           paddingRight: 1,
    //           paddingLeft: 1,
    //           verticalAlign: 'bottom',
    //           whiteSpace: 'nowrap',
    //           borderTop: '1px solid black',
    //           borderRight: '1px solid black',
    //           borderLeft: 'none',
    //         }}>
    //         <span style={{ fontSize: 15 }}>
    //           <span style={{ fontWeight: 700 }}>
    //             <span style={{ color: 'black' }}>
    //               <span style={{ fontStyle: 'normal' }}>
    //                 <span style={{ textDecoration: 'none' }}>
    //                   <span style={{ fontFamily: 'Calibri,sans-serif' }}>TỔNG SLGD RÚT</span>
    //                 </span>
    //               </span>
    //             </span>
    //           </span>
    //         </span>
    //       </td>
    //       <td
    //         className='xl66'
    //         style={{
    //           borderBottom: '1px solid black',
    //           width: 126,
    //           paddingTop: 1,
    //           paddingRight: 1,
    //           paddingLeft: 1,
    //           verticalAlign: 'bottom',
    //           whiteSpace: 'nowrap',
    //           borderTop: '1px solid black',
    //           borderRight: '1px solid black',
    //           borderLeft: 'none',
    //         }}>
    //         <span style={{ fontSize: 15 }}>
    //           <span style={{ fontWeight: 700 }}>
    //             <span style={{ color: 'black' }}>
    //               <span style={{ fontStyle: 'normal' }}>
    //                 <span style={{ textDecoration: 'none' }}>
    //                   <span style={{ fontFamily: 'Calibri,sans-serif' }}>TỔNG GTGD RÚT</span>
    //                 </span>
    //               </span>
    //             </span>
    //           </span>
    //         </span>
    //       </td>
    //       <td
    //         className='xl66'
    //         style={{
    //           borderBottom: '1px solid black',
    //           width: 104,
    //           paddingTop: 1,
    //           paddingRight: 1,
    //           paddingLeft: 1,
    //           verticalAlign: 'bottom',
    //           whiteSpace: 'nowrap',
    //           borderTop: '1px solid black',
    //           borderRight: '1px solid black',
    //           borderLeft: 'none',
    //         }}>
    //         <span style={{ fontSize: 15 }}>
    //           <span style={{ fontWeight: 700 }}>
    //             <span style={{ color: 'black' }}>
    //               <span style={{ fontStyle: 'normal' }}>
    //                 <span style={{ textDecoration: 'none' }}>
    //                   <span style={{ fontFamily: 'Calibri,sans-serif' }}>TỔNG SLGD NẠP</span>
    //                 </span>
    //               </span>
    //             </span>
    //           </span>
    //         </span>
    //       </td>
    //       <td
    //         className='xl66'
    //         style={{
    //           borderBottom: '1px solid black',
    //           width: 104,
    //           paddingTop: 1,
    //           paddingRight: 1,
    //           paddingLeft: 1,
    //           verticalAlign: 'bottom',
    //           whiteSpace: 'nowrap',
    //           borderTop: '1px solid black',
    //           borderRight: '1px solid black',
    //           borderLeft: 'none',
    //         }}>
    //         <span style={{ fontSize: 15 }}>
    //           <span style={{ fontWeight: 700 }}>
    //             <span style={{ color: 'black' }}>
    //               <span style={{ fontStyle: 'normal' }}>
    //                 <span style={{ textDecoration: 'none' }}>
    //                   <span style={{ fontFamily: 'Calibri,sans-serif' }}>TỔNG GTGD NẠP</span>
    //                 </span>
    //               </span>
    //             </span>
    //           </span>
    //         </span>
    //       </td>
    //       <td
    //         className='xl66'
    //         style={{
    //           borderBottom: '1px solid black',
    //           width: 105,
    //           paddingTop: 1,
    //           paddingRight: 1,
    //           paddingLeft: 1,
    //           verticalAlign: 'bottom',
    //           whiteSpace: 'nowrap',
    //           borderTop: '1px solid black',
    //           borderRight: '1px solid black',
    //           borderLeft: 'none',
    //         }}>
    //         <span style={{ fontSize: 15 }}>
    //           <span style={{ fontWeight: 700 }}>
    //             <span style={{ color: 'black' }}>
    //               <span style={{ fontStyle: 'normal' }}>
    //                 <span style={{ textDecoration: 'none' }}>
    //                   <span style={{ fontFamily: 'Calibri,sans-serif' }}>TỔNG SLGD thanh toán</span>
    //                 </span>
    //               </span>
    //             </span>
    //           </span>
    //         </span>
    //       </td>
    //       <td
    //         className='xl66'
    //         style={{
    //           borderBottom: '1px solid black',
    //           width: 64,
    //           paddingTop: 1,
    //           paddingRight: 1,
    //           paddingLeft: 1,
    //           verticalAlign: 'bottom',
    //           whiteSpace: 'nowrap',
    //           borderTop: '1px solid black',
    //           borderRight: '1px solid black',
    //           borderLeft: 'none',
    //         }}>
    //         <span style={{ fontSize: 15 }}>
    //           <span style={{ fontWeight: 700 }}>
    //             <span style={{ color: 'black' }}>
    //               <span style={{ fontStyle: 'normal' }}>
    //                 <span style={{ textDecoration: 'none' }}>
    //                   <span style={{ fontFamily: 'Calibri,sans-serif' }}>TỔNG GTGD thanh toán</span>
    //                 </span>
    //               </span>
    //             </span>
    //           </span>
    //         </span>
    //       </td>
    //       <td
    //         className='xl66'
    //         style={{
    //           borderBottom: '1px solid black',
    //           width: 64,
    //           paddingTop: 1,
    //           paddingRight: 1,
    //           paddingLeft: 1,
    //           verticalAlign: 'bottom',
    //           whiteSpace: 'nowrap',
    //           borderTop: '1px solid black',
    //           borderRight: '1px solid black',
    //           borderLeft: 'none',
    //         }}>
    //         <span style={{ fontSize: 15 }}>
    //           <span style={{ fontWeight: 700 }}>
    //             <span style={{ color: 'black' }}>
    //               <span style={{ fontStyle: 'normal' }}>
    //                 <span style={{ textDecoration: 'none' }}>
    //                   <span style={{ fontFamily: 'Calibri,sans-serif' }}>Số dư cuối</span>
    //                 </span>
    //               </span>
    //             </span>
    //           </span>
    //         </span>
    //       </td>
    //       <td
    //         className='xl66'
    //         style={{
    //           borderBottom: '1px solid black',
    //           width: 64,
    //           paddingTop: 1,
    //           paddingRight: 1,
    //           paddingLeft: 1,
    //           verticalAlign: 'bottom',
    //           whiteSpace: 'nowrap',
    //           borderTop: '1px solid black',
    //           borderRight: '1px solid black',
    //           borderLeft: 'none',
    //         }}>
    //         <span style={{ fontSize: 15 }}>
    //           <span style={{ fontWeight: 700 }}>
    //             <span style={{ color: 'black' }}>
    //               <span style={{ fontStyle: 'normal' }}>
    //                 <span style={{ textDecoration: 'none' }}>
    //                   <span style={{ fontFamily: 'Calibri,sans-serif' }}>
    //                     Mua hàng tại Merchant
    //                   </span>
    //                 </span>
    //               </span>
    //             </span>
    //           </span>
    //         </span>
    //       </td>
    //       <td
    //         className='xl66'
    //         style={{
    //           borderBottom: '1px solid black',
    //           width: 64,
    //           paddingTop: 1,
    //           paddingRight: 1,
    //           paddingLeft: 1,
    //           verticalAlign: 'bottom',
    //           whiteSpace: 'nowrap',
    //           borderTop: '1px solid black',
    //           borderRight: '1px solid black',
    //           borderLeft: 'none',
    //         }}>
    //         <span style={{ fontSize: 15 }}>
    //           <span style={{ fontWeight: 700 }}>
    //             <span style={{ color: 'black' }}>
    //               <span style={{ fontStyle: 'normal' }}>
    //                 <span style={{ textDecoration: 'none' }}>
    //                   <span style={{ fontFamily: 'Calibri,sans-serif' }}>Bank liên kết của ví</span>
    //                 </span>
    //               </span>
    //             </span>
    //           </span>
    //         </span>
    //       </td>
    //       <td
    //         className='xl65'
    //         style={{
    //           borderBottom: 'none',
    //           width: 64,
    //           paddingTop: 1,
    //           paddingRight: 1,
    //           paddingLeft: 1,
    //           verticalAlign: 'bottom',
    //           whiteSpace: 'nowrap',
    //           borderTop: 'none',
    //           borderRight: 'none',
    //           borderLeft: 'none',
    //         }}>
    //         &nbsp;
    //       </td>
    //     </tr>
    //   </tbody>
    // </table>
  );
};

export default Datatable;
