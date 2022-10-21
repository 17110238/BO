import React from "react";

interface LoadingFullScreenProps {
  styles?: any
}

function LoadingFullScreen({ styles }: LoadingFullScreenProps) {
  return (
    <div id="idLoading" style={styles}>
      <div className="atbd-spin-dots spin-lg">
        <span className="spin-dot badge-dot dot-primary"></span>
        <span className="spin-dot badge-dot dot-primary"></span>
        <span className="spin-dot badge-dot dot-primary"></span>
        <span className="spin-dot badge-dot dot-primary"></span>
      </div>
    </div>
  );
}

export default LoadingFullScreen;
