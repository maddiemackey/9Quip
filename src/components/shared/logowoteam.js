import React from "react";
import logo from "../../assets/logo-transparent-no-zoomer.png";
import '../../App.css';

export default class LogoWOTeam extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="logo-no-zoomer-container"><img className="logo-no-zoomer" src={logo} alt={"9Quip Logo Team Zoomer"}/></div>
    );
  }
}
