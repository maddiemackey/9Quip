import React from "react";
import '../../App.css';
//import firebase, { getDbData } from "../Firebase/firebase";

export default class VotingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "Host" };
  }

  render() {
    return (
      <div className="App-body">
        <div className="logo">logo</div>
        <div className="legoHead">lil head</div>
        <div className="prompt">What does Josh even do here?</div>
        <ol>
            <li className="quip">Nothing</li>
            <li className="quip">Nothing</li>
            <li className="quip">Nothing</li>
            <li className="quip">Nothing</li>
            <li className="quip">Nothing</li>
        </ol>
      </div>
    );
  }
}