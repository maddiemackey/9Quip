import React from "react";
import '../../App.css';
//import firebase, { getDbData } from "../Firebase/firebase";

export default class ScorePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "Host" };
  }

  render() {
    return (
      <div className="App-body">
        <div className="logo">logo</div>
        <div className="top5">
            <ol>
                <li className="leader">1st</li>
                <li>2nd</li>
                <li>3rd</li>
                <li>4th</li>
                <li>5th</li>
            </ol>
        </div>
        <div className="otherPlayers">
            <ol>
                <li>Player 6</li>
                <li>Player 7</li>
                <li>Player 8</li>
                <li>Player 9</li>
            </ol>
        </div>
      </div>
    );
  }
}