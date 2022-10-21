import React from "react";
import { useTranslation } from "react-i18next";

export default function GetStart({ type, close, bgImg, stepList = [] }) {
  const { t } = useTranslation("common");

  return (
    <div className="box-get-start">
      <div className="header">
        <div className="title">{t("GET STARTED")}</div>
        <div className="border-title-started"></div>
      </div>
      <div className="list-step">
        {stepList.map((step, index) => {
          return (
            <div className="step" key={index}>
              <img
                src={
                  step.status === "checked"
                    ? "/assets/img/icon-step-checked.svg"
                    : step.status === "locked"
                    ? "/assets/img/icon-step-locked.svg"
                    : "/assets/img/icon-step-current.svg"
                }
              ></img>
              {!step.isHideDashed && <div className="line-dashed" />}
              <div className="gt-step-content">
                <div className="name-step">{t(step.title)}</div>
                <div className="content-step">{t(step.desc)}</div>
              </div>
            </div>
          );
        })}
        {/* <div className="step">
          <img src="/assets/img/icon-step1.svg"></img>
          <div className="line-dashed"></div>
          <div className="name-step">1. Payment link created</div>
          <div className="content-step">Create a payment link instantly and notify your customer via sms or email.</div>
        </div>
        <div className="step">
          <img src="/assets/img/icon-step2.svg"></img>
          <div className="name-step">2. Receive Payments</div>
          <div className="content-step">Your customers can make domestic and international payments directly on the payment link.</div>
        </div> */}
      </div>

      <img src="/assets/img/icon-close-active.svg" className="icon-close" onClick={() => close()}></img>
    </div>
  );
}
