import React from "react";
import { Card, CardBody, CardFooter, CardHeader, CardText, Col, Container, Row } from "reactstrap";
import '../../App.css';
import MaddiesLegoSpeechBubble from "../shared/MaddiesLegoSpeechBubble";
import MrLego from "../shared/mrlego";

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
    this.state = {quips: ["nothing", "idk idc", "honest work", "best programming this side of the murray darling", "hehehehehehehe"]}
  }

  makeQuipGrid() {
    const { quips } = this.state;
    let rowCount = 0,
        quipCount = 0,
        grid = [],
        row = [];
    quips.forEach(quip => {
      row = [...row,
        <Col xs="5" key={quip}>
          <Card className="voteCard" style={{border: "none", margin: "3% 0"}}>
            <CardHeader style={{backgroundColor: colours[quipCount]}}></CardHeader>
            <CardBody>
              <CardText>{quip}</CardText>
            </CardBody>
            <CardFooter>Votes go here!</CardFooter>
          </Card>
        </Col>];
      rowCount++;
      quipCount++;
      if (rowCount >= 2 || quipCount === quips.length) {
        rowCount = 0;
        grid = [...grid,
          <Row key={Math.random()} style={{justifyContent: "center"}}>
            <Col xs="1">
              <MrLego/>
            </Col>
            { row }
            <Col xs="1">
              <MrLego/>
            </Col>
          </Row>];
        row = [];
      }
    })
    return grid;
  }

  render() {
    return (
      <div className="App-body">
        <MaddiesLegoSpeechBubble bubbleText={"What does Josh even do here?"}/>
        <Container>
          {this.makeQuipGrid()}
        </Container>
      </div>
    );
  }
}