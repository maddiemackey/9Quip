import React from "react";
import "./index.css";
import mrlego from "../../../assets/lego-head.png";

export default class RightLegoSpeechBubble extends React.Component {
  render() {
    return (
      <div className="lego-speech-bubble-container-right">
        <div className="speech-bubble-right">{this.props.bubbleText}</div>
        <img
          alt="mr lego"
          className="lego-speech-bubble-mr-lego-right"
          src={mrlego}
        ></img>
      </div>
    );
  }
}
