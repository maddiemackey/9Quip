import React, { useContext } from "react";
import "../App.css";
import { GameState } from "../utils/enum";
import { ClientGameContext } from "./player/GameContext";
import Logo from "./shared/Logo";
import PlayerLegoHead from "./shared/playerLegoHead";
import { useHistory } from "react-router-dom";

export default function Header() {
  const context = useContext(ClientGameContext);
  const history = useHistory();

  function handleClick() {
    history.push("/");
  }

  return (
    <div className="App-header">
      <Logo
        onClick={handleClick}
        style={{ paddingLeft: "10%", zIndex: "10" }}
      />
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
