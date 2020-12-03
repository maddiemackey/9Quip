import React from "react";
import '../App.css';
import Logo from "./shared/Logo";

export default class Header extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <div className="App-header">
        <Logo/>
      </div>
    );
  }
}
