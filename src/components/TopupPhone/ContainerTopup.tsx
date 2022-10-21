import { storeValueIsStoreObject } from '@apollo/client/cache/inmemory/helpers';
import LoadingInline from 'components/common/Loading/LoadingInline';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { t } from 'i18next';
import { ReportReportTopupPhone } from 'models/topUpPhone';
import { useRouter } from 'next/router';
import numeral from 'numeral';
import React, { useEffect, useMemo, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { deleteListTopUpPhone, getListTopUpPhone } from 'redux/actions/topUpPhone';
import BoxSearchTopup from './BoxSearchTopup';
import HeaderTopup from './HeaderTopup';

dayjs.extend(utc);
export default function TelcoManageContainer() {
  const dispatch = useDispatch();
  const router = useRouter();
  const lang = localStorage.getItem('NEXT_LOCALE');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setShowFilter(!showFilter);
  const genderMoneyClass = (data?: number) => {
    return data && data < 0 ? 'text-danger' : '';
  };

  const defaultValue = {
    createdAt: {
      from: dayjs().subtract(1, 'month').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    },

  };
  const data = useSelector<any, ReportReportTopupPhone[]>(state => state.ReportTopUpPhoneReducer.listReportPhone?.data) || [];
  const loading = useSelector<any, boolean>(state => state.ReportTopUpPhoneReducer.loading);
  const dataSum = useSelector<any, ReportReportTopupPhone>(state => state.ReportTopUpPhoneReducer.listReportPhone?.sumData) || [];
  const dataFormat = [...data, dataSum]
  const columns: TableColumn<ReportReportTopupPhone>[] = useMemo(
    () => [
      {
        name: t('Ngày '),
        minWidth: '130px',
        cell: (row) => {
          return <div className=''>{row?.date || t('Tổng')}</div>;
        },
      },
      {
        name: t('SL Giao dịch'),
        minWidth: '110px',
        right: true,
        cell: (row) => {
          return <div className={` ${genderMoneyClass(row?.totalTransaction)}`}>{numeral(row?.totalTransaction).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Giá Trị Giao dịch'),
        right: true,
        minWidth: '160px',

        cell: (row) => {
          return <div className={` ${genderMoneyClass(row?.totalAmountTransaction)}`}>{numeral(row?.totalAmountTransaction).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Tiền Ví'),
        right: true,
        minWidth: '160px',
        footerName: 'Giá trị thực (VND)',
        footer: (
          <p
            className={`mb-0 text-right w-100 font-weight-bold ${genderMoneyClass(
              dataSum?.totalAmountWallet
            )}`}>
            {numeral(dataSum?.totalAmountWallet).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row) => {
          return <div className={` ${genderMoneyClass(row?.totalAmountWallet)}`}>{numeral(row?.totalAmountWallet).format('0,0') || '-'}</div>;
        },
      },

    ],

    [lang,]
  );

  useEffect(() => {
    let data: any = router.query || {}
    if (!(Object.keys(router.query).length === 0)){
      if (!data?.from) { data.from = defaultValue.createdAt.from }
      if (!data?.to) data.to = defaultValue.createdAt.to
      if (!data?.to && !data?.from) {
        data.from = defaultValue.createdAt.from;
        data.to = defaultValue.createdAt.to;
      }
      let payload: any = {
        createdAt: {
          from: data.from,
          to: data.to
        },
        ...(Boolean(data?.supplier) && { supplier: data?.supplier })
      }
    //  console.log("🚀 ~ file: ContainerTopup.tsx ~ line 102 ~ useEffect ~ payload", payload);
      // setValue('createdAt', { from: payload.createdAt.from, to: payload.createdAt.to });
      // setValue('supplier', data?.supplier);
      dispatch(getListTopUpPhone({
        filter: {
          ...payload
        },
      }, (status, res) => { }
      ))
    } else {
      dispatch(getListTopUpPhone({
        filter: {
          ...defaultValue
        },
      }, (status, res) => { }))
    }
    return () => {
      dispatch(deleteListTopUpPhone())
    }

   

  }, []);
  const conditionalRowStyles = [
    {
      when: (row: any) => row.totalAmountWallet === dataSum.totalAmountWallet,
      style: {
        backgroundColor: 'rgb(225 230 237)',
        fontWeight: 900,
        color: 'black',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    },


  ];
  return (
    <>
      {loading && <LoadingInline loading={loading} />}
      <div className='topupphone-container'>

        <HeaderTopup showFilter={showFilter}
          toggleFilter={toggleFilter} />
        {showFilter && <BoxSearchTopup loading={loading} />}
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
        {/* <div className='topupphone-content'>
        <div className='topupphone-table table-price'>
          <div className='topupphone-table__header'>
            <i className='fa fa-calendar-alt'></i>
            <h4>BÁO CÁO </h4>
          </div>
          <div className='topupphone-table__overflow'>
            <table className='topupphone-table__content'>
              <thead>
                <tr>
                  <td>Ngày</td>
                  <td>SL Giao dịch</td>
                  <td>Giá Trị Giao dịch</td>
                  <td>Tiền Ví</td>
                </tr>
              </thead>
              <tbody>
                {data?.map((item, index) => {
                  return (
                    <tr key={`${item?.date}+${index}`}>
                      <td>{item?.date}</td>
                      <td>{item?.totalTransaction}</td>
                      <td>   <NumberFormat
                        displayType={'text'}
                        value={item?.totalAmountTransaction}
                        thousandSeparator
                      /> đ</td>
                      <td>  <NumberFormat
                        displayType={'text'}
                        value={item?.totalAmountWallet}
                        thousandSeparator
                      /> đ</td>

                    </tr>
                  )
                }
                )}
              </tbody>
              <tfoot>

                {dataSum && (<tr>
                  <td>Tổng</td>
                  <td>{dataSum?.totalTransaction || 0}</td>
                  <td> <NumberFormat
                    displayType={'text'}
                    value={dataSum?.totalAmountTransaction || 0}
                    thousandSeparator
                  /> đ</td>
                  <td>  <NumberFormat
                    displayType={'text'}
                    value={dataSum?.totalAmountWallet || 0}
                    thousandSeparator
                  /> đ</td>
                </tr>)


                }


              </tfoot>
            </table>
          </div>
        </div>

      </div> */}
      </div>
    </>

  );
}
