import React from "react";
import firebase from "../../Firebase/firebase";

export const ClientGameContext = React.createContext();

// when this component is rendered, we need to setup the relevant firebase listeners...

// lets first listen to the game state and when when that changes, change the context value
// from there we can derive the other information

// need a way to join games

export class ClientGameContextProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // when null it means there is no game started yet
      mainGameState: null,
      gameId: null,
      playerId: null,
      round: null,
    };

    this.joinGame = this.joinGame.bind(this);
    this.submitQuip = this.submitQuip.bind(this);
    this.startWatchingGame = this.startWatchingGame.bind(this);
  }

  handleGameStateChange() {}

  async joinGame(gameCode, nameInput) {
    return new Promise((res, rej) => {
      const ref = firebase.database().ref("games");
      ref
        .orderByChild("gamecode")
        .equalTo(gameCode)
        .once("value", (snapshot) => {
          const snapshotValue = snapshot.val();
          if (!snapshotValue) {
            return res(null);
          }
          // Get ROUND ID and add to State I guess
          const gameid = Object.keys(snapshot.val())[0];
          const ref = firebase.database().ref(`games/${gameid}/players`);
          const newPlayer = ref.push({name: nameInput, score: 0, icon: "mr-lego"});
          // Store player in local storage to maintain session
          window.localStorage.setItem("quipGameId", gameid);
          window.localStorage.setItem("quipPlayerId", newPlayer.key);
          // Set in state
          this.setState({
            gameId: gameid,
            playerId: newPlayer.key,
            round: 0,
          });
          this.startWatchingGame(gameCode);
          return res(snapshotValue);
        });
    });
  }

  async exitGame() {
    return new Promise((res, rej) => {
      const ref = firebase.database().ref(`games/`);
      // ref
      //   .remove();
      //     // Store player in local storage to maintain session
      //     window.localStorage.clear();
      //     // Set in state
      //     this.setState({
      //       gameId: gameid,
      //       playerId: newPlayer.key,
      //       round: 0,
      //     });
      //     this.startWatchingGame(gameCode);
      //     return res(snapshotValue);
        });
  }

  async submitQuip(prompt, quip) {
    return new Promise((res, rej) => {
      // get round ID
      let roundRef = "";
      if (this.state.round === 0) {
        roundRef = firebase.database().ref(`games/${this.state.gameId}/rounds`).limitToFirst(1);
      }
      roundRef
        .on("value", (snapshot) => {
          const snapshotValue = snapshot.val();
          if (!snapshotValue) {
            return res(null);
          }
          console.log("roundValue:", snapshotValue);

          // Get ROUND ID and add quip to the DB
          const roundId = Object.keys(snapshot.val())[0];
          let flag = false;
          let i = 0;
          snapshotValue[roundId].forEach(snap => {
            if(snap.prompt === prompt){
              let p = 0;
              snap.players.forEach(player => {
                console.log("player:", player);
                if(player.id === this.state.playerId){
                  const quipRef = firebase.database().ref(`games/${this.state.gameId}/rounds/${roundId}/${i}/players/${p}`);
                  quipRef.update({quip: quip});
                  flag = true;
                }
                p++;
              });
              i++;
            }
            if(flag){
              return res(null);
            }
          });
          return res(quip);
      });
    });
  }

  startWatchingGame(gameCode) {
    const ref = firebase.database().ref("games");
    ref
      .orderByChild("gamecode")
      .equalTo(gameCode)
      .on("value", (snapshot) => {
        const snapshotValue = snapshot.val();
        const gameId = Object.keys(snapshotValue)[0];
        const { gamestate } = snapshotValue[gameId];

        console.log("changed", snapshotValue[gameId]);
        // watch and update any other relevant game state here!!

        this.setState({
          mainGameState: gamestate,
        });
      });
  }

  render() {
    return (
      <ClientGameContext.Provider
        value={{
          ...this.state,
          joinGame: this.joinGame,
          submitQuip: this.submitQuip
        }}
      >
        {this.props.children}
      </ClientGameContext.Provider>
    );
  }
}
