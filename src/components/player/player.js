import React from "react";
import "../../App.css";
import Footer from "../footer";
import JoinGame from "./JoinGame";
import Loading from "./Loading";
import Quipping from "./Quipping";
import Voting from "./Voting";
//import firebase, { getDbData } from "../Firebase/firebase";

export default class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "Player" };
  }

  render() {
    return (
      <div>
        <div className="player-body">
          <Voting />
          {/* <Quipping></Quipping> */}
          {/* <JoinGame></JoinGame> */}
          {/* <Loading loadingText="Waiting on Players"></Loading> */}
        </div>
        <Footer />
      </div>
    );
  }
}
