import React from "react";
import '../../App.css';
import Footer from "../footer";
//import firebase, { getDbData } from "../Firebase/firebase";

export default class JoiningPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "Host" };
  }

  render() {
    return (
      <div className="App-body">
        <div className="gameInfo">
          <div className="logo">LOGO</div>
          <div className="codePrompt">
            <div className="lego-head">This will be a head</div>
            <div className="code">42069</div>
          </div>
        </div>
        <div className="players">
          <div className="playersHeader">Players</div>
          <div className="playersBox">
            <ul>
              <li className="player">Ben</li>
              <li className="player">Maddie</li>
              <li className="player">Kory</li>
              <li className="player">Carlos</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
