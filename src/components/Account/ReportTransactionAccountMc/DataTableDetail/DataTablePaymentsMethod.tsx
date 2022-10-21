import React, { useMemo } from 'react'
import DataTableCustom from "components/common/Datatable/DatatableCusTom";
import { TableColumn } from 'react-data-table-component';
import { TransactionResponse } from 'models/transaction/transactionState';

interface data { 
        phuongThucTT: string;
        soGDThanhCong : number;
        soGDHoan : number;
        soGDHuy : number;
        tienThanhCong : number;
        tongDoanhThu : number;
        tienHuy : number;
        tienHoan : number;
        tienPhi : number;
}

const dataList: Array<data> = [
    {
        phuongThucTT: 'vi payme',
        soGDThanhCong : 1,
        soGDHoan : 1,
        soGDHuy : 1,
        tienThanhCong : 1,
        tongDoanhThu : 1,
        tienHuy : 1,
        tienHoan : 1,
        tienPhi : 1
    },
    {
        phuongThucTT: 'the ATM',
        soGDThanhCong : 2,
        soGDHoan : 2,
        soGDHuy : 2,
        tienThanhCong : 2,
        tongDoanhThu : 2,
        tienHuy : 2,
        tienHoan : 2,
        tienPhi : 2
    },
    {
        phuongThucTT: 'the quoc te (VN)',
        soGDThanhCong : 3,
        soGDHoan : 3,
        soGDHuy : 3,
        tienThanhCong : 3,
        tongDoanhThu : 3,
        tienHuy : 3,
        tienHoan : 3,
        tienPhi : 3
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

const DataTablePaymentsMethod : React.FC<Props> = ({
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
                name: t("Phương Thức TT"),
                minWidth: "150px",
                maxWidth: "200px",
                cell: (row, index) => (
                    <span>{row?.phuongThucTT}</span>
                ),
            },
            {
                name: t("Số GD thành công"),
                minWidth: "180px",
                cell: (row) => {
                    return <div>{row?.soGDThanhCong}</div>;
                },
            },
            {
                name: t("Số GD huỷ"),
                minWidth: "250px",
                cell: (row) => {
                    return <div>{row?.soGDHuy}</div>;
                },
            },
            {
                name: t("Số GD hoàn"),
                minWidth: "180px",
                maxWidth: "200px",
                cell: (row) => {
                    return <span>{row?.soGDHoan}</span>;
                },
            },
            {
                name: t("Tiền thành công(VNĐ)"),
                minWidth: "180px",
                maxWidth: "200px",

                cell: (row) => {
                    return <span>{row?.tienThanhCong}</span>;
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
                name: t("Tổng phí"),
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
                nameDataTable="colPaymentsMethod"
                {...rest}
            />
        </div>
    )
}

export default DataTablePaymentsMethod