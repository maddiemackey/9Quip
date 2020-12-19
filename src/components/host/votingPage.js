import React from 'react';
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap';
import '../../App.css';
import MaddiesLegoSpeechBubble from '../shared/MaddiesLegoSpeechBubble';
import PlayerLegoHead from '../shared/playerLegoHead';
import firebase from '../../Firebase/firebase';
import 'firebase/database';
import Timer from '../shared/timer';
import calculatePoints from '../../utils/points';

let colours = {
  0: '#D22C25',
  1: '#0085CD',
  2: '#1FC02C',
  3: '#FFF200',
  4: '#BD008B',
};
export default class VotingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roundData: {},
      playerData: {},
      promptNumber: 0,
      votingMode: 'VOTING',
      seconds: 15,
      pointsToAssign: {},
      viewingTimeout: null,
    };
  }

  componentDidMount() {
    this.setupVotingData();
  }

  async setupVotingData() {
    return new Promise((res, rej) => {
      const refRounds = firebase
        .database()
        .ref(`games/${this.props.gameId}/rounds`);
      refRounds.on('value', (snapshot) => {
        let roundData = snapshot.val();
        if (roundData) {
          this.setState({
            roundData: roundData,
          });
          return res(roundData);
        }
      });
    }).then((roundData) => {
      // Set prompt number based on current vote if page reloaded
      const currentRef = firebase
        .database()
        .ref(`games/${this.props.gameId}/currentVote`);
      currentRef.once('value', (snapshot) => {
        const currentVote = snapshot.val();
        if (currentVote) {
          const actualRoundData =
            roundData[0].promptsReturned[this.props.round];

          actualRoundData.forEach((round) => {
            if (round.prompt === currentVote) {
              this.setState({
                promptNumber: actualRoundData.indexOf(round),
              });
              return;
            }
          });
          const ref = firebase.database().ref(`games/${this.props.gameId}`);
          ref.update({
            currentVote:
              roundData[0].promptsReturned[this.props.round][0].prompt,
          });
        } else {
          const ref = firebase.database().ref(`games/${this.props.gameId}`);
          ref.update({
            currentVote:
              roundData[0].promptsReturned[this.props.round][0].prompt,
          });
        }
      });
    });
  }

  startVoting = () => {
    const { roundData, promptNumber } = this.state;
    const refPlayers = firebase
      .database()
      .ref(`games/${this.props.gameId}/players`);
    refPlayers.once('value', (snapshot) => {
      let playerData = snapshot.val();
      if (playerData) {
        const pointsToAssign = calculatePoints(
          playerData,
          roundData[0].promptsReturned[this.props.round][promptNumber]
        );
        Object.keys(pointsToAssign).forEach((playerID) => {
          if (playerData[playerID]) {
            let newScore =
              playerData[playerID].score + pointsToAssign[playerID];
            const refPlayer = firebase
              .database()
              .ref(`games/${this.props.gameId}/players/${playerID}`);
            refPlayer.update({ score: newScore });
          }
        });
        this.setState({
          pointsToAssign: pointsToAssign,
          playerData: playerData,
          votingMode: 'REVEAL',
        });
        let updates = {};
        updates[`games/${this.props.gameId}/players`] = playerData;
      }
    });
    const ref = firebase.database().ref(`games/${this.props.gameId}`);
    ref.update({ currentVote: null });
    this.setState({
      viewingTimeout: setTimeout(() => {
        this.handleNext();
      }, 8000),
    });
  };

  componentWillUnmount() {
    if (this.state.viewingTimeout) {
      clearTimeout(this.state.viewingTimeout);
    }
  }

  handleNext = () => {
    let { roundData, promptNumber } = this.state;
    const ref = firebase.database().ref(`games/${this.props.gameId}`);
    if (
      roundData[0] &&
      promptNumber < roundData[0].promptsReturned[this.props.round].length - 1
    ) {
      promptNumber++;
      ref.update({
        currentVote:
          roundData[0].promptsReturned[this.props.round][promptNumber].prompt,
      });
    } else {
      ref.update({
        currentVote: null,
      });
      this.props.startScoring();
    }
    this.setState({
      promptNumber,
      votingMode: 'VOTING',
      seconds: this.state.seconds,
    });
  };

  makeQuipGrid = () => {
    const {
      roundData,
      promptNumber,
      playerData,
      votingMode,
      pointsToAssign,
    } = this.state;
    let rowCount = 0,
      quipCount = 0,
      grid = [],
      row = [];
    roundData &&
      roundData[0] &&
      roundData[0].promptsReturned[this.props.round][
        promptNumber
      ].players.forEach((player, playerIndex) => {
        row = [
          ...row,
          <Col
            style={{ minHeight: '15vh' }}
            xs="1"
            key={`col-player-${playerIndex}-row-${rowCount}`}
          >
            {rowCount === 0 &&
              playerData &&
              playerData[player.id] &&
              votingMode === 'REVEAL' && (
                <div>
                  <div className="voting-triangle-left"></div>
                  <div
                    style={{
                      width: '5vw',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignContent: 'center',
                      marginTop: '20%',
                    }}
                  >
                    <PlayerLegoHead
                      headName={playerData[player.id].icon}
                      playerName={playerData[player.id].name}
                      classThing={'playerLegoHeadImgmed'}
                    />
                    <h4
                      style={{
                        fontSize: '70%',
                        textAlign: 'center',
                        textIndent: '-10%',
                      }}
                    >
                      +{pointsToAssign[player.id]}
                    </h4>
                  </div>
                </div>
              )}
          </Col>,
          <Col xs="4" key={player.id}>
            <Card
              className="voteCard"
              style={{ border: 'none', margin: '2% 0' }}
            >
              <CardHeader
                className="quip-card-header"
                style={{ backgroundColor: colours[quipCount] }}
              >
                {playerData &&
                  playerData[player.id] &&
                  votingMode === 'REVEAL' && (
                    <div>{playerData[player.id].name}</div>
                  )}
              </CardHeader>
              <CardBody className="quip-card-body">
                {player.quip ? (
                  player.quip
                ) : (
                  <div
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      color: 'grey',
                    }}
                  >
                    - no answer -
                  </div>
                )}
              </CardBody>

              <div>
                <div className="voting-footer">
                  {votingMode === 'REVEAL' &&
                    player.votes &&
                    player.votes.map((vote, index) => {
                      if (index === 5) {
                        return (
                          <div
                            key={`+${index}`}
                            style={{ color: '#f7bc4d', marginLeft: '2%' }}
                          >
                            +
                          </div>
                        );
                      } else if (index < 5) {
                        return (
                          <div
                            key={`head${index}`}
                            style={{ marginTop: '-1vh' }}
                          >
                            <PlayerLegoHead
                              key={`legohead-${index}`}
                              headName={playerData[vote].icon}
                              playerName={playerData[vote].name}
                              classThing={'playerLegoHeadImgxsml'}
                            />
                          </div>
                        );
                      } else {
                        return <div></div>;
                      }
                    })}
                </div>
              </div>
            </Card>
          </Col>,
          <Col xs="1" key={`col-player-${playerIndex + 1}`}>
            {rowCount === 1 &&
              playerData &&
              playerData[player.id] &&
              votingMode === 'REVEAL' && (
                <div>
                  <div className="voting-triangle-right"></div>
                  <div
                    style={{
                      width: '5vw',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignContent: 'center',
                      marginTop: '20%',
                    }}
                  >
                    <PlayerLegoHead
                      headName={playerData[player.id].icon}
                      playerName={playerData[player.id].name}
                      classThing={'playerLegoHeadImgmed'}
                    />
                    <h4
                      style={{
                        fontSize: '70%',
                        textAlign: 'center',
                        textIndent: '-10%',
                      }}
                    >
                      +{pointsToAssign[player.id]}
                    </h4>
                  </div>
                </div>
              )}
          </Col>,
        ];
        rowCount++;
        quipCount++;
        if (
          rowCount >= 2 ||
          quipCount ===
            roundData[0].promptsReturned[this.props.round][promptNumber].players
              .length
        ) {
          rowCount = 0;
          grid = [
            ...grid,
            <Row
              key={`row-${rowCount}-${playerIndex}`}
              style={{ justifyContent: 'center' }}
            >
              {row}
            </Row>,
          ];
          row = [];
        }
      });
    return grid;
  };

  render() {
    const { roundData, promptNumber, votingMode } = this.state;
    return (
      <div className="voting-body">
        <div className="voting-header">
          <div style={{ marginRight: '2%' }}>
            <MaddiesLegoSpeechBubble
              style={{ minWidth: '30vw' }}
              bubbleText={
                roundData &&
                roundData[0] &&
                roundData[0].promptsReturned[this.props.round][promptNumber]
                  .prompt
                  ? roundData[0].promptsReturned[this.props.round][promptNumber]
                      .prompt
                  : 'Loading data'
              }
            />
          </div>
          {votingMode === 'VOTING' && (
            <div className="voting-timer">
              <Timer
                minutes={0}
                seconds={this.state.seconds}
                onTimerComplete={this.startVoting}
              />
            </div>
          )}
        </div>
        <Container>{this.makeQuipGrid()}</Container>
      </div>
    );
  }
}
