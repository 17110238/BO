import React, { useEffect } from 'react';
import MainLayout from 'layouts/MainLayout';
import MerchantInfoContainer from 'components/E-Wallet/MerchantInfo/MerchantInfoContainer';
import { resetSearchMerchant } from 'redux/actions/merchantInfoActions';
import { useDispatch } from 'react-redux';

function index() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      resetSearchMerchant()
    );
  }, []);

  return (
    <MainLayout isFixedDatatable={true}>
      <MerchantInfoContainer />
    </MainLayout>
  );
}

export default index;
