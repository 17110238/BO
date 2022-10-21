import React from "react";
import MainLayout from "layouts/MainLayout";
import ReportEwalletMcContainer from "components/ReportEwalletMC/ReportEwalletMcContainer";

function index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <ReportEwalletMcContainer />
    </MainLayout>
  );
}

export default index;