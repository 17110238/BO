import React, { useState } from 'react';
import { Collapse, Button, Card } from 'react-bootstrap'

const ContentMultitransferCampaign: React.FC = () => {
  const [isOpenAccordion, setOpenAccordion] = useState({
    accordion1: true,
    accordion2: true,
  })

  return (
    <div className="detail-multitransfer-info-wrapper">
      <Card>
        <Card.Body>
          <Card.Title>
            <Button
              onClick={() => setOpenAccordion(prevState => ({
                ...prevState,
                accordion1: !isOpenAccordion.accordion1,
              }))}
              className="accordion-btn accordion1"
              aria-controls="accordion-1"
              aria-expanded={isOpenAccordion.accordion1}>
              Lập lệnh chuyển tiền thành công
              <i className="fas fa-angle-down"></i>
            </Button>
          </Card.Title>
          <Collapse className="accordion-info" in={isOpenAccordion.accordion1}>
            <section id="accordion-1" className="accordion-info">
              <span className="custom-row">
                <span>Mã chiến dịch:</span>
                <span>L20073413</span>
              </span>
              <span className="custom-row">
                <span>Tổng tiền:</span>
                <span>1000000</span>
              </span>
              <span className="custom-row">
                <span>Số lệnh được tạo:</span>
                <span>200</span>
              </span>
              <span className="custom-row">
                <span>Thời gian tạo:</span>
                <span>31/07/2020 09:28:23</span>
              </span>
              <span className="custom-row">
                <span>Nội dung:</span>
                <span>chuyển lương đợt 2 tháng 4/2022</span>
              </span>
              <span className="custom-row">
                <span>Trạng thái:</span>
                <span>Đã chuyển</span>
              </span>
            </section>
          </Collapse>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>
            <Button
              onClick={() => setOpenAccordion(prevState => ({
                ...prevState,
                accordion2: !isOpenAccordion.accordion2,
              }))}
              className="accordion-btn accordion2"
              aria-controls="accordion-2"
              aria-expanded={isOpenAccordion.accordion2}>
              Thông tin chuyển khoản
              <i className="fas fa-angle-down"></i>
            </Button>
          </Card.Title>
          <Collapse in={isOpenAccordion.accordion2}>
            <section id="accordion-2" className="accordion-info">
              <span className="custom-row">
                <span>Số tiền</span>
                <span>1000000</span>
              </span>
              <span className="custom-row">
                <span>Nội dung chuyển khoản:</span>
                <span>NAP L20073413</span>
              </span>
              <span className="custom-row">
                <span>Ngân hàng:</span>
                <span>Sacombank Việt Nam</span>
              </span>
              <span className="custom-row">
                <span>Số tài khoản:</span>
                <span>321321ZADS</span>
              </span>
              <span className="custom-row">
                <span>Chủ tài khoản:</span>
                <span>Nguyễn Văn A</span>
              </span>
              <span className="custom-row">
                <span>Chi nhánh:</span>
                <span>Chi nhánh TP.HCM</span>
              </span>
            </section>
          </Collapse>
        </Card.Body>
      </Card>
    </div>
  )
}

export default ContentMultitransferCampaign;