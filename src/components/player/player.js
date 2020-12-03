import React from "react";
import "../../App.css";
import JoinGame from "./JoinGame";
import Loading from "./Loading";
//import firebase, { getDbData } from "../Firebase/firebase";

export default class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "Player" };
  }

  render() {
    return (
      <div className="App-body">
        {/* <JoinGame></JoinGame> */}
        <Loading loadingText="Waiting on Players"></Loading>
      </div>
    );
  }
}
