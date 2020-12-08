import React, { useContext } from "react";
import "../App.css";
import { GameState } from "../utils/enum";
import { ClientGameContext } from "./player/GameContext";
import Logo from "./shared/Logo";
import PlayerLegoHead from "./shared/playerLegoHead";

export default function Header() {
  const context = useContext(ClientGameContext);

  return (
    <div className="App-header">
      <Logo style={{paddingLeft: "10%"}}/>
      <div className="App-header-playerhead-container">
        {context.playerHead &&
          context.mainGameState !== GameState.SCOREBOARD && (
            <PlayerLegoHead
              headName={context.playerHead}
              playerName={"Joseph"}
              classThing={"header-player-head"}
            />
          )}
      </div>
    </div>
  );
}
