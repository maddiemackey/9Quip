import React from "react";
import '../../App.css';
//import firebase, { getDbData } from "../Firebase/firebase";

export default class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "Player" };
  }

  render() {
    return <div className="App-body">{this.state.text}</div>;
  }
}
