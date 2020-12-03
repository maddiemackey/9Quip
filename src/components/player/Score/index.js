import React, { useContext } from "react";

import "./index.css";

import { ClientGameContext } from "../GameContext";
import PlayerLegoHead from "../../shared/playerLegoHead";

// "borrowed" from the internet, don't ask what it does, this is a hackathon for god sakes!
function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

//WIP
// TODO: break out into it's own component
function Avatar({ iconName }) {
  return <PlayerLegoHead classThing={"user-avatar"} headName={iconName} />;
}

function Score() {
  const context = useContext(ClientGameContext);

  return (
    <div className="score-container">
      <div className="score-position-container">
        <div className="score-bubble">
          {context.playerPosition ? ordinal(context.playerPosition) : "?"}
        </div>
      </div>
      <div>
        <Avatar iconName={context.playerHead} />
      </div>
      <div>
        <span className="score-user-points">{context.playerScore} </span>pts
      </div>
    </div>
  );
}

export default Score;
