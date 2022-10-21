import React from "react";
import MainLayout from "layouts/MainLayout";
import ReportDetailTransacsionAcMc from "components/Account/ReportTransactionAccountMc/ReportDetailTransacsionAcMc";
import { useRouter } from "next/router";

function index() {

    const router = useRouter()
    return (
    <MainLayout>
        <ReportDetailTransacsionAcMc reportId={router.query.id} />
    </MainLayout>
);
}

export default index;