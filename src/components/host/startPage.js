import React from "react";
import {
  Button
} from "reactstrap";
import '../../App.css';
import Logo from "../shared/Logo";
import StartMrLego from "../shared/startMrLego";

export default class StartPage extends React.Component {

  render() {
    return (
      <div className="start-page">
        <div className="teamName">
        <div><Logo/></div>
        </div>
        <div className="startPrompt">
          <StartMrLego/>
          <div className="prompt">
            <Button onClick={this.props.createGame}>Click here to START</Button>
          </div>
        </div>
      </div>
    );
  }
}
