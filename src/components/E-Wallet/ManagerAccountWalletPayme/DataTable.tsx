import useWindowDimensions from 'hook/useWindowDimension';
import React, { useMemo } from 'react'
import { Dropdown } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { formatPhone } from 'utils/helpers';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import { DataGetListCompany, DataSearchEmployee } from 'models';
import ModalUpdate from './Modal/ModalUpdate';

interface Props {
  getDataList?: (start?: number, limit?: number, sort?: {}) => {
    payload: any;
    getList: (payload: any) => void;
  };
  data?: DataSearchEmployee[];
  setSubmitForm?: (a: boolean) => void;
  isLoading?: boolean;
  handleDelete: (id: number) => void;
  handleDetail: (data: any, company: any) => void;
  dataCompany?: any
}


const DataTable: React.FC<Props> = ({
  getDataList,
  data,
  isLoading,
  handleDelete,
  setSubmitForm,
  handleDetail,
  dataCompany,
  ...rest
}) => {
  const { t } = useTranslation('common')
  const lang = localStorage.getItem('NEXT_LOCATE');
  const { height: screenHeight } = useWindowDimensions()

  const handleCallDetails = (val : any, company: any) => {
    handleDetail(val, company)
  }

  const columns: TableColumn<any>[] = useMemo(
    () => [
      {
        name: t('ID'),
        minWidth: '100px',
        maxWidth: '150px',
        cell: (row, index) => <div>{row?.id}</div>,
        left: true
      },
      {
        name: t('Phone'),
        minWidth: '150px',
        maxWidth: '200px',
        cell: (row) => {
          return <div>{formatPhone(row?.phone ?? '', '0')}</div>;
        },
        center: true,
      },
      {
        name: t("Họ tên"),
        minWidth: '150px',
        maxWidth: '200px',
        cell: (row, index) => {
          return <div>{row?.fullname}</div>
        },
        left: true
      },
      {
        name: t("Công ty"),
        minWidth: '100px',
        maxWidth: '150px',
        cell: (row, index) => {
          return <div>{row?.company}</div>
        },
        left: true
      },
      {
        name: t("Trạng thái tài khoản"),
        minWidth: '150px',
        maxWidth: '200px',
        cell: (row, index) => {
          return <div className={`${row?.accountStatus === "Kích Hoạt" ? "kich-hoat-payme" : "chua-KYC"}`}>{row?.accountStatus}</div>
        },
        center: true
      },
      {
        name: t("Tài khoản ví công ty"),
        minWidth: "150px",
        maxWidth: "200px",
        cell: (row, index) => {
          return <div>{row?.ewalletAccount}</div>
        },
        left: true
      },
      {
        name: t("Thời gian tạo"),
        minWidth: '200px',
        maxWidth: '250px',
        cell: (row, index) => {
          return <div>{row?.createdAt}</div>
        },
        center: true
      },
      {
        name: t('Thao tác'),
        minWidth: '80px',
        center: true,
        cell: (row) => {
          return (
            <Dropdown>
              <Dropdown.Toggle
                className='w-100'
                style={{
                  backgroundColor: 'rgba(0,0,0,0)',
                  borderColor: 'rgba(0,0,0,0)',
                }}
                id='dropdown-button-drop-up'>
                <div className='d-flex justify-content-center w-100'>
                  <i className='fas fa-th-large m-0 text-muted'></i>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ borderRadius: '12px' }}>
                <Dropdown.Item className='refund' onClick={() => handleCallDetails(row, dataCompany) }>
                  <i className='fas fa-edit fa-lg mr-2'></i> {t('Chỉnh sửa')}
                </Dropdown.Item>
                <Dropdown.Item className='danger' onClick={() => handleDelete && handleDelete(+row.id)}>
                  <i className='fa fa-trash mr-2' aria-hidden='true'></i> {t('Remove')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          );
        },
      },
    ],
    [lang]
  )

  return (
    <>
      <DataTableCustom
        className='data-table-custom'
        columns={columns}
        dataList={data}
        t={t}
        isSorting={true}
        getDataList={getDataList}
        isLoading={isLoading}
        nameDataTable="colManagerAccountWalletPayme"
        {...rest}
      />
    </>

  )
}

export default DataTable