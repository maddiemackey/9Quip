import React from "react";
import "./index.css";
import mrlego from "../../../assets/lego-head.png";

export default class MaddiesLegoSpeechBubble extends React.Component {
  render() {
    return (
      <div className="lego-speech-bubble-container">
        <img
          alt="mr lego"
          className="lego-speech-bubble-mr-lego-maddie"
          src={mrlego}
        ></img>
        <div className="speech-bubble">{this.props.bubbleText}</div>
      </div>
    );
  }
}
