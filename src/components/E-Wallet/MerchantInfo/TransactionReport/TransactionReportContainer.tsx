import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getMerchantTransactionReport } from 'redux/actions/merchantInfoActions';
import BoxSearchTransactionReport from './BoxSearchTransactionReport';
import DataTableTransactionReport from './DataTableTransactionReport';
dayjs.extend(utc)

interface Props {
  isShowFilter?: boolean;
  getAllData?: boolean;
  parentSubmit?: boolean;
}

export interface SearchParams {
  createdAt?: {
    from?: string;
    to?: string;
  };
}

const TransactionReportContainer: React.FC<Props> = ({ isShowFilter, parentSubmit, getAllData = false }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const isLoading = useSelector<any, boolean>(
    (state) => state?.merchantInfoReducer.loadingTransactionReport
  );
  const accountId = useSelector<any, string>((state) => state?.merchantInfoReducer.accountId);
  const [reportData, setReportData] = useState<any>([]);
  const [columnTitles, setColumnTitles] = useState<any>([]);

  const toggleChildren = (id: number) => {
    const destinationRowIndex = reportData.findIndex((row: any) => row.id === id);
    const updatedData = [...reportData];
    updatedData[destinationRowIndex].showChildren = !updatedData[destinationRowIndex].showChildren;
    setReportData(updatedData);
  }

  const fetchData = (filter: any = {
    createdAt: {
      from: dayjs().subtract(7, 'day').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    }
  }) => {
    if (getAllData || accountId) {
      const payload = {
        filter: {
          ...filter,
        },
      };


      if (!getAllData) {
        payload.filter.accountId = parseInt(accountId);
      }
      console.log('payload', payload)

      dispatch(
        getMerchantTransactionReport(payload, (status, response) => {
          if (status) {
            const data = JSON.parse(response);
            setColumnTitles(data.column);
            const convertedData = data.dataTable.reduce((majorRows: any[], row: any) => {
              if (row.pid === 0) {
                const children = data.dataTable.filter((childRow: any) => childRow.pid === row.id);
                const showChildren = false;
                majorRows.push({ ...row, children, showChildren });
              }
              return majorRows;
            }, []);
            setReportData(convertedData);
          } else {
            setColumnTitles([]);
            setReportData([]);
          }
        })
      );
    } else {
      setColumnTitles([]);
      setReportData([]);
    }
    setSubmitForm(false);
  }

  useEffect(() => {
    setSubmitForm(true);
  }, [accountId]);

  useEffect(() => {
    if (parentSubmit) {
      setSubmitForm(true);
    }
  }, [parentSubmit]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitSearch: SubmitHandler<SearchParams> = (data) => {
    const payload: any = { ...data };
    payload.createdAt &&
      Object.keys(payload?.createdAt).forEach(
        (key) => !payload.createdAt[key] && delete payload.createdAt[key]
      );

    Object.keys(payload).forEach((key) => !payload[key] && delete payload[key]);

    if (payload.createdAt && Object.keys(payload.createdAt).length === 0) delete payload.createdAt;

    fetchData(payload);
  };


  return (
    <div className='transaction-report-container'>
      {isShowFilter && (
        <BoxSearchTransactionReport
          showFilter={isShowFilter}
          submitForm={submitForm}
          handleSubmitSearch={handleSubmitSearch}
          setSubmitForm={setSubmitForm}
        />
      )}
      <DataTableTransactionReport
        reportData={reportData}
        columnTitles={columnTitles}
        isLoading={isLoading}
        toggleChildren={toggleChildren}
      />
    </div>
  );
};

export default TransactionReportContainer;