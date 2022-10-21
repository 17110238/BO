import React from "react";
import MainLayout from "layouts/MainLayout";
import ProcessingFlowManageContainer from "components/Merchant/pendingListMerchant/processingFlow/ProcessingFlowManageContainer";

function index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <ProcessingFlowManageContainer />
    </MainLayout>
  );
}

export default index;
