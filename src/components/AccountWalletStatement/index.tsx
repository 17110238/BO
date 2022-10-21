import { useState, useEffect } from 'react';
import BoxSearch from './Boxsearch';
import Header from './Header';
import Datatable from './Datatable';
import LoadingInline from 'components/common/Loading/LoadingInline';
import Nodata from 'components/common/NoData/Nodata';
import { useDispatch } from 'react-redux';
import { getAccountStatmentSecureWallet } from 'redux/actions';
import { data } from 'jquery';
import { AccountStatmentSecureWalletResponsed } from 'models/overviewReportWallet';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';

const AccountWalletStatementContainer = () => {
  const [filter, setFilter] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<AccountStatmentSecureWalletResponsed>({})

  const dispatch = useDispatch()

  const handleFilter = () => {
    setIsLoading(true);
  };

  const toggleFilter = () => {
    setFilter(!filter);
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(
      getAccountStatmentSecureWallet((state, res) => {
        if (state) {
          setData(res)
        }
        setIsLoading(false)
      })
    )
  }, [])

  return (
    <>
      <div style={{ background: '#fff' }} className='linkedbank-container'>
        <Header toggleFilter={toggleFilter} showFilter={filter} />
        {/* {filter && <BoxSearch isLoading={isLoading} handleFilter={handleFilter} />} */}
        {/* {isLoading ? ( */}
        <div style={{ position: 'relative', padding: '20px 20px 50px 20px' }} className="cls-top-slgd">
          {/* <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 200,
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.8)',
            }}>
            <LoadingInline loading={isLoading || false} />
          </div> */}
          <Datatable
            data={data}
          />
        </div>
        {isLoading && <LoadingFullScreen />}
      </div>
    </>
  );
};

export default AccountWalletStatementContainer;
