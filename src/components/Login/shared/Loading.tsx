import React from "react";

const styles = {
  overlay: {
    position: "fixed",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    top: 0,
    left: 0,
    zIndex: 100,
  },
  nonOverlay: {},
};

interface LoadingProps {
  isLoading?: boolean;
  isOverlay?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ isLoading, isOverlay }) => {
  return isLoading ? (
    <div
      className="loading-overlay d-flex align-items-center justify-content-center"
      style={isOverlay ? styles.overlay : styles.nonOverlay}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        style={{
          margin: "auto",
          background: "transparent",
          display: "block",
          shapeRendering: "auto",
        }}
        width="80px"
        height="80px"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <circle
          cx={50}
          cy={50}
          r={32}
          strokeWidth={8}
          stroke="#00be00"
          strokeDasharray="50.26548245743669 50.26548245743669"
          fill="none"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="1s"
            repeatCount="indefinite"
            keyTimes="0;1"
            values="0 50 50;360 50 50"
          />
        </circle>
        <circle
          cx={50}
          cy={50}
          r={23}
          strokeWidth={8}
          stroke="#90e390"
          strokeDasharray="36.12831551628262 36.12831551628262"
          strokeDashoffset="36.12831551628262"
          fill="none"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="1s"
            repeatCount="indefinite"
            keyTimes="0;1"
            values="0 50 50;-360 50 50"
          />
        </circle>
      </svg>
    </div>
  ) : (
    <></>
  );
};

export default Loading;
