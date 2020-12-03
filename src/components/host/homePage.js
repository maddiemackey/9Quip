import React from "react";
import '../../App.css';
import Footer from "../footer";
//import firebase, { getDbData } from "../Firebase/firebase";

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "Host" };
  }

  render() {
    return (
      <div className="App-body">
        <div className="teamName">
          <image src="" alt="logo"></image>
          <p>Team Zoomer</p>
        </div>
        <div className="startPrompt">
          <image src="" alt="lego-head"></image>
          <div className="prompt">
            <p>Press Enter to START</p>
          </div>
        </div>
        <Footer></Footer>
      </div>
    );
  }
}
