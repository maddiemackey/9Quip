import React from "react";
import volumeHigh from "../../assets/volume-high.svg";
import volumeMute from "../../assets/volume-mute.svg";

export default class AudioIcon extends React.Component {
  render() {
    return (
      <div>
        {this.props.gameState && (
          <img
            style={{
              width: "auto",
              height: "6vh",
              position: "absolute",
              top: "1%",
              right: "1%",
            }}
            src={this.props.muted ? volumeMute : volumeHigh}
            alt="Mute toggle"
            onClick={this.props.toggleAudio}
          />
        )}
      </div>
    );
  }
}
