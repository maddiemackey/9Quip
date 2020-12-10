import React, { useContext, useEffect, useState } from "react";
import LegoSpeechBubble from "../LegoSpeechBubble";
import "./index.css";
import { ClientGameContext } from "../GameContext";

function Option({ text, colour, onClick }) {
  return (
    <div className="voting-option" onClick={onClick}>
      <div
        style={{
          backgroundColor: colour,
        }}
        className="voting-option-colour"
      ></div>
      <div className="voting-option-text">{text}</div>
    </div>
  );
}

function getColour(index) {
  switch (index) {
    case 0:
      return "#D22C25";
    case 1:
      return "#0085CD";
    case 2:
      return "#1FC02C";
    case 3:
      return "#FFF200";
    case 4:
      return "#BD008B";
    default: {
      console.log("Unknown index only meant to be 5 ");
      return "black";
    }
  }
}

function Voting() {
  const thing = useContext(ClientGameContext);
  const [quips, setQuips] = useState([]);
  const [voted, setVoted] = useState(false);
  const [speech, updateSpeechBubble] = useState("Loading...");

  useEffect(() => {
    console.log("use effect");
    setVoted(false);
    thing.getQuipsForPrompt().then((resQ) => {
      if (resQ === null) {
        alert("Failed to see voting, sorry :(");
      } else {
        setQuips(resQ);
        updateSpeechBubble(whatToSay(resQ));
        console.log("resQ:", resQ);
      }
    });
    // eslint-disable-next-line
  }, [thing.voteState]);

  function whatToSay(resQ) {
    console.log("QUIPS:", resQ.length);
    if (resQ.length === 0) {
      return "Hahaha!";
    } else if (!voted) {
      return thing.voteState;
    }
    return "You're so funny you broke me!";
  }

  return (
    <div className="voting-container">
      <div className="voting-speech-bubble">
        {/* TODO: replace with quip from gamestate  */}
        <LegoSpeechBubble bubbleText={speech}></LegoSpeechBubble>
      </div>
      {!voted && (
        <div className="voting-options-container">
          {quips &&
            quips.map((quip, i) => {
              return (
                <Option
                  text={quip.quip}
                  colour={getColour(i)}
                  onClick={() => {
                    thing.vote(quip.path);
                    setVoted(true);
                    updateSpeechBubble("Please wait while others vote.");
                  }}
                />
              );
            })}
        </div>
      )}
    </div>
  );
}

export default Voting;
