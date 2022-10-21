import React from "react";
import MainLayout from "layouts/MainLayout";
import AccountsContainer from "components/Account/AccountsContainer";

function index() {
    return (
    <MainLayout>
        <AccountsContainer tabActive={2} />
    </MainLayout>
);
}

export default index;