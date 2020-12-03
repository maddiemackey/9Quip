import React, { useContext } from "react";

import "./index.css";
import LegoHead from "../../../assets/lego-head.png";

import { ClientGameContext } from "../GameContext";

// "borrowed" from the internet, don't ask what it does, this is a hackathon for god sakes!
function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

//WIP
// TODO: break out into it's own component
function Avatar() {
  return <img className="user-avatar" alt="user avatar" src={LegoHead}></img>;
}

function Score() {
  return (
    <div className="score-container">
      <div className="score-position-container">
        {/* TOOD: replace with actual value */}
        <div className="score-bubble">{ordinal(10)}</div>
      </div>
      <div>
        <Avatar />
      </div>
      {/* TODO: replace with actual points */}
      <div>
        <span className="score-user-points">143 </span>pts
      </div>
      {/* </div> */}
    </div>
  );
}

export default Score;
