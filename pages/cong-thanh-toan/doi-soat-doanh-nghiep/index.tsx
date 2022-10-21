import React from "react";
import MainLayout from "layouts/MainLayout";
import Link from "next/link";

import AccountantPageContainer from "components/Accountant/AccountantPageContainer";
function index() {
    return (
        <MainLayout>
            <AccountantPageContainer />
        </MainLayout>
    );
}

export default index;