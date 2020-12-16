import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Form, Input } from "reactstrap";
import LegoSpeechBubble from "../LegoSpeechBubble";
import "./index.css";
import { ClientGameContext } from "../GameContext";

function Quipping() {
  const thing = useContext(ClientGameContext);
  let quipRef = useRef(null);
  const [prompts, setPrompts] = useState([]);
  const [promptIndex, changePromptIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (loading === true) {
      thing.getPrompts().then((res) => {
        if (res === null) {
          alert("Failed to get prompts, sorry :(");
        } else {
          setPrompts(res);
          setLoading(false);
        }
      });
    }
  }, [loading, prompts, thing]);

  const handleInputOnChange = (event) => {
    setAnswer(event.target.value);
  };

  const handleQuipSubmit = () => {
    if (!answer) {
      console.log("Must not submit blank quip!");
      return;
    }

    thing.submitQuip(prompts[promptIndex], answer, promptIndex).then((res) => {
      // console.log("PROMPT:", prompts[promptIndex]);

      // clear prompt
      setAnswer("");

      if (res === null) {
        console.log("Failed to submit quip, sorry :(");
      } else {
        console.log("Submitted quip");
        changePromptIndex(promptIndex + 1);
      }
    });
  };

  return (
    <div className="quipping-container">
      <div>
        {promptIndex < 2 && (
          <div>
            <div className="quipping-question-container">
              <LegoSpeechBubble
                bubbleText={!loading ? prompts[promptIndex] : "Loading..."}
              />
            </div>
            <div className="quipping-answer-container">
              <Form onSubmit={handleQuipSubmit}>
                <Input
                  className="quipping-answer-input"
                  placeholder="Enter quip here"
                  type="textarea"
                  value={answer}
                  onChange={handleInputOnChange}
                  innerRef={quipRef}
                  autoFocus={true}
                ></Input>
                <Button type="submit" className="quipping-answer-button">
                  Submit Answer
                </Button>
              </Form>
            </div>
          </div>
        )}
        {promptIndex >= 2 && (
          <div>
            <div className="quipping-question-container">
              <LegoSpeechBubble
                bubbleText={"Please wait while others finish quipping."}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Quipping;
