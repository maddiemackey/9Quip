import React from "react";
import { Button } from "reactstrap";
import '../../App.css';
import LogoWOTeam from "../shared/logowoteam";
import PlayerList from "../shared/playerList";
import MaddiesLegoSpeechBubble from "../shared/MaddiesLegoSpeechBubble/index";

export default class JoiningPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="joining-body">
        <div className="gameInfo">
          <div><LogoWOTeam/></div>
            <div style={{width: "100%"}}>
          <MaddiesLegoSpeechBubble bubbleText={"Enter this code to join: " + this.props.gamecode} />
          </div>
          <Button style={{justifySelf: "flex-end", maxWidth: "30%", fontSize: "100%", marginTop: "3%"}} onClick={this.props.startGame}>Start Game</Button>
        </div>
        <div style={{display: "flex", flexDirection: "column", width: "40%", height: "80vh"}}>
          <PlayerList gameid={this.props.gameid}/>
          <div style={{display: "flex", justifyContent: "center", alignItems: "flex-end"}}>
          </div>
        </div>
      </div>
    );
  }
}
