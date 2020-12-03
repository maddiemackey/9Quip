import React, { useContext, useRef } from "react";
import { Button, Input } from "reactstrap";
import LegoSpeechBubble from "../LegoSpeechBubble";
import "./index.css";
import { ClientGameContext } from "../GameContext";

function Quipping() {
  const thing = useContext(ClientGameContext);
  const quipRef = useRef(null);

  const handleQuipSubmit = () => {
    const quipInput = quipRef.current.value;

    if (!quipInput) {
      console.log("Must not submit blank quip!");
      return;
    }

    thing.submitQuip("Why did Josh cross the river?", quipInput).then((res) => {
      if (res === null) {
        alert("Failed i guess rip");
      } else {
        console.log("Submitted quip");
      }
    });

  };

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
          innerRef={quipRef}
        ></Input>
        <Button onClick={handleQuipSubmit} className="quipping-answer-button">Submit Answer</Button>
      </div>
    </div>
  );
}

export default Quipping;
