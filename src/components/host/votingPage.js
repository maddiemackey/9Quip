import React from "react";
import { Button, Card, CardBody, CardFooter, CardHeader, CardText, Col, Container, Row } from "reactstrap";
import '../../App.css';
import MaddiesLegoSpeechBubble from "../shared/MaddiesLegoSpeechBubble";
import PlayerLegoHead from "../shared/playerLegoHead";
import firebase from "../../Firebase/firebase";
import Timer from "../shared/timer";

let colours = {
  0: "red",
  1: "blue",
  2: "green",
  3: "purple",
  4: "yellow"
}
export default class VotingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      roundData: {},
      promptNumber: 0,
      votingMode: "VOTING",
      seconds: 1
    }
  }

  componentDidMount() {
    const refRounds = firebase.database().ref(`games/${this.props.gameId}/rounds`);
    refRounds.on("value", snapshot => {
      let roundData = snapshot.val();
      if (roundData) {
        this.setState({
          roundData: roundData
        });
      }
    });
  }

  startVoting = () => {
    const refPlayers = firebase.database().ref(`games/${this.props.gameId}/players`);
    refPlayers.on("value", snapshot => {
      let playerData = snapshot.val();
      if (playerData) {
        this.setState({
          playerData: playerData,
          votingMode:"REVEAL"
        });
      }
    });
  }

  handleNext = () => {
    console.log(this.state);
    let { roundData, promptNumber } = this.state;
    roundData[0] && promptNumber < roundData[0].promptsReturned.length - 1 ? promptNumber++ : this.props.startScoring();
    this.setState({ promptNumber }); 
  }

  makeQuipGrid = () => {
    const { roundData, promptNumber, playerData, votingMode } = this.state;
    let rowCount = 0,
        quipCount = 0,
        grid = [],
        row = [];
    roundData[0] && roundData[0].promptsReturned[promptNumber].players.forEach(player => {
      if (playerData) console.log(playerData[player.id].icon);
      row = [...row,
        <Col xs="1">
          {rowCount === 0 && playerData && votingMode === "REVEAL" &&
            <PlayerLegoHead headName={playerData[player.id].icon} playerName={playerData[player.id].name} classThing={"playerLegoHeadImglrg"}/>
          }
        </Col>,
        <Col xs="4" key={player.id}>
          <Card className="voteCard" style={{border: "none", margin: "3% 0"}}>
            <CardHeader style={{backgroundColor: colours[quipCount]}}></CardHeader>
            <CardBody>
              <CardText>{player.quip}</CardText>
            </CardBody>
            <CardFooter>
              <div className="voting-footer">
                {votingMode === "REVEAL" && player.votes && player.votes.map(vote => 
                  <PlayerLegoHead headName={playerData[vote].icon} playerName={playerData[vote].name} classThing={"playerLegoHeadImgsml"}/>
                )}
              </div>
            </CardFooter>
          </Card>
        </Col>,
        <Col xs="1">
          {rowCount === 1 && playerData && votingMode === "REVEAL" &&
            <PlayerLegoHead headName={playerData[player.id].icon} playerName={playerData[player.id].name} classThing={"playerLegoHeadImglrg"}/>
          }
        </Col>
      ];
      rowCount++;
      quipCount++;
      if (rowCount >= 2 || quipCount === roundData[0].promptsReturned[promptNumber].players.length) {
        rowCount = 0;
        grid = [...grid,
          <Row key={Math.random()} style={{justifyContent: "center"}}>
            { row }
          </Row>];
        row = [];
      }
    })
    return grid;
  }

  render() {
    const { roundData, promptNumber } = this.state;
    return (
      <div className="App-body">
        <div className="voting-header">
          <div style={{marginRight: "2%"}} ><MaddiesLegoSpeechBubble bubbleText={roundData[0] && roundData[0].promptsReturned[promptNumber].prompt ? roundData[0].promptsReturned[promptNumber].prompt : "Loading data"}/></div>
          <Timer minutes={0} seconds={this.state.seconds} startVoting={this.startVoting}/>
        </div>
        <Container>
          {this.makeQuipGrid()}
        </Container>
        <Button onClick={this.handleNext} style={{alignContent: "flex-end"}}>Next</Button>
      </div>
    );
  }
}