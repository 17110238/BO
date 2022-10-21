import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { t } from 'i18next';
import { ReportPoboOrderType } from 'models/report-bill';
import numeral from 'numeral';
import React, { useMemo } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

dayjs.extend(utc);
interface Props {
    data: ReportPoboOrderType[],
    dataSum: ReportPoboOrderType
}
export default function DataTableReportTransaction({ data, dataSum }: Props) {
    const lang = localStorage.getItem('NEXT_LOCALE');
    let a: ReportPoboOrderType
    const dataFormat = [...data, dataSum]
    //{month: '04-2022', successCount: 11, successAmount: 2304888050, failCount: 5, failAmount: 1272150.480
    const columns: TableColumn<ReportPoboOrderType>[] = useMemo(
        () => [
            {
                name: t('Ngày '),
                minWidth: '130px',
                cell: (row) => {
                    return <div className=''>{row?.month || t('Tổng')}</div>;
                },
            },
            {
                name: t('Số Lượng GD Thành Công'),
                minWidth: '110px',
                cell: (row) => {
                    return <div >{numeral(row?.successCount).format('0,0') || '-'}</div>;
                },
            },
            {
                name: t('Giá Trị GD Thành Công'),
                right: true,
                minWidth: '160px',
                cell: (row) => {
                    return <div >{numeral(row?.successAmount).format('0,0') || '-'}</div>;
                },
            },
            {
                name: t('Số Lượng GD Không Thành Công'),
                right: true,
                minWidth: '160px',
                cell: (row) => {
                    return <div >{numeral(row?.failCount).format('0,0') || '-'}</div>;
                },
            },
              {
                name: t('Giá Trị GD Không Thành Công'),
                right: true,
                minWidth: '160px',
                cell: (row) => {
                    return <div >{numeral(row?.failAmount) || '-'}</div>;
                },
            },

        ],

        [lang,]
    );
      const conditionalRowStyles = [
        {
          when: (row: any) => row.successCount === dataSum.successCount,
          style: {
            backgroundColor: 'rgb(225 230 237)',
            fontWeight: 900,
            color: 'black',
            '&:hover': {
              cursor: 'pointer',
            },
          },
        },
    ]


    return (
        <>

            <div className='border table-payment cls-datatable topupphone-table'>
                <DataTable
                    className='data-table-custom'
                    columns={columns}
                    data={dataFormat}
                    noDataComponent={
                        <div style={{ textAlign: 'center', alignItems: 'center', display: "flex", height: "350px", justifyContent: 'center', }}><h5>{t('Không có dữ liệu để hiển thị')}</h5></div>
                    }
                    fixedHeader
                    conditionalRowStyles={conditionalRowStyles}
                    noHeader
                    // defaultSortAsc={false}
                    highlightOnHover
                />
            </div>

        </>

    );
}
