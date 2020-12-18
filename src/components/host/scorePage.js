import React from 'react';
import '../../App.css';
import { Button, Table } from 'reactstrap';
import firebase from '../../Firebase/firebase';
import 'firebase/database';
import PlayerLegoHead from '../shared/playerLegoHead';
import { ordinal } from '../../utils/ordinal';

export default class ScorePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { playerList: [], viewingTimeout: null };
  }

  componentDidMount() {
    const refPlayers = firebase
      .database()
      .ref(`games/${this.props.gameId}/players`);
    refPlayers.once('value', (snapshot) => {
      let playerData = snapshot.val();
      if (playerData) {
        const entries = Object.entries(playerData);
        let playerList = [...entries].sort((a, b) => {
          return b[1].score - a[1].score;
        });
        this.setState({
          playerList,
        });
      }
    });
    if (!this.props.gameEnded) {
      this.setState({
        viewingTimeout: setTimeout(() => {
          this.props.nextRound();
        }, 10000),
      });
    }
  }

  componentWillUnmount() {
    if (this.state.viewingTimeout) {
      clearTimeout(this.state.viewingTimeout);
    }
  }

  render() {
    const { playerList } = this.state;
    return (
      <div className="scoreboard-body">
        {!this.props.gameEnded && <h3>Points so far...</h3>}
        {this.props.gameEnded && <h3>Game Over</h3>}
        <Table id="table" className="scoreboard-table">
          <thead>
            <tr className="scoreboard-top-five">
              {playerList &&
                playerList.map((player, index) => {
                  if (index === 0) {
                    return (
                      <th className="scoreboard-player-first">
                        <div style={{ justifyContent: 'flex-start' }}>
                          {ordinal(index)}
                        </div>
                        <div>
                          <PlayerLegoHead
                            key={`legohead-${index}`}
                            headName={player[1].icon}
                            playerName={player[1].name}
                            classThing={'playerLegoHeadImglrg'}
                          />
                          <div className="name">{player[1].name}</div>
                          <div className="score">{player[1].score}</div>
                        </div>
                      </th>
                    );
                  } else if (index <= 4) {
                    return (
                      <th className="scoreboard-player-top-row">
                        <div style={{ justifyContent: 'flex-start' }}>
                          {ordinal(index)}
                        </div>
                        <div>
                          <PlayerLegoHead
                            key={`legohead-${index}`}
                            headName={player[1].icon}
                            playerName={player[1].name}
                            classThing={'playerLegoHeadImgmed'}
                          />
                          <div className="name">{player[1].name}</div>
                          <div className="score">{player[1].score}</div>
                        </div>
                      </th>
                    );
                  } else {
                    return <div></div>;
                  }
                })}
            </tr>
          </thead>
          {playerList.length > 5 && (
            <tbody>
              {
                <tr className="scoreboard-everyone-else-row">
                  {playerList &&
                    playerList.map((player, index) => {
                      if (index > 4) {
                        return (
                          <td className="scoreboard-everyone-else">
                            <div style={{ justifyContent: 'flex-start' }}>
                              {ordinal(index)}
                            </div>
                            <PlayerLegoHead
                              key={`legohead-${index}`}
                              headName={player[1].icon}
                              playerName={player[1].name}
                              classThing={'playerLegoHeadImgsml'}
                            />
                            <div className="name">{player[1].name}</div>
                            <div className="score">{player[1].score}</div>
                          </td>
                        );
                      } else {
                        return <div></div>;
                      }
                    })}
                </tr>
              }
            </tbody>
          )}
        </Table>
        {!this.props.gameEnded && (
          <h4>Get ready for round {this.props.round + 1}</h4>
        )}
        {this.props.gameEnded && (
          <Button
            onClick={this.props.endGame}
            style={{ maxHeight: '9vh', fontSize: '50%' }}
            color="primary"
          >
            END GAME
          </Button>
        )}
      </div>
    );
  }
}
