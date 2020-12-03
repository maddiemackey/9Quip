import React from "react";
import "./index.css";
import LoadingGif from "./loading.gif";

function LoadingScreen({ loadingText }) {
  return (
    <div className="loading-container">
      {/* TODO: replace with Lego design */}
      <img className="loading-container-item" alt="loading" src={LoadingGif} />
      <div className="loading-text loading-container-item">{loadingText}</div>
    </div>
  );
}

export default LoadingScreen;
