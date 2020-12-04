import React from "react";
import '../../App.css';
import {
  Table
} from "reactstrap";
import firebase from "../../Firebase/firebase";

export default class ScorePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { playerList: {} }
  }

  componentDidMount() {
    const refPlayers = firebase.database().ref(`games/${this.props.gameId}/players`);
    refPlayers.on("value", snapshot => {
      let playerData = snapshot.val();
      if (playerData) {
        console.log("not so far");
        const entries = Object.entries(playerData);
        let playerList = [...entries]
          .sort((a, b) => {
            return b[1].score - a[1].score;
          });
        playerList = this.formatPlayerObject(playerList);
        this.setState({
          playerList
        });
      }
    })
  }

  formatPlayerObject(playerList) {
    let newObj = {};
    console.log("here");
    for (const values of Object.values(playerList)) {
      newObj[values.icon] = values.score
    }
    return newObj;
  }

  render() {
    let rowCount = 0;
    const {playerList} = this.state;
    rowCount = Math.floor(playerList/5)
    return (
      <div className="App-body">
        <Table id="table">
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          {rowCount > 1 &&
          <tbody>
            {<tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>*rowCount-1}
          </tbody>
          }
        </Table>
      </div>
    );
  }
}