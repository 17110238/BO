import React, { useMemo } from 'react'
import DataTableCustom from "components/common/Datatable/DatatableCusTom";
import { TableColumn } from 'react-data-table-component';
import { TransactionResponse } from 'models/transaction/transactionState';

interface data { 
        soGDThanhCong : number;
        soGDHuy : number;
        soGDHoan : number;
        tienThanhCong : number;
        tienHuy : number;
        tienHoan : number;
        tongDoanhThu : number;
        tienPhi : number;
}

const dataList: Array<data> = [
    {
        soGDThanhCong : 1,
        soGDHuy : 1,
        soGDHoan : 1,
        tienThanhCong : 1,
        tienHuy : 1,
        tienHoan : 1,
        tongDoanhThu : 1,
        tienPhi : 1,
    },
    {
        soGDThanhCong : 2,
        soGDHuy : 2,
        soGDHoan : 2,
        tienThanhCong : 2,
        tienHuy : 2,
        tienHoan : 2,
        tongDoanhThu : 2,
        tienPhi : 2,
    },
    {
        soGDThanhCong : 3,
        soGDHuy : 3,
        soGDHoan : 3,
        tienThanhCong : 3,
        tienHuy : 3,
        tienHoan : 3,
        tongDoanhThu : 3,
        tienPhi : 3,
    },
]


interface Props {
    t: (a: string) => string;
    // data: TransactionResponse[];
    totalFilter: number;
    onChangeRowsPerPage?: () => void;
    onChangePage?: () => void;
    rest?: any;
}

const DataTableReportSales : React.FC<Props> = ({
    t,
    // data,
    totalFilter,
    onChangeRowsPerPage,
    onChangePage,
    ...rest
}) => {
    const lang = localStorage.getItem("NEXT_LOCALE");
    // const columns: TableColumn<TransactionResponse>[] = useMemo(
        const columns: TableColumn<data>[] = useMemo(
        () => [
            {
                name: t("Số GD thành công"),
                minWidth: "100px",
                maxWidth: "120px",
                cell: (row, index) => (
                    <span>{row?.soGDThanhCong}</span>
                ),
            },
            {
                name: t("Số GD huỷ"),
                minWidth: "150px",
                cell: (row) => {
                    return <span>{row?.soGDHuy}</span>;
                },
            },
            {
                name: t("Số GD hoàn"),
                minWidth: "180px",
                cell: (row) => {
                    return <div>{row?.soGDHoan}</div>;
                },
            },
            {
                name: t("Tiền thành công(VNĐ)"),
                minWidth: "250px",
                cell: (row) => {
                    return <div>{row?.tienThanhCong}</div>;
                },
            },
            {
                name: t("Tiền Hủy (VNĐ)"),
                minWidth: "180px",
                maxWidth: "200px",
                cell: (row) => {
                    return <span>{row?.tienHuy}</span>;
                },
            },
            {
                name: t("Tiền Hoàn (VNĐ)"),
                minWidth: "180px",
                maxWidth: "200px",

                cell: (row) => {
                    return <span>{row?.tienHoan}</span>;
                },
            },
            {
                name: t("Tổng doanh thu"),
                minWidth: "180px",
                maxWidth: "200px",

                cell: (row) => {
                    return <span>{row?.tongDoanhThu}</span>;
                },
            },
            {
                name: t("Tiền Phí (VNĐ)"),
                minWidth: "180px",
                maxWidth: "200px",

                cell: (row) => {
                    return <span>{row?.tienPhi}</span>;
                },
            },
        ],
        [lang]
    );
    return(
        <div className='content-datable-account-mc'>
            <DataTableCustom
                className="data-table-custom"
                columns={columns}
                dataList={dataList}
                paginationTotalRows={totalFilter}
                t={t}
                onChangeRowsPerPage={onChangeRowsPerPage}
                onChangePage={onChangePage}
                nameDataTable="colReportSales"
                {...rest}
            />
        </div>
    )
}

export default DataTableReportSales