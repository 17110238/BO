import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react'
import { Dropdown } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { formatPhone } from 'utils/helpers';
import DataTableCustom from "components/common/Datatable/DatatableCusTom";
import { ReportMerchantResponse } from 'models/account/accountMerchant';


interface ReportTransactionAccountMcProps {
    t: (a: string) => string;
    data: ReportMerchantResponse[] | undefined;
    totalFilter: number;
    onChangeRowsPerPage?: () => void;
    onChangePage?: () => void;
    rest?: any;
}


const ReportTransactionAccountMc : React.FC<ReportTransactionAccountMcProps> = ({
    t,
    data,
    totalFilter,
    onChangePage,
    onChangeRowsPerPage,
    ...rest
}) => {
    const router = useRouter();
    const lang = localStorage.getItem("NEXT_LOCALE");

    const columns: TableColumn<ReportMerchantResponse>[] = useMemo(
        () => [
            {
                name: t("MCID"),
                minWidth: "100px",
                maxWidth: "120px",
                cell: (row, index) => (
                    <div className="position-relative w-100">{row?.merchantId}</div>
                ),
            },
            {
                name: t("Tên MC"),
                minWidth: "150px",
                cell: (row) => {
                    return <span></span>;
                },
            },
            {
                name: t("Tổng doanh thu"),
                minWidth: "180px",
                cell: (row) => {
                    return <div></div>;
                },
            },
            {
                name: t("Tổng phí"),
                minWidth: "250px",
                cell: (row) => {
                    return <div></div>;
                },
            },
            {
                name: t("Tổng tiền MC thực nhận"),
                minWidth: "180px",
                maxWidth: "200px",
                cell: (row) => {
                    return <span></span>;
                },
            },
            {
                name: t("Tổng GD thành công"),
                minWidth: "180px",
                maxWidth: "200px",

                cell: (row) => {
                    return <span></span>;
                },
            },
            {
                name: t("Tổng giao dịch huỷ"),
                minWidth: "180px",
                maxWidth: "200px",

                cell: (row) => {
                    return <span></span>;
                },
            },
            {
                name: t("Tổng giao dịch hoàn"),
                minWidth: "180px",
                maxWidth: "200px",

                cell: (row) => {
                    return <span></span>;
                },
            },
            {
                name: t("Thao tác"),
                minWidth: "130px",
                maxWidth: "130px",
                cell: (row) => {
                    return (
                        <>
                            <Dropdown >
                                <Dropdown.Toggle
                                    className={"p-0"}
                                    style={{
                                        backgroundColor: "rgba(0,0,0,0)",
                                        borderColor: "rgba(0,0,0,0)",
                                    }}
                                    id="dropdown-button-drop-up"
                                >
                                    <div className="btn btn-dropdown  pr-0">
                                        <label>{t("Thao tác")}</label>
                                        <div className=" ml-2">
                                            <i className="fas fa-caret-down"></i>
                                        </div>
                                    </div>
                                </Dropdown.Toggle>
                                <Dropdown.Menu
                                    style={{ borderRadius: "12px" }}
                                >
                                    <Dropdown.Item
                                        >
                                        {t("Chi tiết báo cáo")}
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={() => router.push('/transaction-manage')}
                                    >
                                        {t("Chi tiết giao dịch")}
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </>
                    );
                },
            },
        ],
        [lang]
    );
    return (
        <div className='content-datable-account-mc'>
            <DataTableCustom
                className="data-table-custom"
                columns={columns}
                dataList={data}
                paginationTotalRows={totalFilter}
                t={t}
                onChangeRowsPerPage={onChangeRowsPerPage}
                onChangePage={onChangePage}
                nameDataTable="colReportTransactionAccountMc"
                {...rest}
            />
        </div>
    )
}

export default ReportTransactionAccountMc