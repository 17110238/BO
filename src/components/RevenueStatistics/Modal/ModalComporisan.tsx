import { GetMerchantReportCrossCheckDataReponse, paymentPayMeApp } from 'models';
import React, { useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getMerchantReportCrossCheck } from 'redux/actions/accountantAction';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import numeral from 'numeral';
import LoadingInline from 'components/common/Loading/LoadingInline';
dayjs.extend(utc);

export interface Props {
  merchantCrossCheck?: GetMerchantReportCrossCheckDataReponse
  showModalDetail?: boolean
  onHide?: (a: string) => void
  finishedAt?: any
  loading?: boolean
}


const ModalComporisan: React.FC<Props> = ({
  merchantCrossCheck,
  showModalDetail,
  onHide,
  finishedAt,
  loading
}) => {

  const { t } = useTranslation('common')
  const dispatch = useDispatch()
  return (
    <>
      <Modal
        show={showModalDetail}
        onHide={() => { onHide && onHide('modalDetail') }}
        backdrop='static'
        className='modal-comporisan-details'
        // keyboard={false}
      >
        <LoadingInline loading={loading} />
        <Modal.Header closeButton>
          <Modal.Title>{t('Chi tiết đối soát')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='comporisan__detail--container'>
            <div className='comporisan__detail--title'>
              <div className='comporisan__detail--title-first'>
                <h5>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h5>
                <span>Độc lập - Tự do - Hạnh phúc</span>
              </div>
              <div className='comporisan__detail--title-second'>
                <h3>BIÊN BẢN ĐỐI SOÁT GIAO DỊCH VÀ PHÍ DỊCH VỤ</h3>
                <h6>GIỮA CÔNG TY CỔ PHẦN CÔNG NGHỆ PAYME & {merchantCrossCheck?.paymentList && merchantCrossCheck?.paymentList[0]?.merchantName} ({merchantCrossCheck?.transferedReport?.merchantId || '-'})</h6>
                <span>Từ ngày {dayjs(finishedAt?.from).format('DD/MM/YYYY')} đến ngày {dayjs(finishedAt?.to).format('DD/MM/YYYY')}.</span>
              </div>
            </div>
            <div className='comporisan__detail--header'>
              <ul>
                <li><p>Căn cứ theo hợp đồng sử dụng dịch vụ giữa Công ty Cổ phần Công nghệ PayME và {merchantCrossCheck?.paymentList && merchantCrossCheck?.paymentList[0]?.merchantName}.</p></li>
                <li><p>
                  Hôm nay, ngày {dayjs(finishedAt?.to).get('date')} tháng {dayjs(finishedAt?.to).get('month') + 1} năm {dayjs(finishedAt?.to).get('year')}, Công ty Cổ phần Công nghệ PayME và {merchantCrossCheck?.paymentList && merchantCrossCheck?.paymentList[0]?.merchantName} cùng kí biên bản xác nhận phí dịch  vụ như sau:</p></li>
              </ul>
            </div>
            <div className='comporisan__detail--content'>
              <table>
                <tbody>
                  <tr>
                    <th>Nội dung</th>
                    <th>Số lượng GD</th>
                    <th>Giá trị GD</th>
                    <th>Phí giao dịch (gồm VAT)</th>
                    <th>Thanh toán cho đối tác</th>
                  </tr>
                  <tr>
                    <td className='font-weight-bold'>Số dư đầu kỳ</td>
                    <td className='font-weight-bold'>{numeral(Math.abs(merchantCrossCheck?.beginBalanceData?.count!)).format('0,0') || 0}</td>
                    <td className='font-weight-bold'>{numeral(Math.abs(merchantCrossCheck?.beginBalanceData?.amount!)).format('0,0') || 0}</td>
                    <td className='font-weight-bold'>{numeral(Math.abs(merchantCrossCheck?.beginBalanceData?.fee!)).format('0,0') || 0}</td>
                    {/* <td className='font-weight-bold'>{numeral(Math.abs(merchantCrossCheck?.beginBalanceData?.total!)).format('0,0') || 0}</td> */}
                    <td></td>
                  </tr>
                  <tr>
                    <td className='font-weight-bold'>Số phát sinh trong kỳ</td>
                    <td className='font-weight-bold'>{numeral(Math.abs(merchantCrossCheck?.currentReportBalance?.count!)).format('0,0') || 0}</td>
                    <td className='font-weight-bold'>{numeral(Math.abs(merchantCrossCheck?.currentReportBalance?.amount!)).format('0,0') || 0}</td>
                    <td className='font-weight-bold'>{numeral(Math.abs(merchantCrossCheck?.currentReportBalance?.fee!)).format('0,0') || 0}</td>
                    <td className='font-weight-bold'>{numeral(Math.abs(merchantCrossCheck?.currentReportBalance?.paymentPartner!)).format('0,0') || 0}</td>
                  </tr>
                  <tr>
                    <td className='font-italic'>Số phát sinh tăng</td>
                    <td className='font-italic'>{numeral(Math.abs(merchantCrossCheck?.currentReportIncrease?.count!)).format('0,0') || 0}</td>
                    <td className='font-italic'>{numeral(Math.abs(merchantCrossCheck?.currentReportIncrease?.amount!)).format('0,0') || 0}</td>
                    <td className='font-italic'>{numeral(Math.abs(merchantCrossCheck?.currentReportIncrease?.fee!)).format('0,0') || 0}</td>
                    {/* <td className='font-italic'>{numeral(Math.abs(merchantCrossCheck?.currentReportIncrease?.paymentPartner!)).format('0,0') || 0}</td> */}
                    <td></td>
                  </tr>
                  {
                    merchantCrossCheck?.currentReport?.paymentSucceeded?.map((item: paymentPayMeApp, index: number) => {
                      return (
                        <tr key={index}>
                          <td>+ {item?.methodName}</td>
                          <td>{numeral(Math.abs(item?.count!)).format('0,0') || 0}</td>
                          <td>{numeral(Math.abs(item?.amount!)).format('0,0') || 0}</td>
                          <td>{numeral(Math.abs(item?.fee!)).format('0,0') || 0}</td>
                          {/* <td>{numeral(Math.abs(item?.total!)).format('0,0') || 0}</td> */}
                          <td></td>
                        </tr>
                      )
                    })
                  }
                  <tr>
                    <td className='font-italic'>Số phát sinh giảm (GD hoàn)</td>
                    <td className='font-italic'>{numeral(Math.abs(merchantCrossCheck?.currentReport?.paymentRefunded?.count!)).format('0,0') || 0}</td>
                    <td className='font-italic'>{numeral(Math.abs(merchantCrossCheck?.currentReport?.paymentRefunded?.amount!)).format('0,0') || 0}</td>
                    <td className='font-italic'>{numeral(Math.abs(merchantCrossCheck?.currentReport?.paymentRefunded?.fee!)).format('0,0') || 0}</td>
                    {/* <td className='font-italic'>{numeral(Math.abs(merchantCrossCheck?.currentReport?.paymentRefunded?.total!)).format('0,0') || 0}</td> */}
                    <td></td>
                  </tr>
                  <tr>
                    <td className='font-weight-bold'>Đã thanh toán trong kỳ</td>
                    <td className='font-weight-bold'>{numeral(Math.abs(merchantCrossCheck?.transferedReport?.count!)).format('0,0') || 0}</td>
                    <td className='font-weight-bold'>{numeral(Math.abs(merchantCrossCheck?.transferedReport?.amount!)).format('0,0') || 0}</td>
                    <td className='font-weight-bold'>{numeral(Math.abs(merchantCrossCheck?.transferedReport?.fee!)).format('0,0') || 0}</td>
                    <td className='font-weight-bold'>{numeral(Math.abs(merchantCrossCheck?.transferedReport?.total!)).format('0,0') || 0}</td>
                  </tr>
                  <tr>
                    <td>Số dư cuối kỳ</td>
                    <td>{numeral(Math.abs(merchantCrossCheck?.finalBalanceData?.count!)).format('0,0') || 0}</td>
                    <td>{numeral(Math.abs(merchantCrossCheck?.finalBalanceData?.amount!)).format('0,0') || 0}</td>
                    <td>{numeral(Math.abs(merchantCrossCheck?.finalBalanceData?.fee!)).format('0,0') || 0}</td>
                    <td>{numeral(Math.abs(merchantCrossCheck?.finalBalanceData?.paymentPartner!)).format('0,0') || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className='comporisan__detail--total'>
              <table>
                <tr>
                  <th></th>
                  <th></th>
                </tr>
                <tr>
                  <td><p>Tổng giá trị giao dịch đối soát.</p></td>
                  <td>{numeral(Math.abs(merchantCrossCheck?.currentReportIncrease?.amount!)).format('0,0') || 0}</td>
                </tr>
                <tr>
                  <td><p>Tổng PayME phải thanh toán cho đối tác.</p></td>
                  <td>{numeral(Math.abs(merchantCrossCheck?.currentReportIncrease?.paymentPartner!)).format('0,0') || 0}</td>
                </tr>
                <tr>
                  <td><p>Tổng phí dịch vụ (gồm VAT) PayME xuất hóa đơn cho đối tác.</p></td>
                  <td>{numeral(Math.abs(merchantCrossCheck?.currentReportIncrease?.fee!)).format('0,0') || 0}</td>
                </tr>
              </table>
            </div>
            <div className='comporisan__detail--footer'>
              <div className='comporisan__detail--footer-left'>
                <p className='font-italic'>TP.Hồ Chí Minh, ngày...tháng...năm...</p>
                <span>ĐẠI DIỆN ĐỐI TÁC</span>
              </div>
              <div className='comporisan__detail--footer-right'>
                <p className='font-italic'>TP.Hồ Chí Minh, ngày...tháng...năm...</p>
                <span>ĐẠI DIỆN PAYME</span>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ModalComporisan
