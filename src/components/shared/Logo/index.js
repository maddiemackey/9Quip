import React from "react";
import "./index.css";
import logo from "../../../assets/logo-transparent.png";

export default class Logo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="logo-container"><img className="logo" src={logo} alt={"9Quip Logo Team Zoomer"}/></div>
    );
  }
}
