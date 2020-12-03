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

  /** https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript */
  generateGamecode = (length) => {
    var result           = '';
    var characters       = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
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
            <Button onClick={this.createGame}>Click here to START</Button>
          </div>
        </div>
      </div>
    );
  }
}
