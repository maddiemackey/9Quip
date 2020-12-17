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
      const ref = firebase.database().ref(`games/${this.props.gameId}`);
      ref.update({ currentVote: roundData[0].promptsReturned[0].prompt });
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
        // console.log(playerData);
        const pointsToAssign = calculatePoints(
          playerData,
          roundData[0].promptsReturned[promptNumber]
        );
        Object.keys(pointsToAssign).forEach((playerID) => {
          if (playerData[playerID]) {
            let newScore =
              playerData[playerID].score + pointsToAssign[playerID];
            // console.log("POINTS: ", pointsToAssign[playerID]);
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
    roundData[0] && promptNumber < roundData[0].promptsReturned.length - 1
      ? promptNumber++
      : this.props.startScoring();
    const ref = firebase.database().ref(`games/${this.props.gameId}`);
    ref.update({
      currentVote: roundData[0].promptsReturned[promptNumber].prompt,
    });

    this.setState({
      promptNumber,
      votingMode: 'VOTING',
      seconds: this.state.seconds + 1,
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
    roundData[0] &&
      roundData[0].promptsReturned[promptNumber].players.forEach((player) => {
        row = [
          ...row,
          <Col style={{ minHeight: '15vh' }} xs="1" key={Math.random()}>
            {rowCount === 0 &&
              playerData &&
              playerData[player.id] &&
              votingMode === 'REVEAL' && (
                <>
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
                </>
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
                    no answer
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
                          <div style={{ color: '#f7bc4d', marginLeft: '2%' }}>
                            +
                          </div>
                        );
                      } else if (index < 5) {
                        return (
                          <div style={{ marginTop: '-1vh' }}>
                            <PlayerLegoHead
                              key={Math.random()}
                              headName={playerData[vote].icon}
                              playerName={playerData[vote].name}
                              classThing={'playerLegoHeadImgsml'}
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
          <Col xs="1" key={Math.random()}>
            {rowCount === 1 &&
              playerData &&
              playerData[player.id] &&
              votingMode === 'REVEAL' && (
                <>
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
                </>
              )}
          </Col>,
        ];
        rowCount++;
        quipCount++;
        if (
          rowCount >= 2 ||
          quipCount ===
            roundData[0].promptsReturned[promptNumber].players.length
        ) {
          rowCount = 0;
          grid = [
            ...grid,
            <Row key={Math.random()} style={{ justifyContent: 'center' }}>
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
                roundData[0] &&
                roundData[0].promptsReturned[promptNumber].prompt
                  ? roundData[0].promptsReturned[promptNumber].prompt
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
        {/* {votingMode === "REVEAL" && (
          <Button
            onClick={this.handleNext}
            style={{ alignContent: "flex-end" }}
          >
            Next
          </Button>
        )} */}
      </div>
    );
  }
}
