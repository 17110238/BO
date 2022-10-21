import React from "react";
import MainLayout from "layouts/MainLayout";
import AccountsContainer from "components/Account/AccountsContainer";

function index() {
    return (
    <MainLayout isFixedDatatable={true}>
        <AccountsContainer tabActive={1} />
    </MainLayout>
);
}

export default index;