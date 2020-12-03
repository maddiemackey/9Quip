import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Input } from "reactstrap";
import LegoSpeechBubble from "../LegoSpeechBubble";
import "./index.css";
import { ClientGameContext } from "../GameContext";

function Quipping() {
  const thing = useContext(ClientGameContext);
  let quipRef = useRef(null);
  const [prompts, setPrompts] = useState([]);
  const [promptIndex, changePromptIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(loading === true){
      console.log("Do the thing xuli");
        thing.getPrompts().then((res) => {
          if (res === null) {
            alert("Failed to get prompts, sorry :(");
          } else {
            setPrompts(res);
            setLoading(false);
            console.log("Received prompts", res);
          }
        });
    }
  }, [loading, prompts]);

  const handleQuipSubmit = () => {
    const quipInput = quipRef.current.value;

    if (!quipInput) {
      console.log("Must not submit blank quip!");
      return;
    }

    thing.submitQuip(prompts[promptIndex], quipInput, promptIndex).then((res) => {
       console.log("PROMPT:", prompts[promptIndex]);
      if (res === null) {
        console.log("Failed to submit quip, sorry :(");
      } else {
        console.log("Submitted quip");
        changePromptIndex(promptIndex+1);
      }
    });

  };

  return (
    <div className="quipping-container">
      <div>
        {promptIndex < 2 && (
        <div>
          <div className="quipping-question-container">
            <LegoSpeechBubble bubbleText={!loading ? prompts[promptIndex] : "Loading..."} />
          </div>
          <div className="quipping-answer-container">
            <Input
              className="quipping-answer-input"
              placeholder="Enter quip here"
              type="textarea"
              innerRef={quipRef}
            ></Input>
            <Button onClick={handleQuipSubmit} className="quipping-answer-button">Submit Answer</Button>
          </div>
        </div>
        )}
        {promptIndex >= 2 && (
        <div>
          <div className="quipping-question-container">
            <LegoSpeechBubble bubbleText={"Please wait while others finish quipping."} />
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default Quipping;
