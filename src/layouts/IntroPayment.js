import React from "react";

export default function IntroPayment({ title, desc, bgImg, question, introQuestList = [], toggleIntroduce }) {
  return (
    <div className="box-introduce">
      <div className="box-introduce__top">
        <div className="row">
          <div className="col-xl-6 img-intro">
            <img src={`/assets/img/${bgImg}`}></img>
          </div>
          <div className="content-intro col-xl-6">
            <div className="title">{title}</div>
            <div className="content">{desc}</div>
            <button className="btn btn-success" onClick={() => toggleIntroduce()}>
              Get Started
            </button>
          </div>
        </div>
      </div>
      <div className="box-introduce__bottom">
        <div className="d-flex justify-content-between header">
          <div className="title-header">{question}</div>
          <div className="d-flex align-items-center">
            <div className="document">Need help ?</div>
            <i className="fas fa-circle m"></i>
            <div className="document">Documentation</div>
          </div>
        </div>

        <div className="row list-function">
          {introQuestList.map((intro) => {
            return (
              <div className="col-md-4 item">
                <img src={`/assets/img/${intro.img}`}></img>
                <div className="title">{intro.title}</div>
                <div className="content">{intro.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="box-introduce__skip">
        <div onClick={toggleIntroduce}>Skips and get started</div>
      </div>
    </div>
  );
}
