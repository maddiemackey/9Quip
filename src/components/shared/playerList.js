import React from "react";
import '../../App.css';
import firebase from "../../Firebase/firebase";
import PlayerSquare from "./playerSquare";
import _ from 'lodash';

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
          let submittedQuipCount = 0;
          for (var property in players) {
            if (players.hasOwnProperty(property)) {
              if(this.props.showOnQuip){
                players[property].allQuipsSubmitted && playersArr.push(players[property]);
                players[property].allQuipsSubmitted && submittedQuipCount++;
                if(submittedQuipCount === _.size(players)) {
                  this.props.onAllQuipsSubmitted();
                }
              } else {
                playersArr.push(players[property]);
              }
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
                <div className="playersHeader" style={{display: "flex", alignItems: "center"}}>Players:</div>
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