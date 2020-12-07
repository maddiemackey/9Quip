import React from "react";
import '../../App.css';
import firebase from "../../Firebase/firebase";
import PlayerSquare from "./playerSquare";

export default class PlayerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {players: []};
  }

  componentDidMount() {
    const refPlayers = firebase.database().ref(`/games/${this.props.gameid}/players`);
    refPlayers.on("value", snapshot => {
        let playersArr = [];
        let players = snapshot.val();
        if (players) {
          for (var property in players) {
            if (players.hasOwnProperty(property)) {
              playersArr.push(players[property]);
            }
          }
        }
        this.setState({
            players: playersArr
        });
    });
  }

  render() {
    return (
        <div className="players">
            {this.state.players.length > 0 && (
            <div>
                <div className="playersHeader" style={{display: "flex", alignItems: "center"}}>Players</div>
                <div className="playersBox">
                {this.state.players.map((player, i) =>
                  <PlayerSquare key={i} icon={player.icon} name={player.name}/>
                )}
                </div>
            </div>
            )}
        </div>
    );
  }
}