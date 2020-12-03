import React from "react";
import '../../App.css';
//import firebase, { getDbData } from "../Firebase/firebase";

export default class QuippingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "Host" };
  }

  render() {
    return (
      <div className="App-body">
        <div className="logo">Ha Another Logo</div>
        <div className="players">
            <ul>
                <li className="player">Josh</li>
                <li className="player">Josh</li>
                <li className="player">Josh</li>
                <li className="player">Josh</li>
            </ul>
        </div>
        <div className="gameInfo">
            <div className="timer">4:20</div>
            <div className="promptSection">
                <div className="prompt">Answer the prompts on your device :p</div>
                <div className="legoHead">Head of Lego</div>
            </div>
        </div>
      </div>
    );
  }
}