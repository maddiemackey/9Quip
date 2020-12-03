import React from "react";
import firebase from "../../Firebase/firebase";
import { GameState } from "../../utils/enum";

export const ClientGameContext = React.createContext();

// when this component is rendered, we need to setup the relevant firebase listeners...

// lets first listen to the game state and when when that changes, change the context value
// from there we can derive the other information

// need a way to join games

function getPlayerPosition(players, playerId) {
  const entries = Object.entries(players);

  return [...entries]
    .sort((a, b) => {
      return b[1].score - a[1].score;
    })
    .findIndex((v) => {
      return v[0] === playerId;
    });
}

export class ClientGameContextProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // when null it means there is no game started yet
      mainGameState: null,
      gameId: null,
      playerId: null,
      round: null,
      playerScore: 0,
      playerPosition: null,
    };

    this.joinGame = this.joinGame.bind(this);
    this.submitQuip = this.submitQuip.bind(this);
    this.startWatchingGame = this.startWatchingGame.bind(this);
    this.exitGame = this.exitGame.bind(this);
    this.getPrompts = this.getPrompts.bind(this);
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
          const newPlayer = ref.push({
            name: nameInput,
            score: 0,
            icon: "mr-lego",
          });
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
      // Remove from DB
      const ref = firebase
        .database()
        .ref(`games/${this.state.gameId}/players/${this.state.playerId}`);
      ref.remove();

      // Remove from localStorage
      window.localStorage.clear();

      // Remove from state
      this.setState({
        mainGameState: null,
        gameId: null,
        playerId: null,
        round: null,
      });

      return res("Removed player");
    });
  }

  async getPrompts() {
    return new Promise((res, rej) => {
      const ref = firebase
        .database()
        .ref(
          `games/${this.state.gameId}/players/${this.state.playerId}/prompts`
        );
      ref.once("value", (snapshot) => {
        const prompts = snapshot.val();
        this.setState({
          prompts: prompts,
        });
        return res(prompts);
      });
    });
  }

  async submitQuip(prompt, quip) {
    return new Promise((res, rej) => {
      // get round ID
      let roundRef = "";
      if (this.state.round === 0) {
        roundRef = firebase
          .database()
          .ref(
            `games/${this.state.gameId}/rounds/${this.state.round}/promptsReturned`
          );
      }
      roundRef.on("value", (snapshot) => {
        const snapshotValue = snapshot.val();
        if (!snapshotValue) {
          return res(null);
        }

        console.log();
        // Get ROUND ID and add quip to the DB
        //const roundId = Object.keys(snapshot.val())[0];
        let i = 0;
        snapshotValue.forEach((snap) => {
          if (snap.prompt === prompt) {
            let p = 0;
            snap.players.forEach((player) => {
              if (player.id === this.state.playerId) {
                // if (this.state)
                return res(
                  `games/${this.state.gameId}/rounds/${this.state.round}/promptsReturned/${i}/players/${p}`
                );
              }
              p++;
            });
          }
          i++;
        });
      });
    }).then((res) => {
      const quipRef = firebase.database().ref(res);
      quipRef.update({ quip: quip });
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
        const { gamestate, players } = snapshotValue[gameId];

        let playerScore = this.state.playerScore;
        let playerPosition = this.state.playerPosition;

        if (this.state.playerId) {
          const player = players[this.state.playerId];
          console.log("found player, setting score", player);
          playerScore = player.score;
          playerPosition = getPlayerPosition(players, this.state.playerId);
        }

        // watch and update any other relevant game state here!!
        this.setState({
          mainGameState: gamestate,
          playerScore,
          playerPosition,
        });
      });
  }

  render() {
    return (
      <ClientGameContext.Provider
        value={{
          ...this.state,
          startWatchingGame: this.startWatchingGame,
          joinGame: this.joinGame,
          submitQuip: this.submitQuip,
          exitGame: this.exitGame,
          getPrompts: this.getPrompts,
        }}
      >
        {this.props.children}
      </ClientGameContext.Provider>
    );
  }
}
