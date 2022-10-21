import React from "react";

export default function IntroduceAnalytic({ close }) {
  return (
    <div className="box-intro-analytic">
      <img src="/assets/img/img-intro-analytic.png" className="logo-intro"></img>
      <div className="title-intro-analytic">Introducing Analytics Pixel</div>
      <div className="content-analytic">
        <div className="content">You can now use the Facebook & Google Analytics pixel to track your visitors' actions.</div>
        <div className="learn-more">Learnmore</div>
      </div>
      <img src="/assets/img/icon-close.svg" className="icon-close" onClick={() => close()}></img>
    </div>
  );
}
