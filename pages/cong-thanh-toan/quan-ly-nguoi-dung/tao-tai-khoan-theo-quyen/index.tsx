import React from "react";
import MainLayout from "layouts/MainLayout";
import UserContainer from "components/User/UserContainer";
import Link from "next/link";
import CreateUser from 'components/User/CreateUserScope'
function index() {
  return (
    <MainLayout>
      <CreateUser />
    </MainLayout>
  );
}

export default index;