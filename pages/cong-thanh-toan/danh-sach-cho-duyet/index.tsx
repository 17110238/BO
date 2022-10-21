import React from "react";
import MainLayout from "layouts/MainLayout";
import PendingListMerchantContainer from "components/Merchant/pendingListMerchant/PendingListMerchantContainer";

function index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <PendingListMerchantContainer />
    </MainLayout>
  );
}

export default index;
