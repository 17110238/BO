import React, { useEffect, useState } from 'react';
import BoxSearchTopTransfer from './BoxSearch';
import TopTransferHeader from './Header';
import TopTransferDatatable from './Datable';
import { useDispatch } from 'react-redux';
import { getTopTransferAction } from 'redux/actions/topTransferAction';
import alert from 'utils/helpers/alert';
import { useRouter } from 'next/router';

const TopTransferContainer = () => {
  const dispatch = useDispatch();
  const [showFilter, setShowFilter] = useState(true);
  const [filter, setFilter] = useState<any>();
  const [isLoading, setLoading] = useState(false);
  const [mostTransferData, setMostTransferData] = useState<any>();
  const [highestAmountData, setHighestAmountData] = useState<any>();

  const fetchTopTransferData = (sort: any, callback: any) => {
    setLoading(true);
    dispatch(
      getTopTransferAction(
        {
          createdAt: filter?.createdAt,
          sort,
        },
        callback
      )
    );
  };

  useEffect(() => {
    if (filter?.createdAt) {
      fetchTopTransferData({ count: -1 }, (state: boolean, data: any) => {
        setLoading(false);
        if (state) {
          setMostTransferData(data);
        } else {
          setMostTransferData([]);
        }
      });
      fetchTopTransferData({ amount: -1 }, (state: boolean, data: any) => {
        setLoading(false);
        if (state) {
          setHighestAmountData(data);
        } else {
          setHighestAmountData([]);
        }
      });
    }
  }, [filter]);

  const handleToggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleFilter = (data: any) => {
    setFilter(data);
  };

  return (
    <div className='linkedbank-container'>
      <TopTransferHeader
        title='Giao dịch nhiều nhất'
        isShowFilterBtn
        isShowFilter={showFilter}
        isClickFilter={handleToggleFilter}
      />
      {showFilter && <BoxSearchTopTransfer handleFilter={handleFilter} isLoading={isLoading} />}
      <div className='mt-4'>
        <div>
          <TopTransferHeader title='Đối tác có nhiều giao dịch' />
          <div style={{ maxHeight: '600px', overflow: 'hidden' }}>
            <TopTransferDatatable data={mostTransferData} loading={isLoading} />
          </div>
        </div>
        <div className='mt-3'>
          <TopTransferHeader title='Đối tác có giá trị giao dịch lớn' />
          <div style={{ maxHeight: '600px', overflow: 'hidden' }}>
            <TopTransferDatatable data={highestAmountData} loading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopTransferContainer;
