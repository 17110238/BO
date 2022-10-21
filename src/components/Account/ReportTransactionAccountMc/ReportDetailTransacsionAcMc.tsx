import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import alert from "utils/helpers/alert";
import { Dropdown } from "react-bootstrap";
import router from "next/router";
import HeaderReportDetailTransactionAcMc from "./HeaderReportDetailTransactionAcMc";
import BodyReportSales from "./BodyDetail/BodyReportSales";
import BodyTransactionPoint from "./BodyDetail/BodyTransactionPoint";
import BodyPaymentsMethod from "./BodyDetail/BodyPaymentsMethod";




interface Props {
    reportId : string | string[] | undefined;
}

const ReportDetailTransacsionAcMc : React.FC<Props> = ({
    reportId
}) => {
    const { t } = useTranslation("common");
    const dispatch = useDispatch();
    const [collapseState, setCollapseState] = useState({
        sectionReportSales: false,
        sectionTransactionPoint: true,
        sectionPaymentsMethod: true,
    });
    return(
        <div className="detail-report-transaction-container">
            <div className="back-report-transaction" onClick={() => router.push('/accounts')}>
                <i className="fas fa-chevron-left"></i>
                <span>{t('Trở về trang trước')}</span>
            </div>
            <div className="header-section-report-transaction detail-report-transaction">
                <HeaderReportDetailTransactionAcMc
                    title={"Báo cáo doanh thu"}
                    onClickHeader = {() => {
                        setCollapseState({
                            ...collapseState,
                            sectionReportSales : !collapseState
                            .sectionReportSales
                        })
                    }}
                />
                <BodyReportSales
                    collapse={collapseState.sectionReportSales}
                />
            </div>
            <div className="header-section-report-transaction detail-report-transaction">
                <HeaderReportDetailTransactionAcMc
                    title={"Theo điểm giao dịch"}
                    onClickHeader = {() => {
                        setCollapseState({
                            ...collapseState,
                            sectionTransactionPoint : !collapseState
                            .sectionTransactionPoint
                        })
                    }}
                />
                <BodyTransactionPoint
                    collapse={collapseState.sectionTransactionPoint}
                />
            </div>
            <div className="header-section-report-transaction detail-report-transaction">
                <HeaderReportDetailTransactionAcMc
                    title={"Theo phương thức thanh toán"}
                    onClickHeader = {() => {
                        setCollapseState({
                            ...collapseState,
                            sectionPaymentsMethod : !collapseState
                            .sectionPaymentsMethod
                        })
                    }}
                />
                <BodyPaymentsMethod
                    collapse={collapseState.sectionPaymentsMethod}
                />
            </div>
        </div>
    )
}
export default ReportDetailTransacsionAcMc;