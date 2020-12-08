import React from "react";
import '../../App.css';
import Timer from "../shared/timer";
import MaddiesLegoSpeechBubble from "../shared/MaddiesLegoSpeechBubble/index";
import PlayerList from "../shared/playerList";

export default class QuippingPage extends React.Component {
  render() {
    return (
      <div className="quipping-body">
      <div className="quipping-body-inner">
        <div className="gameInfo">
          <div><Timer seconds={6000} onTimerComplete={this.props.startVoting}/></div>
          <div style={{width: "100%"}}>
            <MaddiesLegoSpeechBubble bubbleText={"Answer the prompts on your phone!"} />
          </div>
        </div>
        <PlayerList gameid={this.props.gameid} showOnQuip={true} onAllQuipsSubmitted={this.props.startVoting}/>
        </div>
      </div>
    );
  }
}