import React from "react";
import {
    Button
} from "reactstrap";
import '../App.css';

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App-footer">
        <p>Team Zoomer</p>
        <Button style={{marginLeft: "auto", minWidth: "10%"}}>Exit</Button>
      </div>
    );
  }
}
