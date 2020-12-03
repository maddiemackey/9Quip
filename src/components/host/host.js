import React from "react";
import '../../App.css';
//import firebase, { getDbData } from "../Firebase/firebase";

export default class Host extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "Host" };
  }

  render() {
    return <div className="App-body">{this.state.text}</div>;
  }
}
