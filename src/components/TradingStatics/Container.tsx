import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import Nodata from 'components/common/NoData/Nodata';
import MainLayout from 'layouts/MainLayout';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import LoadingInline from 'components/common/Loading/LoadingInline';
import { useDispatch } from 'react-redux';
import { reportEwalletDaily } from 'redux/actions';
import { items } from 'components/systemConfig/constants/configItems';
import formatCurrency from 'utils/helpers/formatCurrency';
import Header from './Header';
import BoxSearchTradingStatic from './BoxSearch';
import _ from 'lodash'
import TradingStaticsDataTable from './DataTable';
import { clearFalsyObject } from 'utils/helpers/replaceUrl';
import { useRouter } from 'next/router';

// function getDatesInRange(startDate: any, endDate: any) {
//   const date = new Date(startDate.getTime());

//   // ✅ Exclude start date
//   date.setDate(date.getDate());

//   const dates = [];

//   // ✅ Exclude end date
//   while (date < endDate) {
//     dates.push(new Date(date));
//     date.setDate(date.getDate() + 1);
//   }

//   return dates;
// }

const TradingStaticContainer = () => {
  const [data, setData] = useState<any>({})
  const [showFilter, setShowFilter] = useState<boolean>(true)
  const [filter, setFilter] = useState<any>({});
  const [isLoading, setLoading] = useState<boolean>(false);
  const toggleFilter = () => setShowFilter(!showFilter)
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    const handleReportEwalletDaily = () => {
      setLoading(true);
      dispatch(
        reportEwalletDaily({ filter }, (status, res) => {
          if (status) {
            setData(JSON.parse(res) || {})
          }
          setLoading(false);
        })
      )
    }
    if (!_.isEmpty(filter)) {
      handleReportEwalletDaily();
    }
  }, [filter]); 

  useEffect(() => {
    const params = { ...router.query };

    delete params.to;
    delete params.from;

    const payload = clearFalsyObject({
      ...params,
      createdAt: {
        from: router.query?.from || dayjs().subtract(7, 'day').startOf('day').utc().format(),
        to: router.query?.to || dayjs().endOf('date').utc().format(),
      },
    });
    setFilter(payload);
    setSubmitForm(true);
  }, []);

  const handleSubmitSearch = (data: any) => {
    setFilter({ ...data });
  };

  return (
    <div className='merchant-container reportTransaction-container box-payment box-payment-report-customer' style={{height: "100%"}}>
      <Header
        showFilter={showFilter}
        toggleFilter={toggleFilter}
      />
      <BoxSearchTradingStatic
        handleSubmitSearch={handleSubmitSearch} 
        loading={isLoading}
        showFilter={showFilter}
      />
      <TradingStaticsDataTable
        data={data}
        isLoading={isLoading}
      />
    </div>
  );
};

export default TradingStaticContainer;