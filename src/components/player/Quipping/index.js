import React from "react";
import { Button, Input } from "reactstrap";
import LegoSpeechBubble from "../LegoSpeechBubble";
import "./index.css";

function Quipping() {
  return (
    <div className="quipping-container">
      <div className="quipping-question-container">
        <LegoSpeechBubble bubbleText="Why did Josh cross the river?" />
      </div>
      <div className="quipping-answer-container">
        <Input
          className="quipping-answer-input"
          placeholder="because there was a CEO that needed speaking to"
          type="textarea"
        ></Input>
        <Button className="quipping-answer-button">Submit Answer</Button>
      </div>
    </div>
  );
}

export default Quipping;
