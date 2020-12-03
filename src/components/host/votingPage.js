import React from "react";
import '../../App.css';
import MaddiesLegoSpeechBubble from "../shared/MaddiesLegoSpeechBubble";

export default class VotingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {quips: ["nothing", "idk idc", "honest work", "best programming this side of the murray darling"]}
  }

  render() {
    return (
      <div className="App-body">
        <MaddiesLegoSpeechBubble bubbleText={"What does Josh even do here?"}/>
        <ol>
        {this.state.quips.map(quip => (
            <li>{quip}</li>
          ))}
        </ol>
      </div>
    );
  }
}