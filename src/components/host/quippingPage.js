import React from "react";
import '../../App.css';
import Timer from "../shared/timer";
import MaddiesLegoSpeechBubble from "../shared/MaddiesLegoSpeechBubble/index";

export default class QuippingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { players: ["medi", "ben", "jojo", "carlos", "kory"] };
  }

  render() {
    return (
      <div className="quipping-body">
        <div className="gameInfo">
          <div><Timer minutes={10} seconds={0} onTimerComplete={this.props.startVoting}/></div>
          <div style={{width: "100%"}}>
            <MaddiesLegoSpeechBubble bubbleText={"Answer the prompts on your phone!"} />
          </div>
        </div>

        <div className="players">
          <div className="playersHeader">Players</div>
          <div className="playersBox">
            {this.state.players.join(" ")}
          </div>
        </div>
      </div>
    );
  }
}