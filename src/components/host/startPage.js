import React from "react";
import {
  Button
} from "reactstrap";
import '../../App.css';


export default class StartPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="start-page">
        <div className="teamName">
          <image src="" alt="logo"></image>
          <p>Team Zoomer</p>
        </div>
        <div className="startPrompt">
          <image src="" alt="lego-head"></image>
          <div className="prompt">
            <Button onClick={this.props.createGame}>Click here to START</Button>
          </div>
        </div>
      </div>
    );
  }
}
