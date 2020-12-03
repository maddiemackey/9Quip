import React from "react";
import "./index.css";

function Loading() {
  return (
    <div className="lds-ripple">
      <div></div>
      <div></div>
    </div>
  );
}

function LoadingScreen({ loadingText }) {
  return (
    <div className="loading-container">
      <div className="loading-container-item">
        <Loading />
      </div>
      <div className="loading-text loading-container-item">{loadingText}</div>
    </div>
  );
}

export default LoadingScreen;
