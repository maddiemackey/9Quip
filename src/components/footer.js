import React from "react";
import {
    Button
} from "reactstrap";
import '../App.css';
import Team from "./shared/team";

export default class Footer extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <div className="App-footer">
        <Team/>
        <Button style={{marginLeft: "auto", minWidth: "10%"}}>Exit</Button>
      </div>
    );
  }
}
