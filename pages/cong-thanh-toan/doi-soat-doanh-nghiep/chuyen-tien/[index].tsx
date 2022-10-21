import React from "react";
import MainLayout from "layouts/MainLayout";
import Link from "next/link";
import DespositPageContainer from "components/Accountant/deposit/DespositPageContainer";
function index() {
    return (
        <MainLayout>
            <DespositPageContainer />
        </MainLayout>
    );
}

export default index;