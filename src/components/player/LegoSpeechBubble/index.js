import React from "react";
import "./index.css";

function LegoSpeechBubble({ bubbleText }) {
  return (
    <div className="lego-speech-bubble-container">
      <img
        alt="mr lego"
        className="lego-speech-bubble-mr-lego"
        src="https://www.fillmurray.com/100/100"
      ></img>
      <div className="speech-bubble">{bubbleText}</div>
    </div>
  );
}

export default LegoSpeechBubble;
