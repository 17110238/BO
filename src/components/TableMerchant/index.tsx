import React, { useMemo } from 'react';
import DataTable, { defaultThemes, TableColumn } from 'react-data-table-component';
// import 'react-data-table-component-extensions/dist/index.css';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import DataTableCustomer from 'components/Customer/DataTableCustomer';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { LocationAmount } from 'models/chartmerchant/chartmerchant';
import { useTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';
export const customStyles = {
  header: {
    style: {
      minHeight: '56px',
    },
  },
  headRow: {
    style: {
      background: '#82ca9d',
      borderTopStyle: 'solid',
      fontWeight: '900',
      borderTopWidth: '1px',
      borderTopColor: defaultThemes.default.divider.default,
    },
  },
  headCells: {
    style: {
      '&:not(:last-of-type)': {
        borderRightStyle: 'solid',
        borderRightWidth: '1px',
        borderRightColor: defaultThemes.default.divider.default,
      },
    },
  },
  cells: {
    style: {
      '&:not(:last-of-type)': {
        borderRightStyle: 'solid',
        borderRightWidth: '1px',
        borderRightColor: defaultThemes.default.divider.default,
      },
    },
  },
};
export const TableMerchant = () => {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const { t } = useTranslation('common');
  const dataMerchant =
    useSelector<any, LocationAmount[]>(
      (state) => state.chartMerchantReducers.dataLocationMerchant
    ) || [];
 
  const columns: TableColumn<LocationAmount>[] = useMemo(
    () => [
      //   location(pin):"Tỉnh Khánh Hòa"
      // count(pin):72
      // amount(pin):18369778
      {
        name: 'ID',
        minWidth: '30px',
        maxWidth: '40px',
        right:true,
        cell: (row, index) => <div className='position-relative w-100'>{index + 1}</div>,
      },
      {
        name: t('Vị trí'),
      
        cell: (row) => row.location,
      },
      {
        name: t('Số lượng'),
        minWidth: '50px',
        maxWidth: '100px',
        right:true,
        cell: (row) => row.count,
      },
      {
        name: t('Số tiền'),
        minWidth: '190px',
        maxWidth: '200px',
        right:true,
        cell: (d) => (
          <span>
            {
              <NumberFormat
                value={d.amount}
                className='foo'
                displayType={'text'}
                thousandSeparator={true}
              />
            }{' '}
            đ
          </span>
        ),
       // sortable: true,
      },
      {
        name: t('Tổng'),
        minWidth: '190px',
        maxWidth: '200px',
        right:true,
        cell: (row) => ( <span>
          {
            <NumberFormat
              value={ row.total}
              className='foo'
              displayType={'text'}
              thousandSeparator={true}
            />
          }{' '}
          đ
        </span>)
       // sortable: true,
      },
    ],
    [lang]
  );
  return (
    <Row>
      <Col className='col-lg-12'>
        <div className='border table-payment cls-datatable'>
          <DataTable
            className='data-table-custom'
            columns={columns}
            data={dataMerchant}
            // noDataComponent={t("Không có dữ liệu để hiển thị")}
            noDataComponent={
              <div style={{ textAlign: 'center' ,alignItems:'center',display:"flex",height:"400px",justifyContent:'center'}}><h5>{t('Không có dữ liệu để hiển thị')}</h5></div>
            }
            fixedHeader
            fixedHeaderScrollHeight='400px'
            noHeader
            customStyles={customStyles}
          
            highlightOnHover
          />
        </div>
      </Col>
    </Row>
  );
};
