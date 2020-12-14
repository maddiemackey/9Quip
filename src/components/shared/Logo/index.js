import React from "react";
import "./index.css";
import logo from "../../../assets/logo-transparent.png";

export default class Logo extends React.Component {
  render() {
    return (
      <div className="logo-container">
        <a style={{zIndex: "10"}} href="/">
          <img
            className="logo"
            src={logo}
            style={this.props.style}
            alt={"9Quip Logo Team Zoomer"}
          />
        </a>
      </div>
    );
  }
}
