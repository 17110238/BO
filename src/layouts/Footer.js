import React from "react";
import { useTranslation } from "react-i18next";
export default function Footer() {
  const { t } = useTranslation('common');
  return (
    <div className="footer">
      <div className="left">
        {t("Powered by")}
        <img src="/assets/img/icon-logo-payme.svg" className="ml-1"></img>
      </div>
      <div className="right">
        {t("Bảo mật với chứng chỉ")}
        <img src="/assets/img/icon-compliant.svg" className="mx-1"></img>
      </div>
    </div>
  );
}
