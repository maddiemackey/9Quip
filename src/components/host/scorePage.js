import React from "react";
import '../../App.css';
//import firebase, { getDbData } from "../Firebase/firebase";

export default class ScorePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {topfive: ["carlosss", "medi", "benny boi", "idk some random"], everyoneelse: ["losers: jojo"]}
  }

  render() {
    return (
      <div className="App-body">
        <div className="top5">
            {this.state.topfive.map(player => (
              <div style={{paddingRight: "5vw"}}>{player}</div>
            ))}
        </div>
        <div className="otherPlayers">
            <ol>
            {this.state.everyoneelse.map(player => (
              <ul>{player}</ul>
            ))}
            </ol>
        </div>
      </div>
    );
  }
}