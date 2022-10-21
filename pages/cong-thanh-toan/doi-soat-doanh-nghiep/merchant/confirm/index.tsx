import React from "react";
import MainLayout from "layouts/MainLayout";
import Link from "next/link";
import ConfirmPageContainer from "components/Accountant/confirm/ConfirmPageContainer";
function index() {
    return (
        <MainLayout>
            <ConfirmPageContainer />
        </MainLayout>
    );
}

export default index;