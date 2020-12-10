import React from "react";
import logo from "../../assets/lego-head.png";
import "../../App.css";

export default class StartMrLego extends React.Component {
  render() {
    return (
      <div className="start-mr-lego-container">
        <img className="start-mr-lego" src={logo} alt={"Mr Lego Narrator"} />
      </div>
    );
  }
}
