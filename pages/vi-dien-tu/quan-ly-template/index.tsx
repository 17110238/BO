import React from "react";
import MainLayout from "layouts/MainLayout";
import TemplateManageContainer from "components/E-Wallet/Template/TemplateContainer";

function index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <TemplateManageContainer />
    </MainLayout>
  );
}

export default index;