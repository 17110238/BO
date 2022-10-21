import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getTop10WalletAmount, getTop10WalletCount } from 'redux/actions/topTransferAction';
import { clearFalsyObject } from 'utils/helpers/replaceUrl';
import BoxSearch from './Boxsearch';
import Datatable from './Datatable';
import Header from './Header';
dayjs.extend(utc);

const TopTransferAmountNHNN = () => {
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setShowFilter(!showFilter);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [listDataCount, setlistDataCount] = useState([]);
  const [listDataAmount, setlistDataAmount] = useState([]);
  const [filter, setFilter] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmitForm = () => {
    setSubmitForm(true);
  };

  const handleSubmitSearch = (data: any) => {
    let payload = clearFalsyObject({ ...data });
    setFilter({ ...payload });
    setLoading(true);
    setSubmitForm(true);
  };

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [loading]);

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

  useEffect(() => {
    const payload = {
      filter: {
        beginTime:
          filter?.createdAt?.from || dayjs().subtract(7, 'day').startOf('day').utc().format(),
        endTime: filter?.createdAt?.to || dayjs().endOf('date').utc().format(),
        accountType: 'PERSONAL',
      },
      paging: {
        start: 0,
        limit: 100,
      },
    };

    if (filter?.createdAt?.from && filter?.createdAt?.to) {
      dispatch(
        getTop10WalletCount(payload, (status, res) => {
          setlistDataCount(res);
          setSubmitForm(false);
          setLoading(false);
        })
      );

      dispatch(
        getTop10WalletAmount(payload, (status, res) => {
          setlistDataAmount(res);
          setSubmitForm(false);
          setLoading(false);
        })
      );
    }
  }, [filter]);

  return (
    <div style={{ background: '#fff' }} className='linkedbank-container'>
      <Header toggleFilter={toggleFilter} showFilter={showFilter} />
      {/* {filter && <BoxSearch isLoading={isLoading} handleFilter={handleFilter} />} */}
      {/* {isLoading ? ( */}
      <BoxSearch
        showFilter={showFilter}
        submitForm={submitForm}
        handleSubmitSearch={handleSubmitSearch}
        loading={loading}
        setSubmitForm={setSubmitForm}
      />
      <div
        style={{ position: 'relative', padding: '0px 20px 50px 20px' }}
        className='cls-top-slgd'>
        <Datatable
          loading={loading}
          data={listDataCount}
          dataAmount={listDataAmount}
          setSubmitForm={setSubmitForm}
        />
      </div>
    </div>
  );
};

export default TopTransferAmountNHNN;
