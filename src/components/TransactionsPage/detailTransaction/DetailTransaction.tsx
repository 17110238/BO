import React, { useState } from 'react';
import HeaderTransaction from '../HeaderTransaction';
import { useTranslation } from 'react-i18next';
import { Form, Button, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useRouter } from 'next/router'
import ModalConfirm from './ModalConfirmTransaction';

export default function DetailTransaction() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isShowConfirmModal, setShowConfirmModal] = useState(false);

  const renderTooltip = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      Quản lý giao dịch
    </Tooltip>
  );

  return (
    <>
      {/* <HeaderTransaction 
        t={t}
        title="Chi tiết giao dịch"
      /> */}
      <div className='detail-transaction-container h-100 bg-white p-4'>
        <div className='d-flex align-items-center mb-2'>
          <OverlayTrigger
            placement="bottom"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
          >
            <img
              className='title-icon mr-2'
              src="/assets/img/header/back-icon.png"
              alt="Back"
              onClick={() => router.back()}
            />
          </OverlayTrigger>
          <h5>Chi tiết giao dịch #11111</h5>
        </div>
        {/* <div className='d-flex align-items-center justify-content-end mb-3'>
          <button
            className='px-3 py-2 mr-2 border-0 bg-primary text-white btn-border-rounded'
            onClick={() => setShowConfirmModal(true)}
          >Xác thực giao dịch</button>
          <button className='px-3 py-2 mr-2 border-0 bg-info text-white btn-border-rounded'>IPN</button>
        </div> */}
        <div className="body-transaction ">
          <form className="section-form">
            <div className="section-body ">

              <div className="inputs-group">
                <div className="row">
                  <div className="form-group col-lg-4 ">
                    <label>
                      {t("Mã đơn hàng")}:
                    </label>
                    <input readOnly value="1111" />
                  </div>
                  <div className="form-group col-lg-4 ">
                    <label>{t("Mã thanh toán")}:</label>
                    <input readOnly value="11111" />
                  </div>
                  <div className="form-group  col-lg-4">
                    <label>{t("Giá trị")}:</label>
                    <input readOnly value="20,000 VND" />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group  col-lg-4">
                    <label>{t("Phí")}:</label>
                    <input readOnly value="10,000 VND" />
                  </div>
                  <div className="form-group  col-lg-4 ">
                    <label>{t("Tổng tiền")}:</label>
                    <input readOnly value="100,000 VND" />
                  </div>
                  <div className="form-group  col-lg-4 ">
                    <label>{t("Phí (User)")}:</label>
                    <input readOnly value="0 VND" />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group  col-lg-4 ">
                    <label>{t("Tổng tiền (User)")}:</label>
                    <input readOnly value="11111" />
                  </div>
                  <div className="form-group  col-lg-4 ">
                    <label>{t("TG Tạo")}:</label>
                    <input readOnly value="23/12/2021 16:20" />
                  </div>
                  <div className="form-group  col-lg-4 ">
                    <label>{t("TG Cập nhật")}:</label>
                    <input readOnly value="23/12/2021 16:20" />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group  col-lg-4 ">
                    <label>{t("Mô tả")}:</label>
                    <input readOnly value="Lorem Ipsum dolor" />
                  </div>
                  <div className="form-group  col-lg-4 ">
                    <label>{t("Trạng thái")}:</label>
                    <input readOnly value="Thành công" />
                  </div>
                  <div className="form-group  col-lg-4 ">
                    <label>{t("Doanh nghiệp")}:</label>
                    <input readOnly value="Tran Phi Vu (#22)" />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group  col-lg-4 ">
                    <label>{t("Điểm GD")}:</label>
                    <input readOnly value="Shop Si 01 (#12)" />
                  </div>
                  <div className="form-group  col-lg-4 ">
                    <label>{t("Mã GD MC (Partner Transaction)")}:</label>
                    <input readOnly value="zzaaqqqds" />
                  </div>
                  <div className="form-group  col-lg-4 ">
                    <label>{t("Mã GD NCC (supplier Transaction)")}:</label>
                    <input readOnly value="" />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group  col-lg-4 ">
                    <label>{t("PTTT")}:</label>
                    <input readOnly value="XNAP" />
                  </div>
                  <div className="form-group  col-lg-4 ">
                    <label>{t("PayCode")}:</label>
                    <input readOnly value="XNAP" />
                  </div>
                  <div className="form-group  col-lg-4">
                    <label>{t("redirect URL")}:</label>
                    <input readOnly value="https://merchant.payme.vn" />
                  </div>
                </div>
              </div>

              {/* --------------- */}

            </div>
          </form>
        </div>

        <ModalConfirm
          show={isShowConfirmModal}
          handleClose={() => setShowConfirmModal(false)}
        />
      </div>

    </>
  )
}

