import React from "react";
import '../../App.css';
import {
  Button
} from "reactstrap";
import LogoWOTeam from "../shared/logowoteam";
import MaddiesLegoSpeechBubble from "../shared/MaddiesLegoSpeechBubble/index";

export default class JoiningPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { players: ["medi", "ben", "jojo", "carlos", "kory"] };
  }

  render() {
    return (
      <div className="joining-body">
        <div className="gameInfo">
          <div><LogoWOTeam/></div>
          <div className="codePrompt">
          <MaddiesLegoSpeechBubble bubbleText={"Enter this code to join: " + this.props.gamecode} />
          </div>
        </div>
        <div className="players">
          <div className="playersHeader">Players</div>
          <div className="playersBox">
            {this.state.players.join(" ")}
          </div>
        </div>
        <Button onClick={this.props.startGame}>Start Game</Button>
      </div>
    );
  }
}
