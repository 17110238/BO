import React, { memo, useEffect, useMemo, useState } from 'react';
import DataTable, { defaultThemes, TableColumn } from 'react-data-table-component';
import { Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { dataTopIncomeMerchantType, merchantTopIncomeType } from 'models/chartmerchant/chartmerchant';
import { getListTopIncomeMerchant } from 'redux/actions/chartMerchant';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';
import BarChartType from 'components/ChartMerchant/BarChartType';
import ReactSelect from 'react-select';
import { customStylesV1} from 'utils/helpers/customStylesForReactSelect';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import { SubmitHandler, useForm } from 'react-hook-form';
import updateURLParameter from 'utils/helpers/changeUrl';
import { searchParams } from 'components/User/BoxSearchUser';
interface CreatedAt{
  createdAt: {
    from:string,
    to: string,
  },
}
const TopIncomeMerchant: React.FC = () => {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const dispatch = useDispatch();
  const { t } = useTranslation('common');
  const dataMerchant = useSelector<any, dataTopIncomeMerchantType[]>((state) => state.chartMerchantReducers.dataTopIncomeMerchant) || [];
  let dataFormat: merchantTopIncomeType[] = [];
  let ab = dataMerchant.map((item, index) => {
    const res: any = {};
    res.month = item.month;
    res.year = item.year;
    res.result = item.result.map((method) => {
      return { ...method, month: item.month, year: item.year };
    });
    dataFormat.push(...res.result);
    return res;
  });
  let initialData = dataFormat.filter((item, index) => { return item.month === dataMerchant[0].month; });
  const dataOptions = dataMerchant?.map((item, index) => {
    return {
      value: item.month,
      label: item.month < 10 ? '0' + item.month + '/' + item.year : item.month + '/' + item.year,
    };
  });
  const [first1, setfirst1] = useState(initialData);

  
  

  const columns: TableColumn<merchantTopIncomeType>[] = useMemo(
    () => [
   
      {
        minWidth: '150px',
        maxWidth: '200px',
        name: t('Tên doanh nghiệp'),
        // sortable: true,
      
        // selector: (row) => row.merchantTitle,
        cell: (row) => row.merchantTitle,
      },
      {
        name: t('Số lượng'),
        // selector: (row) => row.count,
        cell: (row) => row.count,
       // sortable: true,
        right:true,
      },
      {
        name: t('Số tiền'),
        // selector: (row) => row.amount,
       // sortable: true,
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
      },
      // {
      //   maxWidth: '70px',
      //   minWidth: '80px',
      //   name: t('Tháng'),
      //   cell: (row) => row.month,
      // },
      // {
      //   maxWidth: '70px',
      //   minWidth: '70px',
      //   name: t('Năm'),
      //   cell: (row) => row.year,
      // },
    ],
    [lang]
  );
  useEffect(() => {
    const params: CreatedAt = {
      createdAt: {
        from: dayjs().subtract(2, 'month').format('YYYY-MM-DD'),
        to: dayjs().endOf('date').format('YYYY-MM-DD'),
      },
    };
    dispatch(getListTopIncomeMerchant(params, (status, data) => { }));
  }, []);
 
  const handleChange = (e: any) => {
    dataFormat = dataFormat.filter((item, index) => {
      return item.month === e.value;
    });
    setfirst1(dataFormat);
  };

  return (
    <div className='barchart py-4'>
      <div className='barchart__content'>
        <h5
          className='py-3  mb-2  text-left pl-4'
          style={{ borderBottom: '1px solid #d1d1d199' }}>
          {t('Thống kê giao dịch doanh nghiệp')}
        </h5>
        <BarChartType />
      </div>
      <div className='barchart__content'>
        <h5
          className='py-3  mb-2  text-left pl-4'
          style={{ borderBottom: '1px solid #d1d1d199' }}>
          {t('Top 20 doanh nghiệp có số tiền nhận thanh toán cao nhất')}{' '}
        </h5>
        <div className="d-flex  justify-content-end flex-wrap">

          <div className='select__option '>
            {/* <label >{t('Tháng')}</label> */}
            <ReactSelect
              className='select-input-form'
              classNamePrefix='input-select'
              styles={customStylesV1}
               defaultValue={dataOptions[0]}
              onChange={handleChange}
              options={dataOptions}
              noOptionsMessage={() => t('Không tìm được kết quả')}
              theme={(theme) => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  primary25: '#EFF2F7',
                  primary: '#EFF2F7',
                },
              })}
            />
          </div>
          {/* <Form onSubmit={handleSubmit(onSubmit)} >
            <div className='account-manage__box-search d-flex flex-wrap align-items-end'>
              <div className='form-group  form-date'>
                <Form.Label>{t('Duration')}</Form.Label>
                <div className='date-picker-custom'>
                  <DatePickerCustomV2 placeholder={'DD/MM/YYYY'} control={control} />
                </div>
              </div>
              <Form.Group className='form-btn ml-3'>
                <button
                  type='submit'
                  className='btn btn-primary btn-search'
                  style={{ minWidth: '120px' }}>
                  <i className='fas fa-search'></i> {t('Tìm kiếm')}
                </button>
              </Form.Group>
            </div>
          </Form> */}
        </div>
        <Row>
          <Col className='col-lg-12'>
            <div className='border table-payment cls-datatable1'>
              <DataTable
                className='data-table-custom'
                columns={columns}
                data={first1}
                noDataComponent={
                  <div
                    style={{
                      textAlign: 'center',
                      alignItems: 'center',
                      display: 'flex',
                      height: '350px',
                      justifyContent: 'center',
                    }}>
                    <h5>{t('Không có dữ liệu để hiển thị')}</h5>
                  </div>
                }
                fixedHeaderScrollHeight='300px'
                fixedHeader
                noHeader
                paginationPerPage={10}
                highlightOnHover
                pagination
              />
            </div>

            {/* <DataTableCustom
              className='data-table-custom'
              columns={columnsTopIncome}
              dataList={dataFormat}
              defaultSortFieldId={1}

              pagination
              selectableRows
             // paginationTotalRows={totalFilter}
              t={t}
              fixedHeader
              fixedHeaderScrollHeight='1000px'
              nameDataTable='colAccountMerchant'
              // {...rest}
            /> */}
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default memo(TopIncomeMerchant);
