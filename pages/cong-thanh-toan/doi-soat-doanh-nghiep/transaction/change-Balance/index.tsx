
import React from "react";
import MainLayout from "layouts/MainLayout";
import Link from "next/link";
import ChangeAccountBalance from "components/Accountant/ChangeAccountBalance/ChangeAccountBalance";
function index() {
    return (
        <MainLayout>
            <ChangeAccountBalance />
        </MainLayout>
    );
}

export default index;