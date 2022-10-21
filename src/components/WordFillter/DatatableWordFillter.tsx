import React, { useMemo, useState } from 'react'
import { Dropdown } from 'react-bootstrap';
import DataTable, { TableColumn } from 'react-data-table-component'
import { useTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import ModalImport from './ModalImport';
import Link from 'next/link';
import FileSaver from 'file-saver';
import { EWalletWordFillter } from 'models';
import dayjs from 'dayjs';

interface TypeDatatableWordFillter {
    t: (a: string) => string;
    data: any[];
    totalFilter: number;
    onRowSelected?: () => void;
    deleteDefault?: boolean;
    getDataList?: (
        start?: number,
        limit?: number,
        sort?: {}
    ) => {
        payload: any;
        getList: (payload: any) => void;
    };
    rest?: any;
}

const DatatableWordFillter = (props: TypeDatatableWordFillter) => {

    const lang = localStorage.getItem('NEXT_LOCALE');
    const { data, t, getDataList, ...rest } = props;
    const [showModalImport, setShowModalImport] = useState<boolean>(false);
    const [dataId, setDataId] = useState<EWalletWordFillter>()
    const columns: TableColumn<EWalletWordFillter>[] = useMemo(
        () => [
            {
                name: 'ID',
                minWidth: '30px',
                maxWidth: '40px',
                cell: (row) => (<div className='position-relative w-100'>{row?.id}</div>)
            },
            {
                name: t('Loại'),
                cell: (row) => row.type,
            },
            {
                name: t('Danh sách từ'),
                cell: (row) => row.fileName,
            },
            {
                name: t('Mô tả'),

                cell: (row) => (
                    <span>
                        {row?.description}
                    </span>
                ),
                // sortable: true,
            },
            {
                name: t('TG Cập nhật'),
                cell: (row) => (<span>
                    {row?.updatedAt ? dayjs(row?.updatedAt).format(' h:mm A MM/DD/YYYY') : ''}
                </span>)
                // sortable: true,
            },
            {
                name: t('Thao tác'),
                center:true,
                cell: (row) => {
                    return (
                        <>
                            <Dropdown className='transaction-table-dropdown' >
                                <Dropdown.Toggle
                                    className='w-100'
                                    style={{
                                        backgroundColor: 'rgba(0,0,0,0)',
                                        borderColor: 'rgba(0,0,0,0)',
                                    }}
                                    id='dropdown-button-drop-up'>
                                    <div className='d-flex justify-content-center w-100' >
                                        <i className='fas fa-th-large m-0 text-muted'></i>
                                    </div>
                                </Dropdown.Toggle>
                                <Dropdown.Menu style={{ borderRadius: '12px' }}>
                                    <Dropdown.Item onClick={() => { FileSaver.saveAs(`${process.env.NEXT_PUBLIC_API_UPLOAD + row?.file}`, `${row?.file + '.xlsx'}`) }}>
                                        {/* FileSaver.saveAs(`${process.env.NEXT_PUBLIC_API_UPLOAD + row?.file}`, `${row?.file + '.xlsx'}`); */}
                                        <a href={`${process.env.NEXT_PUBLIC_API_UPLOAD + row?.file}`} target='_blank'></a>
                                        {/* ${process.env.NEXT_PUBLIC_API_UPLOAD} */}
                                        <i className="fas fa-download mr-2"></i>
                                        {t('Xem')}

                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => { handleShowModalImport(row) }}>
                                        <i className="fas fa-file-import mr-2"></i>
                                        {t('Cập nhật')}
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </>
                    )
                }
            },
        ],
        [lang]
    );
    const handleShowModalImport = (dataid: EWalletWordFillter) => { setShowModalImport(true); setDataId(dataid) }
    return (
        <>
            <div className='border table-payment cls-datatable'>
                <DataTableCustom
                    className='data-table-custom'
                    columns={columns}
                    dataList={data}
                    // paginationTotalRows={totalFilter}
                    t={t}
                    fixedHeader
                    nameDataTable='colAccountMerchant'
                    getDataList={getDataList}
                    {...rest}
                />
            </div>

            {showModalImport && <ModalImport show={showModalImport} getDataList={getDataList} onHide={() => setShowModalImport(false)} data={dataId} />}
        </>
    )
}

export default DatatableWordFillter