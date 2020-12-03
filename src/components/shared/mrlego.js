import React from "react";
import logo from "../../assets/lego-head.png";
import '../../App.css';

export default class MrLego extends React.Component {
  render() {
    return (
      <div className="mr-lego-container"><img className="mr-lego" src={logo} alt={"Mr Lego Narrator"}/></div>
    );
  }
}
