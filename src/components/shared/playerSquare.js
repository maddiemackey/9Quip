import React from "react";
import "../../App.css";
import PlayerLegoHead from "./playerLegoHead";

export default class PlayerSquare extends React.Component {
  render() {
    return (
      <div className="playerSquare">
        <PlayerLegoHead
          headName={this.props.icon}
          playerName={this.props.name}
          classThing={"playerLegoHeadImgmed"}
        />
        <div className="playerText">{this.props.name}</div>
      </div>
    );
  }
}
