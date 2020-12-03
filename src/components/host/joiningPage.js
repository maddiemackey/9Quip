import React from "react";
import '../../App.css';
import LogoWOTeam from "../shared/logowoteam";
import LegoSpeechBubble from "../../components/player/LegoSpeechBubble/index";

export default class JoiningPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { players: ["medi", "ben", "jojo", "carlos", "kory"] };
  }

  render() {
    return (
      <div className="joining-body">
        <div className="row">
        <div className="column">
        <div className="gameInfo">
          <div><LogoWOTeam/></div>
          <div className="codePrompt">
            <LegoSpeechBubble bubbleText={"Enter this code to join: " + this.props.gamecode} />
          </div>
        </div>
        </div>
        <div className="column">
        <div className="players">
          <div className="playersHeader">Players</div>
          <div className="playersBox">
            {this.state.players.join(" ")}
          </div>
        </div>
        </div>
        </div>
      </div>
    );
  }
}
