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
      <div className="App-body">
        <p>Team Zoomer</p>
        <Button>Exit</Button>
      </div>
    );
  }
}
