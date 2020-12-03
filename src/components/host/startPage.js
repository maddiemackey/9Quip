import React from "react";
import {
  Button
} from "reactstrap";
import '../../App.css';
import { GameState } from "../../utils/enum";
import firebase from "../../Firebase/firebase";
import Logo from "../shared/Logo";
import MrLego from "../shared/mrlego";

export default class StartPage extends React.Component {
  createGame = () => {
    const ref = firebase.database().ref("games");
    const gamecode = this.generateGamecode(4);
    ref.push({gamecode: gamecode, gamestate: GameState.joining});
  }

  render() {
    return (
      <div className="start-page">
        <div className="teamName">
        <div><Logo/></div>
        </div>
        <div className="startPrompt">
          <MrLego/>
          <div className="prompt">
            <Button onClick={this.props.createGame}>Click here to START</Button>
          </div>
        </div>
      </div>
    );
  }
}
