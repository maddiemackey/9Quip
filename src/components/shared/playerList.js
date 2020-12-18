import React from 'react';
import '../../App.css';
import firebase from '../../Firebase/firebase';
import 'firebase/database';
import PlayerSquare from './playerSquare';
// import _ from 'lodash';

export default class PlayerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { players: [], formattedPlayers: [] };
  }

  componentDidMount() {
    const refPlayers = firebase
      .database()
      .ref(`/games/${this.props.gameid}/players`);
    refPlayers.on('value', (snapshot) => {
      let playersArr = [];
      // let players = snapshot.val();
      // if (players) {
      //   let submittedQuipCount = 0;
      //   for (var property in players) {
      //     if (players.hasOwnProperty(property)) {
      //       if (this.props.showOnQuip) {
      //         console.log(
      //           'ALLQSUB:',
      //           players[property].allQuipsSubmitted[this.props.round]
      //         );

      //         if (players[property].allQuipsSubmitted[this.props.round]) {
      //           playersArr.push(players[property]);
      //           submittedQuipCount++;
      //         }
      //         console.log('SIZE:', _.size(players));
      //         console.log('sUBMITTED:', submittedQuipCount);
      //         console.log('WHAT:', submittedQuipCount === _.size(players));
      //         if (submittedQuipCount === _.size(players)) {
      //           this.props.onAllQuipsSubmitted();
      //         }
      //       } else {
      //         playersArr.push(players[property]);
      //       }
      //     }
      //   }
      // }
      this.setState({
        players: playersArr,
      });
      this.formatPlayers();
    });
  }

  formatPlayers() {
    let rowPlayers = [];
    this.setState({ formattedPlayers: [] });
    this.state.players.forEach((players, i) => {
      rowPlayers.push(players);
      if ((i + 1) % 5 === 0) {
        this.setState({
          formattedPlayers: [...this.state.formattedPlayers, rowPlayers],
        });
        rowPlayers = [];
      }
    });
    this.setState({
      formattedPlayers: [...this.state.formattedPlayers, rowPlayers],
    });
  }

  render() {
    return (
      <div>
        <div className="players">
          {this.state.players.length > 0 && (
            <div>
              <div
                className="playersHeader"
                style={{ display: 'flex', alignItems: 'center' }}
              >
                Players:
              </div>
              <div className="playersBox">
                <table>
                  <tbody>
                    {this.state.formattedPlayers.map((row, index) => (
                      <tr key={row[index]}>
                        {row.map((player, i) => (
                          <th key={`head-${i}`}>
                            <PlayerSquare
                              key={`player-${i}`}
                              icon={player.icon}
                              name={player.name}
                            />
                          </th>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {this.state.players.length === 0 && (
            <div
              style={{
                display: 'flex',
                height: '100%',
                marginTop: '25vh',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <h2 style={{ textAlign: 'center' }}>Waiting for players...</h2>
            </div>
          )}
        </div>
      </div>
    );
  }
}
