import React from "react";
import LegoSpeechBubble from "../LegoSpeechBubble";
import "./index.css";

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

function Voting({ options }) {
  return (
    <div className="voting-container">
      <div className="voting-speech-bubble">
        {/* TODO: replace with quip from gamestate  */}
        <LegoSpeechBubble bubbleText="Who is Mister Lego?"></LegoSpeechBubble>
      </div>
      <div className="voting-options-container">
        {options.map((option, i) => {
          return <Option text={option.answer} colour={getColour(i)} />;
        })}
      </div>
    </div>
  );
}

export default Voting;
