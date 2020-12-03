import React from "react";
import '../App.css';

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App-body">
        <p>Team Zoomer</p>
        <button><i class="fas fa-sign-out-alt"></i></button>
      </div>
    );
  }
}
