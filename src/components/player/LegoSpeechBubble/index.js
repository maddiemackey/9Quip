import React from "react";
import "./index.css";
import mrlego from "../../../assets/lego-head.png";

function LegoSpeechBubble({ bubbleText }) {
  return (
    <div className="lego-speech-bubble-container">
      <img
        alt="mr lego"
        className="lego-speech-bubble-mr-lego"
        src={mrlego}
      ></img>
      <div className="speech-bubble">{bubbleText}</div>
    </div>
  );
}

export default LegoSpeechBubble;
