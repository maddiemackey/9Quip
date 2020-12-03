import React from "react";
import {
  Button
} from "reactstrap";
import '../../App.css';
import { GameState } from "../../utils/enum";
import firebase from "../../Firebase/firebase";
import assignQuips from "../../utils/assignQuips";

export default class StartPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      text: "Host"
    };
  }

  createGame = () => {
    const ref = firebase.database().ref("games");
    const gamecode = this.generateGamecode(4);
    ref.push({gamecode: gamecode, gamestate: GameState.joining});
  }

  render() {
    return (
      <div className="start-page">
        <div className="teamName">
          <img src="" alt="logo"></img>
          <p>Team Zoomer</p>
        </div>
        <div className="startPrompt">
          <img src="" alt="lego-head"></img>
          <div className="prompt">
            <Button onClick={this.props.createGame}>Click here to START</Button>
          </div>
        </div>
      </div>
    );
  }
}
