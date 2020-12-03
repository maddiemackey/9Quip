import React from "react";
import '../../App.css';

export default class playerLegoHead extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="playerLegoHead"><img className="playerLegoHeadImg" src={`../../assets/lego-heads/${this.props.headName}.png`} alt={`${this.props.playerName} Head`}/></div>
    );
  }
}
