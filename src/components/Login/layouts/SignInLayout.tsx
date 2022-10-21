import Footer from "../shared/Footer";
import Head from "next/head";
import Link from "next/link";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface SingInLayoutProps {
  app?: string;
}

const SignInLayout: React.FC<SingInLayoutProps> = ({ children, app }) => {
  const { t } = useTranslation("common");
  const appOrPos = useMemo(() => app, [app]);

  return (
    <div className="cls-container">
      <Head>
        <title>BO PayME</title>
      </Head>
      <div className="contain-wap">
        <div className="header">
          <div className="logo">
            <img src="/assets/images/logo-payme.svg" alt="" />
          </div>
        </div>
        <div className="card">
          <div className="card-body">{children}</div>
        </div>
      </div>
     
    </div>
  );
};

export default SignInLayout;
