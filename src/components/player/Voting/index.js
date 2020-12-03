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
      return "red";
    case 1:
      return "blue";
    case 2:
      return "green";
    case 3:
      return "purple";
    case 4:
      return "yellow";
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


  useEffect(() => {
    setVoted(false);
    thing.getQuipsForPrompt().then((resQ) => {
      if (resQ === null) {
        alert("Failed to see voting, sorry :(");
      } else {
        setQuips(resQ);
      }
    });
  }, [thing.voteState]);

  return (
    <div className="voting-container">
      <div className="voting-speech-bubble">
        {/* TODO: replace with quip from gamestate  */}
        <LegoSpeechBubble bubbleText={!voted ? thing.voteState : "Please wait while others vote"}></LegoSpeechBubble>
      </div>
      {!voted && (
      <div className="voting-options-container">
        {quips && quips.map((quip, i) => {
          return <Option text={quip.quip} colour={getColour(i)} onClick={() => {thing.vote(quip.path); setVoted(true);}}/>;
        })}
      </div>
      )}
    </div>
  );
}

export default Voting;
